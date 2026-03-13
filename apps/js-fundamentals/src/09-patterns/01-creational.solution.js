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

// ─── Exercise 1 — Factory Function ───────────────────────────────────────────
//
// CONCEPT: A factory function is any function (not a constructor) that returns
//          a new object. It avoids `new` and prototype chains while still
//          encapsulating creation logic and private state via closures.
// WHY:     No `new` keyword needed — harder to misuse. Makes inheritance by
//          composition (mixing returned objects) trivial. Plays well with
//          functional code.
// WHEN:    Creating objects without classes, mixing behaviours, avoiding `this`
//          binding issues, simulating private fields pre-#private.
// WHERE:   Redux action creators, React hook factories, configuration builders.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects#using_a_constructor_function

function createUser(name, role) {
  return {
    get name() {
      return name;
    },
    role,
    greet() {
      return `Hi, I'm ${name} (${role})`;
    },
  };
}

console.log('\nLevel 1 — Factory Function');
test('greet returns correct string', () => {
  const u = createUser('Alice', 'admin');
  assertEq(u.greet(), "Hi, I'm Alice (admin)");
});
test('name is accessible', () => assertEq(createUser('Bob', 'user').name, 'Bob'));
test('role is accessible', () => assertEq(createUser('Bob', 'user').role, 'user'));
test('each call returns a new obj', () => {
  assert(createUser('A', 'x') !== createUser('A', 'x'), 'should be different references');
});

// ─── Exercise 2 — Singleton ───────────────────────────────────────────────────
//
// CONCEPT: The Singleton pattern restricts a class to a single instance and
//          provides a global access point. Implemented by storing the instance
//          as a static property and throwing from the constructor when called
//          directly.
// WHY:     Controls access to a shared resource (config store, logger, DB
//          connection) and prevents inconsistent duplicate instances.
// WHEN:    Application-wide config, logger, connection pools, Redux store.
// WHERE:   Node.js module caching (each require() returns the same object), DI
//          containers, service locators.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static

class AppConfig {
  static #instance = null;
  #store = {};

  constructor() {
    if (AppConfig.#instance) {
      throw new Error('Use AppConfig.getInstance()');
    }
  }

  static getInstance() {
    if (!AppConfig.#instance) {
      AppConfig.#instance = new AppConfig();
    }
    return AppConfig.#instance;
  }

  get(key) {
    return this.#store[key];
  }
  set(key, value) {
    this.#store[key] = value;
  }
}

console.log('\nLevel 2 — Singleton');
test('getInstance() returns same reference', () => {
  assert(AppConfig.getInstance() === AppConfig.getInstance(), 'must be same instance');
});
test('set and get work on the instance', () => {
  const cfg = AppConfig.getInstance();
  cfg.set('theme', 'dark');
  assertEq(cfg.get('theme'), 'dark');
});
test('new AppConfig() throws', () => {
  let threw = false;
  try {
    new AppConfig();
  } catch (e) {
    threw = true;
    assertEq(e.message, 'Use AppConfig.getInstance()');
  }
  assert(threw, 'should have thrown');
});

// ─── Exercise 3 — Object Pool ─────────────────────────────────────────────────
//
// CONCEPT: An object pool maintains a set of reusable objects to avoid the
//          overhead of repeated allocation and garbage collection. Objects are
//          "acquired" when needed and "released" when done.
// WHY:     In performance-critical paths (game loops, WebSockets, WebWorkers),
//          GC pauses caused by constant allocation can cause frame drops or
//          latency spikes. A pool eliminates most allocations after warm-up.
// WHEN:    Particle systems, database connection pools, worker thread pools,
//          frequent short-lived objects (events, vectors, tasks).
// WHERE:   Three.js geometry reuse, pg/mysql connection pooling, Node cluster.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management

function createPool(factory, size) {
  const available = Array.from({ length: size }, factory);
  const inUse = new Set();

  return {
    acquire() {
      if (available.length === 0) return null;
      const obj = available.pop();
      inUse.add(obj);
      return obj;
    },
    release(obj) {
      if (inUse.delete(obj)) available.push(obj);
    },
  };
}

