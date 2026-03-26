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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 1 — FizzBuzz ───────────────────────────────────────────────────
//
// CONCEPT: Modulo operator + conditional ordering
// WHY:     The critical trick is checking FizzBuzz (% 15) BEFORE checking Fizz
//          or Buzz individually. If you check % 3 first, 15 returns "Fizz"
//          instead of "FizzBuzz". Order matters in if-else chains.
// WHEN:    Any time you need divisibility checks. The ordering lesson applies
//          to all overlapping conditions in if/else chains.
// WHERE:   Classic interview question. Also a template for any multi-condition
//          classification logic (tax brackets, discount tiers, etc.).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder

function fizzBuzz(n) {
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

console.log('\nLevel 1 — FizzBuzz');
test('3  → "Fizz"', () => assertEq(fizzBuzz(3), 'Fizz'));
test('5  → "Buzz"', () => assertEq(fizzBuzz(5), 'Buzz'));
test('15 → "FizzBuzz"', () => assertEq(fizzBuzz(15), 'FizzBuzz'));
test('7  → "7"', () => assertEq(fizzBuzz(7), '7'));

// ─── Exercise 2 — Grade classifier ───────────────────────────────────────────
//
// CONCEPT: Guard clauses + RangeError
// WHY:     Validate at the boundary first. Throw the right built-in error type
//          (RangeError for out-of-range numbers, TypeError for wrong types).
//          The if-else chain works because conditions are mutually exclusive
//          once the range is validated.
// WHEN:    Any classification with a validity check upfront.
// WHERE:   Input validation in APIs and utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError

function getGrade(score) {
  if (score < 0 || score > 100) throw new RangeError(`Score ${score} out of range [0, 100]`);
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

console.log('\nLevel 1 — Grade classifier');
test('95 → "A"', () => assertEq(getGrade(95), 'A'));
test('82 → "B"', () => assertEq(getGrade(82), 'B'));
test('71 → "C"', () => assertEq(getGrade(71), 'C'));
test('65 → "D"', () => assertEq(getGrade(65), 'D'));
test('55 → "F"', () => assertEq(getGrade(55), 'F'));
test('throws on -1', () => {
  let threw = false;
  try {
    getGrade(-1);
  } catch (e) {
    threw = e instanceof RangeError;
  }
  assert(threw, 'expected RangeError');
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 3 — Switch + fall-through ──────────────────────────────────────
//
// CONCEPT: switch fall-through
// WHY:     Omitting break causes execution to "fall through" to the next case.
//          This is usually a bug — but intentionally used here to group cases.
//          switch uses === for comparison.
// WHEN:    Use fall-through to share logic across cases. But document it clearly
//          or lint rules will flag it.
// WHERE:   Command parsers, state machines, grouping similar enum values.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch

function dayType(day) {
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return 'Weekday';
    case 6:
    case 7:
      return 'Weekend';
    default:
      throw new RangeError(`Invalid day: ${day}`);
  }
}

console.log('\nLevel 2 — Switch fall-through');
test('1 (Mon) → "Weekday"', () => assertEq(dayType(1), 'Weekday'));
test('5 (Fri) → "Weekday"', () => assertEq(dayType(5), 'Weekday'));
test('6 (Sat) → "Weekend"', () => assertEq(dayType(6), 'Weekend'));
test('7 (Sun) → "Weekend"', () => assertEq(dayType(7), 'Weekend'));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 4 — Guard clauses ──────────────────────────────────────────────
//
// CONCEPT: Guard clauses (early return pattern)
// WHY:     Nested ifs create "arrow code" that's hard to read. Guard clauses
//          invert the condition and return early, keeping the happy path
//          unindented and at the end. Each guard is self-contained and easy
//          to test in isolation.
// WHEN:    Any function with multiple validation steps. Especially common in
//          API handlers, form validators, domain objects.
// WHERE:   Ubiquitous in well-written backends. This is what interviewers look
//          for when they ask you to "clean up" a nested if chain.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return

function validateUser(user) {
  if (!user || typeof user.name !== 'string' || user.name.trim() === '')
    return { valid: false, reason: 'name must be a non-empty string' };
  if (typeof user.age !== 'number' || user.age < 18 || user.age > 120)
    return { valid: false, reason: 'age must be between 18 and 120' };
  return { valid: true };
}

console.log('\nLevel 3 — Guard clauses');
test('valid user', () => assertEq(validateUser({ name: 'Ali', age: 25 }).valid, true));
test('missing name', () => assertEq(validateUser({ age: 25 }).valid, false));
test('empty name', () => assertEq(validateUser({ name: '', age: 25 }).valid, false));
test('age too young', () => assertEq(validateUser({ name: 'Ali', age: 15 }).valid, false));
test('age too old', () => assertEq(validateUser({ name: 'Ali', age: 130 }).valid, false));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 5 — GOD
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 5 — Lazy evaluator ─────────────────────────────────────────────
//
// CONCEPT: Builder / fluent API + lazy evaluation
// WHY:     A fluent chain (method chaining returning `this` or a new object)
//          lets you express control flow as data. Laziness means the callback
//          is stored, not called immediately — only the winning branch runs.
//          This is the foundation of Promises, Observables, and Option types.
// WHEN:    When you want to compose conditional logic without executing it yet.
//          Also used in query builders, test frameworks (expect), and parsers.
// WHERE:   Functional programming, monadic patterns, DSLs.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects

function when(condition) {
  let thenFn, otherwiseFn;
  const api = {
    then(fn) {
      thenFn = fn;
      return api;
    },
    otherwise(fn) {
      otherwiseFn = fn;
      return api;
    },
    value() {
      return condition ? thenFn() : otherwiseFn();
    },
  };
  return api;
}

console.log('\nLevel 5 — Lazy evaluator');
let sideEffect = 0;
test('true  → "yes"', () =>
  assertEq(
    when(true)
      .then(() => 'yes')
      .otherwise(() => 'no')
      .value(),
    'yes',
  ));
test('false → "no"', () =>
  assertEq(
    when(false)
      .then(() => 'yes')
      .otherwise(() => 'no')
      .value(),
    'no',
  ));
test('lazy: otherwise not called when true', () => {
  when(true)
    .then(() => {})
    .otherwise(() => {
      sideEffect++;
    })
    .value();
  assert(sideEffect === 0, 'otherwise should not have been called');
});
