/**
 * CONCEPT: Structural Typing Deep Dive — Excess Property Checks, Compatibility
 *
 * WHY: TypeScript's structural type system has nuances that trip up developers:
 * excess property checking (only on fresh object literals), function compatibility,
 * class structural equivalence, and covariance/contravariance. These are
 * guaranteed interview topics at senior TypeScript positions.
 *
 * WHEN/WHERE: Understanding type compatibility, writing type-safe APIs, debugging
 * "assignable to" errors, contributing to TypeScript codebases.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Implement a `isAssignableTo<TTarget>(value: unknown): value is TTarget`
// type predicate using a RUNTIME structural check.
// Given a `schema` describing the expected shape as `{ [key: string]: string }`
// (key = property name, value = typeof string),
// check all required keys exist and have correct typeof value.
// TODO: implement structuralCheck
export function structuralCheck(value: unknown, schema: Record<string, string>): boolean {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Implement covariance/contravariance understanding exercise.
// Given a broad source type and specific target, use TypeScript assignments
// to demonstrate type compatibility:
export interface Animal {
  name: string;
}
export interface Dog extends Animal {
  breed: string;
}

// Write a function `demonstrateCovariance()` that:
// - Creates a Dog and assigns it to an Animal variable (covariant — OK for objects)
// - Creates a handler: (a: Animal) => void and shows it can be used as (d: Dog) => void
// Returns { dogWorksAsAnimal: boolean, animalHandlerWorksForDog: boolean }
// TODO: implement demonstrateCovariance
export function demonstrateCovariance(): {
  dogWorksAsAnimal: boolean;
  animalHandlerWorksForDog: boolean;
} {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Implement `deepEqual<T>(a: T, b: T): boolean`
// A recursive structural equality check for plain objects, arrays, and primitives.
// (Does not need to handle: Date, Map, Set, RegExp, functions)
// TODO: implement deepEqual
export function deepEqual<T>(a: T, b: T): boolean {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Implement a `clone<T>(obj: T): T` function that deep clones
// plain objects and arrays (non-circularly-referenced).
// May use JSON.parse/JSON.stringify with the limitation of losing Date, etc.
// Add a JSDoc comment explaining the limitation.
// TODO: implement clone
/**
 * Deep clones a plain object/array using JSON roundtrip.
 * Limitation: loses Date objects (converted to strings), undefined values,
 * functions, Map, Set, and circular references are not supported.
 */
export function clone<T>(obj: T): T {
  throw new Error('Not implemented');
}
