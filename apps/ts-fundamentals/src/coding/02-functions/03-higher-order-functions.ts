/**
 * CONCEPT: Higher-order functions and function composition
 *
 * WHY: Higher-order functions (functions that take or return other functions)
 * are fundamental to functional programming patterns in TypeScript. Typing them
 * correctly requires generics, conditional types, and careful inference.
 *
 * WHEN/WHERE: Middleware, decorators, pipelines, event systems, React hooks
 * — anywhere functions are passed as values or returned as results.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/functions.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write a `compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C`
// function that composes two functions right-to-left: compose(f, g)(x) === f(g(x))
// TODO: implement compose
export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write a `pipe<T>(value: T, ...fns: Array<(x: any) => any>): any` function
// that passes a value through a series of functions left-to-right
// pipe(5, x => x * 2, x => x + 1) === 11
// For simplicity, you can use `any` for the variadic version
// TODO: implement pipe
export function pipe<T>(value: T, ...fns: Array<(x: any) => any>): any {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Write a `curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C`
// function that converts a two-argument function into a curried form
// TODO: implement curry
export function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Write a `once<T extends (...args: any[]) => any>(fn: T): T`
// function that ensures a function is only called the FIRST time — subsequent
// calls return the first result (useful for lazy initialization)
// TODO: implement once
export function once<T extends (...args: any[]) => any>(fn: T): T {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a `partial<T, Args extends any[], Rest extends any[], R>(
//   fn: (first: T, ...args: [...Args, ...Rest]) => R,
//   firstArg: T
// ): (...args: [...Args, ...Rest]) => R`
// This is a simplified partial application that binds the first argument.
// Simpler version: `partialFirst<T, R>(fn: (first: T, ...rest: any[]) => R, first: T): (...rest: any[]) => R`
// TODO: implement partialFirst
export function partialFirst<T, R>(
  fn: (first: T, ...rest: any[]) => R,
  first: T,
): (...rest: any[]) => R {
  throw new Error('Not implemented');
}
