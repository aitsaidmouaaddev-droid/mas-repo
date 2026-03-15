/**
 * @packageDocumentation
 * @module @mas/qcm
 *
 * Framework-agnostic QCM (quiz) engine library.
 *
 * **Session** — stateful quiz session manager.
 * **Engine**  — pure scoring, shuffling, and filtering functions.
 * **Validators** — runtime data validation for raw JSON payloads.
 * **Types** — all TypeScript interfaces and type aliases.
 */

// ─── Session ──────────────────────────────────────────────────────────────────
export { createSession, QcmSession } from './lib/session.js';

// ─── Engine (pure functions) ──────────────────────────────────────────────────
export {
  checkAnswer,
  checkSingleAnswer,
  checkMultiAnswer,
  scoreAnswers,
  scoreByModule,
  calculateStreak,
  maxScoreForQuestions,
  weightedScore,
  maxWeight,
  shuffleChoices,
  shuffleQuestions,
  flattenModules,
  listModules,
  filterByModule,
  filterByDifficulty,
  filterByTags,
  getRetryQuestions,
} from './lib/engine.js';

// ─── Validators ───────────────────────────────────────────────────────────────
export { validateQuestion, validateModule, validateQcmData } from './lib/validators.js';

// ─── Types (re-export for consumers) ──────────────────────────────────────────
export type {
  QuestionType,
  Difficulty,
  QcmQuestion,
  QcmModule,
  QcmData,
  SessionMode,
  SessionConfig,
  QcmAnswer,
  AnswerFeedback,
  ModuleScore,
  QcmResult,
  SessionProgress,
  FlatQuestion,
} from './lib/types.js';
export { DEFAULT_CONFIG } from './lib/types.js';

// ─── Redux Slice ──────────────────────────────────────────────────────────────
export {
  qcmSlice,
  qcmReducer,
  startSession,
  answerQuestion,
  skipQuestion,
  nextQuestion,
  previousQuestion,
  finishSession,
  retrySession,
  resetSession,
  selectQcm,
  selectQcmStatus,
  selectCurrentQuestion,
  selectProgress,
  selectResult,
  selectLastFeedback,
  selectModules,
} from './lib/qcmSlice.js';
export type { QcmSliceState, QcmStatus } from './lib/qcmSlice.js';
