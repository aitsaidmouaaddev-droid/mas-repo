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

// ─── Exercise 1 — Basic Proxy: read-only object ───────────────────────────────
//
// CONCEPT: new Proxy(target, handler) intercepts operations on target.
//          The set trap receives (target, prop, value, receiver).
//          Reflect.get/set forward the operation to the original target with
//          correct prototype-chain semantics.
// WHY:     Proxies let you enforce invariants (immutability, access control)
//          transparently — callers use plain property syntax.
// WHEN:    Configuration objects, frozen API responses, capability objects.
// WHERE:   State managers (Immer uses Proxies), Vue 3 reactivity, MobX.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

function makeReadOnly(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set() {
      throw new TypeError('read-only');
    },
  });
}

// ─── Exercise 2 — Validation proxy ───────────────────────────────────────────
//
// CONCEPT: The set trap can run arbitrary logic before committing a write.
//          Returning false (or throwing) prevents the assignment.
// WHY:     Keeps validation co-located with the data object without class
//          boilerplate or setter methods for every field.
// WHEN:    Form models, domain entities, configuration objects with constraints.
// WHERE:   Runtime schema enforcement, developer-facing library configuration.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set

function validated(obj, schema) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      if (schema[prop] && !schema[prop](value)) {
        throw new TypeError(`Invalid value for "${prop}": ${JSON.stringify(value)}`);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

// ─── Exercise 3 — Default value proxy ────────────────────────────────────────
//
// CONCEPT: The get trap intercepts property reads.  If the property is absent
//          on the target, we return our default instead of undefined.
// WHY:     Eliminates repetitive `obj.key ?? default` guards at every use site.
// WHEN:    Configuration with fallbacks, sparse matrices, counted maps.
// WHERE:   Game state defaults, locale string lookups, feature flag registries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get

function withDefaults(obj, defaultValue) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop, receiver);
      }
      return defaultValue;
    },
  });
}

// ─── Exercise 4 — Negative array index proxy ─────────────────────────────────
//
// CONCEPT: Array indices arrive in the get trap as string keys.  Parsing them
//          lets us map negative numbers to the correct positive index.
// WHY:     Makes array tail-access ergonomic without Array.prototype.at() being
//          available (and demonstrates key remapping).
// WHEN:    Utility wrappers, Python-port helpers, ring buffers.
// WHERE:   Data processing utilities, test helpers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

function negativeIndex(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (Number.isInteger(index) && index < 0) {
        return Reflect.get(target, target.length + index, receiver);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

// ─── Exercise 5 — Observable proxy ───────────────────────────────────────────
//
// CONCEPT: The set trap fires before every assignment, making it trivial to
//          read the old value and then notify observers after committing.
// WHY:     Reactive UI frameworks (Vue 3, MobX) rely on this pattern to track
//          which data a component read and re-render when it changes.
// WHEN:    State management, undo/redo, audit logging.
// WHERE:   Vue 3 reactivity system, MobX observables, debugger watch tools.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set

function observable(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      const oldVal = Reflect.get(target, prop, receiver);
      const result = Reflect.set(target, prop, value, receiver);
      if (result) onChange(prop, value, oldVal);
      return result;
    },
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log('\nLevel 2 — Read-only proxy');
test('reading a property works', () => {
  const p = makeReadOnly({ x: 1 });
  assertEq(p.x, 1);
});
test('writing throws TypeError read-only', () => {
  const p = makeReadOnly({ x: 1 });
  let threw = false;
  try {
    p.x = 2;
  } catch (e) {
    threw = e instanceof TypeError && e.message === 'read-only';
  }
  assert(threw, 'expected TypeError with message "read-only"');
});
test('reading undefined key returns undefined', () => {
  const p = makeReadOnly({});
  assertEq(p.missing, undefined);
});

console.log('\nLevel 3 — Validation proxy');
test('valid set succeeds', () => {
  const obj = validated({ age: 0 }, { age: (v) => typeof v === 'number' && v >= 0 });
  obj.age = 25;
  assertEq(obj.age, 25);
});
test('invalid set throws', () => {
  const obj = validated({ age: 0 }, { age: (v) => typeof v === 'number' && v >= 0 });
  let threw = false;
  try {
    obj.age = -1;
  } catch (e) {
    threw = true;
  }
  assert(threw, 'should throw on invalid value');
});
test('keys without a schema validator pass through', () => {
  const obj = validated({}, {});
  obj.anything = 42;
  assertEq(obj.anything, 42);
});

console.log('\nLevel 3 — Default value proxy');
test('missing key returns default', () => {
  const p = withDefaults({ a: 1 }, 99);
  assertEq(p.missing, 99);
});
test('existing key returns its value', () => {
  const p = withDefaults({ a: 1 }, 99);
  assertEq(p.a, 1);
});
test('default of 0 works', () => {
  const p = withDefaults({}, 0);
  assertEq(p.x, 0);
});

console.log('\nLevel 4 — Negative array index proxy');
test('[-1] returns last element', () => {
  assertEq(negativeIndex([1, 2, 3])[-1], 3);
});
test('[-2] returns second-to-last', () => {
  assertEq(negativeIndex([1, 2, 3])[-2], 2);
});
test('[0] still works normally', () => {
  assertEq(negativeIndex([10, 20, 30])[0], 10);
});
test('length property still works', () => {
  assertEq(negativeIndex([1, 2, 3]).length, 3);
});

console.log('\nLevel 5 — Observable proxy');
test('onChange called with correct key and values', () => {
  const log = [];
  const obj = observable({ x: 1 }, (key, newVal, oldVal) => log.push({ key, newVal, oldVal }));
  obj.x = 42;
  assertEq(log.length, 1);
  assertEq(log[0].key, 'x');
  assertEq(log[0].newVal, 42);
  assertEq(log[0].oldVal, 1);
});
test('onChange called for new key with undefined oldVal', () => {
  const log = [];
  const obj = observable({}, (key, newVal, oldVal) => log.push({ key, newVal, oldVal }));
  obj.y = 7;
  assertEq(log[0].oldVal, undefined);
  assertEq(log[0].newVal, 7);
});
test('set still persists the value', () => {
  const obj = observable({ a: 0 }, () => {});
  obj.a = 99;
  assertEq(obj.a, 99);
});
