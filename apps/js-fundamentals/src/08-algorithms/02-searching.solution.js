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

// ─── Exercise 1 — Linear Search ──────────────────────────────────────────────
//
// CONCEPT: Linear search (sequential search) inspects each element one by one
//          from start to end until the target is found or the array is exhausted.
//          O(n) time, O(1) space — no requirement that the data be sorted.
// WHY:     The only feasible approach for unsorted data. Also optimal when you
//          expect the target near the front (short lists, hot items first).
// WHEN:    Unsorted arrays, searching with complex predicates, tiny data sets.
// WHERE:   Array.prototype.find, Array.prototype.findIndex internally.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

function linearSearch(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
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

// ─── Exercise 2 — Binary Search (iterative) ──────────────────────────────────
//
// CONCEPT: Binary search exploits the sorted order to eliminate half of the
//          remaining candidates with each comparison. Maintain a [lo, hi] window
//          and repeatedly check the midpoint — O(log n) time, O(1) space.
// WHY:     Dramatically faster than linear search for large sorted datasets.
//          Searching 1 million elements takes at most ~20 comparisons.
// WHEN:    Any time you need to search a sorted collection repeatedly.
// WHERE:   Database indexes, dictionary lookups, IP routing tables, git bisect.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

function binarySearch(arr, target) {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1; // unsigned right shift avoids overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

console.log('\nLevel 2 — Binary Search');
test('finds middle element', () => assertEq(binarySearch([1, 3, 5, 7, 9, 11], 7), 3));
test('finds first element', () => assertEq(binarySearch([2, 4, 6, 8], 2), 0));
test('finds last element', () => assertEq(binarySearch([2, 4, 6, 8], 8), 3));
test('returns -1 when not found', () => assertEq(binarySearch([1, 3, 5], 4), -1));
test('single-element match', () => assertEq(binarySearch([42], 42), 0));
test('empty array returns -1', () => assertEq(binarySearch([], 1), -1));

// ─── Exercise 3 — Count occurrences ──────────────────────────────────────────
//
// CONCEPT: Use binary search twice — once to find the leftmost index where the
//          target appears, once for the rightmost. The count is rightmost − leftmost + 1.
//          This is the "lower bound / upper bound" technique from C++ STL.
// WHY:     O(log n) instead of O(n) for a sorted array. Same idea used to find
//          ranges in database indexes.
// WHEN:    Counting duplicates in large sorted arrays, range queries on sorted data.
// WHERE:   SQL BETWEEN queries, time-series range lookups.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

function countOccurrences(arr, target) {
  // Find the leftmost index of target
  function lowerBound() {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  // Find the first index AFTER the last occurrence
  function upperBound() {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const left = lowerBound();
  const right = upperBound();
  // Verify element actually exists at lower bound
  if (left >= arr.length || arr[left] !== target) return 0;
  return right - left;
}

console.log('\nLevel 2 — Count Occurrences');
test('3 twos in [1,1,2,2,2,3]', () => assertEq(countOccurrences([1, 1, 2, 2, 2, 3], 2), 3));
test('2 ones in [1,1,2,3]', () => assertEq(countOccurrences([1, 1, 2, 3], 1), 2));
test('value not present → 0', () => assertEq(countOccurrences([1, 2, 3], 5), 0));
test('all same value', () => assertEq(countOccurrences([4, 4, 4], 4), 3));

// ─── Exercise 4 — Binary Search on a Rotated Sorted Array ────────────────────
//
// CONCEPT: In a rotated sorted array one half is always sorted. Check which
//          half is sorted, determine whether the target lies in that half, then
//          eliminate the other half — preserving O(log n) behaviour.
// WHY:     A common interview question that tests whether you can adapt standard
//          binary search to a broken invariant.
// WHEN:    Searching in circular buffers, time-wrapping log files,
//          any "almost sorted" data.
// WHERE:   Log rotation, circular queues, LeetCode 33.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

function searchRotated(arr, target) {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] === target) return mid;
    // Left half is sorted
    if (arr[lo] <= arr[mid]) {
      if (arr[lo] <= target && target < arr[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half is sorted
      if (arr[mid] < target && target <= arr[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

console.log('\nLevel 3 — Search Rotated Array');
test('[4,5,6,7,0,1,2] target=0  → 4', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4));
test('[4,5,6,7,0,1,2] target=4  → 0', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 4), 0));
test('[4,5,6,7,0,1,2] target=3  →-1', () => assertEq(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1));
test('[1] target=0               →-1', () => assertEq(searchRotated([1], 0), -1));
test('[1] target=1               → 0', () => assertEq(searchRotated([1], 1), 0));
test('[3,1] target=1             → 1', () => assertEq(searchRotated([3, 1], 1), 1));

// ─── Exercise 5 — Find Peak Element ──────────────────────────────────────────
//
// CONCEPT: Use binary search on the gradient: if arr[mid] < arr[mid+1] the peak
//          must lie to the right; otherwise it lies to the left (or at mid).
//          This reduces an O(n) scan to O(log n).
// WHY:     The key insight is that a local peak always exists in any finite
//          sequence — a mathematical guarantee that lets us discard half the
//          candidates at every step.
// WHEN:    Finding local maxima without a full scan: signal peaks, A/B test
//          lift peaks, sensor data.
// WHERE:   LeetCode 162, signal processing, gradient descent convergence checks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max

function findPeak(arr) {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < arr[mid + 1])
      lo = mid + 1; // ascending — peak is to the right
    else hi = mid; // descending — peak is here or left
  }
  return lo;
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

// ─── Exercise 6 — Kth Smallest in Two Sorted Arrays ──────────────────────────
//
// CONCEPT: Binary search on the partition point of the smaller array. For any
//          split (i elements from arr1, k−i from arr2) check if it forms a valid
//          median-style partition where max(left) <= min(right). O(log(min(m,n))).
// WHY:     The naive merge approach is O(m+n). The binary search approach finds
//          the answer without constructing the merged array.
// WHEN:    Median of two sorted arrays (k = (m+n)/2), database join statistics.
// WHERE:   LeetCode 4, database query planners, statistical quantile computation.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min

function kthSmallest(arr1, arr2, k) {
  // Ensure arr1 is the shorter array to minimise binary search range
  if (arr1.length > arr2.length) return kthSmallest(arr2, arr1, k);
  const m = arr1.length,
    n = arr2.length;
  let lo = Math.max(0, k - n),
    hi = Math.min(k, m);
  while (lo <= hi) {
    const i = (lo + hi) >>> 1; // elements taken from arr1
    const j = k - i; // elements taken from arr2
    const maxLeft1 = i === 0 ? -Infinity : arr1[i - 1];
    const maxLeft2 = j === 0 ? -Infinity : arr2[j - 1];
    const minRight1 = i === m ? Infinity : arr1[i];
    const minRight2 = j === n ? Infinity : arr2[j];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      return Math.max(maxLeft1, maxLeft2);
    } else if (maxLeft1 > minRight2) {
      hi = i - 1;
    } else {
      lo = i + 1;
    }
  }
  return -1; // unreachable for valid inputs
}

console.log('\nLevel 4 — Kth Smallest in Two Sorted Arrays');
test('k=4 in [1,3]+[2,4,5,6] → 4', () => assertEq(kthSmallest([1, 3], [2, 4, 5, 6], 4), 4));
test('k=1 → smallest overall', () => assertEq(kthSmallest([1, 2], [3, 4], 1), 1));
test('k=4 → largest overall', () => assertEq(kthSmallest([1, 2], [3, 4], 4), 4));
test('k=3 in [2,3,6,7]+[1,4,8,9]', () => assertEq(kthSmallest([2, 3, 6, 7], [1, 4, 8, 9], 3), 3));
