/**
 * CONCEPT: Type Predicates and Assertion Functions
 *
 * WHY: TypeScript can't always narrow types automatically. Type predicates
 * (`x is T`) create reusable narrowing logic encapsulated in functions.
 * Assertion functions (`asserts x is T`) narrow for the ENTIRE remaining scope.
 *
 * WHEN/WHERE: Complex validation functions, array filtering to typed arrays,
 * error handling, DI containers, data parsing pipelines.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write type predicates for primitive checks:
// - isString(x: unknown): x is string
// - isNumber(x: unknown): x is number
// - isBoolean(x: unknown): x is boolean
// TODO: implement all three
export function isString(x: unknown): x is string {
  throw new Error('Not implemented');
}

export function isNumber(x: unknown): x is number {
  throw new Error('Not implemented');
}

export function isBoolean(x: unknown): x is boolean {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Define a `Dog` and `Cat` type, then write:
// - isDog(x: Dog | Cat): x is Dog — check for the 'bark' method
// Use it to implement speak(animal: Dog | Cat): string
export type Dog = { name: string; bark(): string };
export type Cat = { name: string; meow(): string };

// TODO: implement isDog type predicate
export function isDog(animal: Dog | Cat): animal is Dog {
  throw new Error('Not implemented');
}

// TODO: implement speak
export function speak(animal: Dog | Cat): string {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Write a type predicate function `isNonNullable<T>(x: T | null | undefined): x is T`
// that filters out null and undefined
// Then use it to type a function `filterNonNullable<T>(arr: Array<T | null | undefined>): T[]`
// TODO: implement isNonNullable
export function isNonNullable<T>(x: T | null | undefined): x is T {
  throw new Error('Not implemented');
}

// TODO: implement filterNonNullable using isNonNullable in .filter()
export function filterNonNullable<T>(arr: Array<T | null | undefined>): T[] {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Write an assertion function `assertDefined<T>(x: T | null | undefined, msg?: string): asserts x is T`
// that throws if x is null or undefined. When it returns, TypeScript knows x is T.
// TODO: implement assertDefined
export function assertDefined<T>(x: T | null | undefined, msg?: string): asserts x is T {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a type predicate `isShape(x: unknown): x is { kind: string }`
// Then write `isCircle(x: unknown): x is { kind: 'circle'; radius: number }`
// Check both the shape structure AND the kind discriminant
// TODO: implement both predicates
export function isShape(x: unknown): x is { kind: string } {
  throw new Error('Not implemented');
}

export function isCircle(x: unknown): x is { kind: 'circle'; radius: number } {
  throw new Error('Not implemented');
}
