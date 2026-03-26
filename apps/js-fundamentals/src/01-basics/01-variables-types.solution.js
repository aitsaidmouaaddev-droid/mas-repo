// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}`);
    console.log(`       → ${e.message}`);
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

// ─── Exercise 1 — typeof check ────────────────────────────────────────────────
//
// CONCEPT: typeof operator
// WHY:     JavaScript is dynamically typed — values carry their type at runtime,
//          not variables. typeof lets you inspect what type a value actually is.
// WHEN:    Use when you need to branch based on input type (e.g. validating
//          function arguments, checking if something is undefined).
// WHERE:   Everywhere in JS. Common in utility functions, type guards, APIs.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
//
// Return the typeof the given value as a string.

function getType(value) {
  return typeof value;
}

console.log('\nLevel 1 — typeof check');
test('typeof 42      → "number"', () => assertEq(getType(42), 'number'));
test('typeof "hi"    → "string"', () => assertEq(getType('hi'), 'string'));
test('typeof true    → "boolean"', () => assertEq(getType(true), 'boolean'));
test('typeof {}      → "object"', () => assertEq(getType({}), 'object'));
test('typeof null    → "object"', () => assertEq(getType(null), 'object')); // famous gotcha!
test('typeof undef   → "undefined"', () => assertEq(getType(undefined), 'undefined'));
test('typeof fn      → "function"', () =>
  assertEq(
    getType(() => {}),
    'function',
  ));

// ─── Exercise 2 — Truthiness ──────────────────────────────────────────────────
//
// CONCEPT: Truthy / falsy values
// WHY:     JS coerces values to boolean in conditionals. Knowing what is falsy
//          prevents bugs like `if (count)` silently skipping when count === 0.
// WHEN:    Any conditional. Critical when handling user input or API responses
//          that may be 0, "", null, or undefined.
// WHERE:   if/else, ternaries, logical operators (&&, ||, ??).
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Falsy
//
// Return true if the value is truthy, false otherwise.

function isTruthy(value) {
  return !!value;
}

console.log('\nLevel 1 — Truthiness');
test('0       is falsy', () => assert(!isTruthy(0)));
test('"0"     is truthy', () => assert(isTruthy('0'))); // non-empty string = truthy
test('""      is falsy', () => assert(!isTruthy('')));
test('null    is falsy', () => assert(!isTruthy(null)));
test('[]      is truthy', () => assert(isTruthy([]))); // empty array = truthy!
test('{}      is truthy', () => assert(isTruthy({})));
test('NaN     is falsy', () => assert(!isTruthy(NaN)));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 3 — Type coercion ───────────────────────────────────────────────
//
// CONCEPT: Implicit type coercion with == vs ===
// WHY:     == triggers coercion (e.g. "5" == 5 is true). This is a source of
//          subtle bugs. === compares without coercion — always prefer it.
// WHEN:    Understanding this is crucial for interviews and debugging legacy code.
//          Always use === in production code.
// WHERE:   Comparisons, sort callbacks, legacy codebases.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
//
// Return an object { loose, strict } with the results of == and === comparisons.

function compare(a, b) {
  return { loose: a == b, strict: a === b };
}

console.log('\nLevel 2 — Type coercion');
test('"5" == 5   is true,  "5" === 5  is false', () => {
  const r = compare('5', 5);
  assert(r.loose === true && r.strict === false, JSON.stringify(r));
});
test('null == undefined  is true', () => {
  assert(compare(null, undefined).loose === true);
});
test('null === undefined is false', () => {
  assert(compare(null, undefined).strict === false);
});
test('0 == false  is true', () => {
  assert(compare(0, false).loose === true);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 4 — typeof null gotcha + Symbol ─────────────────────────────────
//
// CONCEPT: Symbol, typeof null, and safe type checking
// WHY:     typeof null === "object" is a known JS bug from 1995 that can never
//          be fixed without breaking the web. Symbols are a primitive type
//          (ES2015) used to create truly unique property keys.
// WHEN:    Use Symbol for non-collision property keys on shared objects (e.g.
//          mixins, meta-programming). Check for null explicitly: value === null.
// WHERE:   Library code, plugin systems, iterators (Symbol.iterator),
//          well-known symbols (Symbol.toPrimitive, Symbol.hasInstance).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
//
// Return the *actual* type as a string: 'null' for null, 'array' for arrays,
// 'symbol' for symbols — otherwise fall back to typeof.

function trueType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

console.log('\nLevel 4 — True type detection');
test('null          → "null"', () => assertEq(trueType(null), 'null'));
test('[1,2]         → "array"', () => assertEq(trueType([1, 2]), 'array'));
test('Symbol("x")  → "symbol"', () => assertEq(trueType(Symbol('x')), 'symbol'));
test('{}            → "object"', () => assertEq(trueType({}), 'object'));
test('42            → "number"', () => assertEq(trueType(42), 'number'));
