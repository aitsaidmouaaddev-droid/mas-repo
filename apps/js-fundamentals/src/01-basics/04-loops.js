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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ═══ LEVEL 1 — Rookie ═══════════════════════════════════════════════════════════
// Exercise 1 — Sum Array
// Sum all numbers in an array using a for loop (no .reduce()).
// Input: arr — array of numbers
// Output: number — the total sum
function sumArray(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Sum Array');
test('empty array → 0', () => assertEq(sumArray([]), 0));
test('[1,2,3] → 6', () => assertEq(sumArray([1, 2, 3]), 6));
test('negative numbers', () => assertEq(sumArray([-1, -2, 3]), 0));
test('single element', () => assertEq(sumArray([42]), 42));
test('large array', () => assertEq(sumArray([10, 20, 30, 40]), 100));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 2 — Flatten One Level
// Flatten a one-level-deep nested array using for...of (no .flat()).
// Input: arr — array of arrays (one level deep)
// Output: new flat array
function flattenOne(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Flatten One Level');
test('[[1,2],[3,4]] → [1,2,3,4]', () =>
  assertDeepEq(
    flattenOne([
      [1, 2],
      [3, 4],
    ]),
    [1, 2, 3, 4],
  ));
test('empty inner arrays', () => assertDeepEq(flattenOne([[], [1], []]), [1]));
test('empty outer array', () => assertDeepEq(flattenOne([]), []));
test('single-element inner arrays', () => assertDeepEq(flattenOne([[1], [2], [3]]), [1, 2, 3]));
test('mixed lengths', () => assertDeepEq(flattenOne([[1, 2, 3], [4]]), [1, 2, 3, 4]));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 3 — Implement forEach
// Implement myForEach(arr, fn) that calls fn(item, index, arr) for each element.
// Must not use Array.prototype.forEach.
// Input: arr — any array, fn — callback(item, index, arr)
// Output: undefined (like the built-in)
function myForEach(arr, fn) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Implement forEach');
test('calls fn for each item', () => {
  const seen = [];
  myForEach([10, 20, 30], (item) => seen.push(item));
  assertDeepEq(seen, [10, 20, 30]);
});
test('passes correct index', () => {
  const indices = [];
  myForEach(['a', 'b', 'c'], (_, i) => indices.push(i));
  assertDeepEq(indices, [0, 1, 2]);
});
test('passes array as third arg', () => {
  const ref = [1, 2];
  let captured;
  myForEach(ref, (_, __, arr) => {
    captured = arr;
  });
  assert(captured === ref, 'third arg should be the original array');
});
test('returns undefined', () =>
  assertEq(
    myForEach([], () => {}),
    undefined,
  ));
test('empty array — fn never called', () => {
  let called = false;
  myForEach([], () => {
    called = true;
  });
  assert(!called);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 5 — Master ════════════════════════════════════════════════════════
// Exercise 4 — Fibonacci Iterator (Closure)
// Return an object with a next() method that returns the next Fibonacci number
// each time it is called (starting 0, 1, 1, 2, 3, 5, …).
// No generators — pure closure state.
// Input: none (factory function)
// Output: { next: () => number }
function makeFibIterator() {
  // YOUR CODE HERE
}

console.log('\nLevel 5 — Fibonacci Iterator');
test('first 8 values correct', () => {
  const fib = makeFibIterator();
  const results = Array.from({ length: 8 }, () => fib.next());
  assertDeepEq(results, [0, 1, 1, 2, 3, 5, 8, 13]);
});
test('each iterator is independent', () => {
  const a = makeFibIterator();
  const b = makeFibIterator();
  a.next();
  a.next(); // advance a by 2
  assertEq(b.next(), 0); // b still at start
});
test('continues correctly after many calls', () => {
  const fib = makeFibIterator();
  for (let i = 0; i < 10; i++) fib.next();
  assertEq(fib.next(), 55); // 11th Fibonacci number
});
