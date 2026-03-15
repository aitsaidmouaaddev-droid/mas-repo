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

// Exercise 1 — makeCounter
// Returns an object with increment(), decrement(), and value() methods.
// All three share closure over an internal count variable starting at `start`.
function makeCounter(start = 0) {
  // YOUR CODE HERE
}

// Exercise 2 — makeMultiplier
// Returns a function that multiplies its single argument by `factor`.
function makeMultiplier(factor) {
  // YOUR CODE HERE
}

// Exercise 3 — memoize
// Wraps `fn` and caches results keyed by the first argument (primitive).
// Uses a Map internally. Returns cached value on repeat calls.
function memoize(fn) {
  // YOUR CODE HERE
}

// Exercise 4 — makePrivate
// Returns { get, set } where get() returns the current value and set(v) updates it.
// The value must NOT be accessible as a plain property on the returned object.
function makePrivate(initial) {
  // YOUR CODE HERE
}

// Exercise 5 — once
// Returns a wrapper that calls fn at most once.
// Every call after the first returns the same first result.
function once(fn) {
  // YOUR CODE HERE
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
