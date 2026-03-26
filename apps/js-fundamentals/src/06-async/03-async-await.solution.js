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

// ─── Exercise 1 — async function basics ──────────────────────────────────────
//
// CONCEPT: `async function` declarations automatically wrap their return value
//          in a Promise.  Inside them, `await expr` pauses execution until the
//          Promise resolves and returns its value — making async code look and
//          read like synchronous code.
// WHY:     Dramatically improves readability over raw .then() chains while
//          keeping the same non-blocking behaviour under the hood.
// WHEN:    Any time you work with Promises: HTTP calls, DB queries, file I/O,
//          timers, web crypto.
// WHERE:   Everywhere in modern JS — React useEffect, Express route handlers,
//          Node.js scripts, serverless functions.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

function asyncGetUser(id) {
  return new Promise((resolve) => setTimeout(() => resolve({ id, name: `User-${id}` }), 0));
}

async function fetchUser(id) {
  return await asyncGetUser(id);
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

// ─── Exercise 2 — Error handling with try/catch ───────────────────────────────
//
// CONCEPT: When an awaited Promise rejects, it throws synchronously inside the
//          async function.  This means standard try/catch works exactly like it
//          does for synchronous errors.
// WHY:     Consistent, readable error handling without nested .catch() chains.
//          You can use finally for cleanup just as in synchronous code.
// WHEN:    Any async operation that might fail: network requests, DB writes,
//          parsing user input, third-party API calls.
// WHERE:   HTTP clients (fetch, axios), ORMs (prisma, mongoose), fs.promises.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

function asyncFetch(url) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (url.includes('fail')) reject(new Error(`could not load ${url}`));
      else resolve(`data from ${url}`);
    }, 0),
  );
}

async function safeFetch(url) {
  try {
    return await asyncFetch(url);
  } catch (e) {
    return `error: ${e.message}`;
  }
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

// ─── Exercise 3 — Sequential vs Parallel execution ───────────────────────────
//
// CONCEPT: Awaiting Promises in sequence means each starts only after the
//          previous finishes — total time = sum of all durations. Starting them
//          all at once with Promise.all means total time = max duration.
// WHY:     Parallel execution can make a function 10× faster when fetching
//          independent data (e.g., user + profile + settings all at once).
// WHEN:    Fetching independent resources. NEVER for dependent requests
//          (e.g., get token → then use token).
// WHERE:   Dashboard data loading, batch API calls, parallel DB queries.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

async function fetchAll(ids) {
  return Promise.all(ids.map((id) => fetchUser(id)));
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

// ─── Exercise 4 — Promise.allSettled ─────────────────────────────────────────
//
// CONCEPT: Promise.all short-circuits on the first rejection. Promise.allSettled
//          always waits for every promise and returns an array of outcome
//          descriptors — { status: 'fulfilled', value } or
//          { status: 'rejected', reason }.
// WHY:     Ideal for "best effort" batch operations where partial success is
//          acceptable and you want to report which items failed.
// WHEN:    Bulk notifications, batch job processing, multi-source data loading
//          where missing one result isn't fatal.
// WHERE:   Email batch send, parallel DB upserts, CDN replication checks.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

async function fetchAllSettled(urls) {
  const outcomes = await Promise.allSettled(urls.map((url) => asyncFetch(url)));
  return outcomes.map((outcome, i) => {
    if (outcome.status === 'fulfilled') {
      return { url: urls[i], data: outcome.value };
    }
    return { url: urls[i], error: outcome.reason.message };
  });
}

console.log('\nLevel 3 — Promise.allSettled');
testAsync('handles mix of success and failure', async () => {
  const results = await fetchAllSettled(['ok.com', 'fail.me', 'ok2.com']);
  assertEq(results[0].data, 'data from ok.com');
  assertEq(results[1].error, 'could not load fail.me');
  assertEq(results[2].data, 'data from ok2.com');
});

// ─── Exercise 5 — Retry with async/await ─────────────────────────────────────
//
// CONCEPT: Async retry wraps a flaky operation in a loop, catching errors and
//          re-running until it either succeeds or exhausts attempts. Using
//          async/await makes the loop syntactically simple.
// WHY:     Network calls fail transiently. A retry strategy (with optional
//          exponential backoff) makes systems resilient to momentary outages.
// WHEN:    REST calls, database connections on startup, cloud service API
//          calls with rate-limit errors.
// WHERE:   Axios interceptors, database ORM lifecycle hooks, cloud SDK wrappers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of

async function withRetry(fn, maxRetries) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
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

// ─── Exercise 6 — Async Generator ────────────────────────────────────────────
//
// CONCEPT: An async generator (async function*) can yield values that come from
//          awaited Promises.  The consumer uses `for await...of` to iterate,
//          pausing the loop body until each yielded Promise resolves.
// WHY:     Enables lazy, memory-efficient streaming of async data — pages of DB
//          results, SSE events, chunked HTTP responses — without buffering
//          everything in memory.
// WHEN:    Paginated API consumption, SSE/WebSocket message streams, file
//          streaming, infinite scroll data sources.
// WHERE:   Node.js Readable streams (async iterable), Prisma cursor, GitHub API
//          pagination, server-sent events.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

async function* asyncRange(start, end, delayMs = 0) {
  for (let i = start; i < end; i++) {
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    yield i;
  }
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

// ─── Exercise 7 — Rate Limiter (concurrency control) ─────────────────────────
//
// CONCEPT: A concurrency limit prevents overwhelming a downstream service by
//          ensuring at most N async tasks run at the same time. Implemented
//          by keeping a pool of active Promises and awaiting one to finish
//          before starting another.
// WHY:     Without concurrency control, mapping a large array with async work
//          launches everything at once — potentially hitting API rate limits,
//          exhausting DB connections, or crashing a server.
// WHEN:    Bulk API calls, image processing pipelines, DB batch inserts,
//          web scraping with politeness limits.
// WHERE:   p-limit / p-map (npm), Bottleneck, queue-based Lambda triggers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

async function rateLimited(items, concurrency, worker) {
  const results = new Array(items.length);
  const executing = new Set();

  for (let i = 0; i < items.length; i++) {
    const idx = i;
    const p = Promise.resolve()
      .then(() => worker(items[idx]))
      .then((result) => {
        results[idx] = result;
        executing.delete(p);
      });
    executing.add(p);
    if (executing.size >= concurrency) {
      await Promise.race(executing); // wait for one slot to free up
    }
  }
  await Promise.all(executing); // drain remaining
  return results;
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
