/**
 * CONCEPT: Branded Types (Nominal Typing in TypeScript)
 *
 * WHY: TypeScript uses structural typing — two types with the same shape are
 * interchangeable. This is dangerous for distinct IDs, units, or validated values:
 * UserId and PostId are both strings but should NEVER be mixed up.
 * Branded types create nominal-feeling types using intersection with unique tags.
 *
 * WHEN/WHERE: ID types (UserId, PostId, OrderId), units (Meters, Feet, USD, EUR),
 * validated strings (EmailAddress, PhoneNumber), version numbers, any domain
 * concept that should not be mixed with structurally equivalent types.
 *
 * DOCS: https://www.typescriptlang.org/play#example/nominal-typing
 */

// ─── Branding utilities ───────────────────────────────────────────────────────
declare const __brand: unique symbol;
export type Brand<T, TBrand extends string> = T & { readonly [__brand]: TBrand };

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create branded types for distinct IDs:
// - UserId: Brand<string, 'UserId'>
// - PostId: Brand<string, 'PostId'>
// Create factory functions: makeUserId(s: string): UserId, makePostId(s: string): PostId
// TODO: define and implement
export type UserId = Brand<string, 'UserId'>;
export type PostId = Brand<string, 'PostId'>;

// TODO: implement makeUserId
export function makeUserId(s: string): UserId {
  throw new Error('Not implemented');
}

// TODO: implement makePostId
export function makePostId(s: string): PostId {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create a branded `Meters` type and a `Feet` type (both number-based)
// Implement conversion functions: metersToFeet, feetToMeters
// 1 meter = 3.28084 feet
// TODO: define types and implement conversions
export type Meters = Brand<number, 'Meters'>;
export type Feet = Brand<number, 'Feet'>;

export function makeMeters(n: number): Meters {
  throw new Error('Not implemented');
}

export function makeFeet(n: number): Feet {
  throw new Error('Not implemented');
}

export function metersToFeet(m: Meters): Feet {
  throw new Error('Not implemented');
}

export function feetToMeters(f: Feet): Meters {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Create a `ValidatedEmail` branded type and an `EmailAddress` validator:
// `validateEmail(s: string): ValidatedEmail | null`
// Use a simple regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// TODO: implement
export type ValidatedEmail = Brand<string, 'ValidatedEmail'>;

export function validateEmail(s: string): ValidatedEmail | null {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Write a function `findUser(id: UserId, users: Array<{ id: UserId; name: string }>)`
// that finds a user by their typed ID. This demonstrates that branded types
// work naturally with array search.
// TODO: implement findUser
export function findUser(
  id: UserId,
  users: Array<{ id: UserId; name: string }>,
): { id: UserId; name: string } | undefined {
  throw new Error('Not implemented');
}
