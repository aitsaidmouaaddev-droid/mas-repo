/**
 * CONCEPT: Enums vs const objects with `as const`
 *
 * WHY: TypeScript enums are convenient but have pitfalls: they emit runtime
 * JS objects, `const enum` can't be used with isolatedModules, and they don't
 * integrate well with tools like Babel/esbuild. The `as const` pattern creates
 * nominal-feeling constants with zero runtime overhead beyond the object itself.
 *
 * WHEN/WHERE: Any time you need a set of named constants — status codes, states,
 * directions, event names. Use `as const` objects in new code; understand enums
 * for existing codebases.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/enums.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Define a regular numeric `enum Direction` with Up, Down, Left, Right
// TODO: define Direction enum
export enum Direction {
  // TODO: add members
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Define a string enum `Status` with:
// Pending = 'PENDING', Active = 'ACTIVE', Inactive = 'INACTIVE'
// TODO: define Status string enum
export enum Status {
  // TODO: add members
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Create the SAME Status values using the `as const` pattern
// Derive a `StatusValue` type from it using keyof/typeof
// TODO: define STATUS_MAP as const object
export const STATUS_MAP = {
  // TODO: same values as Status enum above
} as const;

// TODO: derive StatusValue type from STATUS_MAP values
export type StatusValue = unknown;

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Write a function `getStatusLabel(status: StatusValue): string`
// that returns a human-readable label: 'Pending', 'Active', 'Inactive'
// TODO: implement getStatusLabel
export function getStatusLabel(status: StatusValue): string {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a function `isValidDirection(value: unknown): value is Direction`
// that checks if a number is a valid Direction enum value
// TODO: implement isValidDirection type predicate
export function isValidDirection(value: unknown): value is Direction {
  throw new Error('Not implemented');
}
