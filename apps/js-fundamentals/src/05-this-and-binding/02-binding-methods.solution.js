// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assert(condition, msg) {
  if (!condition) throw new Error(msg ?? 'assertion failed');
}
function assertEq(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ─── Exercise 1 — Explicit bind in constructor ────────────────────────────────
//
// CONCEPT: Calling `this.method = this.method.bind(this)` in the constructor
//          replaces the prototype method with a bound copy on the instance. The
//          bound function always uses the instance as `this`, no matter how the
//          function reference is later used (callback, event handler, etc.).
// WHY:     React class components popularised this pattern because JSX event
//          handlers receive bare function references; without binding, `this`
//          inside the handler would be undefined.
// WHEN:    When you know a method will always be used as a callback and you want
//          the simplest, most explicit approach.
// WHERE:   Class constructors, React class components, DOM event listeners.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
class Greeter {
  constructor(name) {
    this.name = name;
    this.greet = this.greet.bind(this); // create bound instance copy
  }
  greet() {
    return 'Hello, ' + this.name;
  }
}

console.log('\nLevel 1 — Explicit bind in constructor');
test('detached greet() still returns correct greeting', () => {
  const g = new Greeter('World');
  const fn = g.greet;
  assertEq(fn(), 'Hello, World');
});

// ─── Exercise 2 — Arrow class field ──────────────────────────────────────────
//
// CONCEPT: A class field defined as an arrow function (`greet = () => ...`) is
//          initialised once per instance at construction time. Arrow functions
//          capture `this` lexically from the surrounding scope — here the
//          constructor — so `this` is always the instance, permanently.
// WHY:     Cleaner than binding in the constructor; the intent is self-evident.
//          No separate bind line required.
// WHEN:    Modern codebases using class fields (stage 3+ / Babel / TypeScript).
//          Preferred in React function-class hybrids and modern class patterns.
// WHERE:   React class components (modern style), any class where you want
//          auto-bound callbacks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
class GreeterArrow {
  constructor(name) {
    this.name = name;
  }
  greet = () => 'Hello, ' + this.name;
}

console.log('\nLevel 2 — Arrow class field');
test('arrow greet() works when detached', () => {
  const g = new GreeterArrow('World');
  const fn = g.greet;
  assertEq(fn(), 'Hello, World');
});

// ─── Exercise 3 — partial application ────────────────────────────────────────
//
// CONCEPT: Partial application pre-fills some arguments of a function, returning
//          a new function that accepts the remaining arguments. It is a form of
//          function specialisation — you turn a general function into a more
//          specific one.
// WHY:     Avoids repeating the same argument in every call; creates reusable
//          specialised helpers from generic utilities.
// WHEN:    When you have a function you call repeatedly with the same leading
//          arguments, or when adapting a multi-arg function to a callback API
//          that only passes one argument.
// WHERE:   Functional programming patterns, event handler factories, adapter
//          wrappers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind#partially_applying_functions
function partial(fn, ...preArgs) {
  return function (...laterArgs) {
    return fn(...preArgs, ...laterArgs);
  };
}

console.log('\nLevel 3 — partial application');
test('partial(add, 1, 2)(3) === 6', () => {
  const add = (a, b, c) => a + b + c;
  assertEq(partial(add, 1, 2)(3), 6);
});
test('partial(add, 10)(5, 3) === 18', () => {
  const add = (a, b, c) => a + b + c;
  assertEq(partial(add, 10)(5, 3), 18);
});

// ─── Exercise 4 — curry ──────────────────────────────────────────────────────
//
// CONCEPT: Currying transforms a function of N arguments into a chain of unary
//          (or n-ary) functions. Each call returns either the final result (when
//          enough args have been collected) or another curried function waiting
//          for more. The arity of the original function (`fn.length`) determines
//          how many args are needed.
// WHY:     Enables point-free style, function composition, and highly reusable
//          specialised helpers. Common in functional libraries (Ramda, lodash/fp).
// WHEN:    Functional programming contexts; when composing pipelines of
//          single-argument transformations.
// WHERE:   Data transformation pipelines, Redux selectors, functional utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function (...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

console.log('\nLevel 4 — curry');
test('curry(add)(1)(2)(3) === 6', () => {
  const add = (a, b, c) => a + b + c;
  assertEq(curry(add)(1)(2)(3), 6);
});
test('curry(add)(1, 2)(3) === 6', () => {
  const add = (a, b, c) => a + b + c;
  assertEq(curry(add)(1, 2)(3), 6);
});
test('curry(add)(1)(2, 3) === 6', () => {
  const add = (a, b, c) => a + b + c;
  assertEq(curry(add)(1)(2, 3), 6);
});

// ─── Exercise 5 — readonly via property descriptor ───────────────────────────
//
// CONCEPT: `Object.defineProperty` gives fine-grained control over a property's
//          behaviour via a descriptor object. Setting `writable: false` prevents
//          assignment to the property (silently in sloppy mode, throws in strict
//          mode). `configurable: false` prevents the descriptor itself from being
//          changed.
// WHY:     Freezing individual methods is more surgical than `Object.freeze`
//          (which locks the entire object). Useful for defensive programming,
//          creating immutable APIs, or simulating the `readonly` decorator
//          proposal.
// WHEN:    Public API surfaces that should not be monkey-patched; plugin systems
//          where host objects must not be accidentally overwritten.
// WHERE:   Library internals, polyfills, class decorator patterns.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
function makeReadonly(targetObj, methodName) {
  const currentValue = targetObj[methodName];
  Object.defineProperty(targetObj, methodName, {
    value: currentValue,
    writable: false,
    configurable: false,
    enumerable: true,
  });
}

console.log('\nLevel 5 — readonly via property descriptor');
test('method is non-writable after makeReadonly', () => {
  const obj = {
    sayHi() {
      return 'hi';
    },
  };
  makeReadonly(obj, 'sayHi');
  const descriptor = Object.getOwnPropertyDescriptor(obj, 'sayHi');
  assert(descriptor.writable === false, 'writable should be false');
});
test('original method still works after makeReadonly', () => {
  const obj = {
    sayHi() {
      return 'hi';
    },
  };
  makeReadonly(obj, 'sayHi');
  assertEq(obj.sayHi(), 'hi');
});
