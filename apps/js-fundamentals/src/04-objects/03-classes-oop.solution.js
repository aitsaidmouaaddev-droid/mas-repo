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

// ─── Exercise 1 — Stack ───────────────────────────────────────────────────────
//
// CONCEPT: ES6 class syntax for data structures
// WHY:     class is syntactic sugar over prototype-based inheritance. The methods
//          are defined on the prototype, not copied to each instance. Getters/setters
//          are defined via Object.defineProperty under the hood.
// WHEN:    Any time you model an ADT (Abstract Data Type) — Stack, Queue, LinkedList —
//          or encapsulate state with well-defined operations.
// WHERE:   React Component class, DOM element subclassing, undo/redo history, call stacks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

class Stack {
  #items = [];

  push(item) {
    this.#items.push(item);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  get size() {
    return this.#items.length;
  }
}

console.log('\nLevel 2 — class Stack');
test('new Stack is empty', () => assert(new Stack().isEmpty()));
test('push then peek', () => {
  const s = new Stack();
  s.push(1);
  assertEq(s.peek(), 1);
});
test('push/pop LIFO order', () => {
  const s = new Stack();
  s.push(1);
  s.push(2);
  assertEq(s.pop(), 2);
  assertEq(s.pop(), 1);
});
test('pop on empty → undefined', () => assertEq(new Stack().pop(), undefined));
test('peek does not remove item', () => {
  const s = new Stack();
  s.push(42);
  s.peek();
  assertEq(s.size, 1);
});
test('size tracks correctly', () => {
  const s = new Stack();
  s.push('a');
  s.push('b');
  s.pop();
  assertEq(s.size, 1);
});
test('isEmpty after all pops', () => {
  const s = new Stack();
  s.push(1);
  s.pop();
  assert(s.isEmpty());
});

// ─── Exercise 2 — Animal + Dog ───────────────────────────────────────────────
//
// CONCEPT: Class inheritance and super
// WHY:     `extends` sets up the prototype chain. `super(...)` in a constructor
//          calls the parent constructor. `super.method()` calls the parent's version
//          of an overridden method. Without calling super() in a derived constructor
//          you cannot access `this` — the JS engine throws a ReferenceError.
// WHEN:    Modelling hierarchies where subclasses share behaviour but specialize it.
// WHERE:   React class components (extends Component), Node.js stream subclassing,
//          error subclassing (class AppError extends Error).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super

class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  speak() {
    return `${this.name} says ${this.sound}!`;
  }
  toString() {
    return `Animal(${this.name})`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, 'Woof');
  }
  fetch(item) {
    return `${this.name} fetches the ${item}!`;
  }
  toString() {
    return `Dog(${this.name})`;
  }
}

console.log('\nLevel 3 — Animal + Dog');
test('Animal.speak()', () => assertEq(new Animal('Cat', 'Meow').speak(), 'Cat says Meow!'));
test('Animal.toString()', () => assertEq(new Animal('Cat', 'Meow').toString(), 'Animal(Cat)'));
test('Dog inherits speak()', () => assertEq(new Dog('Rex').speak(), 'Rex says Woof!'));
test('Dog.fetch()', () => assertEq(new Dog('Rex').fetch('ball'), 'Rex fetches the ball!'));
test('Dog.toString() override', () => assertEq(new Dog('Rex').toString(), 'Dog(Rex)'));
test('Dog instanceof Animal', () => assert(new Dog('Rex') instanceof Animal));

// ─── Exercise 3 — BankAccount private fields ─────────────────────────────────
//
// CONCEPT: Private class fields (#)
// WHY:     Fields prefixed with # are genuinely private — not accessible from outside
//          the class body. This is enforced by the syntax (not convention like _balance).
//          Before private fields, developers used WeakMaps or closures; both were
//          cumbersome. Private fields are stored per-instance on the object itself.
// WHEN:    Encapsulating internal state that must not be mutated directly (balance,
//          internal counters, cached values).
// WHERE:   Financial calculations, game engines (health points), React internal fiber
//          implementation (V8 side), Node.js crypto modules.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

