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

// ═══ LEVEL 1 — readFileFake ══════════════════════════════════════════════════

// Exercise 1 — readFileFake(path, callback)
// Simulate an async file read using process.nextTick (or setTimeout(fn, 0)).
// The callback follows the Node.js error-first convention: cb(error, data).
// If path ends with '.missing', call cb(new Error('File not found'), null).
// Otherwise call cb(null, `content of ${path}`).
function readFileFake(path, cb) {
  // YOUR CODE HERE
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
      // Immediately after scheduling: called should still be false
      try {
        assert(!called, 'callback should not be called synchronously');
      } catch (e) {
        reject(e);
      }
    }),
);

// ═══ LEVEL 2 — Error-first callback wrapper ══════════════════════════════════

// Exercise 2 — tryCb(fn, cb)
// Wrap a synchronous function `fn` (that may throw) in an error-first callback pattern.
// Call cb(null, result) if fn succeeds, cb(err, null) if fn throws.
// fn receives no arguments.
function tryCb(fn, cb) {
  // YOUR CODE HERE
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

// ═══ LEVEL 3 — callbackify ═══════════════════════════════════════════════════

// Exercise 3 — callbackify(asyncFn)
// Convert a Promise-based function to callback style (Node.js convention).
// Returns a new function that, when called with the same args plus a trailing callback,
// invokes asyncFn(...args) and routes the result/error to cb(err, result).
// This is the inverse of util.promisify.
function callbackify(asyncFn) {
  // YOUR CODE HERE
}

// Example usage:
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
