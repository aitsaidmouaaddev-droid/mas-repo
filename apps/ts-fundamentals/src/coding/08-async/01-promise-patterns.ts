/**
 * CONCEPT: Async/Await and Promise typing in TypeScript
 *
 * WHY: Async programming is central to modern TypeScript. Understanding how to
 * type Promises, async functions, concurrent operations, and error channels is
 * critical for backend (Node/NestJS) and frontend (React, Angular) development.
 *
 * WHEN/WHERE: API calls, database access, file I/O, timers, streams, concurrent
 * data loading, retry/timeout patterns.
 *
 * DOCS:
 * - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#awaited-type-and-promise-improvements
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Implement `delay(ms: number): Promise<void>` that resolves after ms milliseconds
// TODO: implement delay
export function delay(ms: number): Promise<void> {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Implement a Result type and `tryCatch<T>`:
// Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
// tryCatch takes an async factory `fn: () => Promise<T>` and returns Promise<Result<T, Error>>
// If fn throws, catch the error and return { ok: false, error }
// TODO: implement
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Implement `withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>`
// that rejects with a TimeoutError if promise doesn't resolve within ms milliseconds
// Use Promise.race
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

// TODO: implement withTimeout
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Implement `sequential<T>(tasks: Array<() => Promise<T>>): Promise<T[]>`
// that runs async tasks IN SEQUENCE (not concurrently) and returns all results
// TODO: implement sequential
export async function sequential<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Implement `retry<T>(fn: () => Promise<T>, attempts: number, delayMs?: number): Promise<T>`
// Retries fn up to `attempts` times. Wait `delayMs` ms between retries.
// If all attempts fail, rejects with the last error.
// TODO: implement retry
export async function retry<T>(fn: () => Promise<T>, attempts: number, delayMs = 0): Promise<T> {
  throw new Error('Not implemented');
}
