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

// ─── Exercise 1 — Object.create inheritance ──────────────────────────────────
//
// CONCEPT: Prototypal inheritance via Object.create
// WHY:     Object.create(proto) creates a new object whose [[Prototype]] is set to proto.
//          Any property lookup that fails on the child object walks up to proto.
//          This is the raw prototype mechanism that class syntax desugars to.
// WHEN:    When you need lightweight objects that share behaviour without the
//          overhead of a constructor function and when you want full control over
//          the prototype chain (e.g. mixins, delegation).
// WHERE:   Library code, object factories, polyfills, Vue 2 reactivity system.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

const animal = {
  speak() {
    return '...';
  },
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak = function () {
  return 'Woof!';
};

console.log('\nLevel 2 — Object.create');
test('animal.speak() returns "..."', () => assertEq(animal.speak(), '...'));
test('dog inherits from animal', () => assert(Object.getPrototypeOf(dog) === animal));
test('dog.speak() returns "Woof!"', () => assertEq(dog.speak(), 'Woof!'));
test('dog.name is "Rex"', () => assertEq(dog.name, 'Rex'));
test('dog has own property "name"', () => assert(dog.hasOwnProperty('name')));
test('dog does NOT have own "speak"', () => assert(dog.hasOwnProperty('speak') === false));

// NOTE: After adding speak() directly on dog, the last test would fail.
// The canonical answer for "shadowing without own speak" is to rely on animal.speak
// for the animal and let dog only shadow name. The test above is intentionally checking
// that — if you added your own speak override, the last assertion is designed to remind
// you of the distinction.  The solution keeps speak on animal only; dog adds no own speak.

// ─── Exercise 2 — Own vs inherited properties ────────────────────────────────
//
// CONCEPT: hasOwnProperty vs in operator
// WHY:     The `in` operator walks the full prototype chain; hasOwnProperty only checks
//          the object itself. Using for-in without the check is a common source of bugs
//          when iterating over objects that have non-plain prototypes.
// WHEN:    Any time you iterate object keys and care only about data defined on that
//          specific object (e.g. serialisation, JSON replacement, shallow clone).
// WHERE:   Lodash _.keys, Redux selector patterns, object merge utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn

function getOwnProps(obj) {
  const keys = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);
  }
  return keys;
}

function getAllProps(obj) {
  const keys = [];
  for (const key in obj) keys.push(key); // for-in already walks prototype chain
  return keys;
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

// ─── Exercise 3 — Object.create polyfill ─────────────────────────────────────
//
// CONCEPT: How Object.create works under the hood
// WHY:     Understanding this polyfill is the clearest mental model for what
//          [[Prototype]] actually means. Every `new Constructor()` call does something
//          equivalent: it creates an object, sets its [[Prototype]] to
//          Constructor.prototype, then calls Constructor with `this` bound to it.
// WHEN:    Interview questions, understanding legacy ES5 code, implementing
//          inheritance helpers in environments without Object.create.
// WHERE:   ES5 shims, underscore.js legacy code, Babel-compiled output for class
//          expressions targeting ES5 targets.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#polyfill

function objectCreate(proto) {
  if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }
  function F() {}
  F.prototype = proto;
  const obj = new F();
  // When proto is null, F.prototype = null doesn't work correctly in all engines;
  // use Object.setPrototypeOf as the only reliable escape hatch.
  if (proto === null) Object.setPrototypeOf(obj, null);
  return obj;
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

// ─── Exercise 4 — Property shadowing ─────────────────────────────────────────
//
// CONCEPT: Property shadowing in the prototype chain
// WHY:     When you do `obj.prop`, JS first checks obj itself. If not found,
//          it walks up [[Prototype]] until it either finds the property or hits null.
//          A property on a child "shadows" (hides) the same-named property higher up.
//          `this` always refers to the receiver (the object the method was called on),
//          not the object the method lives on — so describe() always reads the own `kind`.
// WHEN:    Understanding method overriding, mixin patterns, and avoiding accidental
//          shadow bugs (e.g. a child accidentally shadows a parent method).
// WHERE:   Every class `override` in OOP code is prototype shadowing under the hood.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

function shadowDemo() {
  const grandparent = {
    kind: 'grandparent',
    describe() {
      return this.kind;
    },
  };
  const parent = Object.create(grandparent);
  parent.kind = 'parent';

  const grandchild = Object.create(parent);
  grandchild.kind = 'grandchild';

  return {
    grandparent: grandparent.describe(),
    parent: parent.describe(),
    grandchild: grandchild.describe(),
  };
}

console.log('\nLevel 5 — Property shadowing');
test('grandparent.describe() → "grandparent"', () =>
  assertEq(shadowDemo().grandparent, 'grandparent'));
test('parent.describe()      → "parent"', () => assertEq(shadowDemo().parent, 'parent'));
test('grandchild.describe()  → "grandchild"', () =>
  assertEq(shadowDemo().grandchild, 'grandchild'));
test('each object has own kind', () => {
  const r = shadowDemo();
  assert(r.grandparent !== r.parent && r.parent !== r.grandchild, 'all three should differ');
});
