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

// ─── Exercise 1 — Basic Proxy: read-only object ───────────────────────────────
// A Proxy wraps any object and lets you intercept fundamental operations.
// The set trap fires before a property is written.
//
// Task: implement makeReadOnly(obj) — reading works normally, any write
// throws a TypeError with message 'read-only'.

function makeReadOnly(obj) {
  // YOUR CODE HERE
}

// ─── Exercise 2 — Validation proxy ───────────────────────────────────────────
// Intercept sets to enforce a schema: an object whose keys map to validator
// functions.  If the validator returns false, throw a TypeError.
//
// Task: implement validated(obj, schema).

function validated(obj, schema) {
  // YOUR CODE HERE
}

// ─── Exercise 3 — Default value proxy ────────────────────────────────────────
// Intercept gets so that accessing any key not present on the target returns
// a caller-supplied default instead of undefined.
//
// Task: implement withDefaults(obj, defaultValue).

function withDefaults(obj, defaultValue) {
  // YOUR CODE HERE
}

// ─── Exercise 4 — Negative array index proxy ─────────────────────────────────
// Python-style negative indexing: arr[-1] → last element, arr[-2] → second last.
//
// Task: implement negativeIndex(arr) using a Proxy get trap.
// Hint: Number(key) < 0 → access arr[arr.length + Number(key)].

function negativeIndex(arr) {
  // YOUR CODE HERE
}

// ─── Exercise 5 — Observable proxy ───────────────────────────────────────────
// Call onChange(key, newValue, oldValue) whenever a property is set.
//
// Task: implement observable(obj, onChange).

function observable(obj, onChange) {
  // YOUR CODE HERE
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log('\nLevel 2 — Read-only proxy');
test('reading a property works', () => {
  const p = makeReadOnly({ x: 1 });
  assertEq(p.x, 1);
});
test('writing throws TypeError read-only', () => {
  const p = makeReadOnly({ x: 1 });
  let threw = false;
  try {
    p.x = 2;
  } catch (e) {
    threw = e instanceof TypeError && e.message === 'read-only';
  }
  assert(threw, 'expected TypeError with message "read-only"');
});
test('reading undefined key returns undefined', () => {
  const p = makeReadOnly({});
  assertEq(p.missing, undefined);
});

console.log('\nLevel 3 — Validation proxy');
test('valid set succeeds', () => {
  const obj = validated({ age: 0 }, { age: (v) => typeof v === 'number' && v >= 0 });
  obj.age = 25;
  assertEq(obj.age, 25);
});
test('invalid set throws', () => {
  const obj = validated({ age: 0 }, { age: (v) => typeof v === 'number' && v >= 0 });
  let threw = false;
  try {
    obj.age = -1;
  } catch (e) {
    threw = true;
  }
  assert(threw, 'should throw on invalid value');
});
test('keys without a schema validator pass through', () => {
  const obj = validated({}, {});
  obj.anything = 42;
  assertEq(obj.anything, 42);
});

console.log('\nLevel 3 — Default value proxy');
test('missing key returns default', () => {
  const p = withDefaults({ a: 1 }, 99);
  assertEq(p.missing, 99);
});
test('existing key returns its value', () => {
  const p = withDefaults({ a: 1 }, 99);
  assertEq(p.a, 1);
});
test('default of 0 works', () => {
  const p = withDefaults({}, 0);
  assertEq(p.x, 0);
});

console.log('\nLevel 4 — Negative array index proxy');
test('[-1] returns last element', () => {
  assertEq(negativeIndex([1, 2, 3])[-1], 3);
});
test('[-2] returns second-to-last', () => {
  assertEq(negativeIndex([1, 2, 3])[-2], 2);
});
test('[0] still works normally', () => {
  assertEq(negativeIndex([10, 20, 30])[0], 10);
});
test('length property still works', () => {
  assertEq(negativeIndex([1, 2, 3]).length, 3);
});

console.log('\nLevel 5 — Observable proxy');
test('onChange called with correct key and values', () => {
  const log = [];
  const obj = observable({ x: 1 }, (key, newVal, oldVal) => log.push({ key, newVal, oldVal }));
  obj.x = 42;
  assertEq(log.length, 1);
  assertEq(log[0].key, 'x');
  assertEq(log[0].newVal, 42);
  assertEq(log[0].oldVal, 1);
});
test('onChange called for new key with undefined oldVal', () => {
  const log = [];
  const obj = observable({}, (key, newVal, oldVal) => log.push({ key, newVal, oldVal }));
  obj.y = 7;
  assertEq(log[0].oldVal, undefined);
  assertEq(log[0].newVal, 7);
});
test('set still persists the value', () => {
  const obj = observable({ a: 0 }, () => {});
  obj.a = 99;
  assertEq(obj.a, 99);
});
