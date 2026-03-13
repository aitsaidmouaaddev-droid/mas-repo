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

// ─── Exercise 1 — curry ──────────────────────────────────────────────────────
//
// CONCEPT: Currying — transforming f(a,b,c) into f(a)(b)(c)
// WHY:     Currying allows partial application: you can "bake in" some arguments
//          and get a more specialized function back. It's foundational to
//          point-free functional programming and composability.
//          The implementation uses fn.length (arity) to know when to call fn.
//          When enough args are collected, call fn; otherwise return a function
//          that waits for more args.
// WHEN:    Pre-configuring functions for use in pipelines (e.g., curry(add)(5)
//          gives you an add5 function ready to pass to map). Reusable
//          specialized functions from generic ones.
// WHERE:   Ramda (fully auto-curried API), Haskell-inspired JS libraries,
//          Redux middleware signature (store => next => action =>), fp-ts.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

function curry(fn) {
  // Recursive accumulator: keeps gathering args until fn.length are collected
  function curried(...args) {
    if (args.length >= fn.length) {
      // We have enough args — call the original function
      return fn(...args);
    }
    // Not enough args yet — return a function that appends to the collected args
    return function (...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  }
  return curried;
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

// ─── Exercise 2 — partial ────────────────────────────────────────────────────
//
// CONCEPT: Partial application — pre-filling some arguments of a function
// WHY:     Partial application differs from currying: it applies a FIXED number
//          of arguments upfront (not one at a time). The result is a function
//          expecting the remaining arguments. Unlike curry, partial doesn't care
//          about arity — it just prepends the pre-args to the call.
// WHEN:    Creating event handler variants, building specialized API callers
//          (partial(fetch, '/api')), configuring reusable utilities.
// WHERE:   Function.prototype.bind is built-in partial application.
//          Lodash's _.partial, Ramda's R.partial. React's useCallback with
//          captured values is partial application in spirit.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

function partial(fn, ...preArgs) {
  return function (...laterArgs) {
    return fn(...preArgs, ...laterArgs);
  };
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

// ─── Exercise 3 — compose ────────────────────────────────────────────────────
//
// CONCEPT: Function composition right-to-left (mathematical order)
// WHY:     In mathematics, (f ∘ g)(x) = f(g(x)) — g is applied first, then f.
//          compose matches this convention. It's the mirror image of pipe.
//          Use reduceRight to apply functions from right to left.
// WHEN:    When you think in mathematical notation, when the order of
//          operations flows naturally right-to-left (like type signatures).
// WHERE:   Ramda's R.compose, Haskell's (.) operator, Redux's compose()
//          for combining store enhancers, functional libraries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight

function compose(...fns) {
  if (fns.length === 0) return (x) => x;
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
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

// ─── Exercise 4 — Maybe Monad ────────────────────────────────────────────────
//
// CONCEPT: The Maybe monad — a container type for nullable values
// WHY:     null/undefined access errors are among the most common runtime bugs.
//          Maybe wraps a value (Just) or absence (Nothing) and lets you chain
//          transformations safely. map on Nothing is a no-op — it short-circuits
//          the chain without throwing. This is "null-safe chaining" made explicit.
//          Monads follow two laws: identity (Just(x).map(id) === Just(x)) and
//          composition (m.map(f).map(g) === m.map(x => g(f(x)))).
// WHEN:    Safe property access chains, optional API response fields, config
//          lookups that might be absent, database queries that might return null.
// WHERE:   fp-ts Option type, Haskell's Maybe, Scala's Option, Swift's Optional,
//          RxJS's empty observable (similar semantics), Elm's Maybe type.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
//          (Optional chaining ?. is the built-in version of this pattern)

function Just(value) {
  return {
    // map: apply fn to the wrapped value, wrap result in Just
    map(fn) {
      return Just(fn(value));
    },
    // getOrElse: we have a value — return it, ignoring the default
    getOrElse(_default) {
      return value;
    },
    // For debugging
    toString() {
      return `Just(${value})`;
    },
  };
}

function Nothing() {
  const nothing = {
    // map: nothing to transform — skip fn, return Nothing
    map(_fn) {
      return nothing;
    },
    // getOrElse: no value — return the default
    getOrElse(defaultVal) {
      return defaultVal;
    },
    toString() {
      return 'Nothing';
    },
  };
  return nothing;
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
    .map((x) => x + 1)
    .map((x) => x * 10)
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
  assertEq(sideEffect, 0);
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
