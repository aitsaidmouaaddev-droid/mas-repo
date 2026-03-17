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

// ─── Exercise 1 — Sum Array ──────────────────────────────────────────────────
//
// CONCEPT: Classic for loop with index-based iteration
// WHY:     The for loop is the most primitive iteration construct in JS and
//          runs in a tight, predictable loop. Understanding it unlocks every
//          higher-level abstraction (.map, .reduce, etc.).
// WHEN:    Use a for loop when you need index access, early exit, or maximum
//          performance in hot code paths.
// WHERE:   Polyfills, parsers, algorithmic code, anywhere you need fine-grained
//          control over iteration.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for

function sumArray(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

console.log('\nLevel 1 — Sum Array');
test('empty array → 0', () => assertEq(sumArray([]), 0));
test('[1,2,3] → 6', () => assertEq(sumArray([1, 2, 3]), 6));
test('negative numbers', () => assertEq(sumArray([-1, -2, 3]), 0));
test('single element', () => assertEq(sumArray([42]), 42));
test('large array', () => assertEq(sumArray([10, 20, 30, 40]), 100));

// ─── Exercise 2 — Flatten One Level ─────────────────────────────────────────
//
// CONCEPT: for...of loop over iterables
// WHY:     for...of iterates over any iterable (arrays, strings, Maps, Sets,
//          generators) without needing indices. It's cleaner than a for loop
//          when index isn't required.
// WHEN:    Use for...of when you just need the values and don't care about
//          indices — e.g., processing items from a stream or collection.
// WHERE:   Parsers, data transformation pipelines, consuming generators.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of

function flattenOne(arr) {
  const result = [];
  for (const inner of arr) {
    for (const item of inner) {
      result.push(item);
    }
  }
  return result;
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

// ─── Exercise 3 — Implement forEach ─────────────────────────────────────────
//
// CONCEPT: Implementing higher-order functions from scratch
// WHY:     Array.prototype.forEach is itself implemented as a loop under the
//          hood. Building it yourself cements the mental model that all array
//          methods are loops with a callback contract.
// WHEN:    You'd never ship a custom forEach in production, but reimplementing
//          builtins is a standard interview technique to test loop mastery and
//          callback understanding.
// WHERE:   Polyfills (e.g., MDN shim for forEach), custom iterable wrappers,
//          library internals like lodash's _.forEach.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

function myForEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr);
  }
  // implicitly returns undefined — matches spec
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

// ─── Exercise 4 — Fibonacci Iterator (Closure) ───────────────────────────────
//
// CONCEPT: Closures as stateful iterators (the iterator pattern via closure)
// WHY:     Before generators existed (pre-ES6), closures were the only way to
//          create lazy sequences. Even today, understanding closures-as-state
//          is fundamental: generators compile down to exactly this pattern.
// WHEN:    Use closure-based iterators when you need a lightweight stateful
//          sequence without generator overhead, or in environments without
//          generator support.
// WHERE:   RxJS Observable internals, older Underscore.js lazy sequences,
//          custom pagination cursors, streaming data sources.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

function makeFibIterator() {
  let a = 0;
  let b = 1;
  return {
    next() {
      const value = a;
      [a, b] = [b, a + b]; // destructuring swap — atomic, no temp variable
      return value;
    },
  };
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
