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

// ═══ LEVEL 1 — Rookie ════════════════════════════════════════════════════════
// Exercise 1 — myMap
// Implement Array.prototype.map from scratch.
// Must NOT use .map(), .forEach(), or .reduce() internally.
// Input: arr — array, fn — function(item, index, arr) → newItem
// Output: new array of transformed items
function myMap(arr, fn) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — myMap');
test('double each number', () =>
  assertDeepEq(
    myMap([1, 2, 3], (x) => x * 2),
    [2, 4, 6],
  ));
test('string transformation', () =>
  assertDeepEq(
    myMap(['a', 'b'], (s) => s.toUpperCase()),
    ['A', 'B'],
  ));
test('empty array → []', () =>
  assertDeepEq(
    myMap([], (x) => x),
    [],
  ));
test('index is passed as second arg', () => {
  const indices = [];
  myMap(['x', 'y', 'z'], (_, i) => indices.push(i));
  assertDeepEq(indices, [0, 1, 2]);
});
test('original array passed as third arg', () => {
  const src = [1, 2];
  let captured;
  myMap(src, (_, __, arr) => {
    captured = arr;
  });
  assert(captured === src);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 2 — myFilter
// Implement Array.prototype.filter from scratch.
// Must NOT use .filter(), .forEach(), or .reduce() internally.
// Input: arr — array, fn — predicate(item, index, arr) → boolean
// Output: new array of items for which predicate returns true
function myFilter(arr, fn) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — myFilter');
test('keep evens', () =>
  assertDeepEq(
    myFilter([1, 2, 3, 4], (x) => x % 2 === 0),
    [2, 4],
  ));
test('keep strings longer than 3', () =>
  assertDeepEq(
    myFilter(['hi', 'hello', 'hey'], (s) => s.length > 3),
    ['hello'],
  ));
test('empty array → []', () =>
  assertDeepEq(
    myFilter([], (x) => x),
    [],
  ));
test('none match → []', () =>
  assertDeepEq(
    myFilter([1, 3, 5], (x) => x % 2 === 0),
    [],
  ));
test('all match', () =>
  assertDeepEq(
    myFilter([2, 4, 6], (x) => x % 2 === 0),
    [2, 4, 6],
  ));
test('index passed as second arg', () => {
  const result = myFilter(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 0);
  assertDeepEq(result, ['a', 'c']);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 3 — myReduce
// Implement Array.prototype.reduce from scratch.
// If init is provided, use it as the initial accumulator.
// If init is NOT provided (=== undefined), use arr[0] as initial acc and start
// iteration from index 1 (matching spec behavior).
// Must NOT use .reduce(), .map(), or .filter() internally.
// Input: arr — array, fn — reducer(acc, item, index, arr) → newAcc, init — optional
// Output: final accumulated value
function myReduce(arr, fn, init) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — myReduce');
test('sum with init=0', () =>
  assertEq(
    myReduce([1, 2, 3], (acc, x) => acc + x, 0),
    6,
  ));
test('sum without init', () =>
  assertEq(
    myReduce([1, 2, 3], (acc, x) => acc + x),
    6,
  ));
test('flatten with concat', () =>
  assertDeepEq(
    myReduce([[1, 2], [3], [4, 5]], (acc, x) => acc.concat(x), []),
    [1, 2, 3, 4, 5],
  ));
test('single element no init → itself', () =>
  assertEq(
    myReduce([42], (acc, x) => acc + x),
    42,
  ));
test('build object (tally)', () => {
  const result = myReduce(
    ['a', 'b', 'a', 'c', 'a'],
    (acc, ch) => {
      acc[ch] = (acc[ch] ?? 0) + 1;
      return acc;
    },
    {},
  );
  assertDeepEq(result, { a: 3, b: 1, c: 1 });
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 4 — Expert ════════════════════════════════════════════════════════
// Exercise 4 — pipe
// Create a pipe utility: pipe(f, g, h)(x) === h(g(f(x)))
// Functions are applied left-to-right. If no functions are provided, return
// an identity function.
// Input: ...fns — functions
// Output: a function that applies fns sequentially to its argument
function pipe(...fns) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — pipe');
test('single function', () => assertEq(pipe((x) => x + 1)(5), 6));
test('two functions left-to-right', () =>
  assertEq(
    pipe(
      (x) => x * 2,
      (x) => x + 1,
    )(3),
    7,
  ));
test('three functions', () =>
  assertEq(
    pipe(
      (x) => x + 1,
      (x) => x * 2,
      (x) => x - 3,
    )(5),
    9,
  ));
test('no functions → identity', () => assertEq(pipe()(42), 42));
test('string pipeline', () => {
  const process = pipe(
    (s) => s.trim(),
    (s) => s.toLowerCase(),
    (s) => s.replace(/\s+/g, '_'),
  );
  assertEq(process('  Hello World  '), 'hello_world');
});
