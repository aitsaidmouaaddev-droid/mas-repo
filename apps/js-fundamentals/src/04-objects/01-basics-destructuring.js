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

// Exercise 1 — getFullName
// Destructure firstName and lastName in the parameter list; return "firstName lastName"
function getFullName({ firstName, lastName }) {
  // YOUR CODE HERE
}

// Exercise 2 — withDefaults
// Use default destructuring so missing keys fall back to name='Anonymous', age=0
function withDefaults({ name = 'Anonymous', age = 0 } = {}) {
  // YOUR CODE HERE
}

// Exercise 3 — swapValues
// Swap the values of key1 and key2 in obj using destructuring assignment; return new obj
function swapValues(obj, key1, key2) {
  // YOUR CODE HERE
}

// Exercise 4 — pick
// Return a new object containing only the specified keys
function pick(obj, keys) {
  // YOUR CODE HERE
}

// Exercise 5 — omit
// Return a new object without the specified keys
function omit(obj, keys) {
  // YOUR CODE HERE
}

// Exercise 6 — deepClone
// Deep clone a plain object (no functions/dates). Use JSON.parse(JSON.stringify).
function deepClone(obj) {
  // YOUR CODE HERE
}

// Exercise 7 — mergeDeep
// Deep merge: nested objects are merged recursively; arrays are replaced entirely
function mergeDeep(target, source) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — destructuring in params');
test('getFullName({firstName:"John",lastName:"Doe"}) → "John Doe"', () =>
  assertEq(getFullName({ firstName: 'John', lastName: 'Doe' }), 'John Doe'));
test('withDefaults({}) → {name:"Anonymous",age:0}', () =>
  assertDeepEq(withDefaults({}), { name: 'Anonymous', age: 0 }));
test('withDefaults({name:"Ali"}) → {name:"Ali",age:0}', () =>
  assertDeepEq(withDefaults({ name: 'Ali' }), { name: 'Ali', age: 0 }));

console.log('\nLevel 2 — swap & pick');
test('swapValues({a:1,b:2},"a","b") → {a:2,b:1}', () =>
  assertDeepEq(swapValues({ a: 1, b: 2 }, 'a', 'b'), { a: 2, b: 1 }));
test('pick({a:1,b:2,c:3},["a","c"]) → {a:1,c:3}', () =>
  assertDeepEq(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 }));

console.log('\nLevel 3 — omit & deepClone');
test('omit({a:1,b:2,c:3},["b"]) → {a:1,c:3}', () =>
  assertDeepEq(omit({ a: 1, b: 2, c: 3 }, ['b']), { a: 1, c: 3 }));
test('deepClone returns equal but distinct object', () => {
  const obj = { a: 1, nested: { b: 2 } };
  const clone = deepClone(obj);
  assertDeepEq(clone, obj);
  assert(clone !== obj, 'clone should not be same reference');
  clone.nested.b = 99;
  assertEq(obj.nested.b, 2); // original unaffected
});

console.log('\nLevel 4 — mergeDeep');
test('mergeDeep({a:{x:1,y:2},b:1},{a:{y:3,z:4}}) → {a:{x:1,y:3,z:4},b:1}', () =>
  assertDeepEq(mergeDeep({ a: { x: 1, y: 2 }, b: 1 }, { a: { y: 3, z: 4 } }), {
    a: { x: 1, y: 3, z: 4 },
    b: 1,
  }));
