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

// ─── Exercise 1 — Stack ───────────────────────────────────────────────────────
//
// CONCEPT: A stack is a LIFO (Last-In-First-Out) data structure. ES2022 class
//          syntax provides a clean OOP surface with getter properties.
// WHY:     Stacks are the core of call stacks, undo history, expression parsing,
//          and depth-first search. Understanding them is foundational.
// WHEN:    Any time order must be reversed; maintaining a history of states.
// WHERE:   Browser history, text editor undo, recursive algorithm simulation.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Stack {
  #items = [];

  push(val) {
    this.#items.push(val);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  get size() {
    return this.#items.length;
  }
}

// ─── Exercise 2 — EventEmitter ────────────────────────────────────────────────
//
// CONCEPT: The Observer (pub/sub) pattern decouples event producers from
//          consumers. An EventEmitter stores listeners per event name and
//          calls them when that event fires.
// WHY:     Enables loose coupling — emitters don't need to know who is listening.
//          Node.js core, the DOM, and most UI frameworks build on this pattern.
// WHEN:    Cross-component communication, plugin systems, I/O event handling.
// WHERE:   Node EventEmitter, DOM addEventListener, Redux middleware.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
class EventEmitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
  }

  off(event, fn) {
    if (!this.#listeners.has(event)) return;
    this.#listeners.set(
      event,
      this.#listeners.get(event).filter((l) => l !== fn),
    );
  }

  emit(event, ...args) {
    if (!this.#listeners.has(event)) return;
    for (const fn of this.#listeners.get(event)) fn(...args);
  }
}

// ─── Exercise 3 — Queue (linked list) ────────────────────────────────────────
//
// CONCEPT: A queue is a FIFO (First-In-First-Out) data structure. Implementing
//          it with a linked list gives O(1) enqueue and dequeue, whereas an
//          array-based approach has O(n) shift.
// WHY:     Real queues need O(1) operations at both ends. Understanding linked
//          structures sharpens pointer/reference reasoning.
// WHEN:    Task scheduling, breadth-first search, message buffers.
// WHERE:   OS process schedulers, job queues (Bull/BullMQ), print spoolers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class Queue {
  #head = null;
  #tail = null;
  #size = 0;

  enqueue(val) {
    const node = new Node(val);
    if (this.#tail) this.#tail.next = node;
    this.#tail = node;
    if (!this.#head) this.#head = node;
    this.#size++;
  }

  dequeue() {
    if (!this.#head) return undefined;
    const val = this.#head.val;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return val;
  }

  get size() {
    return this.#size;
  }
}

// ─── Exercise 4 — Counter (private field + static factory) ───────────────────
//
// CONCEPT: Private class fields (prefix `#`) are truly inaccessible outside the
//          class — they throw a SyntaxError even with bracket notation.
//          Static factory methods (`static fromValue`) are an alternative to
//          constructor overloading, keeping construction logic explicit.
// WHY:     Encapsulation prevents unintended mutation. Factories make the intent
//          of different construction paths clear.
// WHEN:    Any value-object or stateful entity that should control its own state.
// WHERE:   Financial amounts, counters, validated domain objects.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }
  decrement() {
    this.#count--;
  }

  get value() {
    return this.#count;
  }

  static fromValue(n) {
    const c = new Counter();
    c.#count = n;
    return c;
  }
}

// ─── Exercise 5 — Observable ──────────────────────────────────────────────────
//
// CONCEPT: A minimal reactive Observable pushes values to all registered
//          observers. On complete(), it notifies then purges the subscriber
//          list so no further values are delivered — mirroring RxJS semantics.
// WHY:     Reactive streams underpin modern UI frameworks and async data
//          pipelines. Understanding the core is essential for RxJS, Angular
//          Observables, and reactive state management.
// WHEN:    Real-time data (websockets, sensors), UI event streams, animation.
// WHERE:   RxJS, Angular async pipe, Redux Observable, Apollo subscriptions.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Observable {
  #subscribers = [];

  subscribe(observer) {
    this.#subscribers.push(observer);
  }

  next(value) {
    for (const observer of this.#subscribers) observer.next(value);
  }

  complete() {
    for (const observer of this.#subscribers) observer.complete();
    this.#subscribers = [];
  }
}

console.log('\nLevel 1 — Stack');
test('push, peek, pop, size', () => {
  const s = new Stack();
  s.push(1);
  s.push(2);
  s.push(3);
  assertEq(s.peek(), 3);
  assertEq(s.size, 3);
  assertEq(s.pop(), 3);
  assertEq(s.pop(), 2);
  assertEq(s.pop(), 1);
  assertEq(s.pop(), undefined);
  assertEq(s.size, 0);
});

console.log('\nLevel 2 — EventEmitter');
test('listener called on emit, not called after off', () => {
  const ee = new EventEmitter();
  let count = 0;
  const inc = () => count++;
  ee.on('click', inc);
  ee.emit('click');
  ee.emit('click');
  assertEq(count, 2);
  ee.off('click', inc);
  ee.emit('click');
  assertEq(count, 2);
});
test('emit passes args to listener', () => {
  const ee = new EventEmitter();
  let received;
  ee.on('data', (a, b) => {
    received = a + b;
  });
  ee.emit('data', 3, 4);
  assertEq(received, 7);
});

console.log('\nLevel 3 — Queue (linked list)');
test('FIFO order', () => {
  const q = new Queue();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  assertEq(q.size, 3);
  assertEq(q.dequeue(), 1);
  assertEq(q.dequeue(), 2);
  assertEq(q.dequeue(), 3);
  assertEq(q.dequeue(), undefined);
  assertEq(q.size, 0);
});

console.log('\nLevel 4 — Counter (private field + static)');
test('Counter.fromValue(5).value → 5', () => {
  const c = Counter.fromValue(5);
  assertEq(c.value, 5);
  c.increment();
  assertEq(c.value, 6);
  c.decrement();
  c.decrement();
  assertEq(c.value, 4);
});
test('private #count not accessible externally', () => {
  const c = new Counter();
  assert(c['#count'] === undefined, '#count should not be accessible as c["#count"]');
});

console.log('\nLevel 5 — Observable');
test('multiple subscribers receive values; complete clears all', () => {
  const obs = new Observable();
  const log1 = [],
    log2 = [];
  obs.subscribe({ next: (v) => log1.push(v), complete: () => log1.push('done') });
  obs.subscribe({ next: (v) => log2.push(v), complete: () => log2.push('done') });
  obs.next(1);
  obs.next(2);
  obs.complete();
  obs.next(3); // should be ignored — no subscribers remain
  assertDeepEq(log1, [1, 2, 'done']);
  assertDeepEq(log2, [1, 2, 'done']);
});
