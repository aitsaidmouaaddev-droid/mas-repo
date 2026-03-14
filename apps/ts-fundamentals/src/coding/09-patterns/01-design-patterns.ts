/**
 * CONCEPT: Design Patterns in TypeScript
 *
 * WHY: Classical design patterns take on new forms in TypeScript with the
 * benefit of generics and structural typing. Understanding typed implementations
 * of patterns like Repository, Observer, Strategy, and Builder demonstrates
 * advanced TypeScript mastery and is highly valued in interviews.
 *
 * WHEN/WHERE: Large-scale applications, frameworks, library design, DDD,
 * clean architecture, testable code.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/mixins.html
 */

// ─── Exercise 1: Repository Pattern ──────────────────────────────────────────
// Implement a generic in-memory Repository that implements CRUD:
// - add(item: T & { id: string }): void
// - findById(id: string): T | undefined
// - findAll(): T[]
// - update(id: string, changes: Partial<T>): T | undefined
// - remove(id: string): boolean
// TODO: implement InMemoryRepository
export class InMemoryRepository<T extends { id: string }> {
  // TODO: implement
  add(_item: T): void {
    throw new Error('Not implemented');
  }
  findById(_id: string): T | undefined {
    throw new Error('Not implemented');
  }
  findAll(): T[] {
    throw new Error('Not implemented');
  }
  update(_id: string, _changes: Partial<T>): T | undefined {
    throw new Error('Not implemented');
  }
  remove(_id: string): boolean {
    throw new Error('Not implemented');
  }
}

// ─── Exercise 2: Strategy Pattern ────────────────────────────────────────────
// Implement a `Sorter<T>` class that uses a strategy for comparison:
// - constructor(strategy: (a: T, b: T) => number)
// - sort(items: T[]): T[]  (does not mutate original)
// - setStrategy(strategy: (a: T, b: T) => number): void
// Create two strategies: numericAscending, alphabeticAscending
// TODO: implement
export class Sorter<T> {
  constructor(private strategy: (a: T, b: T) => number) {}
  sort(_items: T[]): T[] {
    throw new Error('Not implemented');
  }
  setStrategy(_strategy: (a: T, b: T) => number): void {
    throw new Error('Not implemented');
  }
}

export const numericAscending = (a: number, b: number) => a - b;
export const alphabeticAscending = (a: string, b: string) => a.localeCompare(b);

// ─── Exercise 3: Observer / PubSub ───────────────────────────────────────────
// Implement a typed `Observable<T>` with:
// - subscribe(observer: (value: T) => void): () => void  (returns unsubscribe fn)
// - next(value: T): void  (notifies all subscribers)
// - complete(): void  (removes all subscriptions)
// TODO: implement Observable
export class Observable<T> {
  // TODO: implement
  subscribe(_observer: (value: T) => void): () => void {
    throw new Error('Not implemented');
  }
  next(_value: T): void {
    throw new Error('Not implemented');
  }
  complete(): void {
    throw new Error('Not implemented');
  }
}
