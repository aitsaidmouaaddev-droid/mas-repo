/**
 * CONCEPT: TypeScript Classes — Access Modifiers, Abstract Classes, Mixins
 *
 * WHY: TypeScript enhances JavaScript classes with access control, abstract
 * patterns, and the ability to compose behaviors through mixins. These patterns
 * are fundamental for OOP design in TypeScript applications and are common
 * interview topics.
 *
 * WHEN/WHERE: Service layer, domain entities, design patterns (Strategy,
 * Decorator, Composite), frameworks (Angular services, NestJS controllers).
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/classes.html
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create a `BankAccount` class with:
// - private balance: number (starts at 0)
// - constructor(public readonly owner: string, initialBalance?: number)
// - deposit(amount: number): void — adds to balance, throws if amount <= 0
// - withdraw(amount: number): void — subtracts, throws if insufficient funds
// - get currentBalance(): number — readonly access to balance
// TODO: implement BankAccount
export class BankAccount {
  // TODO: implement
  constructor(
    public readonly owner: string,
    _initialBalance?: number,
  ) {
    throw new Error('Not implemented');
  }
  deposit(_amount: number): void {
    throw new Error('Not implemented');
  }
  withdraw(_amount: number): void {
    throw new Error('Not implemented');
  }
  get currentBalance(): number {
    throw new Error('Not implemented');
  }
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create an abstract `Animal` class:
// - constructor(public readonly name: string)
// - abstract makeSound(): string
// - describe(): string — returns `${name} says: ${makeSound()}`
// Create `Dog extends Animal` and `Cat extends Animal` implementing makeSound()
// TODO: implement all three classes
export abstract class Animal {
  constructor(public readonly name: string) {}
  abstract makeSound(): string;
  describe(): string {
    throw new Error('Not implemented');
  }
}

export class Dog extends Animal {
  makeSound(): string {
    throw new Error('Not implemented');
  }
}

export class Cat extends Animal {
  makeSound(): string {
    throw new Error('Not implemented');
  }
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Implement the `Serializable` mixin factory:
// It should add `serialize(): string` (JSON.stringify) and
// `static deserialize<T>(this: new(...args:any[]) => T, json: string): T` methods
// Write a `User` base class, then create `SerializableUser` using the mixin
type Constructor<T = {}> = new (...args: any[]) => T;

// TODO: implement Serializable mixin
export function Serializable<TBase extends Constructor>(Base: TBase) {
  throw new Error('Not implemented');
}

export class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

// TODO: create SerializableUser = Serializable(User)
export const SerializableUser = User; // replace with Serializable(User)

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Implement a simple `EventEmitter<Events extends Record<string, any>>` class
// with typed events using generic constraints:
// - on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void
// - emit<K extends keyof Events>(event: K, data: Events[K]): void
// TODO: implement EventEmitter
export class EventEmitter<Events extends Record<string, any>> {
  // TODO: implement
  on<K extends keyof Events>(_event: K, _handler: (data: Events[K]) => void): void {
    throw new Error('Not implemented');
  }
  emit<K extends keyof Events>(_event: K, _data: Events[K]): void {
    throw new Error('Not implemented');
  }
}
