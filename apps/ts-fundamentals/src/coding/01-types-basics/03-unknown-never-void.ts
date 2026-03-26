/**
 * CONCEPT: The `unknown`, `never`, and `void` types
 *
 * WHY: These three types handle different edge cases:
 * - `unknown` is the type-safe counterpart of `any` — you must narrow before use
 * - `never` represents values that can never occur (unreachable code, exhaustiveness)
 * - `void` represents "don't care about the return value" (distinct from undefined)
 *
 * WHEN/WHERE:
 * - `unknown`: catch blocks, external API responses, JSON parsing
 * - `never`: exhaustiveness checks, functions that always throw/loop
 * - `void`: callback return types, event handlers, fire-and-forget functions
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write a function `parseJSON(input: string): unknown`
// that safely parses JSON and returns `unknown` (let the caller narrow the type)
// If parsing fails, return null
// TODO: implement parseJSON
export function parseJSON(input: string): unknown {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write a function `getStringLength(value: unknown): number`
// that returns the length if value is a string, otherwise returns -1
// Use narrowing, NOT type assertions (no `as string`)
// TODO: implement getStringLength
export function getStringLength(value: unknown): number {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Write a function `assertNever(x: never): never`
// This is the standard exhaustiveness check helper — it should THROW at runtime
// with a message if somehow called (it should be unreachable in well-typed code)
// TODO: implement assertNever
export function assertNever(x: never): never {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Use assertNever to create an exhaustive handler for the `Shape` union
// If a new shape is added but not handled, TypeScript should give a compile error
type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };
type Triangle = { kind: 'triangle'; base: number; height: number };
export type Shape = Circle | Square | Triangle;

// TODO: implement area(shape: Shape): number
// Handle circle (π*r²), square (side²), triangle (0.5*base*height)
// Use assertNever in the default case
export function area(shape: Shape): number {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a function `fail(message: string): never`
// This should throw an Error with the message. It returns `never` because it
// ALWAYS throws — useful for guarantee-throwing helpers.
// TODO: implement fail
export function fail(message: string): never {
  throw new Error('Not implemented');
}
