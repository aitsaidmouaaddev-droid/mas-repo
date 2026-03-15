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
// Exercise 1 — Recursive Factorial
// Compute n! recursively. factorial(0) === 1 (base case).
// Input: n — non-negative integer
// Output: number
function factorial(n) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — factorial');
test('0! = 1', () => assertEq(factorial(0), 1));
test('1! = 1', () => assertEq(factorial(1), 1));
test('5! = 120', () => assertEq(factorial(5), 120));
test('10! = 3628800', () => assertEq(factorial(10), 3628800));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 2 — Deep Flatten
// Recursively flatten a nested array to any depth (no .flat(Infinity)).
// Input: arr — arbitrarily nested array
// Output: flat array of primitives
function flatten(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — flatten');
test('[1,[2,3]] → [1,2,3]', () => assertDeepEq(flatten([1, [2, 3]]), [1, 2, 3]));
test('[[1,[2]],[3]] → [1,2,3]', () => assertDeepEq(flatten([[1, [2]], [3]]), [1, 2, 3]));
test('already flat', () => assertDeepEq(flatten([1, 2, 3]), [1, 2, 3]));
test('empty array', () => assertDeepEq(flatten([]), []));
test('deeply nested [[[[[1]]]]]', () => assertDeepEq(flatten([[[[[1]]]]]), [1]));
test('mixed depth', () => assertDeepEq(flatten([1, [2, [3, [4, 5]]]]), [1, 2, 3, 4, 5]));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 3 — Deep Clone
// Recursively deep-clone a value (plain objects and arrays).
// No JSON.parse/JSON.stringify allowed.
// Primitives are returned as-is.
// The clone must be a new object/array — mutations to the original must not
// affect the clone and vice versa.
// Input: val — any value (primitives, plain objects, arrays — no functions/dates)
// Output: deep copy
function deepClone(val) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — deepClone');
test('primitive returned as-is', () => assertEq(deepClone(42), 42));
test('string returned as-is', () => assertEq(deepClone('hi'), 'hi'));
test('null returned as-is', () => assertEq(deepClone(null), null));
test('flat object cloned', () => {
  const obj = { a: 1, b: 2 };
  const clone = deepClone(obj);
  assertDeepEq(clone, obj);
  clone.a = 99;
  assertEq(obj.a, 1); // original not mutated
});
test('nested object cloned deeply', () => {
  const obj = { a: { b: { c: 42 } } };
  const clone = deepClone(obj);
  clone.a.b.c = 0;
  assertEq(obj.a.b.c, 42);
});
test('array cloned', () => {
  const arr = [1, [2, [3]]];
  const clone = deepClone(arr);
  clone[1][0] = 99;
  assertEq(arr[1][0], 2);
});
test('mixed object/array', () => {
  const val = { items: [1, { x: 2 }] };
  const clone = deepClone(val);
  assertDeepEq(clone, val);
  clone.items[1].x = 999;
  assertEq(val.items[1].x, 2);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 5 — Master ════════════════════════════════════════════════════════
// Exercise 4 — Trampoline
// Implement trampoline(fn) to make deeply recursive functions safe from stack
// overflow. The convention: if fn returns a function, call that function; keep
// going until a non-function value is returned.
//
// Then use trampoline to compute factorial(10000) via a trampolined helper.
// Note: JS numbers lose precision at large integers — we only check that the
// result is a finite number > 0, not the exact value.
//
// Input: fn — a function that may return thunks (functions) or a final value
// Output: the final non-function value
function trampoline(fn) {
  // YOUR CODE HERE
}

// Trampolined factorial using accumulator (continuation-passing style)
// factHelper returns a thunk (function) instead of recursing directly.
function trampolinedFactorial(n) {
  function factHelper(n, acc) {
    if (n <= 1) return acc;
    return () => factHelper(n - 1, n * acc); // return a thunk — not a recursive call
  }
  return trampoline(factHelper(n, 1));
}

console.log('\nLevel 5 — trampoline');
test('trampoline with simple thunk chain', () => {
  // count down from 5 to 0 via thunks
  function countdown(n) {
    if (n === 0) return 'done';
    return () => countdown(n - 1);
  }
  assertEq(trampoline(countdown(5)), 'done');
});
test('trampoline returns non-function immediately', () => {
  assertEq(trampoline(42), 42);
  assertEq(trampoline('hello'), 'hello');
});
test('trampolinedFactorial(10) = 3628800', () => assertEq(trampolinedFactorial(10), 3628800));
test('trampolinedFactorial(10000) does not throw (stack safe)', () => {
  const result = trampolinedFactorial(10000);
  assert(typeof result === 'number' && isFinite(result) && result > 0);
});
