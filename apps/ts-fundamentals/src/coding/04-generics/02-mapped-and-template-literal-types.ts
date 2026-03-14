/**
 * CONCEPT: Mapped Types and Template Literal Types
 *
 * WHY: Mapped types transform every property of an existing type, enabling
 * the creation of Partial, Readonly, Pick, Record, and custom transformations.
 * Template literal types generate string literal unions programmatically,
 * enabling typed event name patterns, CSS property generation, and more.
 *
 * WHEN/WHERE: Library utilities, event systems, CSS-in-JS, query builders,
 * ORMs, typed API clients.
 *
 * DOCS:
 * - https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
 * - https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Implement the `MyPartial<T>` mapped type (same as built-in Partial<T>)
// TODO: define MyPartial<T>
export type MyPartial<T> = unknown; // replace with mapped type

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Implement `Nullable<T>` that makes every property of T accept `null`
// Every value should be `T[K] | null`
// TODO: define Nullable<T>
export type Nullable<T> = unknown; // replace with mapped type

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Implement `Getters<T>` that transforms an object type into a getters interface:
// { name: string } → { getName: () => string }
// Hint: use key remapping with `as` and template literal type
// TODO: define Getters<T> using key remapping
export type Getters<T> = unknown; // replace with mapped type with key remapping

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Create an `EventName` template literal type from a union of base verbs:
// 'click' | 'focus' | 'blur' | 'change'
// EventName should produce: 'onClick' | 'onFocus' | 'onBlur' | 'onChange'
// TODO: define EventName using template literal + Capitalize
export type BaseEvent = 'click' | 'focus' | 'blur' | 'change';
export type EventName = unknown; // replace with template literal type

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Implement a `createGetters<T extends object>(obj: T): Getters<T>`
// function at runtime — create an object with getter functions for each property
// Note: the return type is `any` here since the Getters<T> type is a separate exercise
// For simplicity use: returns Record<string, () => unknown>
// TODO: implement createGetters
export function createGetters<T extends object>(obj: T): Record<string, () => unknown> {
  throw new Error('Not implemented');
}
