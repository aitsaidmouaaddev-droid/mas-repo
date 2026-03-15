import {
  checkSingleAnswer,
  checkMultiAnswer,
  checkAnswer,
  scoreAnswers,
  scoreByModule,
  calculateStreak,
  maxScoreForQuestions,
  weightedScore,
  maxWeight,
  flattenModules,
  listModules,
  filterByModule,
  filterByDifficulty,
  filterByTags,
  getRetryQuestions,
} from './engine';
import { validateQuestion, validateModule, validateQcmData } from './validators';
import { QcmSession } from './session';
import type { QcmQuestion, QcmAnswer, QcmData, QcmModule, SessionConfig } from './types';
import { DEFAULT_CONFIG } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const singleQ: QcmQuestion = {
  id: 'q1',
  type: 'single',
  difficulty: 'easy',
  tags: ['jsx'],
  question: 'What is JSX?',
  choices: ['A', 'B', 'C'],
  answer: 1,
};

const multiQ: QcmQuestion = {
  id: 'q2',
  type: 'multi',
  difficulty: 'medium',
  tags: ['hooks', 'state'],
  question: 'Valid hooks?',
  choices: ['useState', 'useForce', 'useEffect', 'useWatch'],
  answer: [0, 2],
};

const hardQ: QcmQuestion = {
  id: 'q3',
  type: 'single',
  difficulty: 'hard',
  tags: ['advanced'],
  question: 'Hard question?',
  choices: ['X', 'Y'],
  answer: 0,
};

const engineData: QcmData = {
  modules: [
    { id: 'mod-a', label: 'Module A', questions: [singleQ, multiQ] },
    { id: 'mod-b', label: 'Module B', questions: [hardQ] },
  ],
};

// ─── Difficulty weights ───────────────────────────────────────────────────────

describe('weightedScore', () => {
  it('returns correct weight for each difficulty', () => {
    expect(weightedScore('easy', true)).toBe(1);
    expect(weightedScore('medium', true)).toBe(2);
    expect(weightedScore('hard', true)).toBe(3);
  });

  it('returns 0 when incorrect', () => {
    expect(weightedScore('hard', false)).toBe(0);
  });
});

describe('maxWeight', () => {
  it('returns max points for difficulty', () => {
    expect(maxWeight('easy')).toBe(1);
    expect(maxWeight('medium')).toBe(2);
    expect(maxWeight('hard')).toBe(3);
  });
});

// ─── Answer checking ──────────────────────────────────────────────────────────

describe('checkSingleAnswer', () => {
  it('returns true for correct answer', () => {
    expect(checkSingleAnswer(singleQ, 1)).toBe(true);
  });

  it('returns false for wrong answer', () => {
    expect(checkSingleAnswer(singleQ, 0)).toBe(false);
  });
});

describe('checkMultiAnswer', () => {
  it('returns correct=true and partialScore=1 for perfect answer', () => {
    const result = checkMultiAnswer(multiQ, [0, 2]);
    expect(result.correct).toBe(true);
    expect(result.partialScore).toBe(1);
  });

  it('returns partial score for incomplete answer', () => {
    const result = checkMultiAnswer(multiQ, [0]);
    expect(result.correct).toBe(false);
    expect(result.partialScore).toBe(0.5);
  });

  it('penalizes wrong picks', () => {
    const result = checkMultiAnswer(multiQ, [0, 1]);
    expect(result.correct).toBe(false);
    expect(result.partialScore).toBe(0.25);
  });

  it('floors at 0 for all wrong', () => {
    const result = checkMultiAnswer(multiQ, [1, 3]);
    expect(result.correct).toBe(false);
    expect(result.partialScore).toBe(0);
  });
});

