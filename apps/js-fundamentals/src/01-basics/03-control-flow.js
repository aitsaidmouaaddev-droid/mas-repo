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

// Exercise 1 — FizzBuzz
// Divisible by 3 → "Fizz", by 5 → "Buzz", by both → "FizzBuzz", else → String(n)
function fizzBuzz(n) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — FizzBuzz');
test('3  → "Fizz"', () => assertEq(fizzBuzz(3), 'Fizz'));
test('5  → "Buzz"', () => assertEq(fizzBuzz(5), 'Buzz'));
test('15 → "FizzBuzz"', () => assertEq(fizzBuzz(15), 'FizzBuzz'));
test('7  → "7"', () => assertEq(fizzBuzz(7), '7'));

// ─────────────────────────────────────────────────────────────────────────────

// Exercise 2 — Grade classifier
// 90+ → 'A', 80+ → 'B', 70+ → 'C', 60+ → 'D', else → 'F'
// Throw RangeError if score is outside 0-100.
function getGrade(score) {
  // YOUR CODE HERE
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

// Exercise 3 — Switch + fall-through
// Given a day number (1=Mon … 7=Sun), return "Weekday" or "Weekend".
// Use a switch statement with intentional fall-through.
function dayType(day) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Switch fall-through');
test('1 (Mon) → "Weekday"', () => assertEq(dayType(1), 'Weekday'));
test('5 (Fri) → "Weekday"', () => assertEq(dayType(5), 'Weekday'));
test('6 (Sat) → "Weekend"', () => assertEq(dayType(6), 'Weekend'));
test('7 (Sun) → "Weekend"', () => assertEq(dayType(7), 'Weekend'));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Guard clauses
// Validate a user object: must have name (non-empty string) and age (18-120).
// Return { valid: true } or { valid: false, reason: '...' }.
// Use guard clauses (early returns), NOT nested ifs.
function validateUser(user) {
  // YOUR CODE HERE
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

// Exercise 5 — Lazy evaluator (chainable)
// Implement when(condition).then(fn).otherwise(fn).value()
// Callbacks must be called LAZILY — only the winning branch executes.
function when(condition) {
  // YOUR CODE HERE
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
