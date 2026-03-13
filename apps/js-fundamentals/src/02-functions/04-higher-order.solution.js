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

// ─── Exercise 1 — myMap ──────────────────────────────────────────────────────
//
// CONCEPT: Higher-order functions — functions that take functions as arguments
// WHY:     .map() is a transformation abstraction: apply a function to every
//          element and collect results. Implementing it from scratch reveals
//          it's just a for loop with a callback. The callback contract
//          (item, index, arr) is part of the ECMAScript spec and is consistent
//          across map/filter/forEach.
// WHEN:    Any time you need to transform every element of an array into a new
//          value without mutating the original.
// WHERE:   React component lists (array.map(item => <Component />)), API
//          response normalization, data pipeline transformations.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
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

// ─── Exercise 2 — myFilter ───────────────────────────────────────────────────
//
// CONCEPT: Predicate-based selection — higher-order functions for filtering
// WHY:     .filter() applies a predicate (a function returning boolean) to each
//          element and keeps only those for which it returns true. The result
//          is always a new array; the original is never mutated. This is the
//          cornerstone of declarative data selection.
// WHEN:    Removing items from lists, search result filtering, permission-based
//          rendering (filter out items user can't see), dead code elimination.
// WHERE:   Redux selectors, React list rendering, lodash.filter, SQL-like data
//          querying in memory, Elasticsearch query builders.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

function myFilter(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
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

// ─── Exercise 3 — myReduce ───────────────────────────────────────────────────
//
// CONCEPT: Fold / accumulate — the most general array higher-order function
// WHY:     reduce is the Swiss Army knife of array HOFs. map and filter can
//          both be implemented with reduce. It walks the array, threading an
//          accumulator through each step. When no initial value is given, the
//          spec uses index 0 as acc and starts at index 1.
// WHEN:    Summing, tallying frequencies, building objects from arrays,
//          flattening, computing running totals, building pipelines.
// WHERE:   Redux reducer (literally named after this pattern), Lodash's
//          _.reduce, React's useReducer hook, functional data pipelines.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

function myReduce(arr, fn, init) {
  let acc;
  let startIndex;

  if (init !== undefined) {
    acc = init;
    startIndex = 0;
  } else {
    // No initial value: use first element as accumulator, start from index 1
    if (arr.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = arr[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr);
  }
  return acc;
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

// ─── Exercise 4 — pipe ───────────────────────────────────────────────────────
//
// CONCEPT: Function composition (left-to-right) using reduce
// WHY:     pipe is reduce over a list of functions: start with the input value,
//          then thread it through each function in order. This is the functional
//          programming "pipeline" pattern. It's the opposite of compose (which
//          goes right-to-left, like mathematical function composition).
// WHEN:    Data transformation pipelines, middleware chains, build step
//          orchestration, creating reusable processing steps.
// WHERE:   RxJS pipe() operator, Node.js stream .pipe(), Redux middleware chain,
//          fp-ts pipe, Ramda pipe, Angular async pipes.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

function pipe(...fns) {
  // If no functions, return identity
  if (fns.length === 0) return (x) => x;
  // Use reduce to thread the value through each function left-to-right
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
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
