/**
 * CONCEPT: TypeScript Decorators (Experimental / Stage 3)
 *
 * WHY: Decorators are ubiquitous in Angular, NestJS, TypeORM, and MobX.
 * Understanding how to write class, method, property, and parameter decorators
 * prepares you for framework internals and meta-programming patterns.
 *
 * WHEN/WHERE: Frameworks (NestJS controllers, Angular components), cross-cutting
 * concerns (logging, validation, caching, serialization), DI metadata.
 *
 * DOCS:
 * - https://www.typescriptlang.org/docs/handbook/decorators.html
 * - https://tc39.es/proposal-decorators/
 *
 * NOTE: Enable "experimentalDecorators": true in tsconfig.
 */

// ─── Exercise 1: Class Decorator ──────────────────────────────────────────────
// Implement `@sealed` class decorator that calls Object.seal on the constructor
// and its prototype (preventing new properties from being added to instances).
// TODO: implement sealed
export function sealed(constructor: Function): void {
  throw new Error('Not implemented');
}

// ─── Exercise 2: Method Decorator ─────────────────────────────────────────────
// Implement `@log` method decorator: wraps the method to console.log
// the method name, arguments, and return value on each call.
// Collect calls in a shared array for testing purposes.
// The decorator should store calls in `(target as any).__logCalls`
// Each call record: { method: string; args: unknown[]; returnValue: unknown }
// TODO: implement log
export function log(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  throw new Error('Not implemented');
}

// ─── Exercise 3: Accessor / Property Decorator ────────────────────────────────
// Implement `@readonly` property decorator that makes a class property
// non-writable on the prototype level (configurable: false, writable: false).
// TODO: implement readonly decorator
export function readonly(_target: object, _propertyKey: string): void {
  throw new Error('Not implemented');
}

// ─── Exercise 4: Decorator Factory ────────────────────────────────────────────
// Implement `@memoize()` method decorator FACTORY that caches method results
// keyed by JSON.stringify(args). Returns cached result on subsequent calls
// with same arguments.
// TODO: implement memoize
export function memoize() {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    throw new Error('Not implemented');
  };
}

// ─── Test classes (used in tests) ─────────────────────────────────────────────
@sealed
export class SealedClass {
  value = 42;
  greet() {
    return `hello ${this.value}`;
  }
}

export class LoggedClass {
  calls: Array<{ method: string; args: unknown[]; returnValue: unknown }> = [];

  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

export class MemoizedClass {
  callCount = 0;

  @memoize()
  expensive(n: number): number {
    this.callCount++;
    return n * n;
  }
}
