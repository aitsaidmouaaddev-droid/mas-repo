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

// ─── Exercise 1 — findFirst ───────────────────────────────────────────────────
//
// CONCEPT: Array.prototype.find returns the first element for which the
//          callback returns a truthy value, or undefined if none match.
// WHY:     Short-circuits on the first match — more efficient than filter()[0].
// WHEN:    Looking up a single record by id, finding the first failing item.
// WHERE:   Form validation, lookup tables, event queues.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
function findFirst(arr, predicate) {
  return arr.find(predicate);
}

// ─── Exercise 2 — chunk ───────────────────────────────────────────────────────
//
// CONCEPT: Iterate with a step equal to chunk size, slicing sub-arrays at each
//          step. The final slice naturally captures any remainder.
// WHY:     Batching is ubiquitous — API pagination, rendering virtualised lists,
//          processing large datasets without overloading memory.
// WHEN:    Any time you need to process or display data in fixed-size groups.
// WHERE:   Pagination, batch API calls, grid layouts.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Exercise 3 — zip ─────────────────────────────────────────────────────────
//
// CONCEPT: Pair corresponding elements from two arrays by index. The output
//          length is capped to the shorter input (like Python's zip).
// WHY:     Combines parallel data sources without a shared key; great for
//          combining labels with values, or two aligned streams.
// WHEN:    Merging x/y coordinate arrays, pairing questions with answers.
// WHERE:   Chart libraries, form field builders, CSV column alignment.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
function zip(a, b) {
  const len = Math.min(a.length, b.length);
  return Array.from({ length: len }, (_, i) => [a[i], b[i]]);
}

// ─── Exercise 4 — partition ───────────────────────────────────────────────────
//
// CONCEPT: Split a collection into two groups — those that pass a predicate
//          and those that fail — in a single pass using reduce.
// WHY:     More efficient than two separate filter calls; keeps intent clear.
// WHEN:    Separating valid from invalid inputs, splitting tasks by priority.
// WHERE:   Form validation, feature flags, task schedulers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function partition(arr, predicate) {
  return arr.reduce(
    ([pass, fail], item) => (predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]]),
    [[], []],
  );
}

// ─── Exercise 5 — sliding ─────────────────────────────────────────────────────
//
// CONCEPT: A sliding (rolling) window moves one position at a time across the
//          array, producing overlapping sub-arrays of a fixed size.
// WHY:     Essential in signal processing, time-series analytics, and any
//          algorithm that needs local context around each element.
// WHEN:    Moving averages, n-gram generation, diff/patch algorithms.
// WHERE:   Financial charts, NLP tokenisation, audio processing.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
function sliding(arr, size) {
  const result = [];
  for (let i = 0; i <= arr.length - size; i++) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Exercise 6 — asyncMap ────────────────────────────────────────────────────
//
// CONCEPT: Promise.all takes an array of Promises and resolves to an array of
//          their results, running all in parallel (not sequentially).
// WHY:     Sequential awaits add latency equal to the sum of all durations;
//          Promise.all reduces total wait to the slowest single operation.
// WHEN:    Fetching multiple independent resources, running parallel DB queries.
// WHERE:   API gateways, data loaders (GraphQL), test suites.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
async function asyncMap(arr, asyncFn) {
  return Promise.all(arr.map(asyncFn));
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
