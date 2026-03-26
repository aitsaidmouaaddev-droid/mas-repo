/**
 * @module session
 * @description Stateful QCM session manager.
 *
 * Wraps the pure engine functions into a class that tracks navigation,
 * answers, timing, auto-finish, and retry logic.
 *
 * @example
 * ```ts
 * import { createSession } from '@mas/qcm';
 *
 * const session = createSession(quizData, { shuffle: true });
 *
 * // Answer first question
 * const feedback = session.answer(2);
 * console.log(feedback.correct);
 *
 * // Finish and get result
 * const result = session.finish();
 * console.log(`Score: ${result.percentage}%`);
 * ```
 */

import type {
  QcmData,
  FlatQuestion,
  QcmAnswer,
  QcmResult,
  SessionConfig,
  SessionProgress,
  AnswerFeedback,
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
} from './engine.js';

// ─── Session state ────────────────────────────────────────────────────────────

type SessionStatus = 'idle' | 'in-progress' | 'finished';

/**
 * Manages the lifecycle of a single quiz attempt.
 *
 * Handles question navigation, answer recording, auto-advance,
 * per-question timer, and retry session creation.
 *
 * Created via `new QcmSession(data, config)` or the {@link createSession} factory.
 */
export class QcmSession {
  private readonly config: SessionConfig;
  private readonly allQuestions: FlatQuestion[];
  private questions: FlatQuestion[];
  private answers: QcmAnswer[] = [];
  private currentIndex = 0;
  private status: SessionStatus = 'idle';
  private startedAt = 0;
  private finishedAt = 0;
  private questionStartedAt = 0;

  constructor(data: QcmData, config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.allQuestions = flattenModules(data);
    this.questions = this.applyFilters(this.allQuestions);

    if (this.config.shuffle) {
      this.questions = shuffleQuestions(this.questions).map(shuffleChoices) as FlatQuestion[];
    }

    this.start();
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  private start(): void {
    this.status = 'in-progress';
    this.startedAt = Date.now();
    this.questionStartedAt = Date.now();
  }

  /**
   * End the session and compute the final result.
   * Safe to call multiple times — subsequent calls return the cached result.
   */
  finish(): QcmResult {
    if (this.status === 'finished') return this.buildResult();

    this.status = 'finished';
    this.finishedAt = Date.now();
    return this.buildResult();
  }

  // ─── Navigation ───────────────────────────────────────────────────────

  /**
   * Get the current question (answer hidden) along with navigation metadata.
   * Returns `null` when the session is finished or empty.
   */
  current(): {
    question: FlatQuestion;
    index: number;
    total: number;
    timeRemaining?: number;
  } | null {
    if (this.status === 'finished') return null;
    if (this.currentIndex >= this.questions.length) return null;

    const q = this.questions[this.currentIndex];
    const stripped: FlatQuestion = {
      ...q,
      answer: -1, // hide answer from consumer
    };

    const result: {
      question: FlatQuestion;
      index: number;
      total: number;
      timeRemaining?: number;
    } = {
      question: stripped,
      index: this.currentIndex,
      total: this.questions.length,
    };

    if (this.config.timed && this.config.timePerQuestion) {
      const elapsed = (Date.now() - this.questionStartedAt) / 1000;
      result.timeRemaining = Math.max(0, this.config.timePerQuestion - elapsed);
    }

    return result;
  }

  /** Advance to the next question. Returns `false` if already at the end. */
  next(): boolean {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.questionStartedAt = Date.now();
      return true;
    }
    return false;
  }

