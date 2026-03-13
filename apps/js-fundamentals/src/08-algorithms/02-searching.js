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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — Linear Search
// Scan the array from left to right. Return the index of the first element that
// satisfies the predicate, or -1 if no element matches.
//
// linearSearch([10, 20, 80, 30, 60], x => x === 30) → 3
function linearSearch(arr, predicate) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Linear Search');
test('finds first match', () =>
  assertEq(
    linearSearch([10, 20, 80, 30, 60], (x) => x === 30),
    3,
  ));
test('returns -1 when not found', () =>
  assertEq(
    linearSearch([1, 2, 3], (x) => x === 5),
    -1,
  ));
test('empty array returns -1', () =>
  assertEq(
    linearSearch([], (x) => x > 0),
    -1,
  ));
test('returns index 0 on match', () =>
  assertEq(
    linearSearch([7, 1, 2], (x) => x === 7),
    0,
  ));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Binary Search (iterative)
// The input array is sorted in ascending order. Repeatedly halve the search
// space by comparing the target to the middle element.
// Return the index of target, or -1 if not present.
//
// binarySearch([1,3,5,7,9,11], 7) → 3
function binarySearch(arr, target) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Binary Search');
test('finds middle element', () => assertEq(binarySearch([1, 3, 5, 7, 9, 11], 7), 3));
test('finds first element', () => assertEq(binarySearch([2, 4, 6, 8], 2), 0));
test('finds last element', () => assertEq(binarySearch([2, 4, 6, 8], 8), 3));
test('returns -1 when not found', () => assertEq(binarySearch([1, 3, 5], 4), -1));
test('single-element match', () => assertEq(binarySearch([42], 42), 0));
test('empty array returns -1', () => assertEq(binarySearch([], 1), -1));

// Exercise 3 — Count occurrences
// Given a sorted array, return the number of times target appears.
// Hint: find the leftmost and rightmost index using binary search ideas.
//
// countOccurrences([1,1,2,2,2,3], 2) → 3
function countOccurrences(arr, target) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Count Occurrences');
test('3 twos in [1,1,2,2,2,3]', () => assertEq(countOccurrences([1, 1, 2, 2, 2, 3], 2), 3));
test('2 ones in [1,1,2,3]', () => assertEq(countOccurrences([1, 1, 2, 3], 1), 2));
test('value not present → 0', () => assertEq(countOccurrences([1, 2, 3], 5), 0));
test('all same value', () => assertEq(countOccurrences([4, 4, 4], 4), 3));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Binary Search on a Rotated Sorted Array
// The array was originally sorted in ascending order but then rotated at some
// unknown pivot. Return the index of target, or -1 if not present.
// Must run in O(log n).
//
// searchRotated([4,5,6,7,0,1,2], 0) → 4
function searchRotated(arr, target) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Search Rotated Array');
test('[4,5,6,7,0,1,2] target=0  → 4', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4));
test('[4,5,6,7,0,1,2] target=4  → 0', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 4), 0));
test('[4,5,6,7,0,1,2] target=3  →-1', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1));
test('[1] target=0               →-1', () => assertEq(searchRotated([1], 0), -1));
test('[1] target=1               → 0', () => assertEq(searchRotated([1], 1), 0));
test('[3,1] target=1             → 1', () => assertEq(searchRotated([3, 1], 1), 1));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 5 — Find Peak Element
// A peak element is greater than its neighbours. The array is not sorted.
// Return the index of any peak (arr[-1] and arr[n] are considered -Infinity).
// Must run in O(log n).
//
// findPeak([1, 3, 20, 4, 1, 0]) → 2
function findPeak(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Find Peak Element');
test('[1,3,20,4,1,0]  → peak at 2', () => {
  const i = findPeak([1, 3, 20, 4, 1, 0]);
  const a = [1, 3, 20, 4, 1, 0];
  const left = i === 0 ? -Infinity : a[i - 1];
  const right = i === a.length - 1 ? -Infinity : a[i + 1];
  assert(a[i] > left && a[i] > right, `index ${i} is not a peak`);
});
test('[1,2,3,1]       → peak at 2', () => {
  const i = findPeak([1, 2, 3, 1]);
  assertEq(i, 2);
});
test('single element is a peak', () => assertEq(findPeak([42]), 0));
test('[2,1]           → peak at 0', () => assertEq(findPeak([2, 1]), 0));

// Exercise 6 — Kth Smallest in Two Sorted Arrays
// Given two sorted arrays, find the kth smallest element overall (1-indexed).
// Must run in O(log(min(m,n))).
//
// kthSmallest([1,3], [2,4,5,6], 4) → 4
function kthSmallest(arr1, arr2, k) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Kth Smallest in Two Sorted Arrays');
test('k=4 in [1,3]+[2,4,5,6] → 4', () => assertEq(kthSmallest([1, 3], [2, 4, 5, 6], 4), 4));
test('k=1 → smallest overall', () => assertEq(kthSmallest([1, 2], [3, 4], 1), 1));
test('k=4 → largest overall', () => assertEq(kthSmallest([1, 2], [3, 4], 4), 4));
test('k=3 in [2,3,6,7]+[1,4,8,9]', () => assertEq(kthSmallest([2, 3, 6, 7], [1, 4, 8, 9], 3), 3));
