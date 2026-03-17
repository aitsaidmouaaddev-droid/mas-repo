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

// Exercise 1 — Object method this
// `this` inside a method refers to the object that called it
const obj = {
  name: 'test',
  getName() {
    // YOUR CODE HERE
  },
};

console.log('\nLevel 1 — Object method this');
test('obj.getName() returns the name property', () => assertEq(obj.getName(), 'test'));

// Exercise 2 — Lost this / Bound this
// When a method is extracted from an object and called as a plain function,
// `this` becomes undefined (strict mode) or the global object.
function makeObj(name) {
  return {
    name,
    getName() {
      return this.name;
    },
    getNameLost() {
      const fn = this.getName;
      return fn();
    },
    getNameBound() {
      // YOUR CODE HERE — use .bind so `this` is preserved
    },
  };
}

console.log('\nLevel 2 — Lost this vs bound this');
test('getNameLost() returns undefined (this is lost)', () => {
  const o = makeObj('Alice');
  assertEq(o.getNameLost(), undefined);
});
test('getNameBound() returns the correct name', () => {
  const o = makeObj('Alice');
  assertEq(o.getNameBound(), 'Alice');
});

// Exercise 3 — attachMethod
// Return a version of obj[method] permanently bound to obj
function attachMethod(obj, method) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — attachMethod (bind to preserve this)');
test('attachMethod returns a bound function', () => {
  const o = {
    x: 42,
    getX() {
      return this.x;
    },
  };
  const bound = attachMethod(o, 'getX');
  assertEq(bound(), 42);
});

// Exercise 4 — borrowMethod with call
// Call sourceObj[methodName] with targetObj as `this` and spread extra args
function borrowMethod(sourceObj, targetObj, methodName, ...args) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — borrowMethod (call / apply)');
test('borrowMethod calls with correct this and args', () => {
  const source = {
    greet(greeting) {
      return `${greeting}, ${this.name}!`;
    },
  };
  const target = { name: 'Ali' };
  assertEq(borrowMethod(source, target, 'greet', 'Hello'), 'Hello, Ali!');
});

// Exercise 5 — softBind
// Like .bind but only uses defaultThis when the actual this is nullish or the global object
function softBind(fn, defaultThis) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — softBind');
test('softBind uses defaultThis when called as plain function', () => {
  function greet() {
    return 'hi, ' + this.name;
  }
  const bound = softBind(greet, { name: 'Default' });
  assertEq(bound(), 'hi, Default');
});
test('softBind defers to explicit this when provided via call', () => {
  function greet() {
    return 'hi, ' + this.name;
  }
  const bound = softBind(greet, { name: 'Default' });
  assertEq(bound.call({ name: 'Explicit' }), 'hi, Explicit');
});

// Exercise 6 — myNew
// Implement the `new` operator from scratch
function myNew(Constructor, ...args) {
  // YOUR CODE HERE
}

console.log('\nLevel 5 — myNew (implement new from scratch)');
test('myNew creates instance with correct properties', () => {
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  Person.prototype.greet = function () {
    return `I am ${this.name}`;
  };
  const p = myNew(Person, 'Sam', 30);
  assertEq(p.name, 'Sam');
  assertEq(p.age, 30);
  assertEq(p.greet(), 'I am Sam');
  assert(p instanceof Person, 'should be instanceof Person');
});
test('myNew returns constructor return value when it is an object', () => {
  const special = { tag: 'special' };
  function Ctor() {
    return special;
  }
  assertEq(myNew(Ctor), special);
});
