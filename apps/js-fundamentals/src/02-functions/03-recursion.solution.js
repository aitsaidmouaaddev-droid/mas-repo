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

// ─── Exercise 1 — Recursive Factorial ────────────────────────────────────────
//
// CONCEPT: Recursion with a base case and recursive case
// WHY:     Recursion is a function calling itself with a smaller subproblem.
//          Every recursive function needs: (1) a base case that stops recursion,
//          and (2) a recursive case that moves toward the base case. Factorial
//          is the canonical introductory example.
// WHEN:    Problems that decompose naturally into smaller identical subproblems:
//          tree traversal, graph DFS, divide-and-conquer algorithms, parsing.
// WHERE:   Parser generators, AST traversal (Babel, ESLint), file system walkers,
//          combinatorial algorithms, math libraries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#recursion

function factorial(n) {
  if (n <= 1) return 1; // base case
  return n * factorial(n - 1); // recursive case: n * (n-1)!
}

console.log('\nLevel 1 — factorial');
test('0! = 1', () => assertEq(factorial(0), 1));
test('1! = 1', () => assertEq(factorial(1), 1));
test('5! = 120', () => assertEq(factorial(5), 120));
test('10! = 3628800', () => assertEq(factorial(10), 3628800));

// ─── Exercise 2 — Deep Flatten ───────────────────────────────────────────────
//
// CONCEPT: Recursive tree traversal with Array.isArray guard
// WHY:     An array can contain arrays which can contain arrays — a tree
//          structure. Recursion naturally mirrors this structure. For each
//          element: if it's an array, recurse into it; if it's a primitive,
//          push it. Array.isArray is the correct guard (typeof [] === 'object').
// WHEN:    Flattening data from APIs (nested categories, file trees), processing
//          recursive data structures, normalizing deeply nested state.
// WHERE:   Redux normalizr, GraphQL response flattening, file system tree
//          walkers, webpack module dependency graphs.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray

function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      // Recurse: spread the flattened sub-array into result
      const flat = flatten(item);
      for (const x of flat) result.push(x);
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log('\nLevel 2 — flatten');
test('[1,[2,3]] → [1,2,3]', () => assertDeepEq(flatten([1, [2, 3]]), [1, 2, 3]));
test('[[1,[2]],[3]] → [1,2,3]', () => assertDeepEq(flatten([[1, [2]], [3]]), [1, 2, 3]));
test('already flat', () => assertDeepEq(flatten([1, 2, 3]), [1, 2, 3]));
test('empty array', () => assertDeepEq(flatten([]), []));
test('deeply nested [[[[[1]]]]]', () => assertDeepEq(flatten([[[[[1]]]]]), [1]));
test('mixed depth', () => assertDeepEq(flatten([1, [2, [3, [4, 5]]]]), [1, 2, 3, 4, 5]));

// ─── Exercise 3 — Deep Clone ─────────────────────────────────────────────────
//
// CONCEPT: Recursive structural copy with type discrimination
// WHY:     Object/array assignment in JS is by reference — mutations affect the
//          original. A true deep clone requires creating new containers and
//          recursing into nested values. JSON.parse/stringify is the quick hack
//          but drops undefined, functions, Dates, and circular refs. A proper
//          recursive clone handles all plain-data types.
// WHEN:    Immutable state updates (Redux), test fixture isolation, undo/redo
//          stacks, API response caching without shared mutation risk.
// WHERE:   Lodash's _.cloneDeep, Immer (structural sharing variant),
//          Redux Toolkit's state cloning, Jest's deep equality utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/structuredClone

function deepClone(val) {
  if (val === null || typeof val !== 'object') return val; // primitives

  if (Array.isArray(val)) {
    return val.map(deepClone); // recurse into each element
  }

  // Plain object: clone each own enumerable property
  const clone = {};
  for (const key of Object.keys(val)) {
    clone[key] = deepClone(val[key]);
  }
  return clone;
}

console.log('\nLevel 3 — deepClone');
test('primitive returned as-is', () => assertEq(deepClone(42), 42));
test('string returned as-is', () => assertEq(deepClone('hi'), 'hi'));
test('null returned as-is', () => assertEq(deepClone(null), null));
test('flat object cloned', () => {
  const obj = { a: 1, b: 2 };
  const clone = deepClone(obj);
  assertDeepEq(clone, obj);
  clone.a = 99;
  assertEq(obj.a, 1);
});
test('nested object cloned deeply', () => {
  const obj = { a: { b: { c: 42 } } };
  const clone = deepClone(obj);
  clone.a.b.c = 0;
  assertEq(obj.a.b.c, 42);
});
test('array cloned', () => {
  const arr = [1, [2, [3]]];
  const clone = deepClone(arr);
  clone[1][0] = 99;
  assertEq(arr[1][0], 2);
});
test('mixed object/array', () => {
  const val = { items: [1, { x: 2 }] };
  const clone = deepClone(val);
  assertDeepEq(clone, val);
  clone.items[1].x = 999;
  assertEq(val.items[1].x, 2);
});

// ─── Exercise 4 — Trampoline ─────────────────────────────────────────────────
//
// CONCEPT: Trampoline — converting recursion to iteration to prevent stack overflow
// WHY:     JS engines have a limited call stack (~10k–15k frames). Deep recursion
//          throws "Maximum call stack size exceeded". Trampolining converts the
//          recursive call into a thunk (a zero-argument function) that is returned
//          instead of called. The trampoline loop calls thunks one at a time on
//          the HEAP (while loop), never deepening the call stack.
// WHEN:    Tail-recursive algorithms over large inputs: factorial(10000),
//          mutual recursion, interpreters walking deep ASTs, CPS-style parsers.
// WHERE:   Functional languages that compile to JS (Elm, ClojureScript,
//          PureScript) use trampolining internally. Ramda's internal lazy
//          transducers use a similar bounce mechanism.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Recursion

function trampoline(fn) {
  // If the initial value is already not a function, return it immediately
  let result = fn;
  // Keep calling as long as result is a function (a thunk)
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

function trampolinedFactorial(n) {
  function factHelper(n, acc) {
    if (n <= 1) return acc;
    // Return a thunk instead of recursing — trampoline will call it
    return () => factHelper(n - 1, n * acc);
  }
  return trampoline(factHelper(n, 1));
}

console.log('\nLevel 5 — trampoline');
test('trampoline with simple thunk chain', () => {
  function countdown(n) {
    if (n === 0) return 'done';
    return () => countdown(n - 1);
  }
  assertEq(trampoline(countdown(5)), 'done');
});
test('trampoline returns non-function immediately', () => {
  assertEq(trampoline(42), 42);
  assertEq(trampoline('hello'), 'hello');
});
test('trampolinedFactorial(10) = 3628800', () => assertEq(trampolinedFactorial(10), 3628800));
test('trampolinedFactorial(10000) does not throw (stack safe)', () => {
  const result = trampolinedFactorial(10000);
  assert(typeof result === 'number' && isFinite(result) && result > 0);
});
