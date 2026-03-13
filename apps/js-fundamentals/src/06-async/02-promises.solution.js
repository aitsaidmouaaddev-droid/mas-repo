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

// ─── Exercise 1 — promisify ───────────────────────────────────────────────────
//
// CONCEPT: Converting callback APIs to Promises
// WHY:     Node.js was built on callbacks before Promises existed. util.promisify
//          lets you use any error-first callback API with async/await. The trick is
//          to return a new function that creates a Promise and passes a generated
//          callback to the original function; resolve/reject map to success/error.
// WHEN:    Using legacy Node.js APIs (fs, crypto, dns) with async/await.
// WHERE:   Node.js util.promisify, Bluebird.promisify, any async adapter layer.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
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

// ─── Exercise 2 — promiseAll ──────────────────────────────────────────────────
//
// CONCEPT: Concurrent promise coordination
// WHY:     Promise.all starts ALL promises simultaneously (concurrently). It does NOT
//          await them one by one. The results array preserves input order regardless
//          of settlement order. Short-circuits on the first rejection — any remaining
//          promises still run but their results are discarded.
// WHEN:    Fetching multiple independent resources in parallel (user + posts + comments),
//          running test suites concurrently, batch processing.
// WHERE:   Any data-fetching layer, build tools running parallel tasks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;
          if (--remaining === 0) resolve(results);
        })
        .catch(reject);
    });
  });
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

// ─── Exercise 3 — promiseRace ─────────────────────────────────────────────────
//
// CONCEPT: Racing promises — first to settle wins
// WHY:     Promise.race resolves or rejects with whichever promise settles first.
//          This is useful for timeouts: race an actual fetch against a
//          `new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 5000))`.
//          Once one promise settles the outer promise is settled; remaining promises
//          still run but their settlements are ignored.
// WHEN:    Timeouts, feature detection (whichever API responds first), cancellation patterns.
// WHERE:   AbortController polyfills, network timeout wrappers, first-in-cache wins.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
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

// ─── Exercise 4 — retry ───────────────────────────────────────────────────────
//
// CONCEPT: Retry logic with Promises
// WHY:     Network requests, database calls, and other I/O operations fail transiently.
//          A retry wrapper handles this transparently without the caller knowing.
//          The recursive approach is clean: on failure, decrement n and recurse;
//          when n reaches 0, propagate the final error.
// WHEN:    HTTP requests with transient failures, database connection attempts,
//          flaky test retries, cloud API calls with rate limits.
// WHERE:   axios-retry, got retry plugin, pg-promise retry, AWS SDK retry logic.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

function retry(fn, n) {
  return fn(1).catch((err) => {
    if (n <= 1) return Promise.reject(err);
    // Wrap recursive retry in a function that offsets the attempt count
    const retryInner = (attempt, remaining) =>
      fn(attempt).catch((e) =>
        remaining <= 1 ? Promise.reject(e) : retryInner(attempt + 1, remaining - 1),
      );
    return retryInner(2, n - 1);
  });
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
