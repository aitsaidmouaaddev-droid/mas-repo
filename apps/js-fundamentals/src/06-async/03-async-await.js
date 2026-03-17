// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r
        .then(() => console.log(`  ✅  ${label}`))
        .catch((e) => console.log(`  ❌  ${label}\n       → ${e.message}`));
    }
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}
function testAsync(label, fn) {
  return test(label, fn);
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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — async function basics
// An async function always returns a Promise. Use `await` to pause execution
// until the Promise resolves, then return the value.
//
// Task: implement fetchUser(id) as an async function.
//   - Await the provided asyncGetUser(id) call (returns a Promise<{id, name}>)
//   - Return the resolved user object.
//
// asyncGetUser is provided below — do not modify it.

function asyncGetUser(id) {
  return new Promise((resolve) => setTimeout(() => resolve({ id, name: `User-${id}` }), 0));
}

async function fetchUser(id) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — async/await basics');
testAsync('fetchUser(1) resolves to { id: 1, name: "User-1" }', async () => {
  const user = await fetchUser(1);
  assertEq(user.id, 1);
  assertEq(user.name, 'User-1');
});
testAsync('fetchUser(42) has correct id', async () => {
  const user = await fetchUser(42);
  assertEq(user.id, 42);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Error handling with try/catch
// Errors from awaited Promises bubble as thrown exceptions inside async functions.
// Use try/catch to handle them gracefully.
//
// Task: implement safeFetch(url) that:
//   - Awaits asyncFetch(url) (provided below)
//   - If it rejects (url.includes('fail')), returns the string 'error: ' + message
//   - Otherwise returns the result

function asyncFetch(url) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (url.includes('fail')) reject(new Error(`could not load ${url}`));
      else resolve(`data from ${url}`);
    }, 0),
  );
}

async function safeFetch(url) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — try/catch in async');
testAsync('successful fetch returns data', async () => {
  const result = await safeFetch('https://api.example.com/users');
  assertEq(result, 'data from https://api.example.com/users');
});
testAsync('failed fetch returns error string', async () => {
  const result = await safeFetch('https://api.fail.com/data');
  assertEq(result, 'error: could not load https://api.fail.com/data');
});

// Exercise 3 — Sequential vs Parallel execution
// Awaiting Promises one after another is sequential (slow).
// Using Promise.all with await runs them in parallel (fast).
//
// Task: implement fetchAll(ids) that fetches all users IN PARALLEL (use Promise.all)
// and returns the array of user objects.
//
// Sequential (bad):  for (const id of ids) { result.push(await fetchUser(id)); }
// Parallel  (good):  await Promise.all(ids.map(id => fetchUser(id)));

async function fetchAll(ids) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Parallel with Promise.all');
testAsync('fetches all users in correct order', async () => {
  const users = await fetchAll([1, 2, 3]);
  assertEq(users.length, 3);
  assertEq(users[0].id, 1);
  assertEq(users[1].id, 2);
  assertEq(users[2].id, 3);
});
testAsync('empty ids returns empty array', async () => {
  const users = await fetchAll([]);
  assertEq(users.length, 0);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Promise.allSettled
// Unlike Promise.all, Promise.allSettled never rejects early — it waits for ALL
// promises and returns { status: 'fulfilled'|'rejected', value/reason }.
//
// Task: implement fetchAllSettled(urls) — use Promise.allSettled to collect
// results from asyncFetch on each url. Return an array of:
//   { url, data: <value> }   for fulfilled results
//   { url, error: <message> } for rejected results

async function fetchAllSettled(urls) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Promise.allSettled');
testAsync('handles mix of success and failure', async () => {
  const results = await fetchAllSettled(['ok.com', 'fail.me', 'ok2.com']);
  assertEq(results[0].data, 'data from ok.com');
  assertEq(results[1].error, 'could not load fail.me');
  assertEq(results[2].data, 'data from ok2.com');
});

// Exercise 5 — Retry with async/await
// A common pattern: retry a flaky operation up to N times before giving up.
//
// Task: implement withRetry(fn, maxRetries) that:
//   - Calls fn() and awaits it
//   - If it rejects, retries up to maxRetries more times
//   - If all attempts fail, throws the last error

async function withRetry(fn, maxRetries) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Retry');
testAsync('succeeds on first attempt', async () => {
  const result = await withRetry(() => Promise.resolve('ok'), 3);
  assertEq(result, 'ok');
});
testAsync('retries and eventually succeeds', async () => {
  let attempts = 0;
  const result = await withRetry(() => {
    attempts++;
    if (attempts < 3) return Promise.reject(new Error('not yet'));
    return Promise.resolve('done');
  }, 5);
  assertEq(result, 'done');
  assertEq(attempts, 3);
});
testAsync('throws after max retries exceeded', async () => {
  let threw = false;
  await withRetry(() => Promise.reject(new Error('always fails')), 2).catch(() => {
    threw = true;
  });
  if (!threw) throw new Error('should have thrown after retries');
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 6 — Async Generator
// An async generator (async function*) yields values asynchronously.
// It is consumed with `for await...of`.
//
// Task: implement asyncRange(start, end, delayMs) — an async generator that
// yields integers from start (inclusive) to end (exclusive), with a delay of
// delayMs between each value. For tests we'll use delayMs = 0.

async function* asyncRange(start, end, delayMs = 0) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Async Generator');
testAsync('yields correct values', async () => {
  const values = [];
  for await (const n of asyncRange(1, 5, 0)) values.push(n);
  assertDeepEq(values, [1, 2, 3, 4]);
});
testAsync('empty range yields nothing', async () => {
  const values = [];
  for await (const n of asyncRange(3, 3, 0)) values.push(n);
  assertDeepEq(values, []);
});

// Exercise 7 — Rate limiter
// Process an array of items but no more than `concurrency` at a time.
//
// Task: implement rateLimited(items, concurrency, worker) where:
//   - worker(item) returns a Promise
//   - at most `concurrency` workers run simultaneously
//   - returns a Promise that resolves with all results in original order

async function rateLimited(items, concurrency, worker) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Rate Limiter (concurrency control)');
testAsync('processes all items and returns results in order', async () => {
  const items = [1, 2, 3, 4, 5];
  const results = await rateLimited(items, 2, (n) => Promise.resolve(n * 10));
  assertDeepEq(results, [10, 20, 30, 40, 50]);
});
testAsync('concurrency of 1 processes items sequentially', async () => {
  const log = [];
  await rateLimited([1, 2, 3], 1, (n) => {
    log.push(n);
    return Promise.resolve(n);
  });
  assertDeepEq(log, [1, 2, 3]);
});
