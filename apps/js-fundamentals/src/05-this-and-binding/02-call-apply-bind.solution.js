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

// ─── Exercise 1 — myCall ─────────────────────────────────────────────────────
//
// CONCEPT: How Function.prototype.call works under the hood
// WHY:     .call() changes the receiver (`this`) of a function. The trick to implementing
//          it without call/apply is to temporarily attach the function as a property of
//          the target object and invoke it as a method — the JS engine then sets `this`
//          to the object automatically. A Symbol is used as the key so we never collide
//          with an existing property.
// WHEN:    Understanding this helps demystify prototype method borrowing, polyfills, and
//          how Babel transpiles certain patterns.
// WHERE:   Array.prototype.slice.call(arguments) to convert arguments to an array (pre-ES6),
//          Object.prototype.toString.call(value) for reliable type detection.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call

Function.prototype.myCall = function (context, ...args) {
  const ctx = context == null ? globalThis : Object(context);
  const fnKey = Symbol('fn');
  ctx[fnKey] = this;
  const result = ctx[fnKey](...args);
  delete ctx[fnKey];
  return result;
};

function sum(a, b) {
  return a + b;
}
const obj1 = { multiplier: 3 };
function scale(x) {
  return x * this.multiplier;
}

console.log('\nLevel 2 — myCall');
test('myCall basic invocation', () => assertEq(sum.myCall(null, 2, 3), 5));
test('myCall sets this correctly', () => assertEq(scale.myCall(obj1, 4), 12));
test('myCall with no args', () => {
  function getName() {
    return this.name;
  }
  assertEq(getName.myCall({ name: 'Zoe' }), 'Zoe');
});
test('myCall returns correct value', () => {
  function multiply(a, b, c) {
    return a * b * c;
  }
  assertEq(multiply.myCall(null, 2, 3, 4), 24);
});

// ─── Exercise 2 — myApply ────────────────────────────────────────────────────
//
// CONCEPT: How Function.prototype.apply works
// WHY:     apply is identical to call except arguments are passed as an array.
//          Before the spread operator (...), apply was the only way to "spread" an
//          array as individual arguments: Math.max.apply(null, arr).
//          Now `Math.max(...arr)` is idiomatic, but knowing apply is essential for
//          reading legacy code and writing polyfills.
// WHEN:    Passing a dynamic number of arguments stored in an array, variadic functions.
// WHERE:   Legacy ES5 code, testing frameworks that patch Function.prototype.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/apply

Function.prototype.myApply = function (context, argsArray) {
  const ctx = context == null ? globalThis : Object(context);
  const fnKey = Symbol('fn');
  ctx[fnKey] = this;
  const result = ctx[fnKey](...(argsArray ?? []));
  delete ctx[fnKey];
  return result;
};

console.log('\nLevel 3 — myApply');
test('myApply basic invocation', () => assertEq(sum.myApply(null, [7, 8]), 15));
test('myApply sets this correctly', () => assertEq(scale.myApply(obj1, [5]), 15));
test('myApply with null argsArray', () => {
  function zero() {
    return 0;
  }
  assertEq(zero.myApply(null, null), 0);
});
test('myApply spread use-case (Math.max)', () => {
  assertEq(Math.max.myApply(null, [3, 1, 4, 1, 5, 9, 2, 6]), 9);
});

// ─── Exercise 3 — myBind ─────────────────────────────────────────────────────
//
// CONCEPT: How Function.prototype.bind works (partial application + permanent this)
// WHY:     bind returns a new function — it does NOT call the original. The returned
//          function has `this` locked; even .call()/.apply() with a different context
//          on the bound function are ignored. Additionally, bind supports partial
//          application: any extra args to bind() are prepended to every future call.
//          The new keyword case: if the bound function is used as a constructor,
//          the bound `this` is discarded and the newly created object is used instead
//          (same as native bind behaviour).
// WHEN:    React class method binding in constructors, setTimeout callbacks,
//          event listeners, curried function factories.
// WHERE:   React.Component (this.handleClick = this.handleClick.bind(this)),
//          Lodash _.bind, partial application patterns.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind

Function.prototype.myBind = function (context, ...partialArgs) {
  const originalFn = this;

  function bound(...callArgs) {
    const allArgs = [...partialArgs, ...callArgs];
    // When used as a constructor (new bound()), `this` is the newly created object.
    // We detect this via instanceof and defer to the original function as constructor.
    if (this instanceof bound) {
      return new originalFn(...allArgs);
    }
    return originalFn.myCall(context, ...allArgs);
  }

  // Preserve prototype for instanceof checks when used as constructor
  if (originalFn.prototype) {
    bound.prototype = Object.create(originalFn.prototype);
  }

  return bound;
};

function add(a, b, c) {
  return a + b + c;
}
const addFive = add.myBind(null, 5);
const addFiveTen = add.myBind(null, 5, 10);

console.log('\nLevel 4 — myBind');
test('myBind basic binding', () => assertEq(scale.myBind(obj1)(4), 12));
test('myBind partial application (1 arg)', () => assertEq(addFive(3, 2), 10));
test('myBind partial application (2 args)', () => assertEq(addFiveTen(1), 16));
test('myBind bound this cannot be overridden', () => {
  function who() {
    return this.name;
  }
  const bound = who.myBind({ name: 'Alice' });
  assertEq(bound.call({ name: 'Bob' }), 'Alice');
});
test('myBind returns a function', () => assert(typeof scale.myBind(obj1) === 'function'));
