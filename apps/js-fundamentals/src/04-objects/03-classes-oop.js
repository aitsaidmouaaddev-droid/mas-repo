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

// ═══ LEVEL 2 — class Stack ══════════════════════════════════════════════════

// Exercise 1 — Stack data structure
// Implement a Stack class with:
//   push(item)  — add item to the top
//   pop()       — remove and return top item; return undefined if empty
//   peek()      — return top item without removing; return undefined if empty
//   isEmpty()   — return true if stack has no items
//   size        — getter returning number of items
class Stack {
  // YOUR CODE HERE
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

// ═══ LEVEL 3 — Inheritance + super ══════════════════════════════════════════

// Exercise 2 — Animal hierarchy
// class Animal(name, sound)  — constructor stores name and sound
//   speak()  — returns "${name} says ${sound}!"
//   toString() — returns "Animal(${name})"
//
// class Dog extends Animal(name) — always sound='Woof'
//   fetch(item) — returns "${name} fetches the ${item}!"
//   toString() — returns "Dog(${name})" (override)
class Animal {
  // YOUR CODE HERE
}

class Dog extends Animal {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Animal + Dog');
test('Animal.speak()', () => assertEq(new Animal('Cat', 'Meow').speak(), 'Cat says Meow!'));
test('Animal.toString()', () => assertEq(new Animal('Cat', 'Meow').toString(), 'Animal(Cat)'));
test('Dog inherits speak()', () => assertEq(new Dog('Rex').speak(), 'Rex says Woof!'));
test('Dog.fetch()', () => assertEq(new Dog('Rex').fetch('ball'), 'Rex fetches the ball!'));
test('Dog.toString() override', () => assertEq(new Dog('Rex').toString(), 'Dog(Rex)'));
test('Dog instanceof Animal', () => assert(new Dog('Rex') instanceof Animal));

// ═══ LEVEL 4 — Private fields ═══════════════════════════════════════════════

// Exercise 3 — BankAccount with private #balance
// class BankAccount(initialBalance = 0)
//   deposit(amount)   — add amount; throw Error if amount <= 0
//   withdraw(amount)  — subtract amount; throw Error if amount <= 0 or insufficient funds
//   get balance()     — returns current balance (read-only)
//   transfer(other, amount) — withdraw from this, deposit to other
class BankAccount {
  // YOUR CODE HERE
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

// ═══ LEVEL 5 — Mixins ═══════════════════════════════════════════════════════

// Exercise 4 — Mixin pattern
// Implement two mixin factory functions:
//
// Serializable(Base) — adds:
//   serialize()    → JSON string of own enumerable properties
//   static deserialize(json) → plain parsed object (not a class instance)
//
// Validatable(Base) — adds:
//   validate()  → returns true if all own enumerable properties are non-null/non-undefined
//   errors()    → returns array of property names that are null or undefined
//
// Then create:
//   class Person { constructor(name, age) { ... } }
//   class RichPerson extends Validatable(Serializable(Person)) {}
//
// Hint: mixin factories take a Base class and return a new class that extends Base.

function Serializable(Base) {
  // YOUR CODE HERE
}

function Validatable(Base) {
  // YOUR CODE HERE
}

class Person {
  // YOUR CODE HERE
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
