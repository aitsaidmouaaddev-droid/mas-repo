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

// Exercise 1 — findFirst
// Return the first element satisfying predicate, or undefined
function findFirst(arr, predicate) {
  // YOUR CODE HERE
}

// Exercise 2 — chunk
// Split array into chunks of `size`; last chunk may be smaller
function chunk(arr, size) {
  // YOUR CODE HERE
}

// Exercise 3 — zip
// Zip two arrays into pairs; stop at the shorter array
function zip(a, b) {
  // YOUR CODE HERE
}

// Exercise 4 — partition
// Split into [pass, fail] arrays based on predicate
function partition(arr, predicate) {
  // YOUR CODE HERE
}

// Exercise 5 — sliding
// Return array of overlapping windows of `size`
function sliding(arr, size) {
  // YOUR CODE HERE
}

// Exercise 6 — asyncMap
// Map over array with an async function, running all in parallel
async function asyncMap(arr, asyncFn) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — find');
test('findFirst([1,3,5,4,2], x=>x%2===0) → 4', () =>
  assertEq(
    findFirst([1, 3, 5, 4, 2], (x) => x % 2 === 0),
    4,
  ));
test('findFirst([], x=>true) → undefined', () =>
  assertEq(
    findFirst([], (x) => true),
    undefined,
  ));

console.log('\nLevel 2 — chunk & zip');
test('chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]', () =>
  assertDeepEq(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]));
test('chunk([], 2) → []', () => assertDeepEq(chunk([], 2), []));
test('zip([1,2,3],[4,5]) → [[1,4],[2,5]]', () =>
  assertDeepEq(zip([1, 2, 3], [4, 5]), [
    [1, 4],
    [2, 5],
  ]));

console.log('\nLevel 3 — partition');
test('partition([1,2,3,4,5], x=>x%2===0) → [[2,4],[1,3,5]]', () =>
  assertDeepEq(
    partition([1, 2, 3, 4, 5], (x) => x % 2 === 0),
    [
      [2, 4],
      [1, 3, 5],
    ],
  ));

console.log('\nLevel 4 — sliding');
test('sliding([1,2,3,4,5], 3) → [[1,2,3],[2,3,4],[3,4,5]]', () =>
  assertDeepEq(sliding([1, 2, 3, 4, 5], 3), [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
  ]));

console.log('\nLevel 5 — asyncMap');
test('asyncMap([1,2,3], async x=>x*2) resolves to [2,4,6]', async () => {
  const result = await asyncMap([1, 2, 3], async (x) => x * 2);
  assertDeepEq(result, [2, 4, 6]);
});
