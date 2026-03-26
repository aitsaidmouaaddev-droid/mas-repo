/**
 * @module qcmSlice
 * @description Redux Toolkit slice for QCM state management.
 *
 * Provides a **fully serializable** Redux state that mirrors the QcmSession
 * lifecycle without storing class instances. All logic is driven by the
 * pure engine functions.
 *
 * ## Quick start
 * ```ts
 * import { createAppStore } from '@mas/shared/store';
 * import { qcmReducer, startSession, answerQuestion } from '@mas/qcm';
 *
 * const store = createAppStore({ qcm: qcmReducer });
 * store.dispatch(startSession({ data: quizJson }));
 * store.dispatch(answerQuestion(1));
 * ```
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  QcmData,
  QcmAnswer,
  AnswerFeedback,
  QcmResult,
  SessionConfig,
  SessionProgress,
  FlatQuestion,
} from './types.js';
import { DEFAULT_CONFIG } from './types.js';
import {
  flattenModules,
  filterByModule,
  filterByDifficulty,
  filterByTags,
  shuffleChoices,
  shuffleQuestions,
  checkAnswer,
  scoreAnswers,
  scoreByModule,
  calculateStreak,
  maxScoreForQuestions,
  getRetryQuestions,
  listModules,
} from './engine.js';

// ─── State shape ──────────────────────────────────────────────────────────────

/** Serializable QCM session status. */
export type QcmStatus = 'idle' | 'in-progress' | 'finished';

/**
 * Fully serializable Redux state for a QCM session.
 *
 * No class instances — safe for Redux DevTools, persistence, and SSR.
 */
export interface QcmSliceState {
  /** Current lifecycle status. */
  status: QcmStatus;
  /** Raw quiz data (kept for retry). */
  data: QcmData | null;
  /** Merged session config. */
  config: SessionConfig;
  /** Filtered (and optionally shuffled) question pool. */
  questions: FlatQuestion[];
  /** Recorded user answers. */
  answers: QcmAnswer[];
  /** Zero-based index of the current question. */
  currentIndex: number;
  /** Session start timestamp (ms). */
  startedAt: number;
  /** Session end timestamp (ms), 0 if not finished. */
  finishedAt: number;
  /** Feedback from the most recent answer action. */
  lastFeedback: AnswerFeedback | null;
}

