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

// ═══ LEVEL 1 — Rookie ════════════════════════════════════════════════════════
// Exercise 1 — Hoisting Quiz
// Predict what each snippet evaluates to and return the results as an array.
//
// Snippet A: typeof foo before `var foo = 1`
// Snippet B: typeof bar before `let bar = 1`
// Snippet C: result of calling a function declaration before its definition
// Snippet D: typeof a function expression (var) before its assignment
//
// Return: [snippetA, snippetB, snippetC, snippetD]
// Expected: ['undefined', 'undefined', 42, 'undefined']
function hoistingQuiz() {
  // YOUR CODE HERE — evaluate all 4 snippets and return their results in order
  // Hint: you must actually run the code in sub-scopes to avoid contamination
}

console.log('\nLevel 1 — Hoisting Quiz');
test('returns array of 4 results', () => {
  const result = hoistingQuiz();
  assertDeepEq(result, ['undefined', 'undefined', 42, 'undefined']);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 2 — IIFE Counter
// Using an IIFE, create and return a counter object with:
//   increment() — adds 1
//   decrement() — subtracts 1
//   value()     — returns current count (starts at 0)
// The internal count must be private (not directly accessible from outside).
function makeIIFECounter() {
  // YOUR CODE HERE — use an IIFE inside this function to create private state
}

console.log('\nLevel 2 — IIFE Counter');
test('starts at 0', () => assertEq(makeIIFECounter().value(), 0));
test('increment once → 1', () => {
  const c = makeIIFECounter();
  c.increment();
  assertEq(c.value(), 1);
});
test('increment 3× → 3', () => {
  const c = makeIIFECounter();
  c.increment();
  c.increment();
  c.increment();
  assertEq(c.value(), 3);
});
test('decrement below 0', () => {
  const c = makeIIFECounter();
  c.decrement();
  assertEq(c.value(), -1);
});
test('independent counters', () => {
  const a = makeIIFECounter();
  const b = makeIIFECounter();
  a.increment();
  a.increment();
  assertEq(b.value(), 0);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 3 — Fix the setTimeout Loop Bug
// The buggy function below registers N callbacks but they all log the same
// (wrong) value because var is function-scoped.
// Rewrite it using let so each callback captures the correct index.
//
// Returns an array of the values that will be logged (synchronously collected
// via a mock "log" callback instead of real setTimeout).
function fixedLoop(n, log) {
  // YOUR CODE HERE — use let (or another fix) so each callback sees the right i
  // Call log(i) inside each setTimeout (use timeout 0). Return nothing.
  for (var i = 0; i < n; i++) {
    setTimeout(function () {
      log(i);
    }, 0);
  }
}

console.log('\nLevel 3 — Fix setTimeout Loop');
test('var version captures wrong value', () => {
  // Demonstrate the bug first — all callbacks capture the final i
  const logged = [];
  const fakeSetTimeout = (fn) => fn(); // synchronous for testing
  const n = 3;
  // Simulate the buggy var loop
  const buggyResults = [];
  (function () {
    for (var i = 0; i < n; i++) {
      fakeSetTimeout(function () {
        buggyResults.push(i);
      });
    }
  })();
  // All values are 3 (n), not [0,1,2]
  assertDeepEq(buggyResults, [3, 3, 3]);
});
test('let version captures correct value', () => {
  const logged = [];
  const fakeSetTimeout = (fn) => fn(); // synchronous for testing
  const n = 3;
  const letResults = [];
  (function () {
    for (let i = 0; i < n; i++) {
      fakeSetTimeout(function () {
        letResults.push(i);
      });
    }
  })();
  assertDeepEq(letResults, [0, 1, 2]);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 5 — Master ════════════════════════════════════════════════════════
// Exercise 4 — Temporal Dead Zone (TDZ)
// The Temporal Dead Zone is the period between entering a block and the let/const
// declaration being initialized. Accessing the variable in this window throws a
// ReferenceError.
//
// Implement tdzDemo() that returns an object:
//   { varResult, letResult }
// where:
//   varResult: the result of typeof on a var variable before its declaration line
//              (should be 'undefined' — var is hoisted and initialized)
//   letResult: the error message thrown when accessing a let variable before
//              its declaration (catch the ReferenceError and return e.message)
function tdzDemo() {
  // YOUR CODE HERE
}

console.log('\nLevel 5 — Temporal Dead Zone');
test('var before declaration is "undefined"', () => {
  const { varResult } = tdzDemo();
  assertEq(varResult, 'undefined');
});
test('let in TDZ throws ReferenceError', () => {
  const { letResult } = tdzDemo();
  assert(
    typeof letResult === 'string' && letResult.length > 0,
    'should return error message string',
  );
});
