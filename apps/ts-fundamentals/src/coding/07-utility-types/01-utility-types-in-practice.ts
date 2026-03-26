/**
 * CONCEPT: Built-in Utility Types in Practice
 *
 * WHY: TypeScript ships with ~25 utility types that solve common patterns
 * without writing custom mapped/conditional types. Mastering them is essential
 * for writing clean, maintainable TypeScript and is a standard interview topic.
 *
 * WHEN/WHERE: Object transformations, API types, form schemas, CRUD interfaces,
 * test factories, configuration objects.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

// ─── Base types for all exercises ────────────────────────────────────────────
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  bio?: string;
  createdAt: Date;
  readonly updatedAt: Date;
}

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create a `CreateUserInput` type: everything from UserProfile EXCEPT
// id, createdAt, updatedAt (auto-generated fields)
// TODO: define CreateUserInput using Omit
export type CreateUserInput = unknown;

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create an `UpdateUserInput` type: same as CreateUserInput but ALL fields optional
// (because PATCH requests only include changed fields)
// TODO: define UpdateUserInput
export type UpdateUserInput = unknown;

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Create a `UserPreview` type: only id, username, bio (for list views)
// TODO: define UserPreview using Pick
export type UserPreview = unknown;

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Create a `UserMap` type: a Record where keys are string (user IDs) and values are UserProfile
// TODO: define UserMap using Record
export type UserMap = unknown;

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Implement a generic `createFactory<T>(defaults: Required<T>)`
// that returns a function `(overrides?: Partial<T>): T`
// useful for test data factories
// TODO: implement createFactory
export function createFactory<T>(defaults: Required<T>): (overrides?: Partial<T>) => T {
  throw new Error('Not implemented');
}

// ─── Exercise 6 ───────────────────────────────────────────────────────────────
// Write a function `extractKeys<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>`
// NOTE: keys is readonly (use readonly K[]) so as const arrays work
// TODO: implement extractKeys
export function extractKeys<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  throw new Error('Not implemented');
}

// ─── Exercise 7 ───────────────────────────────────────────────────────────────
// Define a `FunctionSignature<T>` type that, given a function type T,
// produces an object with `params: Parameters<T>` and `returnType: ReturnType<T>`
// Implement a `getSignatureInfo<T extends (...args: any[]) => any>(fn: T)`
// function that returns `{ paramCount: number, name: string }`
// TODO: define FunctionSignature and implement getSignatureInfo
export type FunctionSignature<T extends (...args: any[]) => any> = {
  params: Parameters<T>;
  returnType: ReturnType<T>;
};

export function getSignatureInfo<T extends (...args: any[]) => any>(
  fn: T,
): { paramCount: number; name: string } {
  throw new Error('Not implemented');
}
