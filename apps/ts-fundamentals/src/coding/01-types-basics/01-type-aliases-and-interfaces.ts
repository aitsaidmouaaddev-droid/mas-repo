/**
 * CONCEPT: Type Aliases vs Interfaces
 *
 * WHY: Understanding when to use `type` vs `interface` is a fundamental
 * TypeScript skill used in every project. Both describe object shapes but
 * they have distinct capabilities: interfaces support declaration merging
 * (great for library augmentation) while type aliases support unions,
 * intersections, mapped types, and conditional types.
 *
 * WHEN/WHERE: In every TypeScript file. Use `interface` for public-facing
 * object shapes and APIs (especially extendable ones). Use `type` for
 * computed shapes, unions, intersections, and utility types.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Define a `User` interface with: id (number), name (string), email (string)
// TODO: define User interface
export interface User {
  // TODO: add properties
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create an `AdminUser` interface that EXTENDS `User` and adds:
// - permissions: string[]
// - role: 'admin' | 'superadmin'
// TODO: define AdminUser interface that extends User
export interface AdminUser extends User {
  // TODO: add properties
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Create a type alias `Coordinates` with: lat (number), lng (number)
// Then create a type alias `GeoPoint` that is an intersection of Coordinates
// and { label: string }
// TODO: define Coordinates type alias
export type Coordinates = unknown;

// TODO: define GeoPoint type alias (Coordinates & { label: string })
export type GeoPoint = unknown;

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Create a type alias `StringOrNumber` that is a union of string and number
// Then write a function `toDisplay(value: StringOrNumber): string`
// that returns String(value) for numbers and the string directly for strings
// TODO: define StringOrNumber type
export type StringOrNumber = unknown;

// TODO: implement toDisplay
export function toDisplay(value: StringOrNumber): string {
  throw new Error('Not implemented');
}

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Use declaration merging: augment the `User` interface above to add
// an optional `createdAt: Date` property.
// (Hint: re-declare the interface with the same name)
// TODO: augment User interface to add createdAt?: Date
