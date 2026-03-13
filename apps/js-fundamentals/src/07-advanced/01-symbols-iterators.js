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

// ─── Exercise 1 — Symbol as unique key ───────────────────────────────────────
// Every Symbol() call creates a globally unique value, even with the same
// description string. Use this to produce collision-free keys.
//
// Task: implement makeUniqueId() so that two calls always return different Symbols.

function makeUniqueId() {
  // YOUR CODE HERE
}

// ─── Exercise 2 — Custom iterator ────────────────────────────────────────────
// An object is iterable when it has a [Symbol.iterator]() method that returns
// an iterator — an object with a next() method returning { value, done }.
//
// Task: implement makeRange(start, end) so that [...makeRange(1,4)] === [1,2,3].

function makeRange(start, end) {
  // YOUR CODE HERE
}

// ─── Exercise 3 — Iterable class ─────────────────────────────────────────────
// Classes can implement [Symbol.iterator]() directly so instances are iterable.
//
// Task: implement InfiniteCounter so that the first 5 values destructured from
// a new instance are 0, 1, 2, 3, 4.

class InfiniteCounter {
  // YOUR CODE HERE
}

// ─── Exercise 4 — Well-known symbol: Symbol.toPrimitive ──────────────────────
// Symbol.toPrimitive lets you control how an object coerces to a primitive.
// The runtime passes 'number', 'string', or 'default' as the hint.
//
// Task: implement Money with [Symbol.toPrimitive] so that:
//   +new Money(42,'EUR') === 42
//   `${new Money(42,'EUR')}` === '42 EUR'

class Money {
  constructor(amount, currency) {
    // YOUR CODE HERE
  }

  [Symbol.toPrimitive](hint) {
    // YOUR CODE HERE
  }
}

// ─── Exercise 5 — Iterable linked list ───────────────────────────────────────
// A linked list stores nodes where each node holds a value and a reference to
// the next node. Making it iterable lets you use spread and for-of natively.
//
// Task: implement LinkedList with push(val) and [Symbol.iterator]() that walks
// head → tail, yielding each value.

class LinkedList {
  // YOUR CODE HERE
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log('\nLevel 2 — Symbol as unique key');
test('two Symbols with same description are not equal', () => {
  const a = Symbol('id');
  const b = Symbol('id');
  assert(a !== b, 'Symbols must be unique');
});
test('makeUniqueId() returns different symbols each call', () => {
  assert(makeUniqueId() !== makeUniqueId(), 'each call must return a new Symbol');
});
test('makeUniqueId() returns a Symbol', () => {
  assertEq(typeof makeUniqueId(), 'symbol');
});

console.log('\nLevel 3 — Custom iterator');
test('[...makeRange(1,4)] deep-equals [1,2,3]', () => {
  assertDeepEq([...makeRange(1, 4)], [1, 2, 3]);
});
test('for-of works with makeRange', () => {
  const out = [];
  for (const n of makeRange(1, 4)) out.push(n);
  assertDeepEq(out, [1, 2, 3]);
});
test('makeRange(5,5) yields empty', () => {
  assertDeepEq([...makeRange(5, 5)], []);
});

console.log('\nLevel 3 — Iterable class');
test('first 5 values from InfiniteCounter are 0-4', () => {
  const [a, b, c, d, e] = new InfiniteCounter();
  assertEq(a, 0);
  assertEq(e, 4);
});
test('InfiniteCounter values are sequential', () => {
  const [a, b, c] = new InfiniteCounter();
  assertEq(b - a, 1);
  assertEq(c - b, 1);
});

console.log('\nLevel 4 — Symbol.toPrimitive');
test('+new Money(42,"EUR") === 42', () => {
  assertEq(+new Money(42, 'EUR'), 42);
});
test('template literal gives "42 EUR"', () => {
  assertEq(`${new Money(42, 'EUR')}`, '42 EUR');
});
test('default hint returns amount', () => {
  const m = new Money(10, 'USD');
  assertEq(m[Symbol.toPrimitive]('default'), 10);
});

console.log('\nLevel 5 — Iterable linked list');
test('spread of 3 pushed values', () => {
  const list = new LinkedList();
  list.push(1);
  list.push(2);
  list.push(3);
  assertDeepEq([...list], [1, 2, 3]);
});
test('for-of over linked list', () => {
  const list = new LinkedList();
  list.push('a');
  list.push('b');
  const out = [];
  for (const v of list) out.push(v);
  assertDeepEq(out, ['a', 'b']);
});
test('empty linked list spreads to []', () => {
  assertDeepEq([...new LinkedList()], []);
});
