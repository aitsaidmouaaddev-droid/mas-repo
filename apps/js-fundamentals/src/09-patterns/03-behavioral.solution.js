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

// ─── Exercise 1 — Observer (EventEmitter) ────────────────────────────────────
//
// CONCEPT: The Observer pattern (also known as Publish/Subscribe at a broader
//          scope) defines a one-to-many relationship. A subject maintains a list
//          of observers and notifies them all when state changes occur.
// WHY:     Decouples producers from consumers — the emitter knows nothing about
//          its listeners. Enables reactive architectures where many parts of the
//          system react independently to the same events.
// WHEN:    UI events, model change notifications, inter-module communication,
//          real-time data feeds, logging hooks.
// WHERE:   Node.js EventEmitter, DOM addEventListener, RxJS Observable,
//          Redux store.subscribe, Vue $emit.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

function createEventEmitter() {
  const listeners = new Map(); // event → Set<listener>

  return {
    on(event, listener) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(listener);
    },
    off(event, listener) {
      listeners.get(event)?.delete(listener);
    },
    emit(event, ...args) {
      listeners.get(event)?.forEach((fn) => fn(...args));
    },
  };
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
  emitter.emit('noop');
  assert(true);
});

// ─── Exercise 2 — Strategy ───────────────────────────────────────────────────
//
// CONCEPT: The Strategy pattern defines a family of algorithms and makes them
//          interchangeable. The context object delegates work to a strategy
//          object that can be swapped at runtime without changing the context.
// WHY:     Replaces large if/switch blocks that select between algorithms.
//          Adding a new algorithm is adding a new strategy — no change to the
//          context.
// WHEN:    Sorting, payment processors, routing strategies, compression codecs,
//          authentication methods.
// WHERE:   Passport.js authentication strategies, Array.prototype.sort compareFn,
//          webpack optimisation plugins.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

function createSorter(strategy) {
  let currentStrategy = strategy;
  return {
    sort(arr) {
      return currentStrategy([...arr]);
    },
    setStrategy(newStrategy) {
      currentStrategy = newStrategy;
    },
  };
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

// ─── Exercise 3 — Command ────────────────────────────────────────────────────
//
// CONCEPT: The Command pattern encapsulates a request as an object, enabling
//          parameterisation of clients with different requests, queueing,
//          logging, and undoable operations. Each command knows how to execute
//          and reverse itself.
// WHY:     Key to implementing undo/redo (text editors, Photoshop), macro
//          recording, transaction rollback, and replay of user actions.
// WHEN:    Text editing, database transactions, UI action history,
//          job queues, game replay.
// WHERE:   VS Code undo stack, Redux actions (especially with redux-undo),
//          git commits & revert, database WAL.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

function createTextEditor(initial = '') {
  let value = initial;
  const history = [];

  return {
    get value() {
      return value;
    },
    execute(command) {
      command.execute({
        get value() {
          return value;
        },
        set value(v) {
          value = v;
        },
      });
      history.push(command);
    },
    undo() {
      const command = history.pop();
      if (command) {
        command.undo({
          get value() {
            return value;
          },
          set value(v) {
            value = v;
          },
        });
      }
    },
  };
}

function appendCommand(text) {
  return {
    execute(editor) {
      editor.value = editor.value + text;
    },
    undo(editor) {
      editor.value = editor.value.slice(0, -text.length);
    },
  };
}

function deleteLastCommand() {
  let deleted = '';
  return {
    execute(editor) {
      deleted = editor.value.slice(-1);
      editor.value = editor.value.slice(0, -1);
    },
    undo(editor) {
      editor.value = editor.value + deleted;
    },
  };
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

// ─── Exercise 4 — Middleware Pipeline ────────────────────────────────────────
//
// CONCEPT: A middleware pipeline chains functions (fn(ctx, next)) so each one
//          can perform work before and/or after delegating to the rest of the
//          chain via next(). If a middleware doesn't call next(), it short-
//          circuits the chain. This is the heart of Express/Koa/Fastify.
// WHY:     Decouples cross-cutting concerns (auth, logging, rate-limiting) from
//          business logic. Each concern is a separate, composable function.
//          Pipelines are built once and run many times.
// WHEN:    HTTP request handling, plugin systems, test interceptors,
//          data transformation pipelines.
// WHERE:   Express.js middleware, Koa.js (async compose), Redux middleware
//          (applyMiddleware), fetch interceptors.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters

function createPipeline(...fns) {
  return {
    run(ctx) {
      function dispatch(index) {
        if (index >= fns.length) return;
        fns[index](ctx, () => dispatch(index + 1));
      }
      dispatch(0);
    },
  };
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
