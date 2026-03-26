// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}
function testAsync(label, fn) {
  fn()
    .then(() => console.log(`  ✅  ${label}`))
    .catch((e) => console.log(`  ❌  ${label}\n       → ${e.message}`));
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg ?? 'assertion failed');
}
function assertEq(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── Exercise 1 — readFileFake ────────────────────────────────────────────────
//
// CONCEPT: Error-first (Node.js) callback convention
// WHY:     Node.js standardised on cb(err, data) so every async API has a uniform
//          signature — any function can route both success and failure through a single
//          callback parameter. Error as first arg forces callers to handle it; if you
//          skip the check the bug is obvious (result is undefined).
// WHEN:    Legacy Node.js APIs (fs.readFile, http.get), any pre-Promise async code.
// WHERE:   Node.js fs, crypto, dns, child_process modules, older npm packages.
// MDN:     https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing

function readFileFake(path, cb) {
  process.nextTick(() => {
    if (path.endsWith('.missing')) {
      cb(new Error('File not found'), null);
    } else {
      cb(null, `content of ${path}`);
    }
  });
}

console.log('\nLevel 1 — readFileFake');
testAsync(
  'reads existing file',
  () =>
    new Promise((resolve, reject) => {
      readFileFake('hello.txt', (err, data) => {
        if (err) return reject(err);
        try {
          assertEq(data, 'content of hello.txt');
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }),
);
testAsync(
  'errors on .missing file',
  () =>
    new Promise((resolve, reject) => {
      readFileFake('nope.missing', (err, data) => {
        try {
          assert(err instanceof Error, 'should be an Error');
          assertEq(data, null);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }),
);
testAsync(
  'callback called asynchronously',
  () =>
    new Promise((resolve, reject) => {
      let called = false;
      readFileFake('a.txt', () => {
        called = true;
        resolve();
      });
      try {
        assert(!called, 'callback should not be called synchronously');
      } catch (e) {
        reject(e);
      }
    }),
);

// ─── Exercise 2 — tryCb ──────────────────────────────────────────────────────
//
// CONCEPT: Wrapping synchronous exceptions in the error-first callback pattern
// WHY:     Mixing sync throws with async callbacks causes unpredictable behaviour —
//          the throw bubbles out of the async call stack, not the caller's try/catch.
//          tryCb normalises synchronous exceptions into the same error-first channel
//          so callers only need one error handling path.
// WHEN:    Any time you have a sync function inside an async pipeline
//          (e.g. JSON.parse inside a callback).
// WHERE:   Node.js core uses this pattern for json parsing in stream handlers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

function tryCb(fn, cb) {
  try {
    const result = fn();
    cb(null, result);
  } catch (err) {
    cb(err, null);
  }
}

console.log('\nLevel 2 — error-first callback wrapper');
test('tryCb passes result on success', () => {
  let result, error;
  tryCb(
    () => 42,
    (err, val) => {
      error = err;
      result = val;
    },
  );
  assertEq(error, null);
  assertEq(result, 42);
});
test('tryCb passes error on throw', () => {
  let result, error;
  tryCb(
    () => {
      throw new Error('boom');
    },
    (err, val) => {
      error = err;
      result = val;
    },
  );
  assert(error instanceof Error);
  assertEq(result, null);
});
test('tryCb works with any return type', () => {
  let result;
  tryCb(
    () => ({ ok: true }),
    (_, val) => {
      result = val;
    },
  );
  assertEq(result.ok, true);
});

// ─── Exercise 3 — callbackify ────────────────────────────────────────────────
//
// CONCEPT: Converting Promise-based APIs to callback style
// WHY:     Node.js util.callbackify does exactly this. Some older codebases or
//          frameworks expect callback-style APIs. Being able to bridge the two worlds
//          is essential when integrating modern async code with legacy systems.
//          Note the asymmetry: util.promisify goes cb → Promise, callbackify goes
//          Promise → cb. Together they cover both directions.
// WHEN:    Integrating async/await code with callback-based frameworks (e.g. Mocha
//          callback-style tests, older Express middleware patterns).
// WHERE:   Node.js util.callbackify, testing adapters, interop layers.
// MDN:     https://nodejs.org/api/util.html#utilcallbackifyoriginal

function callbackify(asyncFn) {
  return function (...args) {
    const cb = args.pop(); // last argument is the callback
    asyncFn(...args)
      .then((result) => cb(null, result))
      .catch((err) => cb(err, undefined));
  };
}

async function fetchUser(id) {
  if (id <= 0) throw new Error('Invalid ID');
  return { id, name: 'User' + id };
}
const fetchUserCb = callbackify(fetchUser);

console.log('\nLevel 3 — callbackify');
testAsync(
  'callbackify success path',
  () =>
    new Promise((resolve, reject) => {
      fetchUserCb(1, (err, user) => {
        try {
          assert(!err, `unexpected error: ${err}`);
          assertEq(user.name, 'User1');
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }),
);
testAsync(
  'callbackify error path',
  () =>
    new Promise((resolve, reject) => {
      fetchUserCb(-1, (err, user) => {
        try {
          assert(err instanceof Error, 'should receive Error');
          assertEq(user, undefined);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }),
);
