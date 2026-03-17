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

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 1 — curry
// Transform a function f(a, b, c) into a curried form f(a)(b)(c).
// The curried function collects arguments one at a time. When all args are
// gathered (based on fn.length), call the original function.
// Must support calling with all args at once too: curried(a, b, c) works.
// Input: fn — a function with a known arity (fn.length)
// Output: curried version of fn
function curry(fn) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — curry');
test('curry(add)(1)(2) → 3', () => assertEq(curry((a, b) => a + b)(1)(2), 3));
test('curry(add)(1, 2) → 3 (all at once)', () => assertEq(curry((a, b) => a + b)(1, 2), 3));
test('three args one at a time', () => assertEq(curry((a, b, c) => a + b + c)(1)(2)(3), 6));
test('three args mixed: (1,2)(3)', () => assertEq(curry((a, b, c) => a + b + c)(1, 2)(3), 6));
test('pre-applied add5', () => {
  const add5 = curry((a, b) => a + b)(5);
  assertEq(add5(3), 8);
  assertEq(add5(10), 15);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 2 — partial
// Pre-apply some arguments to a function, returning a function waiting for the rest.
// partial(fn, a, b)(c, d) === fn(a, b, c, d)
// Input: fn — function, ...preArgs — arguments to pre-apply
// Output: new function that takes remaining args
function partial(fn, ...preArgs) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — partial');
test('partial add with first arg', () => assertEq(partial((a, b) => a + b, 10)(5), 15));
test('partial with multiple pre-args', () => assertEq(partial((a, b, c) => a + b + c, 1, 2)(3), 6));
test('partial with no pre-args = original', () => assertEq(partial((a, b) => a * b)(3, 4), 12));
test('partial log prefix', () => {
  const logs = [];
  const logWithPrefix = partial((prefix, msg) => logs.push(`${prefix}: ${msg}`), 'INFO');
  logWithPrefix('connected');
  logWithPrefix('ready');
  assertDeepEq(logs, ['INFO: connected', 'INFO: ready']);
});

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 4 — Expert ════════════════════════════════════════════════════════
// Exercise 3 — compose
// Compose functions right-to-left: compose(f, g, h)(x) === f(g(h(x)))
// This is the mathematical function composition order (opposite of pipe).
// Input: ...fns — functions
// Output: composed function
function compose(...fns) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — compose');
test('single function', () => assertEq(compose((x) => x + 1)(5), 6));
test('two functions right-to-left', () =>
  assertEq(
    compose(
      (x) => x + 1,
      (x) => x * 2,
    )(3),
    7,
  ));
test('order matters: compose ≠ pipe', () => {
  // pipe(f,g)(x) = g(f(x)), compose(f,g)(x) = f(g(x))
  const f = (x) => x * 2;
  const g = (x) => x + 3;
  assertEq(compose(f, g)(5), 16); // f(g(5)) = f(8) = 16
});
test('three functions', () =>
  assertEq(
    compose(
      (x) => x - 1,
      (x) => x * 2,
      (x) => x + 1,
    )(5),
    11,
  ));
test('no functions → identity', () => assertEq(compose()(42), 42));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 5 — Master ════════════════════════════════════════════════════════
// Exercise 4 — Maybe Monad
// Implement a simple Maybe monad with two constructors:
//   Just(value)   — wraps a present value
//   Nothing()     — represents absence of a value
//
// Both must have:
//   .map(fn)      — Just: applies fn and wraps result in Just; Nothing: returns Nothing
//   .getOrElse(defaultVal) — Just: returns the wrapped value; Nothing: returns defaultVal
//
// This prevents null-pointer errors by making absence explicit and chainable.
function Just(value) {
  // YOUR CODE HERE — return an object with map and getOrElse
}

function Nothing() {
  // YOUR CODE HERE — return an object with map and getOrElse
}

console.log('\nLevel 5 — Maybe Monad');
test('Just.map transforms value', () =>
  assertEq(
    Just(5)
      .map((x) => x * 2)
      .getOrElse(0),
    10,
  ));
test('Just.getOrElse returns value', () => assertEq(Just(42).getOrElse(0), 42));
test('Nothing.map returns Nothing', () =>
  assertEq(
    Nothing()
      .map((x) => x * 2)
      .getOrElse(-1),
    -1,
  ));
test('Nothing.getOrElse returns default', () =>
  assertEq(Nothing().getOrElse('default'), 'default'));
test('chain: Just through multiple maps', () => {
  const result = Just(3)
    .map((x) => x + 1) // Just(4)
    .map((x) => x * 10) // Just(40)
    .getOrElse(0);
  assertEq(result, 40);
});
test('chain: Nothing short-circuits', () => {
  let sideEffect = 0;
  Nothing()
    .map((x) => {
      sideEffect++;
      return x + 1;
    })
    .map((x) => {
      sideEffect++;
      return x * 10;
    })
    .getOrElse(0);
  assertEq(sideEffect, 0); // fn never called
});
test('safe property access pattern', () => {
  const getUser = (id) => (id === 1 ? Just({ name: 'Ali' }) : Nothing());
  assertEq(
    getUser(1)
      .map((u) => u.name)
      .getOrElse('unknown'),
    'Ali',
  );
  assertEq(
    getUser(99)
      .map((u) => u.name)
      .getOrElse('unknown'),
    'unknown',
  );
});
