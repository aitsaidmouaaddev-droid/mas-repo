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

function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ─── Exercise 1 — Bubble Sort ────────────────────────────────────────────────
//
// CONCEPT: Bubble Sort repeatedly steps through the list, compares adjacent
//          elements, and swaps them if they are in the wrong order. Each pass
//          "bubbles" the largest unsorted element to its final position.
// WHY:     Simple to understand and implement. The inner loop can be optimised
//          with an early-exit flag (no swaps → already sorted, O(n) best case).
// WHEN:    Almost never in production — O(n²) worst case. Useful for teaching
//          the concept of in-place comparison-based sorting.
// WHERE:   Interview explanations, embedded systems with tiny data sets.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // early exit — already sorted
  }
  return a;
}

console.log('\nLevel 1 — Bubble Sort');
test('[5,3,8,1,2] → [1,2,3,5,8]', () => assertDeepEq(bubbleSort([5, 3, 8, 1, 2]), [1, 2, 3, 5, 8]));
test('[1]         → [1]', () => assertDeepEq(bubbleSort([1]), [1]));
test('[]          → []', () => assertDeepEq(bubbleSort([]), []));
test('[3,1,2]     → [1,2,3]', () => assertDeepEq(bubbleSort([3, 1, 2]), [1, 2, 3]));
test('already sorted stays sorted', () =>
  assertDeepEq(bubbleSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]));
test('reverse order', () => assertDeepEq(bubbleSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]));

// ─── Exercise 2 — Selection Sort ─────────────────────────────────────────────
//
// CONCEPT: Selection Sort divides the array into a sorted and an unsorted region.
//          On each pass it scans the unsorted section, selects the minimum, and
//          swaps it to the boundary position. At most n−1 swaps are performed.
// WHY:     Minimises the number of writes — useful when writes are expensive
//          (e.g. flash memory). Simple invariant: after k passes, first k elements
//          are the k smallest in sorted order.
// WHEN:    Small arrays, memory-constrained environments.
// WHERE:   Embedded firmware, sorting arrays by a costly comparison (disk reads).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
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

// ─── Exercise 3 — Insertion Sort ─────────────────────────────────────────────
//
// CONCEPT: Insertion Sort builds a sorted portion one element at a time: take
//          the next element and shift larger sorted elements right until the
//          correct gap is found, then insert.
// WHY:     O(n) best case on nearly sorted data. Low constant factor, stable,
//          in-place, and excellent for small n. Used as the base case inside
//          Timsort (the engine behind Array.prototype.sort in V8).
// WHEN:    Incremental / online sorting, small sub-arrays inside hybrid sorts.
// WHERE:   Timsort small-run base, card-game hand sorting analogy.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

console.log('\nLevel 2 — Insertion Sort');
test('[12,11,13,5,6] → [5,6,11,12,13]', () =>
  assertDeepEq(insertionSort([12, 11, 13, 5, 6]), [5, 6, 11, 12, 13]));
test('[2,1]          → [1,2]', () => assertDeepEq(insertionSort([2, 1]), [1, 2]));
test('single element stays intact', () => assertDeepEq(insertionSort([42]), [42]));

// ─── Exercise 4 — Merge Sort ─────────────────────────────────────────────────
//
// CONCEPT: Merge Sort uses divide-and-conquer: split the array in half,
//          recursively sort each half, then merge the two sorted halves into
//          one sorted array. Guaranteed O(n log n) in all cases.
// WHY:     Stable sort with predictable performance. Better cache behaviour than
//          quick sort for large data sets accessed sequentially. Foundation of
//          external sorting (data that doesn't fit in RAM).
// WHEN:    Large datasets, linked lists, anywhere stability is required.
// WHERE:   External sort, database engines, git rebase conflict resolution.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let l = 0,
    r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return result.concat(left.slice(l)).concat(right.slice(r));
}

console.log('\nLevel 3 — Merge Sort');
test('[38,27,43,3,9,82,10] → [3,9,10,27,38,43,82]', () =>
  assertDeepEq(mergeSort([38, 27, 43, 3, 9, 82, 10]), [3, 9, 10, 27, 38, 43, 82]));
test('[5,2,4,6,1,3]        → [1,2,3,4,5,6]', () =>
  assertDeepEq(mergeSort([5, 2, 4, 6, 1, 3]), [1, 2, 3, 4, 5, 6]));
test('empty array', () => assertDeepEq(mergeSort([]), []));
test('one element', () => assertDeepEq(mergeSort([7]), [7]));

// ─── Exercise 5 — Quick Sort ──────────────────────────────────────────────────
//
// CONCEPT: Quick Sort picks a pivot, partitions elements into two groups
//          (< pivot and >= pivot), then recursively sorts each group.
//          Average O(n log n), worst-case O(n²) with a bad pivot choice.
// WHY:     Fastest average-case sort in practice for in-memory data due to
//          excellent cache locality. Pivot strategy (random, median-of-3) avoids
//          degenerate inputs.
// WHEN:    General-purpose in-memory sorting, fastest average case needed.
// WHERE:   libc qsort, many JS engine implementations (V8 uses Timsort now).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivotIdx = Math.floor(arr.length / 2);
  const pivot = arr[pivotIdx];
  const left = arr.filter((x, i) => i !== pivotIdx && x < pivot);
  const equal = arr.filter((x, i) => i !== pivotIdx && x === pivot);
  const right = arr.filter((x, i) => i !== pivotIdx && x > pivot);
  return [...quickSort(left), pivot, ...equal, ...quickSort(right)];
}

console.log('\nLevel 4 — Quick Sort');
test('[10,80,30,90,40,50,70] → [10,30,40,50,70,80,90]', () =>
  assertDeepEq(quickSort([10, 80, 30, 90, 40, 50, 70]), [10, 30, 40, 50, 70, 80, 90]));
test('[3,6,8,10,1,2,1]       → [1,1,2,3,6,8,10]', () =>
  assertDeepEq(quickSort([3, 6, 8, 10, 1, 2, 1]), [1, 1, 2, 3, 6, 8, 10]));
test('already sorted', () => assertDeepEq(quickSort([1, 2, 3]), [1, 2, 3]));
test('single element', () => assertDeepEq(quickSort([99]), [99]));

// ─── Exercise 6 — Sort by custom comparator ───────────────────────────────────
//
// CONCEPT: A comparator function (a, b) => number standardises ordering for
//          any data type. It abstracts the comparison logic out of the sorting
//          algorithm — the same mechanism used by Array.prototype.sort.
// WHY:     Separates "how to sort" from "what to compare", enabling reuse of a
//          single sort implementation across strings, objects, dates, etc.
// WHEN:    Sorting non-numeric data, multi-key sorts, locale-aware string sorting.
// WHERE:   Any sort call on non-number arrays: dates, objects, locale strings.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn

function sortBy(arr, compareFn) {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = sortBy(arr.slice(0, mid), compareFn);
  const right = sortBy(arr.slice(mid), compareFn);
  // merge with compareFn
  const result = [];
  let l = 0,
    r = 0;
  while (l < left.length && r < right.length) {
    if (compareFn(left[l], right[r]) <= 0) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return result.concat(left.slice(l)).concat(right.slice(r));
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
