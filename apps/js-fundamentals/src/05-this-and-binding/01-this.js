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

// ═══ LEVEL 1 — Method context ════════════════════════════════════════════════

// Exercise 1 — Fix lost `this`
// The greet variable below is extracted from user object.
// When called as greet(), `this` is undefined (strict mode) / global (sloppy).
// Fix the code so that greetFixed() always returns "Hello, Alice" regardless
// of how it is called. Do NOT modify the user object or greet variable —
// only add code below the comment.
const user = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`;
  },
};
const greet = user.greet; // lost `this`

// YOUR CODE HERE — create greetFixed so the test below passes
// const greetFixed = ???

console.log('\nLevel 1 — Method context');
test('greetFixed() → "Hello, Alice"', () => assertEq(greetFixed(), 'Hello, Alice'));

// ═══ LEVEL 2 — Arrow vs regular in object ════════════════════════════════════

// Exercise 2 — Predict output and fix
// Study the counter object below. Fill in EXPECTED_REGULAR and EXPECTED_ARROW
// with what you think the two increment calls will return.
// Then uncomment and run to verify.
const counter = {
  count: 0,
  incrementRegular: function () {
    this.count++;
    return this.count;
  },
  incrementArrow: () => {
    counter.count++;
    return counter.count;
  }, // arrow: no own `this`
};

// What does each call return the FIRST time it is invoked?
const EXPECTED_REGULAR = 0; // TODO: replace with your prediction
const EXPECTED_ARROW = 0; // TODO: replace with your prediction

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
  // Arrow closes over lexical this (module/global scope), not the object.
  // The counter above works because it explicitly references `counter.count`.
  // Demonstrate: an arrow in a method context that uses `this` does NOT get the object.
  let capturedThis = null;
  const obj = {
    name: 'test',
    fn: () => {
      capturedThis = this;
    },
  };
  obj.fn();
  // In strict mode (ESM), `this` at module top level is undefined.
  // In node CJS or non-strict, it is the global / module.exports object.
  assert(capturedThis !== obj, 'arrow this should not equal the object');
});

// ═══ LEVEL 3 — this in callbacks ═════════════════════════════════════════════

// Exercise 3 — Fix `this` in a callback (3 ways)
// The Timer class below has a bug: when tick() is passed to setInterval, `this`
// is lost. Show all three fixes:
//   tickBind   — use .bind()
//   tickArrow  — use an arrow function wrapper
//   tickClosure— use a closure (const self = this)
// For testing we use a synchronous fake setTimeout that calls cb immediately.

class Timer {
  constructor(label) {
    this.label = label;
    this.ticks = 0;
  }

  tick() {
    this.ticks++;
    return `${this.label}: ${this.ticks}`;
  }

  // Return an object with three fixed versions of tick
  getFixedTicks() {
    // YOUR CODE HERE
    // return { tickBind, tickArrow, tickClosure };
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

// ═══ LEVEL 4 — Explicit binding quiz ════════════════════════════════════════

// Exercise 4 — call / apply / bind predictions
// For each scenario, replace ??? with what you predict the expression evaluates to,
// then uncomment the assertion to verify.

function describe() {
  return `${this.role} at ${this.company}`;
}
const ctx1 = { role: 'Engineer', company: 'Acme' };
const ctx2 = { role: 'Manager', company: 'Globex' };

// Scenario A: call
const resultA = describe.call(ctx1);
// Scenario B: apply
const resultB = describe.apply(ctx2);
// Scenario C: bind — returns a new function, not the value
const boundDescribe = describe.bind(ctx1);
const resultC = boundDescribe();
// Scenario D: bind then call with different ctx — bind wins
const resultD = boundDescribe.call(ctx2);

console.log('\nLevel 4 — call/apply/bind quiz');
test('call sets this to ctx1', () => assertEq(resultA, 'Engineer at Acme'));
test('apply sets this to ctx2', () => assertEq(resultB, 'Manager at Globex'));
test('bind returns bound fn', () => assertEq(resultC, 'Engineer at Acme'));
test('bind wins over later .call(ctx2)', () => assertEq(resultD, 'Engineer at Acme'));

// Bonus — call with args
function greetUser(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'Dana' };
const resultE = greetUser.call(person, 'Hi', '!');
const resultF = greetUser.apply(person, ['Hey', '?']);
test('call passes args positionally', () => assertEq(resultE, 'Hi, Dana!'));
test('apply passes args as array', () => assertEq(resultF, 'Hey, Dana?'));
