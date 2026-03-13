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

// Exercise 1 — doubleAll
// Use .map() to return a new array with each element doubled
function doubleAll(arr) {
  // YOUR CODE HERE
}

// Exercise 2 — getEvens
// Use .filter() to return only even numbers
function getEvens(arr) {
  // YOUR CODE HERE
}

// Exercise 3 — sumAll
// Use .reduce() to sum all elements of the array
function sumAll(arr) {
  // YOUR CODE HERE
}

// Exercise 4 — groupBy
// Group array items by the result of keyFn into an object using .reduce()
function groupBy(arr, keyFn) {
  // YOUR CODE HERE
}

// Exercise 5 — flatMap
// Implement Array.prototype.flatMap: map then flatten one level
function flatMap(arr, fn) {
  // YOUR CODE HERE
}

// Exercise 6 — unique
// Return a new array with duplicates removed, preserving order. Use Set.
function unique(arr) {
  // YOUR CODE HERE
}

// Exercise 7 — sortBy
// Sort an array of objects by multiple keys in order
function sortBy(arr, ...keys) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — map & filter');
test('doubleAll([1,2,3]) → [2,4,6]', () => assertDeepEq(doubleAll([1, 2, 3]), [2, 4, 6]));
test('doubleAll([]) → []', () => assertDeepEq(doubleAll([]), []));
test('getEvens([1,2,3,4,5]) → [2,4]', () => assertDeepEq(getEvens([1, 2, 3, 4, 5]), [2, 4]));
test('getEvens([]) → []', () => assertDeepEq(getEvens([]), []));

console.log('\nLevel 2 — reduce & groupBy');
test('sumAll([1,2,3,4]) → 10', () => assertEq(sumAll([1, 2, 3, 4]), 10));
test('sumAll([]) → 0', () => assertEq(sumAll([]), 0));
test('groupBy([1,2,3,4,5], x=>x%2===0?"even":"odd") → {odd:[1,3,5],even:[2,4]}', () =>
  assertDeepEq(
    groupBy([1, 2, 3, 4, 5], (x) => (x % 2 === 0 ? 'even' : 'odd')),
    { odd: [1, 3, 5], even: [2, 4] },
  ));

console.log('\nLevel 3 — flatMap');
test('flatMap([1,2,3], x=>[x,x*2]) → [1,2,2,4,3,6]', () =>
  assertDeepEq(
    flatMap([1, 2, 3], (x) => [x, x * 2]),
    [1, 2, 2, 4, 3, 6],
  ));

console.log('\nLevel 4 — unique');
test('unique([1,2,2,3,1]) → [1,2,3]', () => assertDeepEq(unique([1, 2, 2, 3, 1]), [1, 2, 3]));

console.log('\nLevel 5 — sortBy');
test('sortBy by a then b', () =>
  assertDeepEq(
    sortBy(
      [
        { a: 2, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 1 },
      ],
      'a',
      'b',
    ),
    [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
    ],
  ));
