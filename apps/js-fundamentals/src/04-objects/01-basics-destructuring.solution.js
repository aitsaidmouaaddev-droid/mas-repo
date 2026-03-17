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

// ─── Exercise 1 — getFullName ─────────────────────────────────────────────────
//
// CONCEPT: Destructuring assignment in function parameters extracts named
//          properties directly into local variables, eliminating boilerplate
//          like `const firstName = obj.firstName`.
// WHY:     Makes the expected shape of an argument self-documenting at the
//          call site and inside the function body.
// WHEN:    Any function that only needs a subset of an object's properties.
// WHERE:   React component props, API response handlers, config readers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

// ─── Exercise 2 — withDefaults ────────────────────────────────────────────────
//
// CONCEPT: Default values in destructuring apply when a property is missing or
//          undefined. A default for the entire parameter (`= {}`) makes the
//          function safe to call with no argument at all.
// WHY:     Eliminates explicit `|| defaultValue` guards throughout the body.
// WHEN:    Configuration objects, optional settings, partial updates.
// WHERE:   React defaultProps pattern, options bags, SDK constructors.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value
function withDefaults({ name = 'Anonymous', age = 0 } = {}) {
  return { name, age };
}

// ─── Exercise 3 — swapValues ──────────────────────────────────────────────────
//
// CONCEPT: Array destructuring assignment lets you swap two variables without
//          a temporary variable: `[a, b] = [b, a]`. The same pattern applies
//          to object properties via computed keys.
// WHY:     Concise and intention-revealing — no temporary intermediate state.
// WHEN:    Sorting algorithms, toggling two states, coordinate transforms.
// WHERE:   Drag-and-drop reordering, game board manipulation, key remapping.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function swapValues(obj, key1, key2) {
  const result = { ...obj };
  [result[key1], result[key2]] = [result[key2], result[key1]];
  return result;
}

// ─── Exercise 4 — pick ────────────────────────────────────────────────────────
//
// CONCEPT: Build a new object containing only a white-listed subset of keys.
//          Object spread (`{ ...obj }`) copies all own enumerable properties;
//          selective construction via reduce copies only what you want.
// WHY:     Avoids exposing sensitive or irrelevant fields when passing data
//          across boundaries (e.g., serialising to JSON, sending to an API).
// WHEN:    Sanitising data, projecting database rows, preparing DTO shapes.
// WHERE:   API serialisers, Redux selector output, form value extraction.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
    return acc;
  }, {});
}

// ─── Exercise 5 — omit ────────────────────────────────────────────────────────
//
// CONCEPT: Complement of pick — copies all keys except those in a black-list.
//          Object.entries + filter + Object.fromEntries is a clean one-liner.
// WHY:     Useful when you know what to exclude rather than what to include.
// WHEN:    Removing internal/private fields, stripping metadata before saving.
// WHERE:   API response cleanup, Redux state normalisation, logging sanitisers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
function omit(obj, keys) {
  const keySet = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keySet.has(k)));
}

// ─── Exercise 6 — deepClone ───────────────────────────────────────────────────
//
// CONCEPT: JSON.parse(JSON.stringify(obj)) performs a deep clone of any plain
//          object containing only JSON-safe values (strings, numbers, booleans,
//          null, arrays, plain objects). Functions and Dates are not preserved.
// WHY:     Simple and dependency-free for data-only objects. `structuredClone`
//          is the modern alternative that handles more types.
// WHEN:    Creating immutable snapshots, undo/redo stacks, test fixtures.
// WHERE:   State management (Redux reducers), caching, config diffing.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ─── Exercise 7 — mergeDeep ───────────────────────────────────────────────────
//
// CONCEPT: Recursively merge two plain objects. When both target and source
//          have a plain-object value for the same key, recurse. Otherwise the
//          source value wins (arrays included — they are replaced, not merged).
// WHY:     Object.assign and spread are shallow — nested objects are replaced
//          entirely. Deep merge is needed for config layering and patch applies.
// WHEN:    Merging user settings over defaults, applying partial config patches.
// WHERE:   Configuration systems, theme overrides, deep state updates.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function mergeDeep(target, source) {
  const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key]) && isPlainObject(result[key])) {
      result[key] = mergeDeep(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
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
