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

// ─── Exercise 1 — Safe default with || ───────────────────────────────────────
//
// CONCEPT: Logical OR (||) as default operator
// WHY:     || returns the right side if the left is falsy. This means 0, "",
//          false, null, and undefined all fall through — which is often wrong.
// WHEN:    Use || only when you're certain the value won't be a meaningful falsy
//          like 0 or "". Otherwise, prefer ??.
// WHERE:   Default parameter values (before ES6), config merging, option objects.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR

function withDefault(value, def) {
  return value || def;
}

console.log('\nLevel 1 — Safe default with ||');
test('"hello" → "hello"', () => assertEq(withDefault('hello', 'def'), 'hello'));
test('null    → "def"', () => assertEq(withDefault(null, 'def'), 'def'));
test('0       → "def" (!!)', () => assertEq(withDefault(0, 'def'), 'def'));

// ─── Exercise 2 — Nullish coalescing (??) ────────────────────────────────────
//
// CONCEPT: Nullish coalescing operator (??) — ES2020
// WHY:     Unlike ||, ?? only falls through on null and undefined. 0, false,
//          and "" are considered real values and are returned as-is.
// WHEN:    Prefer ?? over || for default values in modern code. Use it whenever
//          0 or false or "" are valid values.
// WHERE:   Default parameters, merging configs, reading optional fields.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

function withNullish(value, def) {
  return value ?? def;
}

console.log('\nLevel 1 — Nullish coalescing');
test('"hello" → "hello"', () => assertEq(withNullish('hello', 'def'), 'hello'));
test('null    → "def"', () => assertEq(withNullish(null, 'def'), 'def'));
test('0       → 0', () => assertEq(withNullish(0, 'def'), 0));
test('false   → false', () => assertEq(withNullish(false, 'def'), false));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 3 — Optional chaining ─────────────────────────────────────────
//
// CONCEPT: Optional chaining (?.) — ES2020
// WHY:     Instead of writing user && user.address && user.address.city, you
//          short-circuit safely with ?. The whole expression evaluates to
//          undefined if any step is null/undefined instead of throwing.
// WHEN:    Any time you read deeply nested properties from external data (API
//          responses, user input) that may be incomplete.
// WHERE:   API response parsing, config reading, deeply nested state objects.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

function getCity(user) {
  return user?.address?.city;
}

console.log('\nLevel 2 — Optional chaining');
test('full object → city', () => assertEq(getCity({ address: { city: 'Paris' } }), 'Paris'));
test('no address  → undefined', () => assertEq(getCity({ name: 'Alice' }), undefined));
test('null user   → undefined', () => assertEq(getCity(null), undefined));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Exercise 4 — Implicit coercion traps ────────────────────────────────────
//
// CONCEPT: Implicit type coercion rules
// WHY:     JS has complex coercion rules. + prefers strings (concatenates if
//          either operand is a string). - always converts to number. Arrays
//          convert to "" via .toString(). Objects convert to "[object Object]".
//          The unary + converts to number. These are frequent interview gotchas.
// WHEN:    Understanding this prevents debugging nightmares. Always know what
//          type your values are before using arithmetic operators.
// WHERE:   Anywhere operators are used with mixed types; DOM values (always
//          strings); JSON parsed data.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion

function coercionQuiz() {
  return [
    1 + '2', // "12" — + with string → string concat
    '3' - 1, // 2    — - always numeric
    true + true, // 2    — true coerces to 1
    [] + [], // ""   — [].toString() = ""
    [] + {}, // "[object Object]"
    {} + [], // "[object Object]" as expression (as statement: 0)
    +'', // 0    — unary + on "" → 0
    +null, // 0    — unary + on null → 0
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

// ─── Exercise 5 — Custom valueOf ─────────────────────────────────────────────
//
// CONCEPT: valueOf() and the Abstract Equality Comparison algorithm
// WHY:     When == compares an object to a primitive, JS calls [Symbol.toPrimitive]
//          or valueOf() on the object to get a primitive. By returning a
//          different value each call we can make a == 1 && a == 2 && a == 3 true.
//          This is a famous trick that exposes how JS coercion really works.
// WHEN:    You'd never do this in production. But it reveals the full coercion
//          pipeline: ToPrimitive → valueOf → toString.
// WHERE:   Senior-level interviews; understanding custom iterators and numeric
//          coercion in library code.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf

function makeIncrementing() {
  let n = 0;
  return {
    valueOf() {
      return ++n;
    },
  };
}

console.log('\nLevel 5 — Custom valueOf');
const a = makeIncrementing();
test('a==1 && a==2 && a==3', () => assert(a == 1 && a == 2 && a == 3, 'not all equal'));
