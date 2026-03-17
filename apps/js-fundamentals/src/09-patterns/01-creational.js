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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — Factory Function
// A factory function creates and returns a new object without using `new`.
// It encapsulates creation logic and can close over private state.
//
// Task: implement createUser(name, role) returning an object with:
//   - name (read-only via getter)
//   - role
//   - greet() → "Hi, I'm <name> (<role>)"

function createUser(name, role) {
  // YOUR CODE HERE
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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Singleton
// The Singleton pattern ensures a class has only one instance and provides a
// global point of access to it.
//
// Task: implement AppConfig so that:
//   - AppConfig.getInstance() always returns the same object
//   - new AppConfig() throws an error with message "Use AppConfig.getInstance()"
//   - The instance has get(key) / set(key, value) for configuration storage.

class AppConfig {
  // YOUR CODE HERE
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

// Exercise 3 — Object Pool
// An object pool reuses a fixed set of pre-created objects to avoid repeated
// allocation. Objects are acquired, used, and then released back to the pool.
//
// Task: implement createPool(factory, size) that:
//   - Creates `size` objects via factory() up front
//   - acquire() → returns an available object, or null if all are in use
//   - release(obj) → puts the object back in the pool

function createPool(factory, size) {
  // YOUR CODE HERE
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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Builder Pattern
// The Builder pattern separates the construction of a complex object from its
// representation, allowing step-by-step assembly via a fluent API.
//
// Task: implement QueryBuilder so that:
//   - .from(table)         — sets the table name
//   - .where(condition)    — appends a WHERE clause (can chain multiple times)
//   - .limit(n)            — sets a LIMIT clause
//   - .build()             — returns the SQL string

class QueryBuilder {
  // YOUR CODE HERE
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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 5 — Abstract Factory
// An abstract factory provides an interface for creating families of related
// objects without specifying their concrete classes.
//
// Task: implement createUIFactory(theme) where theme is 'light' or 'dark'.
//   The returned factory has:
//   - createButton()   → { render() → '<button class="<theme>-btn">...</button>' }
//   - createInput()    → { render() → '<input class="<theme>-input" />' }

function createUIFactory(theme) {
  // YOUR CODE HERE
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
