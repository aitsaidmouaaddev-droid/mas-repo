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

// Exercise 1 — Stack
// Implement push(val), pop() → val|undefined, peek() → val|undefined, get size
class Stack {
  // YOUR CODE HERE
}

// Exercise 2 — EventEmitter
// Implement on(event, fn), emit(event, ...args), off(event, fn)
class EventEmitter {
  // YOUR CODE HERE
}

// Exercise 3 — Queue (linked-list backed)
// Use an internal Node class (not an array). Implement enqueue(val), dequeue() → val, get size
class Node {
  // YOUR CODE HERE
}

class Queue {
  // YOUR CODE HERE
}

// Exercise 4 — Counter (private field + static factory)
// Private #count = 0, increment(), decrement(), get value(), static fromValue(n)
class Counter {
  // YOUR CODE HERE
}

// Exercise 5 — Observable (minimal reactive)
// subscribe(observer:{next,complete}), next(value), complete()
// complete() calls all observers then clears the subscriber list
class Observable {
  // YOUR CODE HERE
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
