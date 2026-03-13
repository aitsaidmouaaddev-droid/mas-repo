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

// Exercise 1 — Explicit bind in constructor
// Bind the method in the constructor so it can be safely extracted
class Greeter {
  constructor(name) {
    this.name = name;
    // YOUR CODE HERE — bind this.greet so it works when detached
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

// Exercise 2 — Arrow property in class
// Use a class field arrow function so `this` is captured at construction time
class GreeterArrow {
  constructor(name) {
    this.name = name;
  }
  // YOUR CODE HERE — define greet as an arrow class field
}

console.log('\nLevel 2 — Arrow class field');
test('arrow greet() works when detached', () => {
  const g = new GreeterArrow('World');
  const fn = g.greet;
  assertEq(fn(), 'Hello, World');
});

// Exercise 3 — partial application
// Return a new function with the first N arguments pre-filled
function partial(fn, ...preArgs) {
  // YOUR CODE HERE
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

// Exercise 4 — curry
// Auto-curry: if called with fewer args than fn.length, return a function
// waiting for the rest. Keep collecting until enough args are accumulated.
function curry(fn) {
  // YOUR CODE HERE
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

// Exercise 5 — readonly descriptor
// Implement a property descriptor object that makes a method non-writable.
// Use Object.defineProperty to apply it and verify the property descriptor.
function makeReadonly(targetObj, methodName) {
  // YOUR CODE HERE — use Object.defineProperty to make targetObj[methodName] non-writable
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
