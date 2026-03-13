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

// ─── Exercise 1 — doubleAll ───────────────────────────────────────────────────
//
// CONCEPT: Array.prototype.map transforms every element via a callback and
//          returns a brand-new array of the same length.
// WHY:     Avoids manual loops and mutations; declarative and composable.
// WHEN:    Any time you need a 1-to-1 element transformation.
// WHERE:   Data normalisation, rendering lists, unit conversions.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
function doubleAll(arr) {
  return arr.map((x) => x * 2);
}

// ─── Exercise 2 — getEvens ────────────────────────────────────────────────────
//
// CONCEPT: Array.prototype.filter returns a new array containing only elements
//          for which the callback returns true.
// WHY:     Keeps code expressive — the predicate reads like a sentence.
// WHEN:    Selecting a subset of a collection based on a condition.
// WHERE:   Search results, access control, data validation pipelines.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
function getEvens(arr) {
  return arr.filter((x) => x % 2 === 0);
}

// ─── Exercise 3 — sumAll ──────────────────────────────────────────────────────
//
// CONCEPT: Array.prototype.reduce folds an array into a single accumulated
//          value by applying a callback to each element and the running total.
// WHY:     More expressive than a manual loop counter; composable with other
//          array methods.
// WHEN:    Aggregating — summing, counting, building objects/maps.
// WHERE:   Shopping carts, statistics, state reducers (Redux).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function sumAll(arr) {
  return arr.reduce((acc, x) => acc + x, 0);
}

// ─── Exercise 4 — groupBy ─────────────────────────────────────────────────────
//
// CONCEPT: reduce can build a plain object (dictionary/map) by accumulating
//          entries under computed keys — the foundation of groupBy.
// WHY:     Transforms a flat list into a structured lookup in one pass.
// WHEN:    Categorising data: group orders by status, messages by sender, etc.
// WHERE:   Analytics dashboards, report generation, data pipelines.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

// ─── Exercise 5 — flatMap ─────────────────────────────────────────────────────
//
// CONCEPT: flatMap is map followed by a single level of flattening. Each
//          callback invocation can return an array, and the results are
//          concatenated into one flat output array.
// WHY:     Avoids the intermediate array from a separate .flat() call;
//          natural for one-to-many transformations.
// WHEN:    Expanding rows into sub-rows, tokenising strings, graph traversal.
// WHERE:   Compilers/parsers, data enrichment, React list rendering helpers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
function flatMap(arr, fn) {
  return arr.reduce((acc, item) => acc.concat(fn(item)), []);
}

// ─── Exercise 6 — unique ──────────────────────────────────────────────────────
//
// CONCEPT: A Set stores only unique values. Spreading it back into an array
//          produces a deduplicated list while preserving insertion order.
// WHY:     O(n) time; cleaner than nested-loop or indexOf approaches.
// WHEN:    Removing duplicate IDs, tags, or primitive values.
// WHERE:   Tag clouds, autocomplete suggestions, deduplicating API responses.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function unique(arr) {
  return [...new Set(arr)];
}

// ─── Exercise 7 — sortBy ──────────────────────────────────────────────────────
//
// CONCEPT: Array.prototype.sort with a custom comparator. Sorting by multiple
//          keys is achieved by checking successive keys only when earlier ones
//          are equal (comparator returns 0).
// WHY:     Keeps objects in a stable, predictable order without external libs.
// WHEN:    Sorting tables by column, ranking search results, ordering tasks.
// WHERE:   Data grids, leaderboards, calendar/scheduler views.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function sortBy(arr, ...keys) {
  return [...arr].sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });
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