describe('checkAnswer', () => {
  it('dispatches single type correctly', () => {
    const result = checkAnswer(singleQ, 1);
    expect(result.correct).toBe(true);
    expect(result.score).toBe(1);
  });

  it('dispatches multi type correctly', () => {
    const result = checkAnswer(multiQ, [0, 2]);
    expect(result.correct).toBe(true);
    expect(result.score).toBe(2);
  });

  it('scores 0 for wrong single answer', () => {
    const result = checkAnswer(singleQ, 2);
    expect(result.correct).toBe(false);
    expect(result.score).toBe(0);
  });
});

// ─── Scoring ──────────────────────────────────────────────────────────────────

describe('scoreAnswers', () => {
  it('sums answer scores', () => {
    const answers: QcmAnswer[] = [
      { questionId: 'q1', selected: 1, correct: true, skipped: false, score: 1, answeredAt: 0 },
      {
        questionId: 'q2',
        selected: [0, 2],
        correct: true,
        skipped: false,
        score: 2,
        answeredAt: 0,
      },
    ];
    expect(scoreAnswers(answers)).toBe(3);
  });
});

describe('maxScoreForQuestions', () => {
  it('sums max weights', () => {
    expect(maxScoreForQuestions([singleQ, multiQ, hardQ])).toBe(6);
  });
});

describe('scoreByModule', () => {
  it('groups scores by module', () => {
    const flat = flattenModules(engineData);
    const answers: QcmAnswer[] = [
      { questionId: 'q1', selected: 1, correct: true, skipped: false, score: 1, answeredAt: 0 },
      { questionId: 'q3', selected: 0, correct: true, skipped: false, score: 3, answeredAt: 0 },
    ];

    const result = scoreByModule(answers, flat);
    expect(result['mod-a'].score).toBe(1);
    expect(result['mod-a'].total).toBe(2);
    expect(result['mod-b'].score).toBe(3);
    expect(result['mod-b'].percentage).toBe(100);
  });
});

describe('calculateStreak', () => {
  it('finds longest consecutive correct run', () => {
    const answers: QcmAnswer[] = [
      { questionId: 'q1', selected: 1, correct: true, skipped: false, score: 1, answeredAt: 0 },
      { questionId: 'q2', selected: [0], correct: false, skipped: false, score: 0, answeredAt: 0 },
      { questionId: 'q3', selected: 0, correct: true, skipped: false, score: 3, answeredAt: 0 },
    ];
    expect(calculateStreak(answers)).toBe(1);
  });

  it('returns 0 when all wrong', () => {
    const answers: QcmAnswer[] = [
      { questionId: 'q1', selected: 0, correct: false, skipped: false, score: 0, answeredAt: 0 },
    ];
    expect(calculateStreak(answers)).toBe(0);
  });
});

// ─── Flatten / List ───────────────────────────────────────────────────────────

describe('flattenModules', () => {
  it('flattens all questions with moduleId', () => {
    const flat = flattenModules(engineData);
    expect(flat).toHaveLength(3);
    expect(flat[0].moduleId).toBe('mod-a');
    expect(flat[2].moduleId).toBe('mod-b');
  });
});

describe('listModules', () => {
  it('returns module summaries', () => {
    const list = listModules(engineData);
    expect(list).toEqual([
      { id: 'mod-a', label: 'Module A', questionCount: 2 },
      { id: 'mod-b', label: 'Module B', questionCount: 1 },
    ]);
  });
});

// ─── Filtering ────────────────────────────────────────────────────────────────

describe('filterByModule', () => {
  it('filters to matching module', () => {
    const flat = flattenModules(engineData);
    expect(filterByModule(flat, 'mod-a')).toHaveLength(2);
    expect(filterByModule(flat, 'mod-b')).toHaveLength(1);
  });
});

describe('filterByDifficulty', () => {
  it('filters by difficulty level', () => {
    const flat = flattenModules(engineData);
    expect(filterByDifficulty(flat, 'easy')).toHaveLength(1);
    expect(filterByDifficulty(flat, 'hard')).toHaveLength(1);
  });
});

