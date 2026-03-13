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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — Decorator
// A decorator wraps an object and adds (or overrides) behaviour without
// changing the original object.
//
// Task: implement withLogging(logger) — a function that takes a logger object
//   { log(msg) } and returns a new logger that prepends the current timestamp
//   (a string) to every message: "[<ts>] <msg>"
//   Use Date.now() for the timestamp.

function withLogging(logger) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Decorator (withLogging)');
test('prepends timestamp to log message', () => {
  const messages = [];
  const base = { log: (msg) => messages.push(msg) };
  const decorated = withLogging(base);
  decorated.log('hello');
  assert(
    messages[0].startsWith('[') && messages[0].includes('] hello'),
    `message was: ${messages[0]}`,
  );
});
test('does not modify original logger', () => {
  const messages = [];
  const base = { log: (msg) => messages.push(msg) };
  withLogging(base); // just wrap, don't call
  base.log('raw');
  assertEq(messages[0], 'raw');
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Adapter
// An adapter converts the interface of one object so it's compatible with
// another expected interface.
//
// Task: You have a legacy printer with printDocument(text) but the rest of the
//   code expects an object with print(text). Implement createPrinterAdapter(legacyPrinter)
//   that wraps legacyPrinter and exposes a print(text) method.

function createPrinterAdapter(legacyPrinter) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Adapter');
test('print() delegates to printDocument()', () => {
  const output = [];
  const legacy = { printDocument: (t) => output.push(t) };
  const adapter = createPrinterAdapter(legacy);
  adapter.print('hello world');
  assertDeepEq(output, ['hello world']);
});
test('adapter does not expose printDocument directly on new interface', () => {
  const legacy = { printDocument: () => {} };
  const adapter = createPrinterAdapter(legacy);
  assertEq(typeof adapter.print, 'function');
});

// Exercise 3 — Façade
// A façade provides a simple interface to a complex subsystem.
//
// Task: implement createOrderFacade({ inventory, payment, shipping }) where:
//   - inventory has: checkStock(item) → boolean
//   - payment   has: charge(amount) → boolean
//   - shipping  has: schedule(item) → string (tracking number)
//
//   The facade exposes placeOrder(item, amount):
//     → If stock is available AND charge succeeds, call shipping.schedule(item)
//       and return { success: true, tracking: <trackingNumber> }
//     → If stock is unavailable, return { success: false, reason: 'out of stock' }
//     → If charge fails, return { success: false, reason: 'payment failed' }

function createOrderFacade({ inventory, payment, shipping }) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Façade');
test('successful order', () => {
  const facade = createOrderFacade({
    inventory: { checkStock: () => true },
    payment: { charge: () => true },
    shipping: { schedule: () => 'TRK-001' },
  });
  assertDeepEq(facade.placeOrder('book', 10), { success: true, tracking: 'TRK-001' });
});
test('out of stock', () => {
  const facade = createOrderFacade({
    inventory: { checkStock: () => false },
    payment: { charge: () => true },
    shipping: { schedule: () => 'TRK-001' },
  });
  assertDeepEq(facade.placeOrder('book', 10), { success: false, reason: 'out of stock' });
});
test('payment failure', () => {
  const facade = createOrderFacade({
    inventory: { checkStock: () => true },
    payment: { charge: () => false },
    shipping: { schedule: () => 'TRK-001' },
  });
  assertDeepEq(facade.placeOrder('book', 10), { success: false, reason: 'payment failed' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Proxy (validation)
// A Proxy intercepts operations on an object and can add custom behaviour.
//
// Task: implement createValidatedObject(schema) where schema is an object
//   { [key]: validatorFn }. Return a Proxy on {} such that:
//   - Setting a property that exists in schema runs the validator. If it
//     returns false, throw: TypeError("Invalid value for <key>")
//   - Setting a property not in schema always succeeds.
//   - Getting a property returns the stored value (or undefined).

function createValidatedObject(schema) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Proxy (validation)');
test('valid value is set', () => {
  const obj = createValidatedObject({ age: (n) => typeof n === 'number' && n >= 0 });
  obj.age = 25;
  assertEq(obj.age, 25);
});
test('invalid value throws TypeError', () => {
  const obj = createValidatedObject({ age: (n) => typeof n === 'number' && n >= 0 });
  let threw = false;
  try {
    obj.age = -1;
  } catch (e) {
    threw = true;
    assertEq(e instanceof TypeError, true);
    assert(e.message.includes('age'), `message should mention key, got: ${e.message}`);
  }
  assert(threw, 'should have thrown');
});
test('unschemed keys are set freely', () => {
  const obj = createValidatedObject({ age: (n) => n >= 0 });
  obj.name = 'Alice';
  assertEq(obj.name, 'Alice');
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 5 — Composite
// The Composite pattern composes objects into tree structures. Both individual
// items and containers share the same interface.
//
// Task: implement:
//   - createFile(name, size)      — leaf. size() returns its own size.
//   - createFolder(name)          — composite. add(child), size() returns
//                                   the sum of all children's sizes.
//   Both expose: name, size()

function createFile(name, size) {
  // YOUR CODE HERE
}

function createFolder(name) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Composite');
test('file size equals its own size', () => {
  assertEq(createFile('a.txt', 10).size(), 10);
});
test('empty folder size is 0', () => {
  assertEq(createFolder('root').size(), 0);
});
test('folder with files sums sizes', () => {
  const root = createFolder('root');
  root.add(createFile('a.txt', 10));
  root.add(createFile('b.txt', 20));
  assertEq(root.size(), 30);
});
test('nested folders sum recursively', () => {
  const root = createFolder('root');
  const sub = createFolder('sub');
  sub.add(createFile('x.txt', 5));
  root.add(sub);
  root.add(createFile('y.txt', 15));
  assertEq(root.size(), 20);
});
