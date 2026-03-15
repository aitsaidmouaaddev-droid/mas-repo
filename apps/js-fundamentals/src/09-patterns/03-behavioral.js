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

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — Rookie
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 1 — Observer
// The Observer pattern defines a one-to-many dependency: when one object changes
// state, all its observers are notified automatically.
//
// Task: implement createEventEmitter() returning an object with:
//   - on(event, listener)   — register a listener for an event
//   - off(event, listener)  — remove a listener
//   - emit(event, ...args)  — call all listeners for the event with args

function createEventEmitter() {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — Observer (EventEmitter)');
test('listener is called on emit', () => {
  const emitter = createEventEmitter();
  let called = false;
  emitter.on('click', () => {
    called = true;
  });
  emitter.emit('click');
  assert(called);
});
test('listener receives arguments', () => {
  const emitter = createEventEmitter();
  let received;
  emitter.on('data', (val) => {
    received = val;
  });
  emitter.emit('data', 42);
  assertEq(received, 42);
});
test('multiple listeners are all called', () => {
  const emitter = createEventEmitter();
  let count = 0;
  emitter.on('ping', () => count++);
  emitter.on('ping', () => count++);
  emitter.emit('ping');
  assertEq(count, 2);
});
test('off removes a listener', () => {
  const emitter = createEventEmitter();
  let count = 0;
  const handler = () => count++;
  emitter.on('x', handler);
  emitter.off('x', handler);
  emitter.emit('x');
  assertEq(count, 0);
});
test('emitting unknown event does not throw', () => {
  const emitter = createEventEmitter();
  emitter.emit('noop'); // should not throw
  assert(true);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — Apprentice
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 2 — Strategy
// The Strategy pattern defines a family of algorithms, encapsulates each one,
// and makes them interchangeable at runtime.
//
// Task: implement createSorter(strategy) where strategy is a function that
//   sorts an array. The sorter exposes:
//   - sort(arr)              — returns a sorted copy using the current strategy
//   - setStrategy(strategy)  — replaces the current strategy

function createSorter(strategy) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Strategy');
test('sorts with ascending strategy', () => {
  const sorter = createSorter((a) => [...a].sort((x, y) => x - y));
  assertDeepEq(sorter.sort([3, 1, 2]), [1, 2, 3]);
});
test('sorts with descending strategy', () => {
  const sorter = createSorter((a) => [...a].sort((x, y) => y - x));
  assertDeepEq(sorter.sort([3, 1, 2]), [3, 2, 1]);
});
test('setStrategy swaps the strategy', () => {
  const sorter = createSorter((a) => [...a].sort((x, y) => x - y));
  sorter.setStrategy((a) => [...a].sort((x, y) => y - x));
  assertDeepEq(sorter.sort([3, 1, 2]), [3, 2, 1]);
});
test('sort returns a new array (no mutation)', () => {
  const sorter = createSorter((a) => [...a].sort((x, y) => x - y));
  const orig = [3, 1, 2];
  sorter.sort(orig);
  assertDeepEq(orig, [3, 1, 2]);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — Journeyman
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 3 — Command
// The Command pattern encapsulates a request as an object, allowing you to
// parameterise, queue, and undo operations.
//
// Task: implement createTextEditor() returning an editor with:
//   - value      (getter) — current text string
//   - execute(command)    — run command.execute() which mutates `value`
//   - undo()              — revert the last executed command
//
// Commands are objects: { execute(editor), undo(editor) }
// Provide two command factories:
//   - appendCommand(text) — appends text; undo removes it
//   - deleteLastCommand() — deletes the last character; undo re-appends it

function createTextEditor(initial = '') {
  // YOUR CODE HERE
}

function appendCommand(text) {
  // YOUR CODE HERE
}

function deleteLastCommand() {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Command');
test('append adds text', () => {
  const ed = createTextEditor();
  ed.execute(appendCommand('Hello'));
  assertEq(ed.value, 'Hello');
});
test('append then undo restores original', () => {
  const ed = createTextEditor('Hi');
  ed.execute(appendCommand(' there'));
  ed.undo();
  assertEq(ed.value, 'Hi');
});
test('deleteLastCommand removes last char', () => {
  const ed = createTextEditor('Hello');
  ed.execute(deleteLastCommand());
  assertEq(ed.value, 'Hell');
});
test('deleteLastCommand undo restores char', () => {
  const ed = createTextEditor('Hello');
  ed.execute(deleteLastCommand());
  ed.undo();
  assertEq(ed.value, 'Hello');
});
test('multiple undos work in LIFO order', () => {
  const ed = createTextEditor();
  ed.execute(appendCommand('A'));
  ed.execute(appendCommand('B'));
  ed.execute(appendCommand('C'));
  ed.undo();
  assertEq(ed.value, 'AB');
  ed.undo();
  assertEq(ed.value, 'A');
  ed.undo();
  assertEq(ed.value, '');
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — Expert
// ═══════════════════════════════════════════════════════════════════════════════

// Exercise 4 — Middleware Pipeline
// A middleware pipeline (popularised by Express/Koa) chains functions that each
// receive a context and a `next` function. Calling next() passes control to the
// next middleware. If a middleware does not call next(), the chain stops.
//
// Task: implement createPipeline(...fns) where each fn is (ctx, next) => void.
//   The returned pipeline exposes run(ctx) which executes the chain.

function createPipeline(...fns) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Middleware Pipeline');
test('single middleware is called', () => {
  let called = false;
  const pipeline = createPipeline((_ctx, next) => {
    called = true;
    next();
  });
  pipeline.run({});
  assert(called);
});
test('middleware receives context', () => {
  const ctx = { value: 0 };
  const pipeline = createPipeline((c, next) => {
    c.value++;
    next();
  });
  pipeline.run(ctx);
  assertEq(ctx.value, 1);
});
test('middlewares run in order', () => {
  const log = [];
  const pipeline = createPipeline(
    (_ctx, next) => {
      log.push(1);
      next();
    },
    (_ctx, next) => {
      log.push(2);
      next();
    },
    (_ctx, next) => {
      log.push(3);
      next();
    },
  );
  pipeline.run({});
  assertDeepEq(log, [1, 2, 3]);
});
test('middleware that skips next stops chain', () => {
  const log = [];
  const pipeline = createPipeline(
    (_ctx, next) => {
      log.push('A'); /* no next() */
    },
    (_ctx, next) => {
      log.push('B');
      next();
    },
  );
  pipeline.run({});
  assertDeepEq(log, ['A']);
});
test('wrapping pattern (pre/post next) works', () => {
  const log = [];
  const pipeline = createPipeline(
    (_ctx, next) => {
      log.push('before');
      next();
      log.push('after');
    },
    (_ctx, next) => {
      log.push('inner');
      next();
    },
  );
  pipeline.run({});
  assertDeepEq(log, ['before', 'inner', 'after']);
});
