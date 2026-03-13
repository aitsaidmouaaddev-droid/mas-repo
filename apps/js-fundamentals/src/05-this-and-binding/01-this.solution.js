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

// ─── Exercise 1 — Fix lost `this` ────────────────────────────────────────────
//
// CONCEPT: `this` is determined by call-site, not definition-site
// WHY:     When you do `const greet = user.greet`, you copy the function reference.
//          The connection to `user` is severed. The function is called as a plain
//          function — in strict mode `this` is undefined; in sloppy mode it's global.
//          .bind() creates a NEW function with `this` permanently fixed to the object.
// WHEN:    Any time you pass a method as a callback or store it in a variable.
// WHERE:   React event handlers, setTimeout, Array.forEach, addEventListener.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind

const user = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`;
  },
};
const greet = user.greet;

// Fix 1: bind
const greetFixed = greet.bind(user);
// Alternative fix 2: arrow wrapper — (() => user.greet())
// Alternative fix 3: closure — const greetFixed = function() { return user.greet(); }

console.log('\nLevel 1 — Method context');
test('greetFixed() → "Hello, Alice"', () => assertEq(greetFixed(), 'Hello, Alice'));

// ─── Exercise 2 — Arrow vs regular ───────────────────────────────────────────
//
// CONCEPT: Arrow functions capture lexical `this`; regular functions receive dynamic `this`
// WHY:     Arrow functions do not have their own [[ThisValue]]. When defined inside a
//          constructor or method, they permanently capture the enclosing `this`.
//          Regular functions re-bind `this` on every call based on how they are called.
//          The rule: if you need `this` from the surrounding scope → arrow.
//          If you need `this` set by the caller → regular.
// WHEN:    Callbacks inside class methods (use arrow). Object literal methods where you
//          need the object reference (use regular). Event listeners where you need the
//          DOM element (use regular).
// WHERE:   React class component lifecycle methods bound in constructor vs arrow class fields.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

const counter = {
  count: 0,
  incrementRegular: function () {
    this.count++;
    return this.count;
  },
  incrementArrow: () => {
    counter.count++;
    return counter.count;
  },
};

console.log('\nLevel 2 — Arrow vs regular');
test('regular function increments via this.count', () => {
  const c = {
    count: 0,
    inc: function () {
      this.count++;
      return this.count;
    },
  };
  assertEq(c.inc(), 1);
});
test('arrow function cannot use this.count via method call', () => {
  let capturedThis = null;
  const obj = {
    name: 'test',
    fn: () => {
      capturedThis = this;
    },
  };
  obj.fn();
  assert(capturedThis !== obj, 'arrow this should not equal the object');
});

// ─── Exercise 3 — this in callbacks (3 fixes) ────────────────────────────────
//
// CONCEPT: Three strategies for preserving `this` in callbacks
// WHY:
//   1. .bind(this) — creates a new function with `this` locked in. Allocates a new fn.
//   2. Arrow wrapper — `() => this.tick()` captures `this` lexically. Clean and idiomatic.
//   3. Closure — `const self = this; function() { self.tick(); }` — ES5 pattern, still
//      valid but verbosier. Good to know because you'll see it in legacy code.
// WHEN:    Event listeners, setTimeout/setInterval callbacks, Promise chains with class methods.
// WHERE:   React class components, Node.js EventEmitter handlers, legacy jQuery plugins.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind

class Timer {
  constructor(label) {
    this.label = label;
    this.ticks = 0;
  }

  tick() {
    this.ticks++;
    return `${this.label}: ${this.ticks}`;
  }

  getFixedTicks() {
    const tickBind = this.tick.bind(this);
    const tickArrow = () => this.tick();
    const self = this;
    const tickClosure = function () {
      return self.tick();
    };
    return { tickBind, tickArrow, tickClosure };
  }
}

console.log('\nLevel 3 — this in callbacks');
test('tickBind retains this', () => {
  const t = new Timer('A');
  const { tickBind } = t.getFixedTicks();
  assertEq(tickBind(), 'A: 1');
});
test('tickArrow retains this', () => {
  const t = new Timer('B');
  const { tickArrow } = t.getFixedTicks();
  assertEq(tickArrow(), 'B: 1');
});
test('tickClosure retains this', () => {
  const t = new Timer('C');
  const { tickClosure } = t.getFixedTicks();
  assertEq(tickClosure(), 'C: 1');
});

// ─── Exercise 4 — Explicit binding quiz ──────────────────────────────────────
//
// CONCEPT: call / apply / bind — explicit `this` binding
// WHY:
//   .call(ctx, arg1, arg2)   — immediately invokes fn with ctx as `this`, args spread
//   .apply(ctx, [arg1, arg2])— same but args as array
//   .bind(ctx)               — returns NEW function with `this` permanently set.
//                              Subsequent .call()/.apply() CANNOT override a bound `this`.
//   Priority: new > explicit (bind) > implicit (method) > default (global/undefined)
// WHEN:    Borrowing methods, partial application, creating bound callbacks.
// WHERE:   Math.max.apply(null, arr) for spread before ES6, Function.prototype.toString.call.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call

function describe() {
  return `${this.role} at ${this.company}`;
}
const ctx1 = { role: 'Engineer', company: 'Acme' };
const ctx2 = { role: 'Manager', company: 'Globex' };

const resultA = describe.call(ctx1);
const resultB = describe.apply(ctx2);
const boundDescribe = describe.bind(ctx1);
const resultC = boundDescribe();
const resultD = boundDescribe.call(ctx2); // bind wins — ctx2 is ignored

console.log('\nLevel 4 — call/apply/bind quiz');
test('call sets this to ctx1', () => assertEq(resultA, 'Engineer at Acme'));
test('apply sets this to ctx2', () => assertEq(resultB, 'Manager at Globex'));
test('bind returns bound fn', () => assertEq(resultC, 'Engineer at Acme'));
test('bind wins over later .call(ctx2)', () => assertEq(resultD, 'Engineer at Acme'));

function greetUser(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'Dana' };
const resultE = greetUser.call(person, 'Hi', '!');
const resultF = greetUser.apply(person, ['Hey', '?']);
test('call passes args positionally', () => assertEq(resultE, 'Hi, Dana!'));
test('apply passes args as array', () => assertEq(resultF, 'Hey, Dana?'));
