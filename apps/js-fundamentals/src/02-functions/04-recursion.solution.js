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

// ─── Exercise 1 — factorial ──────────────────────────────────────────────────
//
// CONCEPT: Recursion — a function that calls itself with a smaller input,
//          converging toward a base case that stops the recursion.
// WHY:     Some problems (factorial, tree traversal, parsing) have a naturally
//          recursive structure. Expressing them recursively matches the problem
//          shape and is often cleaner than an iterative equivalent.
// WHEN:    Tree/graph traversal, divide-and-conquer algorithms, parsers,
//          mathematical sequences with self-similar definitions.
// WHERE:   File-system walkers, JSON parsers, AST transformers, merge sort,
//          quicksort, DOM tree traversal.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// ─── Exercise 2 — flatten ────────────────────────────────────────────────────
//
// CONCEPT: Recursive array traversal — each call handles one level, then
//          delegates deeper levels to recursive calls.
// WHY:     The depth of nesting is unknown at call time; recursion naturally
//          handles arbitrary depth without a fixed loop count.
// WHEN:    Normalising nested API data, flattening category trees, processing
//          arbitrarily-deep config structures.
// WHERE:   Lodash _.flattenDeep, Array.prototype.flat(Infinity), Webpack's
//          module dependency resolution, Redux's reducer composition.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // recurse into nested arrays
    } else {
      result.push(item);
    }
  }
  return result;
}

// ─── Exercise 3 — treeSum ────────────────────────────────────────────────────
//
// CONCEPT: Recursive tree traversal — visit the current node then recurse into
//          each child, accumulating a result across the whole tree.
// WHY:     Tree data structures are defined recursively (each child is itself
//          a tree), so a recursive function mirrors the structure exactly.
// WHEN:    DOM traversal, category-tree aggregation, org-chart roll-ups,
//          file-system size calculation, AST analysis.
// WHERE:   React's virtual DOM diffing, directory-size CLIs, nested comment
//          thread aggregation, ESLint AST visitors.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Recursion
function treeSum(node) {
  return node.value + node.children.reduce((acc, child) => acc + treeSum(child), 0);
}

// ─── Exercise 4 — fib (with memoization) ─────────────────────────────────────
//
// CONCEPT: Memoized recursion — caching intermediate results to convert an
//          exponential-time algorithm into a linear-time one.
//          Without memoization, fib(n) computes fib(n-2) and fib(n-1)
//          independently, causing an explosion of repeated sub-calls.
// WHY:     fib(50) would take seconds without memoization; with a Map cache,
//          each value is computed exactly once. This is the canonical example
//          of dynamic programming via top-down memoization.
// WHEN:    Any recursive function with overlapping sub-problems: coin change,
//          longest common subsequence, grid path counting.
// WHERE:   React.useMemo, reselect selectors, dynamic programming problems,
//          compiler optimisation passes that cache partial results.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
function fib(n) {
  const memo = new Map();
  function _fib(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (memo.has(n)) return memo.get(n);
    const result = _fib(n - 1) + _fib(n - 2);
    memo.set(n, result);
    return result;
  }
  return _fib(n);
}

// ─── Exercise 5 — trampoline ─────────────────────────────────────────────────
//
// CONCEPT: The trampoline pattern eliminates stack frames from tail-recursive
//          functions. Instead of recursing directly, the function returns a
//          thunk (a zero-argument function). The trampoline loop calls thunks
//          iteratively until a non-function (the final value) is returned.
// WHY:     JavaScript does not guarantee tail-call optimisation (TCO) in most
//          engines. A naive recursive factorial(10000) will throw a stack
//          overflow. Trampolining gives you the clarity of recursion without
//          the stack depth penalty.
// WHEN:    Deep recursion that risks stack overflow: large factorial, deep tree
//          traversal, parsing very long sequences, continuation-passing style.
// WHERE:   Trampolining is common in Clojure (trampoline is a built-in),
//          functional JS libraries, compiler output for tail-recursive langs
//          targeting JS, state-machine runners.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Call_stack
function trampoline(fn) {
  return function (...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result(); // call the thunk, get the next thunk or final value
    }
    return result;
  };
}

console.log('\nLevel 1 — factorial');
test('factorial(5) → 120', () => assertEq(factorial(5), 120));
test('factorial(0) → 1', () => assertEq(factorial(0), 1));
test('factorial(1) → 1', () => assertEq(factorial(1), 1));

console.log('\nLevel 2 — flatten');
test('[1,[2,[3,[4]]]] → [1,2,3,4]', () => assertDeepEq(flatten([1, [2, [3, [4]]]]), [1, 2, 3, 4]));
test('already flat', () => assertDeepEq(flatten([1, 2, 3]), [1, 2, 3]));
test('empty array', () => assertDeepEq(flatten([]), []));

console.log('\nLevel 3 — treeSum');
test('single node → value', () => assertEq(treeSum({ value: 5, children: [] }), 5));
test('small tree sums all values', () => {
  const tree = {
    value: 1,
    children: [
      { value: 2, children: [] },
      { value: 3, children: [{ value: 4, children: [] }] },
    ],
  };
  assertEq(treeSum(tree), 10);
});

console.log('\nLevel 4 — fib with memoization');
test('fib(0) → 0', () => assertEq(fib(0), 0));
test('fib(1) → 1', () => assertEq(fib(1), 1));
test('fib(10) → 55', () => assertEq(fib(10), 55));

console.log('\nLevel 5 — trampoline');
test('trampoline: factTramp(5) → 120', () => {
  const factTramp = trampoline(function fact(n, acc = 1) {
    return n <= 1 ? acc : () => fact(n - 1, n * acc);
  });
  assertEq(factTramp(5), 120);
});
test('trampoline: factTramp(1) → 1', () => {
  const factTramp = trampoline(function fact(n, acc = 1) {
    return n <= 1 ? acc : () => fact(n - 1, n * acc);
  });
  assertEq(factTramp(1), 1);
});
test('trampoline: non-function result returned immediately', () => {
  const identity = trampoline((x) => x);
  assertEq(identity(42), 42);
});
