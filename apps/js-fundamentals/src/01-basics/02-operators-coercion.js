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

// Exercise 1 — Safe default with ||
// Return value if truthy, otherwise the default.
// Warning: think about when this might go wrong.
function withDefault(value, def) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Safe default with ||');
test('"hello" → "hello"', () => assertEq(withDefault('hello', 'def'), 'hello'));
test('null    → "def"', () => assertEq(withDefault(null, 'def'), 'def'));
test('0       → "def" (!!)', () => assertEq(withDefault(0, 'def'), 'def'));

// ─────────────────────────────────────────────────────────────────────────────

// Exercise 2 — Nullish coalescing (??)
// Return value if NOT null/undefined, otherwise the default.
// 0, false, "" should NOT fall through.
function withNullish(value, def) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Nullish coalescing');
test('"hello" → "hello"', () => assertEq(withNullish('hello', 'def'), 'hello'));
test('null    → "def"', () => assertEq(withNullish(null, 'def'), 'def'));
test('0       → 0', () => assertEq(withNullish(0, 'def'), 0));
test('false   → false', () => assertEq(withNullish(false, 'def'), false));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 3 — Optional chaining
// Safely read user.address.city. Return undefined if any step is missing.
function getCity(user) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Optional chaining');
test('full object → city', () => assertEq(getCity({ address: { city: 'Paris' } }), 'Paris'));
test('no address  → undefined', () => assertEq(getCity({ name: 'Alice' }), undefined));
test('null user   → undefined', () => assertEq(getCity(null), undefined));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Implicit coercion traps
// Return an array of the actual results (don't change these expressions).
// Predict each before running!
function coercionQuiz() {
  return [
    1 + '2', // ?
    '3' - 1, // ?
    true + true, // ?
    [] + [], // ?
    [] + {}, // ?
    {} + [], // ? hint: run it as an expression, not a statement
    +'', // ?
    +null, // ?
  ];
}

console.log('\nLevel 3 — Coercion quiz');
test('1 + "2"    → "12"', () => assertEq(coercionQuiz()[0], '12'));
test('"3" - 1    → 2', () => assertEq(coercionQuiz()[1], 2));
test('true+true  → 2', () => assertEq(coercionQuiz()[2], 2));
test('[] + []    → ""', () => assertEq(coercionQuiz()[3], ''));
test('[] + {}    → "[object Object]"', () => assertEq(coercionQuiz()[4], '[object Object]'));
test('+""        → 0', () => assertEq(coercionQuiz()[6], 0));
test('+null      → 0', () => assertEq(coercionQuiz()[7], 0));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 5 — GOD
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 5 — Custom valueOf and toString
// Create an object `a` such that (a == 1 && a == 2 && a == 3) is true.
// Hint: == triggers valueOf.
function makeIncrementing() {
  // YOUR CODE HERE — return an object where == compares increment each time
}

console.log('\nLevel 5 — Custom valueOf');
const a = makeIncrementing();
test('a==1 && a==2 && a==3', () => assert(a == 1 && a == 2 && a == 3, 'not all equal'));
