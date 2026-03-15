/**
 * @module engine
 * @description Pure, stateless functions for the QCM scoring engine.
 *
 * Everything here is side-effect-free: answer checking, weighted scoring,
 * shuffling, filtering, flattening, and retry selection.
 */

import type {
  QcmQuestion,
  QcmAnswer,
  QcmData,
  FlatQuestion,
  ModuleScore,
  Difficulty,
} from './types.js';

// ─── Difficulty weights ───────────────────────────────────────────────────────

/** Points awarded per difficulty tier when the answer is correct. */
const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

/**
 * Compute the weighted score for a single answer.
 *
 * @param difficulty - The question's difficulty tier.
 * @param correct    - Whether the answer was correct.
 * @returns The weight (1 / 2 / 3) if correct, otherwise `0`.
 */
export function weightedScore(difficulty: Difficulty, correct: boolean): number {
  return correct ? DIFFICULTY_WEIGHT[difficulty] : 0;
}

/**
 * Get the maximum possible weight for a difficulty tier.
 *
 * @param difficulty - `'easy'` → 1, `'medium'` → 2, `'hard'` → 3.
 */
export function maxWeight(difficulty: Difficulty): number {
  return DIFFICULTY_WEIGHT[difficulty];
}

// ─── Answer checking ──────────────────────────────────────────────────────────

/**
 * Check a single-choice answer.
 *
 * @param question - The target question (must be `type: 'single'`).
 * @param selected - The index the user picked.
 * @returns `true` if the selected index matches the correct answer.
 */
export function checkSingleAnswer(question: QcmQuestion, selected: number): boolean {
  return selected === question.answer;
}

/**
 * Check a multi-choice answer with **partial scoring**.
 *
 * Scoring formula:
 * - +1 per correct pick
 * - −0.5 per wrong pick
 * - Result clamped to [0, correctCount], then normalized to [0, 1].
 *
 * @param question - The target question (must be `type: 'multi'`).
 * @param selected - Array of indices the user picked.
 * @returns `correct` — fully correct?  `partialScore` — normalized 0–1 fraction.
 */
export function checkMultiAnswer(
  question: QcmQuestion,
  selected: number[],
): { correct: boolean; partialScore: number } {
  const correct = question.answer as number[];
  const correctSet = new Set(correct);
  const selectedSet = new Set(selected);

  let hits = 0;
  let misses = 0;

  for (const s of selectedSet) {
    if (correctSet.has(s)) hits++;
    else misses++;
  }

  const raw = hits - misses * 0.5;
  const partialScore = Math.max(0, raw) / correct.length;

  return {
    correct: hits === correct.length && misses === 0,
    partialScore,
  };
}

/**
 * Universal answer checker — dispatches to single or multi logic.
 *
 * @param question - Any QCM question.
 * @param selected - User pick(s).
 * @returns `correct` flag and the difficulty-weighted `score`.
 */
