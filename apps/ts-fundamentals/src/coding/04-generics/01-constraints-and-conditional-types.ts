/**
 * CONCEPT: Generic Constraints and Conditional Types
 *
 * WHY: Generic constraints (`T extends U`) allow safe property access on
 * generic types. Conditional types (`T extends U ? X : Y`) let you build
 * types that adapt based on their type arguments — enabling powerful utility
 * types like ReturnType, Awaited, Parameters, and more.
 *
 * WHEN/WHERE: Library utilities, type-level transformations, deep type
 * inference, building flexible APIs that preserve type precision.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write a generic `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`
// function. TypeScript should infer the correct return type from T and K.
// TODO: implement getProperty
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write a generic `merge<T, U>(a: T, b: U): T & U`
// that merges two objects (shallow) ensuring the result type has ALL properties
// from both. Properties in b override a if they share keys.
// TODO: implement merge
export function merge<T extends object, U extends object>(a: T, b: U): T & U {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Define a conditional type `IsArray<T>` that is:
// - `true` if T extends any[]
// - `false` otherwise
// TODO: define IsArray conditional type
export type IsArray<T> = unknown; // replace with conditional type

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Define a conditional type `UnpackArray<T>` that:
// - If T is an array type (T extends (infer U)[]), returns U
// - Otherwise returns T
// TODO: define UnpackArray using infer
export type UnpackArray<T> = unknown; // replace with conditional type

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Define a generic class `Stack<T>` with methods:
// - push(item: T): void
// - pop(): T | undefined
// - peek(): T | undefined
// - isEmpty(): boolean
// - get size(): number
// TODO: implement Stack<T>
export class Stack<T> {
  // TODO: implement all members
  push(_item: T): void {
    throw new Error('Not implemented');
  }
  pop(): T | undefined {
    throw new Error('Not implemented');
  }
  peek(): T | undefined {
    throw new Error('Not implemented');
  }
  isEmpty(): boolean {
    throw new Error('Not implemented');
  }
  get size(): number {
    throw new Error('Not implemented');
  }
}

// ─── Exercise 6 ───────────────────────────────────────────────────────────────
// Define a `DeepReadonly<T>` recursive type that makes ALL nested properties readonly
// Hint: check if T extends object, if so map all keys recursively
// TODO: define DeepReadonly recursive mapped type
export type DeepReadonly<T> = unknown; // replace with recursive mapped type
