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

// ─── Exercise 1 — Decorator ──────────────────────────────────────────────────
//
// CONCEPT: The Decorator pattern wraps an existing object to extend or modify
//          its behaviour at runtime without subclassing. The wrapper exposes the
//          same interface and delegates to the original, adding its own logic
//          before or after.
// WHY:     More flexible than inheritance — you can stack multiple decorators.
//          Adding behaviour to specific instances doesn't affect others of the
//          same class.
// WHEN:    Logging, caching, access control, compression, retry logic — any
//          cross-cutting concern layered on a core object.
// WHERE:   Express/Koa middleware pipeline, Java I/O streams, Python @decorator,
//          Redux middleware, React Higher-Order Components.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

function withLogging(logger) {
  return {
    log(msg) {
      logger.log(`[${Date.now()}] ${msg}`);
    },
  };
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

// ─── Exercise 2 — Adapter ────────────────────────────────────────────────────
//
// CONCEPT: The Adapter (Wrapper) pattern converts an incompatible interface into
//          the one that the client expects. A thin translation layer sits between
//          the caller and the adaptee, delegating calls after any necessary
//          argument/return-value transformation.
// WHY:     Allows old code (legacy APIs, third-party libs) to work alongside new
//          code without modifying either. Isolates coupling to the adapter.
// WHEN:    Integrating legacy systems, wrapping third-party libs, testing
//          (wrapping real services with a test double of the expected interface).
// WHERE:   Database driver adapters, fetch vs XMLHttpRequest wrappers, DOM
//          abstraction layers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects

function createPrinterAdapter(legacyPrinter) {
  return {
    print(text) {
      legacyPrinter.printDocument(text);
    },
  };
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

// ─── Exercise 3 — Façade ─────────────────────────────────────────────────────
//
// CONCEPT: The Façade pattern provides a simplified, unified interface to a
//          complex subsystem made up of multiple objects. Callers interact only
//          with the façade and remain unaware of the subsystem internals.
// WHY:     Reduces coupling between client code and the subsystem. Makes complex
//          workflows (checkout, sign-up flow) single-call operations.
// WHEN:    Multi-step processes you want to expose as one operation, SDK wrappers,
//          module entry points.
// WHERE:   E-commerce checkout, AWS SDK service wrappers, Express app factories.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

function createOrderFacade({ inventory, payment, shipping }) {
  return {
    placeOrder(item, amount) {
      if (!inventory.checkStock(item)) return { success: false, reason: 'out of stock' };
      if (!payment.charge(amount)) return { success: false, reason: 'payment failed' };
      const tracking = shipping.schedule(item);
      return { success: true, tracking };
    },
  };
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

// ─── Exercise 4 — Proxy (validation) ─────────────────────────────────────────
//
// CONCEPT: The Proxy pattern provides a surrogate object that controls access to
//          the real subject. JavaScript's built-in Proxy object lets you
//          intercept fundamental operations (get, set, delete, apply, …) via
//          handler traps.
// WHY:     Enables validation, logging, lazy loading, access control, and
//          change-detection without touching the original object's class.
//          Vue 3's reactivity system is built entirely on Proxy.
// WHEN:    Input validation, reactive programming, access control guards,
//          memoisation, virtual properties.
// WHERE:   Vue 3 reactivity, MobX observable, Immer immer(), test spies.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

function createValidatedObject(schema) {
  const store = {};
  return new Proxy(store, {
    set(target, key, value) {
      if (key in schema && !schema[key](value)) {
        throw new TypeError(`Invalid value for ${String(key)}`);
      }
      target[key] = value;
      return true;
    },
  });
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

// ─── Exercise 5 — Composite ───────────────────────────────────────────────────
//
// CONCEPT: The Composite pattern composes objects into tree structures to
//          represent part-whole hierarchies. Leaf nodes and composite nodes
//          share the same interface so clients treat them uniformly.
// WHY:     Simplifies client code — no need to distinguish between individual
//          items and containers. Adding new component types is transparent.
// WHEN:    File systems, UI component trees, scene graphs, JSON/XML documents,
//          arithmetic expression trees.
// WHERE:   React's component tree, DOM, Three.js Object3D hierarchy, AST nodes.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

function createFile(name, size) {
  return {
    name,
    size() {
      return size;
    },
  };
}

function createFolder(name) {
  const children = [];
  return {
    name,
    add(child) {
      children.push(child);
    },
    size() {
      return children.reduce((sum, child) => sum + child.size(), 0);
    },
  };
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