const initialState: QcmSliceState = {
  status: 'idle',
  data: null,
  config: DEFAULT_CONFIG,
  questions: [],
  answers: [],
  currentIndex: 0,
  startedAt: 0,
  finishedAt: 0,
  lastFeedback: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyFilters(questions: FlatQuestion[], config: SessionConfig): FlatQuestion[] {
  let filtered = questions;

  if (config.mode === 'module' && config.module) {
    filtered = filterByModule(filtered, config.module);
  }
  if (config.difficulty) {
    filtered = filterByDifficulty(filtered, config.difficulty);
  }
  if (config.tags && config.tags.length > 0) {
    filtered = filterByTags(filtered, config.tags);
  }

  return filtered;
}

function recordAnswer(answers: QcmAnswer[], answer: QcmAnswer): QcmAnswer[] {
  const idx = answers.findIndex((a) => a.questionId === answer.questionId);
  if (idx >= 0) {
    const copy = [...answers];
    copy[idx] = answer;
    return copy;
  }
  return [...answers, answer];
}

function autoAdvance(state: QcmSliceState): void {
  if (state.currentIndex >= state.questions.length - 1) {
    state.status = 'finished';
    state.finishedAt = Date.now();
  } else {
    state.currentIndex++;
  }
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const qcmSlice = createSlice({
  name: 'qcm',
  initialState,
  reducers: {
    /**
     * Load quiz data and start a session.
     * Applies config, filters, and optional shuffle.
     */
    startSession(state, action: PayloadAction<{ data: QcmData; config?: Partial<SessionConfig> }>) {
      const { data, config } = action.payload;
      const merged = { ...DEFAULT_CONFIG, ...config };
      let questions = applyFilters(flattenModules(data), merged);

      if (merged.shuffle) {
        questions = (shuffleQuestions(questions) as FlatQuestion[]).map(
          (q) => shuffleChoices(q) as FlatQuestion,
        );
      }

      state.status = 'in-progress';
      state.data = data;
      state.config = merged;
      state.questions = questions;
      state.answers = [];
      state.currentIndex = 0;
      state.startedAt = Date.now();
      state.finishedAt = 0;
      state.lastFeedback = null;
    },

    /**
     * Submit an answer for the current question.
     * Records the answer, produces feedback, and auto-advances.
     */
    answerQuestion(state, action: PayloadAction<number | number[]>) {
      if (state.status !== 'in-progress') return;

      const selected = action.payload;
      const q = state.questions[state.currentIndex];
      if (!q) return;

      const { correct, score } = checkAnswer(q, selected);

      const answer: QcmAnswer = {
        questionId: q.id,
        selected,
        correct,
        skipped: false,
        score,
        answeredAt: Date.now(),
      };

      state.answers = recordAnswer(state.answers, answer);

      const feedback: AnswerFeedback = {
        correct,
        correctAnswer: q.answer,
        score,
      };
      if (state.config.showExplanation && q.explanation) {
        feedback.explanation = q.explanation;
      }
      state.lastFeedback = feedback;

      autoAdvance(state);
    },

    /** Skip the current question (score = 0). Auto-advances. */
    skipQuestion(state) {
      if (state.status !== 'in-progress') return;

      const q = state.questions[state.currentIndex];
      if (!q) return;

      const answer: QcmAnswer = {
        questionId: q.id,
        selected: null,
        correct: false,
        skipped: true,
        score: 0,
        answeredAt: Date.now(),
      };

      state.answers = recordAnswer(state.answers, answer);
      state.lastFeedback = null;

      autoAdvance(state);
    },

    /** Move to the next question (manual navigation, no auto-finish). */
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        state.lastFeedback = null;
      }
    },

    /** Move to the previous question. */
    previousQuestion(state) {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        state.lastFeedback = null;
      }
    },

    /** Manually finish the session. */
    finishSession(state) {
      if (state.status === 'finished') return;
      state.status = 'finished';
      state.finishedAt = Date.now();
    },

    /**
     * Start a new session with only the failed/skipped questions.
     * No-op if there are no failed questions.
     */
    retrySession(state) {
      const retryQs = getRetryQuestions(state.answers, state.questions);
      if (retryQs.length === 0) return;

      const retryData: QcmData = {
        modules: [{ id: 'retry', label: 'Retry — Failed Questions', questions: retryQs }],
      };

      state.status = 'in-progress';
      state.data = retryData;
      state.questions = flattenModules(retryData);
      state.answers = [];
      state.currentIndex = 0;
      state.startedAt = Date.now();
      state.finishedAt = 0;
      state.lastFeedback = null;
    },

    /**
     * Update question texts in-place (for locale changes).
     * Matches by question ID and replaces question, choices, explanation, docs.
     */
    updateQuestionTexts(
      state,
      action: PayloadAction<
        { id: string; question: string; choices: string[]; explanation?: string; docs?: string }[]
      >,
    ) {
      const map = new Map(action.payload.map((q) => [q.id, q]));
      for (const q of state.questions) {
        const updated = map.get(q.id);
        if (updated) {
          q.question = updated.question;
          q.choices = updated.choices;
          if (updated.explanation !== undefined) q.explanation = updated.explanation;
          if (updated.docs !== undefined) q.docs = updated.docs;
        }
      }
    },

    /** Reset back to idle state. */
    resetSession() {
      return initialState;
    },
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  startSession,
  answerQuestion,
  skipQuestion,
  nextQuestion,
  previousQuestion,
  finishSession,
  retrySession,
  resetSession,
  updateQuestionTexts,
} = qcmSlice.actions;

/** The QCM reducer — pass to `createAppStore({ qcm: qcmReducer })`. */
export const qcmReducer = qcmSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Root state shape expected by selectors. */
interface RootWithQcm {
  qcm: QcmSliceState;
}

/** Select the full QCM slice state. */
export const selectQcm = (state: RootWithQcm): QcmSliceState => state.qcm;

/** Select the session status: `'idle'`, `'in-progress'`, or `'finished'`. */
export const selectQcmStatus = (state: RootWithQcm): QcmStatus => state.qcm.status;

/**
 * Select the current question (answer hidden).
 * Returns `null` when idle, finished, or out of bounds.
 */
export const selectCurrentQuestion = (
  state: RootWithQcm,
): { question: FlatQuestion; index: number; total: number } | null => {
  const { status, questions, currentIndex } = state.qcm;
  if (status !== 'in-progress' || currentIndex >= questions.length) return null;

  const q = questions[currentIndex];
  return {
    question: { ...q, answer: -1 },
    index: currentIndex,
    total: questions.length,
  };
};

/** Select live session progress. */
export const selectProgress = (state: RootWithQcm): SessionProgress => {
  const { currentIndex, questions, answers } = state.qcm;
  return {
    current: currentIndex,
    total: questions.length,
    answered: answers.filter((a) => !a.skipped).length,
    skipped: answers.filter((a) => a.skipped).length,
  };
};

/** Select the computed result (works mid-session and after finish). */
export const selectResult = (state: RootWithQcm): QcmResult => {
  const { questions, answers, startedAt, finishedAt, config } = state.qcm;
  const score = scoreAnswers(answers);
  const max = maxScoreForQuestions(questions);
  const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
  const duration = finishedAt > 0 ? finishedAt - startedAt : Date.now() - startedAt;

  return {
    score,
    total: questions.length,
    maxScore: max,
    percentage,
    passed: percentage >= config.passThreshold,
    duration,
    streak: calculateStreak(answers),
    answers: [...answers],
    byModule: scoreByModule(answers, questions),
  };
};

/** Select the feedback from the last answer action. */
export const selectLastFeedback = (state: RootWithQcm): AnswerFeedback | null =>
  state.qcm.lastFeedback;

/** Select module summaries from the loaded data. */
export const selectModules = (state: RootWithQcm) => {
  if (!state.qcm.data) return [];
  return listModules(state.qcm.data);
};
