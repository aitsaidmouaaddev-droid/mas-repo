/**
 * @module types
 * @description Core type definitions for the QCM (Questionnaire à Choix Multiples) engine.
 *
 * Provides all interfaces and types needed to define quizzes, configure sessions,
 * record answers, and represent results. Framework-agnostic — works in any TS/JS runtime.
 */

// ─── Question types ───────────────────────────────────────────────────────────

/** Answer mode: single correct choice or multiple correct choices. */
export type QuestionType = 'single' | 'multi';

/** Difficulty tier — drives weighted scoring (easy=1, medium=2, hard=3). */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * A single quiz question.
 *
 * @property id          - Unique identifier (must be unique across all modules).
 * @property type        - `'single'` for one correct answer, `'multi'` for several.
 * @property difficulty  - Difficulty tier that determines the score weight.
 * @property tags        - Freeform tags for filtering (e.g. `['hooks', 'state']`).
 * @property question    - The question prompt displayed to the user.
 * @property code        - Optional code snippet shown alongside the question.
 * @property choices     - Array of possible answer strings (minimum 2).
 * @property answer      - Correct answer: a choice index (`number`) for single,
 *                         or an array of indices (`number[]`) for multi.
 * @property explanation - Optional text shown after the user answers.
 * @property docs        - Optional link to reference documentation for this question.
 */
export interface QcmQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  tags: string[];
  question: string;
  code?: string | null;
  choices: string[];
  answer: number | number[];
  explanation?: string;
  docs?: string;
}

// ─── Module / Data ────────────────────────────────────────────────────────────

/**
 * A thematic group of questions (e.g. "JSX Basics", "Hooks").
 *
 * @property id        - Unique module identifier.
 * @property label     - Human-readable module name.
 * @property questions - Non-empty array of questions in this module.
 */
export interface QcmModule {
  id: string;
  label: string;
  questions: QcmQuestion[];
}

/**
 * Root data structure — the full quiz payload.
 * Contains one or more modules, each holding their own questions.
 */
export interface QcmData {
  modules: QcmModule[];
}

// ─── Session config ───────────────────────────────────────────────────────────

/** Session scope: all questions or a specific module. */
export type SessionMode = 'all' | 'module';

/**
 * Configuration for a quiz session.
 *
 * @property mode            - `'all'` to include every question, `'module'` for one module.
 * @property module          - Module id to filter on when `mode` is `'module'`.
 * @property shuffle         - Randomize question order and choice order.
 * @property showExplanation - Include explanations in answer feedback.
 * @property timed           - Enable per-question countdown timer.
 * @property timePerQuestion - Seconds allowed per question (requires `timed: true`).
 * @property passThreshold   - Minimum percentage (0–100) to pass the quiz.
 * @property difficulty      - Optional filter: only include questions of this difficulty.
 * @property tags            - Optional filter: only include questions matching any of these tags.
 */
export interface SessionConfig {
  mode: SessionMode;
  module?: string;
  shuffle: boolean;
  showExplanation: boolean;
  timed: boolean;
  timePerQuestion?: number;
  passThreshold: number;
  difficulty?: Difficulty;
  tags?: string[];
}

/** Sensible defaults — all questions, no shuffle, show explanations, 80 % pass. */
export const DEFAULT_CONFIG: SessionConfig = {
  mode: 'all',
  shuffle: false,
  showExplanation: true,
  timed: false,
  passThreshold: 80,
};

// ─── Answer / Feedback ────────────────────────────────────────────────────────

/**
 * A recorded user answer for one question.
 *
 * @property questionId - The question this answer belongs to.
 * @property selected   - Index(es) the user picked, or `null` if skipped.
 * @property correct    - Whether the selection was fully correct.
 * @property skipped    - `true` when the user opted to skip.
 * @property score      - Weighted score earned (0 if wrong/skipped, partial for multi).
 * @property answeredAt - Unix timestamp (ms) when the answer was recorded.
 */
export interface QcmAnswer {
  questionId: string;
  selected: number | number[] | null;
  correct: boolean;
  skipped: boolean;
  score: number;
  answeredAt: number;
}

/**
 * Immediate feedback returned after answering a question.
 *
 * @property correct       - Was the answer fully correct?
 * @property correctAnswer - The actual correct answer (index or indices).
 * @property score         - Points earned for this answer.
 * @property explanation   - Optional explanation (present when `showExplanation` is on).
 */
export interface AnswerFeedback {
  correct: boolean;
  correctAnswer: number | number[];
  score: number;
  explanation?: string;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Aggregated score for a single module within a finished session.
 *
 * @property moduleId   - The module these stats belong to.
 * @property score      - Total weighted score earned in this module.
 * @property total      - Number of questions in this module.
 * @property maxScore   - Maximum possible weighted score.
 * @property percentage - Rounded percentage (0–100).
 */
export interface ModuleScore {
  moduleId: string;
  score: number;
  total: number;
  maxScore: number;
  percentage: number;
}

/**
 * Final result of a completed quiz session.
 *
 * @property score      - Total weighted score earned.
 * @property total      - Total number of questions.
 * @property maxScore   - Maximum possible weighted score.
 * @property percentage - Rounded percentage (0–100).
 * @property passed     - `true` when `percentage >= passThreshold`.
 * @property duration   - Session duration in milliseconds.
 * @property streak     - Longest consecutive-correct-answer run.
 * @property answers    - Full list of recorded answers.
 * @property byModule   - Per-module breakdown keyed by module id.
 */
export interface QcmResult {
  score: number;
  total: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  duration: number;
  streak: number;
  answers: QcmAnswer[];
  byModule: Record<string, ModuleScore>;
}

// ─── Session progress ─────────────────────────────────────────────────────────

/**
 * Live progress snapshot during a session.
 *
 * @property current       - Zero-based index of the current question.
 * @property total         - Total number of questions in the session.
 * @property answered      - How many questions have been answered (not skipped).
 * @property skipped       - How many questions have been skipped.
 * @property timeRemaining - Seconds left for the current question (timed mode only).
 */
export interface SessionProgress {
  current: number;
  total: number;
  answered: number;
  skipped: number;
  timeRemaining?: number;
}

// ─── Internal: question with module reference ─────────────────────────────────

/**
 * A question enriched with its parent module id.
 * Produced by {@link flattenModules} — used internally for scoring and filtering.
 */
export interface FlatQuestion extends QcmQuestion {
  moduleId: string;
}