describe('filterByTags', () => {
  it('returns questions matching any tag', () => {
    const flat = flattenModules(engineData);
    expect(filterByTags(flat, ['hooks'])).toHaveLength(1);
    expect(filterByTags(flat, ['jsx', 'advanced'])).toHaveLength(2);
  });
});

// ─── Retry ────────────────────────────────────────────────────────────────────

describe('getRetryQuestions', () => {
  it('returns only failed/skipped questions', () => {
    const flat = flattenModules(engineData);
    const answers: QcmAnswer[] = [
      { questionId: 'q1', selected: 1, correct: true, skipped: false, score: 1, answeredAt: 0 },
      { questionId: 'q2', selected: [1], correct: false, skipped: false, score: 0, answeredAt: 0 },
      { questionId: 'q3', selected: null, correct: false, skipped: true, score: 0, answeredAt: 0 },
    ];
    const retry = getRetryQuestions(answers, flat);
    expect(retry).toHaveLength(2);
    expect(retry.map((q) => q.id)).toEqual(['q2', 'q3']);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validSingle: QcmQuestion = {
  id: 'q1',
  type: 'single',
  difficulty: 'easy',
  tags: ['a'],
  question: 'Q?',
  choices: ['A', 'B'],
  answer: 0,
};

const validMulti: QcmQuestion = {
  id: 'q2',
  type: 'multi',
  difficulty: 'medium',
  tags: [],
  question: 'Q?',
  choices: ['A', 'B', 'C'],
  answer: [0, 2],
};

const validModule: QcmModule = {
  id: 'mod1',
  label: 'Module 1',
  questions: [validSingle, validMulti],
};

// ─── validateQuestion ─────────────────────────────────────────────────────────

describe('validateQuestion', () => {
  it('returns no errors for a valid single question', () => {
    expect(validateQuestion(validSingle)).toEqual([]);
  });

  it('returns no errors for a valid multi question', () => {
    expect(validateQuestion(validMulti)).toEqual([]);
  });

  it('detects missing id', () => {
    const q = { ...validSingle, id: '' };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('id'));
  });

  it('detects invalid type', () => {
    const q = { ...validSingle, type: 'unknown' as 'single' };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('type'));
  });

  it('detects invalid difficulty', () => {
    const q = { ...validSingle, difficulty: 'extreme' as 'easy' };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('difficulty'));
  });

  it('detects non-array tags', () => {
    const q = { ...validSingle, tags: 'bad' as unknown as string[] };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('tags'));
  });

  it('detects empty question text', () => {
    const q = { ...validSingle, question: '' };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('question'));
  });

  it('detects fewer than 2 choices', () => {
    const q = { ...validSingle, choices: ['only one'], answer: 0 };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('choices'));
  });

  it('detects answer out of range for single', () => {
    const q = { ...validSingle, answer: 5 };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('out of range'));
  });

  it('detects single answer that is an array', () => {
    const q = { ...validSingle, answer: [0] as unknown as number };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('Single-type'));
  });

  it('detects multi answer that is a number', () => {
    const q = { ...validMulti, answer: 0 as unknown as number[] };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('Multi-type'));
  });

  it('detects multi answer with out-of-range index', () => {
    const q = { ...validMulti, answer: [0, 99] };
    expect(validateQuestion(q)).toContainEqual(expect.stringContaining('out of range'));
  });
});

// ─── validateModule ───────────────────────────────────────────────────────────

