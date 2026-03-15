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

// ═══ LEVEL 2 — Object.create ════════════════════════════════════════════════

// Exercise 1 — Object.create inheritance
// Create an `animal` object with a speak() method that returns "...".
// Then create a `dog` object that inherits from `animal` and overrides speak()
// to return "Woof!". Use Object.create — no classes allowed.
const animal = {
  // YOUR CODE HERE
};

const dog = Object.create(animal);
// YOUR CODE HERE — add speak() override and a name property 'Rex'

console.log('\nLevel 2 — Object.create');
test('animal.speak() returns "..."', () => assertEq(animal.speak(), '...'));
test('dog inherits from animal', () => assert(Object.getPrototypeOf(dog) === animal));
test('dog.speak() returns "Woof!"', () => assertEq(dog.speak(), 'Woof!'));
test('dog.name is "Rex"', () => assertEq(dog.name, 'Rex'));
test('dog has own property "name"', () => assert(dog.hasOwnProperty('name')));
test('dog does NOT have own "speak"', () => assert(dog.hasOwnProperty('speak') === false));

// ═══ LEVEL 3 — hasOwnProperty vs in ════════════════════════════════════════

// Exercise 2 — Own vs inherited properties
// Implement getOwnProps(obj) — returns array of obj's OWN enumerable property names.
// Implement getAllProps(obj)  — returns array of ALL enumerable property names (own + prototype chain).
// Do NOT use Object.keys / Object.getOwnPropertyNames for getOwnProps (use the for-in + hasOwnProperty pattern).
function getOwnProps(obj) {
  // YOUR CODE HERE
}

function getAllProps(obj) {
  // YOUR CODE HERE
}

const base = { inherited: true };
const child = Object.create(base);
child.own1 = 1;
child.own2 = 2;

console.log('\nLevel 3 — hasOwnProperty vs in');
test('getOwnProps returns only own keys', () =>
  assertDeepEq(getOwnProps(child).sort(), ['own1', 'own2']));
test('getAllProps includes inherited key', () => assert(getAllProps(child).includes('inherited')));
test('getAllProps includes own keys', () => assert(getAllProps(child).includes('own1')));
test('getOwnProps excludes inherited key', () => assert(!getOwnProps(child).includes('inherited')));

// ═══ LEVEL 4 — Object.create polyfill ══════════════════════════════════════

// Exercise 3 — Implement objectCreate(proto, propertiesObject)
// Replicate the behaviour of Object.create(proto).
// The second argument (property descriptors) is optional — you may ignore it for the base implementation.
// Constraint: do NOT call Object.create inside your implementation.
function objectCreate(proto) {
  // YOUR CODE HERE
}

const protoA = {
  greet() {
    return `Hello from ${this.name}`;
  },
};
const objA = objectCreate(protoA);
objA.name = 'World';

console.log('\nLevel 4 — Object.create polyfill');
test('objectCreate sets correct prototype', () => assert(Object.getPrototypeOf(objA) === protoA));
test('objectCreate instance uses proto method', () => assertEq(objA.greet(), 'Hello from World'));
test('objectCreate(null) has null prototype', () =>
  assert(Object.getPrototypeOf(objectCreate(null)) === null));

// ═══ LEVEL 5 — Property shadowing ══════════════════════════════════════════

// Exercise 4 — Property shadowing
// Create a chain: grandparent → parent → grandchild (each via Object.create).
// grandparent has: kind = 'grandparent', describe() { return this.kind; }
// parent has: kind = 'parent'
// grandchild has: kind = 'grandchild'
//
// Implement shadowDemo() that returns an object:
//   { grandparent: grandparent.describe(), parent: parent.describe(), grandchild: grandchild.describe() }
// Each call to describe() must resolve `this.kind` from the calling object (shadowing).
function shadowDemo() {
  // YOUR CODE HERE — build the chain and return the result object
}

console.log('\nLevel 5 — Property shadowing');
test('grandparent.describe() → "grandparent"', () =>
  assertEq(shadowDemo().grandparent, 'grandparent'));
test('parent.describe()      → "parent"', () => assertEq(shadowDemo().parent, 'parent'));
test('grandchild.describe()  → "grandchild"', () =>
  assertEq(shadowDemo().grandchild, 'grandchild'));
test('each object has own kind', () => {
  const r = shadowDemo();
  // Verify structure by checking all three differ
  assert(r.grandparent !== r.parent && r.parent !== r.grandchild, 'all three should differ');
});
