/**
 * CONCEPT: Generic Functions
 *
 * WHY: Generics allow functions to be reused across multiple types while
 * preserving type information. Without generics, you'd either duplicate code
 * for each type OR lose type safety by using `any`/`unknown`.
 *
 * WHEN/WHERE: Any time a function should work with multiple types in a
 * type-preserving way: utilities, wrappers, data transformations, higher-order
 * functions.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/generics.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write a generic `identity<T>(value: T): T` function
// that returns the value unchanged with preserved type
// TODO: implement identity
export function identity<T>(value: T): T {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write a generic `first<T>(arr: T[]): T | undefined` function
// that returns the first element of an array (or undefined if empty)
// TODO: implement first
export function first<T>(arr: T[]): T | undefined {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Write a generic `groupBy<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T[]>`
// that groups an array of objects by a specified key
// TODO: implement groupBy
export function groupBy<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T[]> {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Write a generic `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`
// that creates a new object with only the specified keys
// TODO: implement pick
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a generic `memoize<T extends (...args: any[]) => any>(fn: T): T`
// that caches function results keyed by JSON.stringify of the arguments
// TODO: implement memoize
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  throw new Error('Not implemented');
}
