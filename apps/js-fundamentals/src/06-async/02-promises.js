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
  Promise.resolve()
    .then(() => fn())
    .then(() => console.log(`  ✅  ${label}`))
    .catch((e) => console.log(`  ❌  ${label}\n       → ${e.message}`));
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

// ═══ LEVEL 2 — promisify ═════════════════════════════════════════════════════

// Exercise 1 — promisify(fn)
// Convert an error-first callback function into a Promise-returning function.
// The returned function passes all its arguments to fn, appending a generated callback.
// Resolve with the result value, reject with the error.
function promisify(fn) {
  // YOUR CODE HERE
}

function readFileFake(path, cb) {
  process.nextTick(() => {
    if (path.endsWith('.missing')) cb(new Error('not found'), null);
    else cb(null, `data:${path}`);
  });
}
const readFileAsync = promisify(readFileFake);

console.log('\nLevel 2 — promisify');
testAsync('promisify resolves on success', async () => {
  const data = await readFileAsync('hello.txt');
  assertEq(data, 'data:hello.txt');
});
testAsync('promisify rejects on error', async () => {
  let threw = false;
  try {
    await readFileAsync('x.missing');
  } catch {
    threw = true;
  }
  assert(threw, 'should have rejected');
});
testAsync('promisify works with multiple args', async () => {
  function add(a, b, cb) {
    process.nextTick(() => cb(null, a + b));
  }
  const addAsync = promisify(add);
  assertEq(await addAsync(3, 4), 7);
});

// ═══ LEVEL 3 — Promise.all polyfill ═════════════════════════════════════════

// Exercise 2 — promiseAll(promises)
// Implement Promise.all from scratch.
// Resolves with an array of results in the SAME ORDER as the input array.
// Rejects immediately with the first rejection reason.
// Handles non-Promise values by treating them as already-resolved.
function promiseAll(promises) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — promiseAll');
testAsync('resolves with all values in order', async () => {
  const res = await promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
  assertDeepEq(res, [1, 2, 3]);
});
testAsync('rejects on first rejection', async () => {
  let reason;
  await promiseAll([
    Promise.resolve(1),
    Promise.reject(new Error('fail')),
    Promise.resolve(3),
  ]).catch((e) => {
    reason = e.message;
  });
  assertEq(reason, 'fail');
});
testAsync('handles non-Promise values', async () => {
  const res = await promiseAll([1, Promise.resolve(2), 3]);
  assertDeepEq(res, [1, 2, 3]);
});
testAsync('empty array resolves immediately', async () => {
  const res = await promiseAll([]);
  assertDeepEq(res, []);
});

// ═══ LEVEL 4 — Promise.race polyfill ════════════════════════════════════════

// Exercise 3 — promiseRace(promises)
// Implement Promise.race from scratch.
// Settles (resolves or rejects) with the value/reason of whichever promise settles first.
function promiseRace(promises) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — promiseRace');
testAsync('resolves with fastest promise', async () => {
  const slow = new Promise((r) => setTimeout(() => r('slow'), 50));
  const fast = new Promise((r) => setTimeout(() => r('fast'), 10));
  const res = await promiseRace([slow, fast]);
  assertEq(res, 'fast');
});
testAsync('rejects with fastest rejection', async () => {
  const slow = new Promise((r) => setTimeout(() => r('slow'), 50));
  const fail = new Promise((_, r) => setTimeout(() => r(new Error('boom')), 10));
  let reason;
  await promiseRace([slow, fail]).catch((e) => {
    reason = e.message;
  });
  assertEq(reason, 'boom');
});

// ═══ LEVEL 5 — retry ════════════════════════════════════════════════════════

// Exercise 4 — retry(fn, n)
// Retry a Promise-returning function `fn` up to `n` times on failure.
// On success, resolve immediately.
// If all n attempts fail, reject with the last error.
// fn receives the current attempt number (1-indexed) as its argument.
function retry(fn, n) {
  // YOUR CODE HERE
}

console.log('\nLevel 5 — retry');
testAsync('resolves on first success', async () => {
  let calls = 0;
  const res = await retry(() => {
    calls++;
    return Promise.resolve('ok');
  }, 3);
  assertEq(res, 'ok');
  assertEq(calls, 1);
});
testAsync('retries on failure then succeeds', async () => {
  let calls = 0;
  const res = await retry(() => {
    calls++;
    if (calls < 3) return Promise.reject(new Error('not yet'));
    return Promise.resolve('done');
  }, 5);
  assertEq(res, 'done');
  assertEq(calls, 3);
});
testAsync('rejects after all n attempts', async () => {
  let calls = 0;
  let reason;
  await retry(() => {
    calls++;
    return Promise.reject(new Error(`attempt ${calls}`));
  }, 3).catch((e) => {
    reason = e.message;
  });
  assertEq(calls, 3);
  assertEq(reason, 'attempt 3');
});
