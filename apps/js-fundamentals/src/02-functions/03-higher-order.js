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

// Exercise 1 — myMap
// Implement Array.prototype.map from scratch.
// Returns a new array where each element is fn(element).
function myMap(arr, fn) {
  // YOUR CODE HERE
}

// Exercise 2 — myFilter
// Implement Array.prototype.filter from scratch.
// Returns a new array containing only elements for which fn(element) is truthy.
function myFilter(arr, fn) {
  // YOUR CODE HERE
}

// Exercise 3 — myReduce
// Implement Array.prototype.reduce (always requires an initial value).
// Accumulates a single result by applying fn(accumulator, element) for each element.
function myReduce(arr, fn, init) {
  // YOUR CODE HERE
}

// Exercise 4 — compose
// Right-to-left function composition.
// compose(f, g, h)(x) === f(g(h(x)))
function compose(...fns) {
  // YOUR CODE HERE
}

// Exercise 5 — pipe
// Left-to-right function composition.
// pipe(f, g, h)(x) === h(g(f(x)))
function pipe(...fns) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — myMap');
test('[1,2,3] map ×2 → [2,4,6]', () =>
  assertDeepEq(
    myMap([1, 2, 3], (x) => x * 2),
    [2, 4, 6],
  ));
test('preserves length', () => assertEq(myMap([1, 2, 3], (x) => x).length, 3));
test('handles empty array', () =>
  assertDeepEq(
    myMap([], (x) => x * 2),
    [],
  ));

console.log('\nLevel 2 — myFilter');
test('[1,2,3,4] filter evens → [2,4]', () =>
  assertDeepEq(
    myFilter([1, 2, 3, 4], (x) => x % 2 === 0),
    [2, 4],
  ));
test('filter all out → []', () =>
  assertDeepEq(
    myFilter([1, 3, 5], (x) => x % 2 === 0),
    [],
  ));
test('filter none out → same', () =>
  assertDeepEq(
    myFilter([2, 4, 6], (x) => x % 2 === 0),
    [2, 4, 6],
  ));

console.log('\nLevel 2 — myReduce');
test('sum [1,2,3,4] → 10', () =>
  assertEq(
    myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0),
    10,
  ));
test('max via reduce → 4', () =>
  assertEq(
    myReduce([1, 3, 2, 4], (acc, x) => (x > acc ? x : acc), -Infinity),
    4,
  ));
test('reduce empty → init', () =>
  assertEq(
    myReduce([], (acc, x) => acc + x, 99),
    99,
  ));

console.log('\nLevel 3 — compose');
test('compose(x=>x+1, x=>x*2)(3) → 7', () =>
  assertEq(
    compose(
      (x) => x + 1,
      (x) => x * 2,
    )(3),
    7,
  ));
test('compose single fn', () => assertEq(compose((x) => x + 5)(10), 15));
test('compose three fns right-to-left', () =>
  assertEq(
    compose(
      (x) => x * 2,
      (x) => x + 3,
      (x) => x - 1,
    )(5),
    14,
  ));

console.log('\nLevel 4 — pipe');
test('pipe(x=>x*2, x=>x+1)(3) → 7', () =>
  assertEq(
    pipe(
      (x) => x * 2,
      (x) => x + 1,
    )(3),
    7,
  ));
test('pipe single fn', () => assertEq(pipe((x) => x + 5)(10), 15));
test('pipe three fns left-to-right', () =>
  assertEq(
    pipe(
      (x) => x - 1,
      (x) => x + 3,
      (x) => x * 2,
    )(5),
    14,
  ));