console.log('\nLevel 2 — Object Pool');
test('acquire returns an object', () => assert(createPool(() => ({}), 3).acquire() !== null));
test('pool exhausts after size acquires', () => {
  const pool = createPool(() => ({}), 2);
  pool.acquire();
  pool.acquire();
  assertEq(pool.acquire(), null);
});
test('release makes object available again', () => {
  const pool = createPool(() => ({}), 1);
  const obj = pool.acquire();
  assertEq(pool.acquire(), null); // exhausted
  pool.release(obj);
  assert(pool.acquire() !== null, 'should be available after release');
});

// ─── Exercise 4 — Builder Pattern ────────────────────────────────────────────
//
// CONCEPT: The Builder pattern constructs a complex object step-by-step using
//          a fluent interface. Each setter returns `this`, enabling method
//          chaining. build() finalises and returns the product.
// WHY:     Avoids telescoping constructors (a constructor with many optional
//          params). Makes construction readable and order-independent.
// WHEN:    SQL query construction, HTTP request builders, test data factories,
//          config objects with many optional fields.
// WHERE:   Knex.js, Axios request config, Jest's expect().toEqual() chains,
//          HTML form builders.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

class QueryBuilder {
  #table = '';
  #conditions = [];
  #limitVal = null;

  from(table) {
    this.#table = table;
    return this;
  }

  where(condition) {
    this.#conditions.push(condition);
    return this;
  }

  limit(n) {
    this.#limitVal = n;
    return this;
  }

  build() {
    let sql = `SELECT * FROM ${this.#table}`;
    if (this.#conditions.length > 0) {
      sql += ` WHERE ${this.#conditions.join(' AND ')}`;
    }
    if (this.#limitVal !== null) {
      sql += ` LIMIT ${this.#limitVal}`;
    }
    return sql;
  }
}

console.log('\nLevel 3 — Builder Pattern');
test('basic SELECT', () => {
  const q = new QueryBuilder().from('users').build();
  assertEq(q, 'SELECT * FROM users');
});
test('with WHERE clause', () => {
  const q = new QueryBuilder().from('users').where('age > 18').build();
  assertEq(q, 'SELECT * FROM users WHERE age > 18');
});
test('with multiple WHERE clauses', () => {
  const q = new QueryBuilder().from('users').where('age > 18').where('active = 1').build();
  assertEq(q, 'SELECT * FROM users WHERE age > 18 AND active = 1');
});
test('with LIMIT', () => {
  const q = new QueryBuilder().from('users').limit(10).build();
  assertEq(q, 'SELECT * FROM users LIMIT 10');
});
test('full query', () => {
  const q = new QueryBuilder().from('orders').where('status = "open"').limit(5).build();
  assertEq(q, 'SELECT * FROM orders WHERE status = "open" LIMIT 5');
});

// ─── Exercise 5 — Abstract Factory ───────────────────────────────────────────
//
// CONCEPT: The Abstract Factory provides a factory for a family of related
//          product types. Swapping the concrete factory swaps the entire
//          product family — without changing the code that uses them.
// WHY:     Ensures consistency within a product family (e.g. all UI components
//          share the same theme) and makes swapping families painless.
// WHEN:    Theming systems, cross-platform UI kits, testing (real vs mock
//          factories), multi-tenant apps with distinct UI brands.
// WHERE:   React UI libraries (Material UI theming), platform abstractions
//          (electron vs web vs native), mock service factories in tests.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

function createUIFactory(theme) {
  return {
    createButton() {
      return {
        render() {
          return `<button class="${theme}-btn">...</button>`;
        },
      };
    },
    createInput() {
      return {
        render() {
          return `<input class="${theme}-input" />`;
        },
      };
    },
  };
}

console.log('\nLevel 4 — Abstract Factory');
test('light button render', () => {
  assertEq(
    createUIFactory('light').createButton().render(),
    '<button class="light-btn">...</button>',
  );
});
test('dark button render', () => {
  assertEq(
    createUIFactory('dark').createButton().render(),
    '<button class="dark-btn">...</button>',
  );
});
test('light input render', () => {
  assertEq(createUIFactory('light').createInput().render(), '<input class="light-input" />');
});
test('dark input render', () => {
  assertEq(createUIFactory('dark').createInput().render(), '<input class="dark-input" />');
});
