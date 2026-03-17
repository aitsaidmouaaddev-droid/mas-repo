// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg ?? 'assertion failed');
}
function assertEq(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ─── Exercise 1 — Object method this ─────────────────────────────────────────
//
// CONCEPT: Inside a method, `this` refers to the object the method was called
//          on — i.e. the receiver, the thing to the left of the dot.
// WHY:     Methods need a way to access the data of the object they belong to
//          without hard-coding variable names. `this` is that dynamic reference.
// WHEN:    Any time you access object state or call sibling methods inside a
//          method body.
// WHERE:   Class/object method bodies; never in standalone functions unless you
//          control how they are called.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
const obj = {
  name: 'test',
  getName() {
    return this.name;
  },
};

console.log('\nLevel 1 — Object method this');
test('obj.getName() returns the name property', () => assertEq(obj.getName(), 'test'));

// ─── Exercise 2 — Lost this / Bound this ─────────────────────────────────────
//
// CONCEPT: When you pull a method out of an object and call it as a plain
//          function (`const fn = obj.method; fn()`), the implicit receiver is
//          lost. In strict mode `this` becomes `undefined`; in sloppy mode it
//          becomes the global object. `.bind(thisArg)` creates a new function
//          permanently locked to `thisArg` no matter how it is later called.
// WHY:     Callbacks, event handlers, and higher-order functions all receive
//          bare function references — the original object is not carried along.
// WHEN:    Passing methods as callbacks; storing methods in variables; using
//          class methods with setTimeout/event listeners.
// WHERE:   Class constructors (bind in constructor), React class components,
//          any place a method is detached from its object.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
function makeObj(name) {
  return {
    name,
    getName() {
      return this.name;
    },
    getNameLost() {
      const fn = this.getName;
      return fn(); // `this` is undefined in strict mode → undefined
    },
    getNameBound() {
      const fn = this.getName.bind(this); // lock `this` to this object
      return fn();
    },
  };
}

console.log('\nLevel 2 — Lost this vs bound this');
test('getNameLost() returns undefined (this is lost)', () => {
  const o = makeObj('Alice');
  assertEq(o.getNameLost(), undefined);
});
test('getNameBound() returns the correct name', () => {
  const o = makeObj('Alice');
  assertEq(o.getNameBound(), 'Alice');
});

// ─── Exercise 3 — attachMethod ────────────────────────────────────────────────
//
// CONCEPT: `Function.prototype.bind` returns a new function whose `this` is
//          permanently fixed to the supplied argument, regardless of how the
//          returned function is later invoked.
// WHY:     Useful when you need to hand a method to code that will call it as a
//          plain function (e.g. array.forEach, setTimeout, event emitters).
// WHEN:    Whenever you extract a method and need it to retain its object context.
// WHERE:   Event handler registration, passing methods to callbacks, React class
//          component constructors.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
function attachMethod(obj, method) {
  return obj[method].bind(obj);
}

console.log('\nLevel 2 — attachMethod (bind to preserve this)');
test('attachMethod returns a bound function', () => {
  const o = {
    x: 42,
    getX() {
      return this.x;
    },
  };
  const bound = attachMethod(o, 'getX');
  assertEq(bound(), 42);
});

// ─── Exercise 4 — borrowMethod with call ─────────────────────────────────────
//
// CONCEPT: `Function.prototype.call(thisArg, arg1, arg2, ...)` invokes a
//          function with an explicit `this` and individual arguments.
//          `apply` is the same but accepts an array of arguments.
//          These let you "borrow" methods from one object and run them against
//          another.
// WHY:     Avoids duplicating method code across similar objects; enables
//          mixins and duck-typing patterns.
// WHEN:    You have a method on object A that you want to execute with object B
//          as context.
// WHERE:   Utility libraries, polyfills, method borrowing patterns
//          (e.g. Array.prototype.slice.call(arguments)).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
function borrowMethod(sourceObj, targetObj, methodName, ...args) {
  return sourceObj[methodName].call(targetObj, ...args);
}

console.log('\nLevel 3 — borrowMethod (call / apply)');
test('borrowMethod calls with correct this and args', () => {
  const source = {
    greet(greeting) {
      return `${greeting}, ${this.name}!`;
    },
  };
  const target = { name: 'Ali' };
  assertEq(borrowMethod(source, target, 'greet', 'Hello'), 'Hello, Ali!');
});

// ─── Exercise 5 — softBind ───────────────────────────────────────────────────
//
// CONCEPT: A "soft bind" is like `.bind` except it only substitutes the default
//          `this` when the actual receiver is `undefined`, `null`, or the global
//          object. When called with an explicit `this` via `.call` or `.apply`,
//          the real receiver wins.
// WHY:     Hard `.bind` prevents any future override of `this`, which can be too
//          rigid. Soft bind gives a sensible default while staying flexible.
// WHEN:    Library code that wants a safe default context but shouldn't block
//          callers from supplying their own.
// WHERE:   Utility wrappers, framework internals.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
function softBind(fn, defaultThis) {
  return function (...args) {
    // Use defaultThis when this is nullish or the global object
    const ctx =
      !this || this === (typeof globalThis !== 'undefined' ? globalThis : global)
        ? defaultThis
        : this;
    return fn.apply(ctx, args);
  };
}

console.log('\nLevel 4 — softBind');
test('softBind uses defaultThis when called as plain function', () => {
  function greet() {
    return 'hi, ' + this.name;
  }
  const bound = softBind(greet, { name: 'Default' });
  assertEq(bound(), 'hi, Default');
});
test('softBind defers to explicit this when provided via call', () => {
  function greet() {
    return 'hi, ' + this.name;
  }
  const bound = softBind(greet, { name: 'Default' });
  assertEq(bound.call({ name: 'Explicit' }), 'hi, Explicit');
});

// ─── Exercise 6 — myNew ──────────────────────────────────────────────────────
//
// CONCEPT: The `new` operator does four things automatically:
//          1. Creates a plain object whose [[Prototype]] is Constructor.prototype
//          2. Calls Constructor with that object as `this`
//          3. If Constructor returns an object, that object is the result;
//             otherwise the newly created object is the result.
//          4. Binds the instance to the constructor for `instanceof` checks.
// WHY:     Understanding `new` demystifies how classes and prototype chains work
//          under the hood, and explains why returning a primitive from a
//          constructor is silently ignored.
// WHEN:    Any time you use `new` — knowing the mechanics helps debug prototype
//          issues and write factory functions that behave like constructors.
// WHERE:   OOP patterns, polyfills, reflection utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
function myNew(Constructor, ...args) {
  // Step 1: create object inheriting from Constructor.prototype
  const instance = Object.create(Constructor.prototype);
  // Step 2: call Constructor with the new object as `this`
  const result = Constructor.apply(instance, args);
  // Step 3: if Constructor returned an object, use it; otherwise use instance
  return result !== null && typeof result === 'object' ? result : instance;
}

console.log('\nLevel 5 — myNew (implement new from scratch)');
test('myNew creates instance with correct properties', () => {
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  Person.prototype.greet = function () {
    return `I am ${this.name}`;
  };
  const p = myNew(Person, 'Sam', 30);
  assertEq(p.name, 'Sam');
  assertEq(p.age, 30);
  assertEq(p.greet(), 'I am Sam');
  assert(p instanceof Person, 'should be instanceof Person');
});
test('myNew returns constructor return value when it is an object', () => {
  const special = { tag: 'special' };
  function Ctor() {
    return special;
  }
  assertEq(myNew(Ctor), special);
});
