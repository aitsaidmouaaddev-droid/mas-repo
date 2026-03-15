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

// ─── Exercise 1 — Function Declaration ───────────────────────────────────────
//
// CONCEPT: A function declaration is the classic `function name() {}` syntax.
//          It is hoisted entirely — name AND body — to the top of its scope.
// WHY:     Understanding the difference between declaration vs expression vs
//          arrow matters when debugging "not a function" reference errors.
// WHEN:    Use declarations for named, reusable utilities; expressions/arrows
//          when you need to assign, pass, or conditionally define a function.
// WHERE:   Everywhere — utility modules, Node.js scripts, class methods.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function
function add(a, b) {
  return a + b;
}

// ─── Exercise 2 — Arrow Function ─────────────────────────────────────────────
//
// CONCEPT: Arrow functions are a concise expression form. Single-expression
//          bodies can omit braces and `return`. They do NOT have their own
//          `this`, `arguments`, or `prototype`.
// WHY:     Arrows are the idiomatic choice for callbacks and short utilities.
//          Avoid arrows as object methods or constructors.
// WHEN:    Callbacks (map/filter/reduce), short transformations, closures
//          where you want to inherit outer `this`.
// WHERE:   React event handlers, Array method callbacks, Redux reducers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
const addArrow = (a, b) => a + b;

// ─── Exercise 3 — Default Parameter ──────────────────────────────────────────
//
// CONCEPT: Default parameters let you specify fallback values directly in the
//          signature. The default is used when the argument is `undefined`
//          (not null, not 0, not '').
// WHY:     Eliminates manual `if (x === undefined) x = defaultValue;` guards
//          and makes intent explicit in the signature.
// WHEN:    Any function with optional arguments — configuration objects,
//          optional flags, sensible fallbacks.
// WHERE:   Express route handlers, React component props fallbacks, API helpers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

// ─── Exercise 4 — Rest Parameter ─────────────────────────────────────────────
//
// CONCEPT: `...nums` collects all remaining arguments into a real Array.
//          Unlike the legacy `arguments` object, rest parameters work with
//          arrow functions and are array-like from the start.
// WHY:     Allows variadic functions without manually slicing `arguments`.
//          Prefer rest over `arguments` in all modern code.
// WHEN:    Math utilities (sum, max), event emitters, logging helpers,
//          any function accepting a variable number of inputs.
// WHERE:   Lodash variadic helpers, Node.js `util.format`, React children spreads.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

// ─── Exercise 5 — Hoisting ────────────────────────────────────────────────────
//
// CONCEPT: Function declarations are hoisted — the engine moves both the name
//          and the full body to the top of the enclosing scope before any code
//          runs. This means you can call a declared function before the line
//          where it appears. `var` is also hoisted (name only, value is
//          undefined). `const`/`let` and arrow functions are NOT usably hoisted
//          (they sit in the Temporal Dead Zone until their line).
// WHY:     A common gotcha: declaring a function with `const fn = () => {}` and
//          calling it before that line throws a ReferenceError, while a
//          `function fn() {}` declaration would work fine.
// WHEN:    Rely on hoisting only when you intentionally want top-of-scope
//          availability (e.g., mutually recursive declarations). Otherwise,
//          declare before use for clarity.
// WHERE:   Legacy codebases, module-level utility functions, polyfills.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
function hoistTest() {
  return inner(); // inner is called BEFORE it is defined — hoisting makes this work

  function inner() {
    return 42;
  }
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
