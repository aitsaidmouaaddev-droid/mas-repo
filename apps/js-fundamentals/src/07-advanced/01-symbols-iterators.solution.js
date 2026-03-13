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
//
// CONCEPT: Symbol() creates a primitive value that is always globally unique.
//          Two calls with identical description strings still produce ≠ values.
// WHY:     Provides truly collision-free property keys — no third-party code
//          can accidentally overwrite a Symbol-keyed property.
// WHEN:    Private-ish object metadata, well-known extension points
//          (toJSON, toPrimitive), plugin hooks, enum-like constants.
// WHERE:   Library internals, mixin tokens, React/Redux internal keys.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

function makeUniqueId() {
  return Symbol('id');
}

// ─── Exercise 2 — Custom iterator ────────────────────────────────────────────
//
// CONCEPT: The iteration protocol requires [Symbol.iterator]() to return an
//          iterator object whose next() returns { value, done }.  Any object
//          implementing this is iterable — works with for-of, spread, Array.from.
// WHY:     Lets you define lazy, memory-efficient sequences without materialising
//          a full array up front.
// WHEN:    Ranges, pagination cursors, infinite streams, custom collections.
// WHERE:   DOM NodeList, Map/Set, generators, ReadableStream.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

function makeRange(start, end) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          if (current < end) {
            return { value: current++, done: false };
          }
          return { value: undefined, done: true };
        },
      };
    },
  };
}

// ─── Exercise 3 — Iterable class ─────────────────────────────────────────────
//
// CONCEPT: Defining [Symbol.iterator]() on a class prototype makes every
//          instance iterable.  Using a generator function (function*) is the
//          most concise way because yield handles state automatically.
// WHY:     Instances become first-class citizens of for-of, destructuring, and
//          spread without any external helper.
// WHEN:    Collections, ranges, lazy pipelines, data cursors.
// WHERE:   Custom array-like classes, reactive streams, tree walkers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator

class InfiniteCounter {
  *[Symbol.iterator]() {
    let n = 0;
    while (true) {
      yield n++;
    }
  }
}

// ─── Exercise 4 — Well-known symbol: Symbol.toPrimitive ──────────────────────
//
// CONCEPT: Symbol.toPrimitive is called by the engine whenever an object must
//          coerce to a primitive.  The hint ('number', 'string', 'default')
//          tells you which context triggered coercion.
// WHY:     Allows rich value objects (Money, BigDecimal, Color) to behave
//          correctly in arithmetic and template-literal contexts.
// WHEN:    Domain value objects that participate in math or string interpolation.
// WHERE:   Finance libraries, unit types, date/duration wrappers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive

class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount; // 'number' and 'default'
  }
}

// ─── Exercise 5 — Iterable linked list ───────────────────────────────────────
//
// CONCEPT: A singly linked list stores nodes (value + next pointer).  Combining
//          this with [Symbol.iterator]() enables native iteration.  A generator
//          makes traversal state-free from the caller's perspective.
// WHY:     Demonstrates that any traversable structure can be made iterable,
//          not just array-like objects.
// WHEN:    Custom data structures that must integrate cleanly with JS iteration.
// WHERE:   Compilers/parsers (token streams), queues, undo stacks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

class LinkedList {
  constructor() {
    this.head = null;
  }

  push(val) {
    const node = { val, next: null };
    if (!this.head) {
      this.head = node;
      return;
    }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  *[Symbol.iterator]() {
    let cur = this.head;
    while (cur) {
      yield cur.val;
      cur = cur.next;
    }
  }
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