describe('validateModule', () => {
  it('returns no errors for a valid module', () => {
    expect(validateModule(validModule)).toEqual([]);
  });

  it('detects missing module id', () => {
    const m = { ...validModule, id: '' };
    expect(validateModule(m)).toContainEqual(expect.stringContaining('id'));
  });

  it('detects missing label', () => {
    const m = { ...validModule, label: '' };
    expect(validateModule(m)).toContainEqual(expect.stringContaining('label'));
  });

  it('detects empty questions array', () => {
    const m = { ...validModule, questions: [] };
    expect(validateModule(m)).toContainEqual(expect.stringContaining('question'));
  });

  it('propagates question errors', () => {
    const badQ = { ...validSingle, id: '' };
    const m = { ...validModule, questions: [badQ] };
    const errors = validateModule(m);
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ─── validateQcmData ──────────────────────────────────────────────────────────

describe('validateQcmData', () => {
  it('returns no errors for valid data', () => {
    const data: QcmData = { modules: [validModule] };
    expect(validateQcmData(data)).toEqual([]);
  });

  it('detects duplicate question IDs across modules', () => {
    const dup: QcmModule = {
      id: 'mod2',
      label: 'Module 2',
      questions: [{ ...validSingle }], // same id 'q1'
    };
    const data: QcmData = { modules: [validModule, dup] };
    expect(validateQcmData(data)).toContainEqual(expect.stringContaining('Duplicate'));
  });

  it('propagates module-level errors', () => {
    const badMod: QcmModule = { id: '', label: 'Bad', questions: [validSingle] };
    const data: QcmData = { modules: [badMod] };
    expect(validateQcmData(data).length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sessionData: QcmData = {
  modules: [
    {
      id: 'mod-a',
      label: 'Module A',
      questions: [
        {
          id: 'q1',
          type: 'single',
          difficulty: 'easy',
          tags: [],
          question: 'Q1?',
          choices: ['A', 'B'],
          answer: 0,
        },
        {
          id: 'q2',
          type: 'multi',
          difficulty: 'medium',
          tags: ['hooks'],
          question: 'Q2?',
          choices: ['X', 'Y', 'Z'],
          answer: [0, 2],
        },
      ],
    },
    {
      id: 'mod-b',
      label: 'Module B',
      questions: [
        {
          id: 'q3',
          type: 'single',
          difficulty: 'hard',
          tags: [],
          question: 'Q3?',
          choices: ['Yes', 'No'],
          answer: 1,
        },
      ],
    },
  ],
};

const baseConfig: SessionConfig = {
  ...DEFAULT_CONFIG,
  shuffle: false,
  timed: false,
};

// ─── Factory ──────────────────────────────────────────────────────────────────

describe('QcmSession constructor', () => {
  it('creates a session with all questions in "all" mode', () => {
    const session = new QcmSession(sessionData, baseConfig);
    const progress = session.getProgress();
    expect(progress.total).toBe(3);
    expect(progress.current).toBe(0);
  });

  it('filters to a single module', () => {
    const session = new QcmSession(sessionData, { ...baseConfig, mode: 'module', module: 'mod-b' });
    expect(session.getProgress().total).toBe(1);
  });

  it('filters by difficulty', () => {
    const session = new QcmSession(sessionData, { ...baseConfig, difficulty: 'hard' });
    expect(session.getProgress().total).toBe(1);
  });

  it('filters by tags', () => {
    const session = new QcmSession(sessionData, { ...baseConfig, tags: ['hooks'] });
    expect(session.getProgress().total).toBe(1);
  });
});

// ─── Navigation ───────────────────────────────────────────────────────────────

describe('navigation', () => {
  let session: QcmSession;

  beforeEach(() => {
    session = new QcmSession(sessionData, baseConfig);
  });

  it('current() returns the first question with answer hidden', () => {
    const cur = session.current();
    expect(cur).not.toBeNull();
    expect(cur!.question.id).toBe('q1');
    expect(cur!.question.answer).toBe(-1); // hidden
  });

  it('next() advances the index', () => {
    session.next();
    expect(session.current()!.question.id).toBe('q2');
  });

  it('previous() goes back', () => {
    session.next();
    session.previous();
    expect(session.current()!.question.id).toBe('q1');
  });

  it('next() clamps at the end', () => {
    session.next();
    session.next();
    session.next(); // beyond last → returns false
    expect(session.getProgress().current).toBe(2);
  });

  it('previous() clamps at 0', () => {
    session.previous();
    expect(session.getProgress().current).toBe(0);
  });
});

// ─── Answering ────────────────────────────────────────────────────────────────

describe('answering', () => {
  let session: QcmSession;

  beforeEach(() => {
    session = new QcmSession(sessionData, baseConfig);
  });

  it('answer() returns feedback for correct answer', () => {
    const fb = session.answer(0);
    expect(fb.correct).toBe(true);
    expect(fb.score).toBe(1);
    expect(fb.correctAnswer).toBe(0);
  });

  it('answer() returns feedback for wrong answer', () => {
    const fb = session.answer(1);
    expect(fb.correct).toBe(false);
    expect(fb.score).toBe(0);
  });

  it('skip() marks the question as skipped and auto-advances', () => {
    session.skip();
    // skip auto-advances via autoFinishIfLast → next()
    expect(session.current()!.question.id).toBe('q2');
  });

  it('allows re-answering (overwrites previous answer)', () => {
    session.answer(1); // wrong — auto-advances to q2
    // go back to re-answer q1
    session.previous();
    const fb = session.answer(0); // correct
    expect(fb.correct).toBe(true);
  });

  it('tracks answered count in progress', () => {
    session.answer(0); // correct, auto-advance to q2
    session.answer([0, 2]); // correct, auto-advance to q3
    // auto-finish hasn't happened yet since q3 is current
    const progress = session.getProgress();
    expect(progress.answered).toBe(2);
  });
});

// ─── Finish ───────────────────────────────────────────────────────────────────

describe('finish', () => {
  it('returns a complete result', () => {
    const session = new QcmSession(sessionData, baseConfig);
    session.answer(0); // auto-advance to q2
    session.answer([0, 2]); // auto-advance to q3
    session.answer(1); // last → auto-finish

    const result = session.getResult();
    expect(result.score).toBe(6); // 1 + 2 + 3
    expect(result.total).toBe(3);
    expect(result.maxScore).toBe(6);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.streak).toBe(3);
    expect(result.answers).toHaveLength(3);
    expect(result.byModule).toBeDefined();
    expect(result.byModule['mod-a'].score).toBe(3);
    expect(result.byModule['mod-b'].score).toBe(3);
  });

  it('auto-finishes on last question answer', () => {
    const session = new QcmSession(sessionData, baseConfig);
    session.answer(0);
    session.answer([0, 2]);
    session.answer(1); // last → auto finish

    // current() returns null after finished
    expect(session.current()).toBeNull();
  });

  it('handles partial scoring for multi-answer in result', () => {
    const session = new QcmSession(sessionData, baseConfig);
    session.answer(0); // correct (1 pt), auto-advance to q2
    session.answer([0]); // partial: only 1 of 2 correct → 0.5 * 2 = 1, auto-advance to q3
    session.skip(); // last → auto-finish

    const result = session.getResult();
    expect(result.score).toBe(2); // 1 + 1 + 0
    expect(result.passed).toBe(false);
  });
});

// ─── Retry ────────────────────────────────────────────────────────────────────

describe('retry', () => {
  it('creates a new session with only failed questions', () => {
    const session = new QcmSession(sessionData, baseConfig);
    session.answer(0); // correct, auto-advance
    session.answer([1]); // wrong, auto-advance
    session.skip(); // skipped, last → auto-finish

    const retrySession = session.retry();
    expect(retrySession.getProgress().total).toBe(2);
  });

  it('returns empty session when all answers are correct', () => {
    const session = new QcmSession(sessionData, baseConfig);
    session.answer(0);
    session.answer([0, 2]);
    session.answer(1); // all correct, auto-finish

    const retrySession = session.retry();
    expect(retrySession.getProgress().total).toBe(0);
  });
});

// ─── Timer ────────────────────────────────────────────────────────────────────

describe('timer', () => {
  it('isExpired returns false when not timed', () => {
    const session = new QcmSession(sessionData, baseConfig);
    expect(session.isExpired()).toBe(false);
  });

  it('isExpired returns false just after creation with timed config', () => {
    const session = new QcmSession(sessionData, {
      ...baseConfig,
      timed: true,
      timePerQuestion: 60_000, // 60s per question
    });
    expect(session.isExpired()).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// REDUX SLICE
// ═══════════════════════════════════════════════════════════════════════════════

import { configureStore } from '@reduxjs/toolkit';
import {
  qcmReducer,
  startSession,
  answerQuestion,
  skipQuestion,
  nextQuestion,
  previousQuestion,
  finishSession,
  retrySession,
  resetSession,
  selectQcmStatus,
  selectCurrentQuestion,
  selectProgress,
  selectResult,
  selectLastFeedback,
  selectModules,
} from './qcmSlice';

function createTestStore() {
  return configureStore({ reducer: { qcm: qcmReducer } });
}

const sliceData: QcmData = {
  modules: [
    {
      id: 'mod-a',
      label: 'Module A',
      questions: [
        {
          id: 'q1',
          type: 'single',
          difficulty: 'easy',
          tags: [],
          question: 'Q1?',
          choices: ['A', 'B'],
          answer: 0,
        },
        {
          id: 'q2',
          type: 'multi',
          difficulty: 'medium',
          tags: ['hooks'],
          question: 'Q2?',
          choices: ['X', 'Y', 'Z'],
          answer: [0, 2],
        },
      ],
    },
    {
      id: 'mod-b',
      label: 'Module B',
      questions: [
        {
          id: 'q3',
          type: 'single',
          difficulty: 'hard',
          tags: [],
          question: 'Q3?',
          choices: ['Yes', 'No'],
          answer: 1,
        },
      ],
    },
  ],
};

describe('qcmSlice', () => {
  describe('startSession', () => {
    it('initializes state with all questions', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));

      expect(selectQcmStatus(store.getState())).toBe('in-progress');
      expect(selectProgress(store.getState()).total).toBe(3);
      expect(selectCurrentQuestion(store.getState())!.question.id).toBe('q1');
    });

    it('applies module filter', () => {
      const store = createTestStore();
      store.dispatch(
        startSession({ data: sliceData, config: { mode: 'module', module: 'mod-b' } }),
      );
      expect(selectProgress(store.getState()).total).toBe(1);
    });

    it('applies difficulty filter', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData, config: { difficulty: 'hard' } }));
      expect(selectProgress(store.getState()).total).toBe(1);
    });

    it('applies tags filter', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData, config: { tags: ['hooks'] } }));
      expect(selectProgress(store.getState()).total).toBe(1);
    });
  });

  describe('answerQuestion', () => {
    it('records correct answer and produces feedback', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0));

      const fb = selectLastFeedback(store.getState());
      expect(fb!.correct).toBe(true);
      expect(fb!.score).toBe(1);
    });

    it('records wrong answer', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(1));

      const fb = selectLastFeedback(store.getState());
      expect(fb!.correct).toBe(false);
      expect(fb!.score).toBe(0);
    });

    it('auto-advances to next question', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0)); // q1 → q2

      expect(selectCurrentQuestion(store.getState())!.question.id).toBe('q2');
    });

    it('auto-finishes on last question', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0)); // q1
      store.dispatch(answerQuestion([0, 2])); // q2
      store.dispatch(answerQuestion(1)); // q3 → auto-finish

      expect(selectQcmStatus(store.getState())).toBe('finished');
      expect(selectCurrentQuestion(store.getState())).toBeNull();
    });

    it('ignores actions when not in-progress', () => {
      const store = createTestStore();
      store.dispatch(answerQuestion(0)); // idle → ignored
      expect(selectQcmStatus(store.getState())).toBe('idle');
    });
  });

  describe('skipQuestion', () => {
    it('records skip and auto-advances', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(skipQuestion());

      expect(selectProgress(store.getState()).skipped).toBe(1);
      expect(selectCurrentQuestion(store.getState())!.question.id).toBe('q2');
    });

    it('clears lastFeedback', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0)); // sets feedback
      store.dispatch(skipQuestion()); // clears

      expect(selectLastFeedback(store.getState())).toBeNull();
    });
  });

  describe('navigation', () => {
    it('nextQuestion advances without auto-finish', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(nextQuestion());

      expect(selectCurrentQuestion(store.getState())!.question.id).toBe('q2');
      expect(selectQcmStatus(store.getState())).toBe('in-progress');
    });

    it('nextQuestion clamps at end', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(nextQuestion());
      store.dispatch(nextQuestion());
      store.dispatch(nextQuestion()); // beyond end

      expect(selectProgress(store.getState()).current).toBe(2);
    });

    it('previousQuestion goes back', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(nextQuestion());
      store.dispatch(previousQuestion());

      expect(selectCurrentQuestion(store.getState())!.question.id).toBe('q1');
    });

    it('previousQuestion clamps at 0', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(previousQuestion());

      expect(selectProgress(store.getState()).current).toBe(0);
    });
  });

  describe('finishSession', () => {
    it('manually finishes', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(finishSession());

      expect(selectQcmStatus(store.getState())).toBe('finished');
    });
  });

  describe('selectResult', () => {
    it('computes full result after all correct', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0));
      store.dispatch(answerQuestion([0, 2]));
      store.dispatch(answerQuestion(1));

      const result = selectResult(store.getState());
      expect(result.score).toBe(6);
      expect(result.maxScore).toBe(6);
      expect(result.percentage).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.streak).toBe(3);
      expect(result.total).toBe(3);
      expect(result.answers).toHaveLength(3);
      expect(result.byModule['mod-a'].score).toBe(3);
      expect(result.byModule['mod-b'].score).toBe(3);
    });

    it('handles partial multi-answer scoring', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0)); // correct (1pt)
      store.dispatch(answerQuestion([0])); // partial (1pt)
      store.dispatch(skipQuestion()); // 0

      const result = selectResult(store.getState());
      expect(result.score).toBe(2);
      expect(result.passed).toBe(false);
    });
  });

  describe('selectCurrentQuestion', () => {
    it('hides the answer', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));

      const cur = selectCurrentQuestion(store.getState());
      expect(cur!.question.answer).toBe(-1);
    });

    it('returns null when idle', () => {
      const store = createTestStore();
      expect(selectCurrentQuestion(store.getState())).toBeNull();
    });
  });

  describe('selectModules', () => {
    it('lists modules from loaded data', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));

      const mods = selectModules(store.getState());
      expect(mods).toEqual([
        { id: 'mod-a', label: 'Module A', questionCount: 2 },
        { id: 'mod-b', label: 'Module B', questionCount: 1 },
      ]);
    });

    it('returns empty when idle', () => {
      const store = createTestStore();
      expect(selectModules(store.getState())).toEqual([]);
    });
  });

  describe('retrySession', () => {
    it('restarts with only failed questions', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0)); // correct
      store.dispatch(answerQuestion([1])); // wrong
      store.dispatch(skipQuestion()); // skipped → auto-finish

      store.dispatch(retrySession());

      expect(selectQcmStatus(store.getState())).toBe('in-progress');
      expect(selectProgress(store.getState()).total).toBe(2);
    });

    it('no-ops when all correct', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0));
      store.dispatch(answerQuestion([0, 2]));
      store.dispatch(answerQuestion(1));

      store.dispatch(retrySession());
      // Still finished, no retry happened
      expect(selectQcmStatus(store.getState())).toBe('finished');
    });
  });

  describe('resetSession', () => {
    it('returns to idle state', () => {
      const store = createTestStore();
      store.dispatch(startSession({ data: sliceData }));
      store.dispatch(answerQuestion(0));
      store.dispatch(resetSession());

      expect(selectQcmStatus(store.getState())).toBe('idle');
      expect(selectProgress(store.getState()).total).toBe(0);
    });
  });
});
