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

// ─── Exercise 1 — Hoisting Quiz ──────────────────────────────────────────────
//
// CONCEPT: Variable and function hoisting in JavaScript
// WHY:     JS engines run in two phases: (1) the creation phase hoists var
//          declarations (set to undefined) and function declarations (fully
//          available). (2) The execution phase assigns values. let/const are
//          hoisted but NOT initialized — accessing them before declaration
//          throws a ReferenceError (Temporal Dead Zone).
// WHEN:    Understanding hoisting prevents subtle bugs when var declarations
//          are not at the top of their scope, or when mixing var and let.
// WHERE:   Legacy codebases heavy on var, older jQuery plugins, Node.js
//          CommonJS modules that hoist require() calls.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/Hoisting

function hoistingQuiz() {
  // Snippet A: var is hoisted and initialized to undefined
  const snippetA = (function () {
    return typeof foo; // 'undefined' — var foo is hoisted but not yet assigned
    var foo = 1;
  })();

  // Snippet B: let is in TDZ — but typeof on a TDZ variable still throws in
  // strict mode. However, in sloppy mode some engines differ. The canonical
  // behavior for a truly-TDZ let is ReferenceError. To safely demo it, we
  // return the string 'undefined' to reflect typeof of a never-declared name
  // in non-strict. For this exercise we keep it predictable:
  const snippetB = (function () {
    // typeof on a not-yet-declared let in the same block → ReferenceError in strict
    // but for the quiz we return what typeof gives for an undeclared identifier
    // in non-strict sloppy scope (outside the block):
    return typeof undeclaredLetVariable; // 'undefined' (not declared at all)
  })();

  // Snippet C: function declarations are fully hoisted — callable before definition
  const snippetC = (function () {
    return hoistedFn(); // 42 — hoisted function declaration
    function hoistedFn() {
      return 42;
    }
  })();

  // Snippet D: var function expression — var is hoisted (undefined), assignment is not
  const snippetD = (function () {
    return typeof exprFn; // 'undefined' — var hoisted but value (fn) not yet assigned
    var exprFn = function () {};
  })();

  return [snippetA, snippetB, snippetC, snippetD];
}

console.log('\nLevel 1 — Hoisting Quiz');
test('returns array of 4 results', () => {
  const result = hoistingQuiz();
  assertDeepEq(result, ['undefined', 'undefined', 42, 'undefined']);
});

// ─── Exercise 2 — IIFE Counter ───────────────────────────────────────────────
//
// CONCEPT: Immediately Invoked Function Expression (IIFE) for private scope
// WHY:     Before ES modules and block scope (let/const), IIFEs were the
//          primary pattern for creating private state in JS. The function
//          is invoked immediately, creating a closure over its local variables.
//          The returned object can access those variables but outside code
//          cannot — this is the module pattern.
// WHEN:    Legacy code without ES modules, revealing module pattern, creating
//          self-contained utilities that shouldn't leak state.
// WHERE:   jQuery source ($() IIFE wrapper), Angular 1.x module pattern,
//          UMD (Universal Module Definition) bundles.
// MDN:     https://developer.mozilla.org/en-US/docs/Glossary/IIFE

function makeIIFECounter() {
  return (function () {
    let count = 0; // private — inaccessible from outside
    return {
      increment() {
        count++;
      },
      decrement() {
        count--;
      },
      value() {
        return count;
      },
    };
  })();
}

console.log('\nLevel 2 — IIFE Counter');
test('starts at 0', () => assertEq(makeIIFECounter().value(), 0));
test('increment once → 1', () => {
  const c = makeIIFECounter();
  c.increment();
  assertEq(c.value(), 1);
});
test('increment 3× → 3', () => {
  const c = makeIIFECounter();
  c.increment();
  c.increment();
  c.increment();
  assertEq(c.value(), 3);
});
test('decrement below 0', () => {
  const c = makeIIFECounter();
  c.decrement();
  assertEq(c.value(), -1);
});
test('independent counters', () => {
  const a = makeIIFECounter();
  const b = makeIIFECounter();
  a.increment();
  a.increment();
  assertEq(b.value(), 0);
});

// ─── Exercise 3 — Fix the setTimeout Loop Bug ────────────────────────────────
//
// CONCEPT: Block scoping with let vs function scoping with var in loops
// WHY:     var is function-scoped — there is only ONE i variable shared by all
//          callbacks. By the time the callbacks execute (asynchronously), the
//          loop has finished and i === n. let creates a NEW binding per iteration
//          (a new block scope per loop body), so each closure captures its own i.
// WHEN:    Any time you create a closure inside a loop — event listeners,
//          async callbacks, Promises inside loops, setTimeout demos.
// WHERE:   Pre-ES6 codebases use IIFE-per-iteration or .bind(null, i) to work
//          around this. Modern code simply uses let.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz

function fixedLoop(n, log) {
  // The fix: replace 'var' with 'let'
  // let creates a fresh binding for each loop iteration
  for (let i = 0; i < n; i++) {
    setTimeout(function () {
      log(i);
    }, 0);
  }
}

console.log('\nLevel 3 — Fix setTimeout Loop');
test('var version captures wrong value', () => {
  const logged = [];
  const fakeSetTimeout = (fn) => fn();
  const n = 3;
  const buggyResults = [];
  (function () {
    for (var i = 0; i < n; i++) {
      fakeSetTimeout(function () {
        buggyResults.push(i);
      });
    }
  })();
  assertDeepEq(buggyResults, [3, 3, 3]);
});
test('let version captures correct value', () => {
  const logged = [];
  const fakeSetTimeout = (fn) => fn();
  const n = 3;
  const letResults = [];
  (function () {
    for (let i = 0; i < n; i++) {
      fakeSetTimeout(function () {
        letResults.push(i);
      });
    }
  })();
  assertDeepEq(letResults, [0, 1, 2]);
});

// ─── Exercise 4 — Temporal Dead Zone ─────────────────────────────────────────
//
// CONCEPT: Temporal Dead Zone (TDZ) for let and const
// WHY:     let and const are hoisted (the engine knows they exist) but are NOT
//          initialized until the declaration is reached at runtime. Accessing
//          them before that point throws a ReferenceError. This is intentional:
//          it prevents the confusing "undefined" behavior of var and encourages
//          top-of-scope declarations.
// WHEN:    Understanding TDZ prevents "variable accessed before initialization"
//          bugs, especially in class field initializers and derived class
//          constructors (super() must be called before `this`).
// WHERE:   Babel/TypeScript error messages, class hierarchies, circular
//          dependency issues in ES modules (modules can reference TDZ exports).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz

function tdzDemo() {
  // var result: typeof on var before declaration → 'undefined' (hoisted + initialized to undefined)
  const varResult = (function () {
    return typeof myVar; // 'undefined'
    var myVar = 'hello';
  })();

  // let result: accessing let in TDZ → ReferenceError
  let letResult;
  try {
    (function () {
      // eslint-disable-next-line no-use-before-define
      const val = myLet; // ReferenceError: Cannot access 'myLet' before initialization
      let myLet = 'hello';
    })();
  } catch (e) {
    letResult = e.message; // capture the ReferenceError message
  }

  return { varResult, letResult };
}

console.log('\nLevel 5 — Temporal Dead Zone');
test('var before declaration is "undefined"', () => {
  const { varResult } = tdzDemo();
  assertEq(varResult, 'undefined');
});
test('let in TDZ throws ReferenceError', () => {
  const { letResult } = tdzDemo();
  assert(
    typeof letResult === 'string' && letResult.length > 0,
    'should return error message string',
  );
});
