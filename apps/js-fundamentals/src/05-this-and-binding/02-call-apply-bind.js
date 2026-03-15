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

// ═══ LEVEL 2 — myCall ════════════════════════════════════════════════════════

// Exercise 1 — Implement Function.prototype.myCall(context, ...args)
// Must behave exactly like .call():
//   - invokes `this` (the function) with `context` as its `this`
//   - passes remaining arguments individually to the function
//   - returns the return value of the function
//   - if context is null/undefined, use globalThis
// Hint: temporarily assign the function to a property on context, call it, delete the property.
Function.prototype.myCall = function (context, ...args) {
  // YOUR CODE HERE
};

function sum(a, b) {
  return a + b;
}
const obj1 = { multiplier: 3 };
function scale(x) {
  return x * this.multiplier;
}

console.log('\nLevel 2 — myCall');
test('myCall basic invocation', () => assertEq(sum.myCall(null, 2, 3), 5));
test('myCall sets this correctly', () => assertEq(scale.myCall(obj1, 4), 12));
test('myCall with no args', () => {
  function getName() {
    return this.name;
  }
  assertEq(getName.myCall({ name: 'Zoe' }), 'Zoe');
});
test('myCall returns correct value', () => {
  function multiply(a, b, c) {
    return a * b * c;
  }
  assertEq(multiply.myCall(null, 2, 3, 4), 24);
});

// ═══ LEVEL 3 — myApply ═══════════════════════════════════════════════════════

// Exercise 2 — Implement Function.prototype.myApply(context, argsArray)
// Must behave exactly like .apply():
//   - invokes the function with context as `this`
//   - argsArray is an array (or array-like) of arguments; if null/undefined treat as []
//   - returns the function's return value
Function.prototype.myApply = function (context, argsArray) {
  // YOUR CODE HERE
};

console.log('\nLevel 3 — myApply');
test('myApply basic invocation', () => assertEq(sum.myApply(null, [7, 8]), 15));
test('myApply sets this correctly', () => assertEq(scale.myApply(obj1, [5]), 15));
test('myApply with null argsArray', () => {
  function zero() {
    return 0;
  }
  assertEq(zero.myApply(null, null), 0);
});
test('myApply spread use-case (Math.max)', () => {
  assertEq(Math.max.myApply(null, [3, 1, 4, 1, 5, 9, 2, 6]), 9);
});

// ═══ LEVEL 4 — myBind ════════════════════════════════════════════════════════

// Exercise 3 — Implement Function.prototype.myBind(context, ...partialArgs)
// Must behave exactly like .bind():
//   - returns a NEW function with `this` permanently set to context
//   - supports partial application: pre-fills the first N args
//   - the returned function can be called with additional args
//   - bound `this` cannot be overridden by a subsequent .call()/.apply()
//   - BONUS: the bound function, when used as a constructor (new BoundFn()),
//     should ignore the bound context (like native bind). This is advanced —
//     implement the basic version first.
Function.prototype.myBind = function (context, ...partialArgs) {
  // YOUR CODE HERE
};

function add(a, b, c) {
  return a + b + c;
}
const addFive = add.myBind(null, 5); // partial: first arg is 5
const addFiveTen = add.myBind(null, 5, 10); // partial: first two args

console.log('\nLevel 4 — myBind');
test('myBind basic binding', () => assertEq(scale.myBind(obj1)(4), 12));
test('myBind partial application (1 arg)', () => assertEq(addFive(3, 2), 10));
test('myBind partial application (2 args)', () => assertEq(addFiveTen(1), 16));
test('myBind bound this cannot be overridden', () => {
  function who() {
    return this.name;
  }
  const bound = who.myBind({ name: 'Alice' });
  assertEq(bound.call({ name: 'Bob' }), 'Alice');
});
test('myBind returns a function', () => assert(typeof scale.myBind(obj1) === 'function'));
