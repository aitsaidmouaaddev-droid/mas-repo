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

// Exercise 1 — Function Declaration
// Declare a function add(a, b) that returns the sum of a and b
function add(a, b) {
  // YOUR CODE HERE
}

// Exercise 2 — Arrow Function
// Declare an arrow function addArrow that does the same as add
const addArrow = (a, b) => {
  // YOUR CODE HERE
};

// Exercise 3 — Default Parameter
// Declare greet(name) where name defaults to 'World'
// Return 'Hello, {name}!'
function greet(name = 'World') {
  // YOUR CODE HERE
}

// Exercise 4 — Rest Parameter
// Declare sum(...nums) that adds all arguments together
// sum() with no arguments should return 0
function sum(...nums) {
  // YOUR CODE HERE
}

// Exercise 5 — Hoisting
// hoistTest() must call inner() BEFORE inner is defined in the body
// Use a function declaration for inner (not an arrow) so hoisting applies
function hoistTest() {
  // YOUR CODE HERE — call inner() here and return its result
  // then define inner below this line:
}

console.log('\nLevel 1 — Declarations & Arrows');
test('add(2, 3) → 5', () => assertEq(add(2, 3), 5));
test('add(-1, 1) → 0', () => assertEq(add(-1, 1), 0));
test('addArrow(2, 3) → 5', () => assertEq(addArrow(2, 3), 5));
test('addArrow(-1, 1) → 0', () => assertEq(addArrow(-1, 1), 0));

console.log('\nLevel 2 — Default & Rest');
test("greet() → 'Hello, World!'", () => assertEq(greet(), 'Hello, World!'));
test("greet('Ali') → 'Hello, Ali!'", () => assertEq(greet('Ali'), 'Hello, Ali!'));
test('sum(1, 2, 3) → 6', () => assertEq(sum(1, 2, 3), 6));
test('sum() → 0', () => assertEq(sum(), 0));
test('sum(5) → 5', () => assertEq(sum(5), 5));

console.log('\nLevel 3 — Hoisting');
test('hoistTest() → 42', () => assertEq(hoistTest(), 42));
