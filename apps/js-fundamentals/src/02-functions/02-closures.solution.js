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

// ─── Exercise 1 — makeCounter ────────────────────────────────────────────────
//
// CONCEPT: Closure over mutable private state (the revealing module pattern).
//          The returned methods all share one closed-over `count` variable.
//          Each call to makeCounter() creates a fresh, independent closure.
// WHY:     Closures give you encapsulation without classes. The count variable
//          is completely inaccessible from outside — no way to bypass get/set.
// WHEN:    Any time you need shared private state among a group of functions:
//          counters, accumulators, rate limiters, toggle flags.
// WHERE:   React's useState hook (internal state cell), Redux store's
//          dispatch/getState pair, event-emitter implementations.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
function makeCounter(start = 0) {
  let count = start;
  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    value() {
      return count;
    },
  };
}

// ─── Exercise 2 — makeMultiplier ─────────────────────────────────────────────
//
// CONCEPT: Closure as a factory for specialised functions (partial application).
//          The returned function "remembers" `factor` from its creation scope.
// WHY:     Each call to makeMultiplier creates an independent closure with its
//          own factor — no shared mutable state, no coordination needed.
// WHEN:    Creating specialised instances of generic functions: formatters with
//          a pre-applied locale, validators with a pre-set threshold,
//          event handlers with a pre-bound ID.
// WHERE:   Array.prototype.map callbacks, React component factories,
//          Redux middleware (curried dispatch wrappers).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#closure_scope_chain
function makeMultiplier(factor) {
  return (x) => x * factor;
}

// ─── Exercise 3 — memoize ────────────────────────────────────────────────────
//
// CONCEPT: Memoization — closure over a Map cache for result caching.
//          The cache Map lives inside the closure; it persists across calls
//          but is private to this particular memoized function instance.
// WHY:     Pure functions always return the same output for the same input,
//          so we can skip recomputation. Trading memory for speed.
// WHEN:    Expensive pure computations called repeatedly: derived selectors,
//          recursive Fibonacci, regex compilation, matrix multiplication.
// WHERE:   React.memo, reselect (Redux selectors), lodash.memoize,
//          GraphQL resolver-level caching.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
function memoize(fn) {
  const cache = new Map();
  return function (key) {
    if (cache.has(key)) return cache.get(key);
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}

// ─── Exercise 4 — makePrivate ────────────────────────────────────────────────
//
// CONCEPT: Closure as an access-control mechanism (encapsulation without class).
//          The value is stored in a variable in the outer function's scope —
//          completely unreachable except through the returned get/set methods.
// WHY:     JavaScript objects have no built-in private fields (well, # fields
//          do now, but closures predate them and work everywhere). Closures let
//          you enforce invariants: you can validate in set(), transform in get().
// WHEN:    Wrapping sensitive values (tokens, config), enforcing read-only or
//          write-once semantics, creating validated setters.
// WHERE:   Module pattern (pre-ESM), wallet/balance abstractions, observable
//          state cells, write-once ID fields.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#emulating_private_methods_with_closures
function makePrivate(initial) {
  let _value = initial;
  return {
    get() {
      return _value;
    },
    set(v) {
      _value = v;
    },
  };
}

// ─── Exercise 5 — once ───────────────────────────────────────────────────────
//
// CONCEPT: Closure over a boolean flag and a cached return value.
//          The flag (`called`) and result live in the outer scope — they
//          persist across every call to the wrapper but are invisible outside.
// WHY:     The "once" pattern guarantees idempotency: the side effect fires
//          exactly one time regardless of how many times the wrapper is invoked.
// WHEN:    Initialization routines (DB connect, SDK init), one-time event
//          listeners, preventing double-submit in UIs, singleton factories.
// WHERE:   lodash.once, underscore.once, analytics "page-view fired" guards,
//          React initialization patterns (before useEffect).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

console.log('\nLevel 1 — makeCounter');
test('counter starts at default 0', () => {
  const c = makeCounter();
  assertEq(c.value(), 0);
});
test('increment twice → 2', () => {
  const c = makeCounter();
  c.increment();
  c.increment();
  assertEq(c.value(), 2);
});
test('increment then decrement from 10 → 11', () => {
  const c = makeCounter(10);
  c.increment();
  c.increment();
  c.decrement();
  assertEq(c.value(), 11);
});

console.log('\nLevel 2 — makeMultiplier');
test('makeMultiplier(3)(4) → 12', () => assertEq(makeMultiplier(3)(4), 12));
test('makeMultiplier(0)(99) → 0', () => assertEq(makeMultiplier(0)(99), 0));

console.log('\nLevel 3 — memoize');
test('memoize calls fn only once for same arg', () => {
  let callCount = 0;
  const slow = memoize((n) => {
    callCount++;
    return n * 2;
  });
  slow(5);
  slow(5);
  slow(5);
  assertEq(callCount, 1);
});
test('memoize still calls fn for different args', () => {
  let callCount = 0;
  const slow = memoize((n) => {
    callCount++;
    return n * 2;
  });
  slow(1);
  slow(2);
  slow(1);
  assertEq(callCount, 2);
});

console.log('\nLevel 4 — makePrivate');
test('get returns initial value', () => {
  const p = makePrivate(42);
  assertEq(p.get(), 42);
});
test('set updates the value', () => {
  const p = makePrivate(42);
  p.set(99);
  assertEq(p.get(), 99);
});
test('value is not directly accessible', () => {
  const p = makePrivate(42);
  assert(p.value === undefined, 'p.value should be undefined');
});

console.log('\nLevel 5 — once');
test('once fn is called only once', () => {
  let callCount = 0;
  const inc = once(() => {
    callCount++;
    return callCount;
  });
  inc();
  inc();
  inc();
  assertEq(callCount, 1);
});
test('once always returns first result', () => {
  let callCount = 0;
  const inc = once(() => {
    callCount++;
    return callCount;
  });
  assertEq(inc(), 1);
  assertEq(inc(), 1);
  assertEq(inc(), 1);
});
