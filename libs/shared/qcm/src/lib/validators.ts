/**
 * @module validators
 * @description Runtime validation for QCM data structures.
 *
 * Validates questions, modules, and full QCM payloads.
 * Accepts `unknown` inputs — safe to use on raw JSON or user-supplied data.
 * Returns an array of human-readable error strings (empty = valid).
 */

import type { QcmModule } from './types.js';

// ─── Single question ──────────────────────────────────────────────────────────

/**
 * Validate a single question object.
 *
 * Checks:
 * - `id` is a non-empty string.
 * - `type` is `'single'` or `'multi'`.
 * - `difficulty` is `'easy'`, `'medium'`, or `'hard'`.
 * - `tags` is a string array.
 * - `question` is a non-empty string.
 * - `choices` has at least 2 string entries.
 * - `answer` index(es) are in range and match the question type.
 *
 * @param q - The value to validate (typically parsed JSON).
 * @returns Array of error messages — empty if valid.
 */
export function validateQuestion(q: unknown): string[] {
  const errors: string[] = [];
  if (!q || typeof q !== 'object') return ['Question must be an object'];

  const question = q as Record<string, unknown>;

  if (!question.id || typeof question.id !== 'string') {
    errors.push('Missing or invalid "id"');
  }

  if (question.type !== 'single' && question.type !== 'multi') {
    errors.push(`Invalid "type": expected "single" or "multi", got "${question.type}"`);
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(question.difficulty as string)) {
    errors.push(`Invalid "difficulty": expected easy|medium|hard, got "${question.difficulty}"`);
  }

  if (!Array.isArray(question.tags)) {
    errors.push('Missing or invalid "tags": expected string[]');
  }

  if (!question.question || typeof question.question !== 'string') {
    errors.push('Missing or invalid "question" text');
  }

  if (!Array.isArray(question.choices) || question.choices.length < 2) {
    errors.push('Must have at least 2 choices');
    return errors;
  }

  const choices = question.choices as unknown[];
  if (choices.some((c) => typeof c !== 'string')) {
    errors.push('All choices must be strings');
  }

  const maxIndex = choices.length - 1;

  if (question.type === 'single') {
    if (typeof question.answer !== 'number') {
      errors.push('Single-type question must have a number answer');
    } else if (question.answer < 0 || question.answer > maxIndex) {
      errors.push(`Answer index ${question.answer} is out of range [0..${maxIndex}]`);
    }
  }

  if (question.type === 'multi') {
    if (!Array.isArray(question.answer)) {
      errors.push('Multi-type question must have an array answer');
    } else {
      const answers = question.answer as number[];
      if (answers.length === 0) {
        errors.push('Multi-type question must have at least one correct answer');
      }
      for (const a of answers) {
        if (typeof a !== 'number' || a < 0 || a > maxIndex) {
          errors.push(`Answer index ${a} is out of range [0..${maxIndex}]`);
        }
      }
      if (new Set(answers).size !== answers.length) {
        errors.push('Duplicate values in multi-answer');
      }
    }
  }

  return errors;
}

// ─── Module ───────────────────────────────────────────────────────────────────

/**
 * Validate a module object and all its nested questions.
 *
 * Checks:
 * - `id` and `label` are non-empty strings.
 * - `questions` is a non-empty array.
 * - Each question passes {@link validateQuestion}.
 *
 * @param m - The value to validate.
 * @returns Array of error messages — empty if valid.
 */
export function validateModule(m: unknown): string[] {
  const errors: string[] = [];
  if (!m || typeof m !== 'object') return ['Module must be an object'];

  const mod = m as Record<string, unknown>;

  if (!mod.id || typeof mod.id !== 'string') {
    errors.push('Missing or invalid module "id"');
  }

  if (!mod.label || typeof mod.label !== 'string') {
    errors.push('Missing or invalid module "label"');
  }

  if (!Array.isArray(mod.questions) || mod.questions.length === 0) {
    errors.push('Module must have at least one question');
    return errors;
  }

  (mod.questions as unknown[]).forEach((q, i) => {
    const qErrors = validateQuestion(q);
    for (const e of qErrors) {
      errors.push(`questions[${i}]: ${e}`);
    }
  });

  return errors;
}

// ─── Full data ────────────────────────────────────────────────────────────────

/**
 * Validate an entire QCM data payload.
 *
 * Delegates to {@link validateModule} for each module, and additionally
 * checks for **duplicate question IDs** across all modules.
 *
 * @param data - The value to validate (typically the parsed quiz JSON).
 * @returns Array of error messages — empty if valid.
 */
export function validateQcmData(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') return ['Data must be an object'];

  const d = data as Record<string, unknown>;

  if (!Array.isArray(d.modules) || d.modules.length === 0) {
    errors.push('Must have at least one module');
    return errors;
  }

  const allIds = new Set<string>();

  (d.modules as unknown[]).forEach((mod, mi) => {
    const modErrors = validateModule(mod);
    for (const e of modErrors) {
      errors.push(`modules[${mi}]: ${e}`);
    }

    if (mod && typeof mod === 'object' && Array.isArray((mod as QcmModule).questions)) {
      for (const q of (mod as QcmModule).questions) {
        if (allIds.has(q.id)) {
          errors.push(`Duplicate question id "${q.id}" across modules`);
        }
        allIds.add(q.id);
      }
    }
  });

  return errors;
}
