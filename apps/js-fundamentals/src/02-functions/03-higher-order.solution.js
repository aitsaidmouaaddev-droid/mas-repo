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

// ─── Exercise 1 — myMap ──────────────────────────────────────────────────────
//
// CONCEPT: Higher-order functions — functions that take other functions as
//          arguments or return them. myMap is the canonical example: it
//          abstracts the "iterate and transform" loop into a reusable pattern.
// WHY:     Writing explicit for-loops mixes iteration logic with transformation
//          logic. Separating them makes code easier to read, test, and reuse.
// WHEN:    Any time you need to transform every element of a collection:
//          normalising API responses, rendering lists in React, formatting data.
// WHERE:   Array.prototype.map (built-in), Lodash _.map, RxJS map operator,
//          React component list rendering with .map().
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}

// ─── Exercise 2 — myFilter ───────────────────────────────────────────────────
//
// CONCEPT: Higher-order function for selection — abstracts the "iterate and
//          conditionally keep" pattern into a reusable operation.
// WHY:     A predicate function describes WHAT to keep, while filter handles
//          HOW to iterate. Separating concerns makes predicates independently
//          testable and composable.
// WHEN:    Removing invalid entries from a list, selecting items matching a
//          search term, hiding completed tasks, filtering API results.
// WHERE:   Array.prototype.filter, Redux selectors, SQL WHERE clauses mapped
//          to JS, form validation (keep only invalid fields).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
function myFilter(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i, arr)) result.push(arr[i]);
  }
  return result;
}

// ─── Exercise 3 — myReduce ───────────────────────────────────────────────────
//
// CONCEPT: Higher-order function for aggregation — collapses a collection into
//          a single accumulated value by repeatedly applying a combining function.
// WHY:     Reduce is the most powerful of the trio (map/filter/reduce) — map and
//          filter can both be implemented using reduce. It expresses aggregation
//          intent clearly without mutable accumulator variables scattered around.
// WHEN:    Summing, counting, building objects from arrays, flattening,
//          composing functions, computing running totals.
// WHERE:   Array.prototype.reduce, Redux (state = reducer(state, action)),
//          Lodash _.reduce, transducer libraries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function myReduce(arr, fn, init) {
  let acc = init;
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr);
  }
  return acc;
}

// ─── Exercise 4 — compose ────────────────────────────────────────────────────
//
// CONCEPT: Right-to-left function composition — combining multiple single-
//          purpose functions into one pipeline. compose(f, g, h)(x) = f(g(h(x))).
//          Matches mathematical function notation: (f ∘ g)(x).
// WHY:     Composition is the primary tool for building complex behaviour from
//          simple pieces without nesting calls or creating intermediate variables.
//          Right-to-left mirrors math notation and is idiomatic in Haskell/FP.
// WHEN:    Data transformation pipelines, middleware stacks, selector chains,
//          anywhere you need to combine pure functions.
// WHERE:   Redux compose() (composeEnhancers), Ramda compose, Lodash flowRight,
//          functional programming libraries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

// ─── Exercise 5 — pipe ───────────────────────────────────────────────────────
//
// CONCEPT: Left-to-right function composition — same as compose but in the
//          order you read it. pipe(f, g, h)(x) = h(g(f(x))).
// WHY:     Pipe reads in the natural direction for most programmers (top to
//          bottom, left to right), making pipelines easier to follow than
//          deeply nested calls or compose chains.
// WHEN:    Anywhere compose applies but readability is the priority. Pipe is
//          more common in practice because it reads naturally.
// WHERE:   Lodash flow, Ramda pipe, RxJS pipe(), tc39 pipeline operator proposal
//          (|>), Unix shell pipes, Express/Koa middleware chains.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
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
