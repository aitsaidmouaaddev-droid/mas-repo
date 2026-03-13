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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — Bubble Sort
// Compare adjacent elements and swap them if they are in the wrong order.
// Repeat until the array is sorted. Sort in ascending order.
// Do NOT use Array.prototype.sort.
//
// bubbleSort([5, 3, 8, 1, 2]) → [1, 2, 3, 5, 8]
function bubbleSort(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Bubble Sort');
test('[5,3,8,1,2] → [1,2,3,5,8]', () => assertDeepEq(bubbleSort([5, 3, 8, 1, 2]), [1, 2, 3, 5, 8]));
test('[1]         → [1]', () => assertDeepEq(bubbleSort([1]), [1]));
test('[]          → []', () => assertDeepEq(bubbleSort([]), []));
test('[3,1,2]     → [1,2,3]', () => assertDeepEq(bubbleSort([3, 1, 2]), [1, 2, 3]));
test('already sorted stays sorted', () =>
  assertDeepEq(bubbleSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]));
test('reverse order', () => assertDeepEq(bubbleSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Selection Sort
// On each pass, find the minimum element in the unsorted portion and swap it
// to the front. Sort a copy of the array in ascending order (don't mutate input).
//
// selectionSort([64, 25, 12, 22, 11]) → [11, 12, 22, 25, 64]
function selectionSort(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Selection Sort');
test('[64,25,12,22,11] → [11,12,22,25,64]', () =>
  assertDeepEq(selectionSort([64, 25, 12, 22, 11]), [11, 12, 22, 25, 64]));
test('[1]              → [1]', () => assertDeepEq(selectionSort([1]), [1]));
test('does not mutate the original', () => {
  const orig = [3, 1, 2];
  selectionSort(orig);
  assertDeepEq(orig, [3, 1, 2]);
});

// Exercise 3 — Insertion Sort
// Build the sorted portion one element at a time by inserting each element
// into its correct position. Sort in ascending order.
//
// insertionSort([12, 11, 13, 5, 6]) → [5, 6, 11, 12, 13]
function insertionSort(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Insertion Sort');
test('[12,11,13,5,6] → [5,6,11,12,13]', () =>
  assertDeepEq(insertionSort([12, 11, 13, 5, 6]), [5, 6, 11, 12, 13]));
test('[2,1]          → [1,2]', () => assertDeepEq(insertionSort([2, 1]), [1, 2]));
test('single element stays intact', () => assertDeepEq(insertionSort([42]), [42]));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Merge Sort
// Divide the array in half recursively, sort each half, then merge them back.
// Return a new sorted array (ascending). Time complexity should be O(n log n).
//
// mergeSort([38, 27, 43, 3, 9, 82, 10]) → [3, 9, 10, 27, 38, 43, 82]
function mergeSort(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Merge Sort');
test('[38,27,43,3,9,82,10] → [3,9,10,27,38,43,82]', () =>
  assertDeepEq(mergeSort([38, 27, 43, 3, 9, 82, 10]), [3, 9, 10, 27, 38, 43, 82]));
test('[5,2,4,6,1,3]        → [1,2,3,4,5,6]', () =>
  assertDeepEq(mergeSort([5, 2, 4, 6, 1, 3]), [1, 2, 3, 4, 5, 6]));
test('empty array', () => assertDeepEq(mergeSort([]), []));
test('one element', () => assertDeepEq(mergeSort([7]), [7]));

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 5 — Quick Sort
// Choose a pivot, partition elements into those less-than and greater-than-or-equal,
// then recursively sort each partition. Return a new sorted array (ascending).
//
// quickSort([10, 80, 30, 90, 40, 50, 70]) → [10, 30, 40, 50, 70, 80, 90]
function quickSort(arr) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Quick Sort');
test('[10,80,30,90,40,50,70] → [10,30,40,50,70,80,90]', () =>
  assertDeepEq(quickSort([10, 80, 30, 90, 40, 50, 70]), [10, 30, 40, 50, 70, 80, 90]));
test('[3,6,8,10,1,2,1]       → [1,1,2,3,6,8,10]', () =>
  assertDeepEq(quickSort([3, 6, 8, 10, 1, 2, 1]), [1, 1, 2, 3, 6, 8, 10]));
test('already sorted', () => assertDeepEq(quickSort([1, 2, 3]), [1, 2, 3]));
test('single element', () => assertDeepEq(quickSort([99]), [99]));

// Exercise 6 — Sort by custom comparator
// Implement sortBy(arr, compareFn) — just like Array.prototype.sort but using
// your own merge sort underneath. compareFn(a, b) returns negative / zero / positive.
//
// sortBy([{n:3},{n:1},{n:2}], (a,b) => a.n - b.n) → [{n:1},{n:2},{n:3}]
function sortBy(arr, compareFn) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Sort by comparator');
test('sort objects by .n ascending', () =>
  assertDeepEq(
    sortBy([{ n: 3 }, { n: 1 }, { n: 2 }], (a, b) => a.n - b.n),
    [{ n: 1 }, { n: 2 }, { n: 3 }],
  ));
test('sort strings by length', () =>
  assertDeepEq(
    sortBy(['banana', 'fig', 'apple'], (a, b) => a.length - b.length),
    ['fig', 'apple', 'banana'],
  ));
test('sort numbers descending', () =>
  assertDeepEq(
    sortBy([1, 4, 2, 3], (a, b) => b - a),
    [4, 3, 2, 1],
  ));
