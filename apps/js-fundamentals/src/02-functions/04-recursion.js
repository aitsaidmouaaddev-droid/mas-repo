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

// Exercise 1 — factorial
// Compute n! recursively. Base case: n <= 1 returns 1.
function factorial(n) {
  // YOUR CODE HERE
}

// Exercise 2 — flatten
// Recursively flatten an arbitrarily nested array. Do not use .flat(Infinity).
function flatten(arr) {
  // YOUR CODE HERE
}

// Exercise 3 — treeSum
// Sum all `value` properties in a tree.
// Node shape: { value: number, children: node[] }
// Recurse into each child.
function treeSum(node) {
  // YOUR CODE HERE
}

// Exercise 4 — fib (with memoization)
// Compute the nth Fibonacci number. fib(0) = 0, fib(1) = 1.
// Store computed results in a Map to avoid exponential blowup.
function fib(n) {
  // YOUR CODE HERE
  // Hint: define a Map and a recursive helper inside this function.
}

// Exercise 5 — trampoline
// Implement the trampoline pattern:
// If the result is a function, call it. Keep going until the result is NOT a function.
// This enables tail-recursive style without blowing the call stack.
//
// Example usage:
//   const factTramp = trampoline(function fact(n, acc = 1) {
//     return n <= 1 ? acc : () => fact(n - 1, n * acc);
//   });
//   factTramp(5) === 120
function trampoline(fn) {
  // YOUR CODE HERE
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
