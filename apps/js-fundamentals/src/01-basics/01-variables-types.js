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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — typeof check
// Return the typeof the given value as a string.
function getType(value) {
  // YOUR CODE HERE
  return typeof value;
}

console.log('\nLevel 1 — typeof check');
test('typeof 42      → "number"', () => assertEq(getType(42), 'number'));
test('typeof "hi"    → "string"', () => assertEq(getType('hi'), 'string'));
test('typeof true    → "boolean"', () => assertEq(getType(true), 'boolean'));
test('typeof {}      → "object"', () => assertEq(getType({}), 'object'));
test('typeof null    → "object"', () => assertEq(getType(null), 'object'));
test('typeof undef   → "undefined"', () => assertEq(getType(undefined), 'undefined'));
test('typeof fn      → "function"', () =>
  assertEq(
    getType(() => {}),
    'function',
  ));

// ─────────────────────────────────────────────────────────────────────────────

// Exercise 2 — Truthiness
// Return true if the value is truthy, false otherwise.
function isTruthy(value) {
  // YOUR CODE HERE
  return !!value;
}

console.log('\nLevel 1 — Truthiness');
test('0       is falsy', () => assert(!isTruthy(0)));
test('"0"     is truthy', () => assert(isTruthy('0')));
test('""      is falsy', () => assert(!isTruthy('')));
test('null    is falsy', () => assert(!isTruthy(null)));
test('[]      is truthy', () => assert(isTruthy([])));
test('{}      is truthy', () => assert(isTruthy({})));
test('NaN     is falsy', () => assert(!isTruthy(NaN)));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 3 — Type coercion
// Return { loose: a == b, strict: a === b }
function compare(a, b) {
  // eslint-disable-next-line eqeqeq
  return { loose: a == b, strict: a === b };
}

console.log('\nLevel 2 — Type coercion');
test('"5" == 5 → true, "5" === 5 → false', () => {
  const r = compare('5', 5);
  assert(r.loose === true && r.strict === false, JSON.stringify(r));
});
test('null == undefined  → true', () => assert(compare(null, undefined).loose === true));
test('null === undefined → false', () => assert(compare(null, undefined).strict === false));
test('0 == false  → true', () => assert(compare(0, false).loose === true));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — True type detection
// Return the actual type: 'null' for null, 'array' for arrays, otherwise typeof.
function trueType(value) {
  // YOUR CODE HERE
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

console.log('\nLevel 4 — True type detection');
test('null    → "null"', () => assertEq(trueType(null), 'null'));
test('[1,2]   → "array"', () => assertEq(trueType([1, 2]), 'array'));
test('Symbol  → "symbol"', () => assertEq(trueType(Symbol('x')), 'symbol'));
test('{}      → "object"', () => assertEq(trueType({}), 'object'));
test('42      → "number"', () => assertEq(trueType(42), 'number'));