class BankAccount {
  #balance;

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error('Withdrawal amount must be positive');
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
  }

  transfer(other, amount) {
    this.withdraw(amount);
    other.deposit(amount);
  }
}

console.log('\nLevel 4 — BankAccount private fields');
test('initial balance', () => assertEq(new BankAccount(100).balance, 100));
test('deposit adds to balance', () => {
  const a = new BankAccount(0);
  a.deposit(50);
  assertEq(a.balance, 50);
});
test('withdraw subtracts balance', () => {
  const a = new BankAccount(100);
  a.withdraw(30);
  assertEq(a.balance, 70);
});
test('deposit 0 throws', () => {
  let threw = false;
  try {
    new BankAccount().deposit(0);
  } catch {
    threw = true;
  }
  assert(threw);
});
test('withdraw overdraft throws', () => {
  let threw = false;
  try {
    new BankAccount(10).withdraw(20);
  } catch {
    threw = true;
  }
  assert(threw);
});
test('balance is read-only (no set)', () => {
  const a = new BankAccount(5);
  try {
    a.balance = 999;
  } catch {}
  assertEq(a.balance, 5);
});
test('transfer moves funds', () => {
  const a = new BankAccount(100),
    b = new BankAccount(0);
  a.transfer(b, 40);
  assertEq(a.balance, 60);
  assertEq(b.balance, 40);
});

// ─── Exercise 4 — Mixins ─────────────────────────────────────────────────────
//
// CONCEPT: Mixin pattern via class factory functions
// WHY:     JS does not support multiple inheritance. Mixins let you compose behaviour
//          from multiple sources by wrapping a Base class in a function that returns
//          a new class extending Base. Each mixin adds methods to the prototype chain.
//          The key insight: `Validatable(Serializable(Person))` produces a chain
//          RichPerson → Validatable anon → Serializable anon → Person → Object.
// WHEN:    Cross-cutting concerns: logging, validation, serialisation, caching.
//          Preferred over deep inheritance chains (which become fragile).
// WHERE:   Ember.js Mixin system, TypeScript mixin pattern (official docs), Dart mixins.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins

function Serializable(Base) {
  return class extends Base {
    serialize() {
      // Collect own enumerable props into a plain object
      const data = {};
      for (const key of Object.keys(this)) data[key] = this[key];
      return JSON.stringify(data);
    }
    static deserialize(json) {
      return JSON.parse(json);
    }
  };
}

function Validatable(Base) {
  return class extends Base {
    validate() {
      return Object.keys(this).every((k) => this[k] !== null && this[k] !== undefined);
    }
    errors() {
      return Object.keys(this).filter((k) => this[k] === null || this[k] === undefined);
    }
  };
}

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class RichPerson extends Validatable(Serializable(Person)) {}

console.log('\nLevel 5 — Mixins');
test('serialize returns JSON string', () => {
  const p = new RichPerson('Alice', 30);
  const obj = JSON.parse(p.serialize());
  assertEq(obj.name, 'Alice');
  assertEq(obj.age, 30);
});
test('deserialize returns plain object', () => {
  const p = new RichPerson('Bob', 25);
  const obj = RichPerson.deserialize(p.serialize());
  assertEq(typeof obj, 'object');
  assertEq(obj.name, 'Bob');
});
test('validate() true when all set', () => assert(new RichPerson('Alice', 30).validate()));
test('validate() false when missing', () => assert(!new RichPerson('Alice', null).validate()));
test('errors() returns missing keys', () =>
  assertDeepEq(new RichPerson('Alice', null).errors(), ['age']));
test('errors() empty when valid', () => assertDeepEq(new RichPerson('Alice', 30).errors(), []));