  /** Go back to the previous question. Returns `false` if already at the start. */
  previous(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.questionStartedAt = Date.now();
      return true;
    }
    return false;
  }

  // ─── Answering ────────────────────────────────────────────────────────

  /**
   * Submit an answer for the current question.
   *
   * Records the answer, computes feedback, and auto-advances.
   * If this is the last question, the session is auto-finished.
   * Re-answering the same question overwrites the previous answer.
   *
   * @param selected - Choice index (single) or indices (multi).
   * @returns Immediate feedback with correctness, score, and optional explanation.
   * @throws If the session is not in progress.
   */
  answer(selected: number | number[]): AnswerFeedback {
    this.assertInProgress();

    const q = this.questions[this.currentIndex];
    const { correct, score } = checkAnswer(q, selected);

    this.recordAnswer({
      questionId: q.id,
      selected,
      correct,
      skipped: false,
      score,
      answeredAt: Date.now(),
    });

    const feedback: AnswerFeedback = {
      correct,
      correctAnswer: q.answer,
      score,
    };

    if (this.config.showExplanation && q.explanation) {
      feedback.explanation = q.explanation;
    }

    this.autoFinishIfLast();
    return feedback;
  }

  /**
   * Skip the current question (score = 0, marked as skipped).
   * Auto-advances to the next question or finishes the session.
   *
   * @throws If the session is not in progress.
   */
  skip(): void {
    this.assertInProgress();

    const q = this.questions[this.currentIndex];

    this.recordAnswer({
      questionId: q.id,
      selected: null,
      correct: false,
      skipped: true,
      score: 0,
      answeredAt: Date.now(),
    });

    this.autoFinishIfLast();
  }

  // ─── Timer ────────────────────────────────────────────────────────────

  /** Check whether the per-question timer has expired. Always `false` when untimed. */
  isExpired(): boolean {
    if (!this.config.timed || !this.config.timePerQuestion) return false;
    const elapsed = (Date.now() - this.questionStartedAt) / 1000;
    return elapsed >= this.config.timePerQuestion;
  }

  /** If the timer has expired, auto-skip the current question. Returns `true` if it expired. */
  expireIfNeeded(): boolean {
    if (!this.isExpired()) return false;
    this.skip();
    return true;
  }

  // ─── Result ───────────────────────────────────────────────────────────

  /** Get the current result snapshot (can be called mid-session or after finish). */
  getResult(): QcmResult {
    return this.buildResult();
  }

  /** Get a live progress snapshot: current index, answered/skipped counts, time remaining. */
  getProgress(): SessionProgress {
    const answered = this.answers.filter((a) => !a.skipped).length;
    const skipped = this.answers.filter((a) => a.skipped).length;

    const progress: SessionProgress = {
      current: this.currentIndex,
      total: this.questions.length,
      answered,
      skipped,
    };

    if (this.config.timed && this.config.timePerQuestion) {
      const elapsed = (Date.now() - this.questionStartedAt) / 1000;
      progress.timeRemaining = Math.max(0, this.config.timePerQuestion - elapsed);
    }

    return progress;
  }

  // ─── Retry ────────────────────────────────────────────────────────────

  /**
   * Create a new session containing only the questions the user got wrong or skipped.
   * Returns an empty session (total = 0) if every answer was correct.
   */
  retry(): QcmSession {
    const retryQuestions = getRetryQuestions(this.answers, this.questions);

    if (retryQuestions.length === 0) {
      return new QcmSession({ modules: [] }, this.config);
    }

    const retryData: QcmData = {
      modules: [
        {
          id: 'retry',
          label: 'Retry — Failed Questions',
          questions: retryQuestions,
        },
      ],
    };

    return new QcmSession(retryData, {
      ...this.config,
      mode: 'all',
      module: undefined,
    });
  }

  // ─── Private helpers ──────────────────────────────────────────────────

  private applyFilters(questions: FlatQuestion[]): FlatQuestion[] {
    let filtered = questions;

    if (this.config.mode === 'module' && this.config.module) {
      filtered = filterByModule(filtered, this.config.module);
    }

    if (this.config.difficulty) {
      filtered = filterByDifficulty(filtered, this.config.difficulty);
    }

    if (this.config.tags && this.config.tags.length > 0) {
      filtered = filterByTags(filtered, this.config.tags);
    }

    return filtered;
  }

  private recordAnswer(answer: QcmAnswer): void {
    const existing = this.answers.findIndex((a) => a.questionId === answer.questionId);
    if (existing >= 0) {
      this.answers[existing] = answer;
    } else {
      this.answers.push(answer);
    }
  }

  private autoFinishIfLast(): void {
    if (this.currentIndex >= this.questions.length - 1) {
      this.finish();
    } else {
      this.next();
    }
  }

  private assertInProgress(): void {
    if (this.status !== 'in-progress') {
      throw new Error('Session is not in progress');
    }
  }

  private buildResult(): QcmResult {
    const score = scoreAnswers(this.answers);
    const max = maxScoreForQuestions(this.questions);
    const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
    const duration =
      this.finishedAt > 0 ? this.finishedAt - this.startedAt : Date.now() - this.startedAt;

    return {
      score,
      total: this.questions.length,
      maxScore: max,
      percentage,
      passed: percentage >= this.config.passThreshold,
      duration,
      streak: calculateStreak(this.answers),
      answers: [...this.answers],
      byModule: scoreByModule(this.answers, this.questions),
    };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Convenience factory — creates and starts a new {@link QcmSession}.
 *
 * @param data   - Full quiz payload.
 * @param config - Partial config (merged with {@link DEFAULT_CONFIG}).
 * @returns A started session ready for answering.
 */
export function createSession(data: QcmData, config: Partial<SessionConfig> = {}): QcmSession {
  return new QcmSession(data, config);
}