export function checkAnswer(
  question: QcmQuestion,
  selected: number | number[],
): { correct: boolean; score: number } {
  if (question.type === 'multi') {
    const sel = Array.isArray(selected) ? selected : [selected];
    const { correct, partialScore } = checkMultiAnswer(question, sel);
    return {
      correct,
      score: weightedScore(question.difficulty, true) * partialScore,
    };
  }

  const sel = typeof selected === 'number' ? selected : selected[0];
  const correct = checkSingleAnswer(question, sel);
  return {
    correct,
    score: weightedScore(question.difficulty, correct),
  };
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Sum all individual answer scores.
 *
 * @param answers - Array of recorded answers.
 * @returns Total weighted score.
 */
export function scoreAnswers(answers: QcmAnswer[]): number {
  return answers.reduce((sum, a) => sum + a.score, 0);
}

/**
 * Compute the maximum possible score for a set of questions.
 *
 * @param questions - Questions to tally.
 * @returns Sum of each question's difficulty weight.
 */
export function maxScoreForQuestions(questions: QcmQuestion[]): number {
  return questions.reduce((sum, q) => sum + maxWeight(q.difficulty), 0);
}

/**
 * Break down scores by module.
 *
 * @param answers   - Recorded answers.
 * @param questions - Flat questions (with `moduleId`).
 * @returns Object keyed by module id, each value a {@link ModuleScore}.
 */
export function scoreByModule(
  answers: QcmAnswer[],
  questions: FlatQuestion[],
): Record<string, ModuleScore> {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const groups = new Map<string, { answers: QcmAnswer[]; questions: FlatQuestion[] }>();

  for (const q of questions) {
    if (!groups.has(q.moduleId)) {
      groups.set(q.moduleId, { answers: [], questions: [] });
    }
    groups.get(q.moduleId)!.questions.push(q);
  }

  for (const a of answers) {
    const q = qMap.get(a.questionId);
    if (q && groups.has(q.moduleId)) {
      groups.get(q.moduleId)!.answers.push(a);
    }
  }

  const result: Record<string, ModuleScore> = {};

  for (const [moduleId, group] of groups) {
    const score = scoreAnswers(group.answers);
    const max = maxScoreForQuestions(group.questions);
    result[moduleId] = {
      moduleId,
      score,
      total: group.questions.length,
      maxScore: max,
      percentage: max > 0 ? Math.round((score / max) * 100) : 0,
    };
  }

  return result;
}

/**
 * Find the longest consecutive streak of correct (non-skipped) answers.
 *
 * @param answers - Ordered array of recorded answers.
 * @returns Length of the best streak.
 */
export function calculateStreak(answers: QcmAnswer[]): number {
  let max = 0;
  let current = 0;

  for (const a of answers) {
    if (a.correct && !a.skipped) {
      current++;
      if (current > max) max = current;
    } else {
      current = 0;
    }
  }

  return max;
}

// ─── Shuffle ──────────────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle — returns a new array, original untouched.
 *
 * @param arr - Source array.
 * @returns A shuffled shallow copy.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffle a question's choices **and remap** the answer indices accordingly.
 *
 * @param question - Original question.
 * @returns A new question with shuffled choices and updated `answer`.
 */
export function shuffleChoices(question: QcmQuestion): QcmQuestion {
  const indices = question.choices.map((_, i) => i);
  const shuffled = shuffleArray(indices);

  const newChoices = shuffled.map((i) => question.choices[i]);
  const indexMap = new Map(shuffled.map((oldIdx, newIdx) => [oldIdx, newIdx]));

  let newAnswer: number | number[];
  if (Array.isArray(question.answer)) {
    newAnswer = question.answer.map((a) => indexMap.get(a)!);
  } else {
    newAnswer = indexMap.get(question.answer)!;
  }

  return { ...question, choices: newChoices, answer: newAnswer };
}

/**
 * Shuffle question order. Alias for {@link shuffleArray}.
 *
 * @param questions - Array of questions.
 * @returns A shuffled shallow copy.
 */
export function shuffleQuestions<T>(questions: T[]): T[] {
  return shuffleArray(questions);
}

// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * Keep only questions belonging to a specific module.
 *
 * @param questions - Flat question pool.
 * @param moduleId - Target module id.
 */
export function filterByModule(questions: FlatQuestion[], moduleId: string): FlatQuestion[] {
  return questions.filter((q) => q.moduleId === moduleId);
}

/**
 * Keep only questions of a specific difficulty tier.
 *
 * @param questions  - Flat question pool.
 * @param difficulty - Target difficulty.
 */
export function filterByDifficulty(
  questions: FlatQuestion[],
  difficulty: Difficulty,
): FlatQuestion[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

/**
 * Keep questions that have **at least one** of the given tags.
 *
 * @param questions - Flat question pool.
 * @param tags      - Tags to match (OR logic).
 */
export function filterByTags(questions: FlatQuestion[], tags: string[]): FlatQuestion[] {
  const tagSet = new Set(tags);
  return questions.filter((q) => q.tags.some((t) => tagSet.has(t)));
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

/**
 * Flatten all modules into a single array of {@link FlatQuestion}s,
 * each enriched with its parent `moduleId`.
 *
 * @param data - Full QCM data payload.
 * @returns Flat array preserving module order.
 */
export function flattenModules(data: QcmData): FlatQuestion[] {
  const result: FlatQuestion[] = [];
  for (const mod of data.modules) {
    for (const q of mod.questions) {
      result.push({ ...q, moduleId: mod.id });
    }
  }
  return result;
}

/**
 * List all modules with their question counts.
 *
 * @param data - Full QCM data payload.
 * @returns Array of `{ id, label, questionCount }` summaries.
 */
export function listModules(data: QcmData): { id: string; label: string; questionCount: number }[] {
  return data.modules.map((m) => ({
    id: m.id,
    label: m.label,
    questionCount: m.questions.length,
  }));
}

/**
 * Get questions the user got wrong or skipped — ready for a retry round.
 *
 * @param answers   - Recorded answers from the finished session.
 * @param questions - The full flat question pool.
 * @returns Subset of questions that were failed or skipped.
 */
export function getRetryQuestions(answers: QcmAnswer[], questions: FlatQuestion[]): FlatQuestion[] {
  const failedIds = new Set(
    answers.filter((a) => !a.correct || a.skipped).map((a) => a.questionId),
  );
  return questions.filter((q) => failedIds.has(q.id));
}
