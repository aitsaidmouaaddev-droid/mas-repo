/**
 * Browser-based test runner for TDT challenges.
 *
 * Handles JSX compilation (via Sucrase), import/export stripping,
 * and provides runtime shims for @testing-library/react, vi mocks,
 * and jest-dom matchers so challenge test code runs in the browser.
 */
import { transform } from 'sucrase';
import React from 'react';
import type ReactDOM from 'react-dom/client';
import * as ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TestResult {
  title: string;
  status: 'passed' | 'failed';
  failureMessages: string[];
}

export interface RunResult {
  passed: number;
  failed: number;
  tests: TestResult[];
  logs: string;
}

// ─── Import stripping ────────────────────────────────────────────────────────

/** Remove all `import ... from '...'` and `import '...'` lines */
function stripImports(code: string): string {
  return code
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '');
}

/**
 * Remove `export default` / `export` keywords but keep declarations,
 * and collect exported names into `__exports__` for `require('./solution')`.
 */
function stripExports(code: string): string {
  const exportedNames: string[] = [];
  let defaultName: string | null = null;

  let result = code.replace(
    /^\s*export\s+default\s+(function|class)\s+(\w+)/gm,
    (_match, keyword, name) => {
      defaultName = name;
      return `${keyword} ${name}`;
    },
  );
  result = result.replace(
    /^\s*export\s+(function|class|const|let|var)\s+(\w+)/gm,
    (_match, keyword, name) => {
      exportedNames.push(name);
      return `${keyword} ${name}`;
    },
  );
  // Catch remaining `export default` (e.g., `export default function(...)`)
  result = result.replace(/^\s*export\s+default\s+/gm, '');
  result = result.replace(/^\s*export\s+/gm, '');

  // Append __exports__ object for require('./solution') shim
  const entries = exportedNames.map((n) => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`);
  if (defaultName)
    entries.push(`default: typeof ${defaultName} !== 'undefined' ? ${defaultName} : undefined`);
  if (entries.length > 0) {
    result += `\nvar __exports__ = { ${entries.join(', ')} };\n`;
  } else {
    result += `\nvar __exports__ = {};\n`;
  }

  return result;
}

// ─── JSX compilation ─────────────────────────────────────────────────────────

function compileCode(code: string): string {
  const result = transform(code, {
    transforms: ['jsx', 'typescript'],
    jsxRuntime: 'classic',
    production: false,
  });
  return result.code;
}

// ─── vi mock shim ────────────────────────────────────────────────────────────

interface MockFn {
  (...args: unknown[]): unknown;
  mock: { calls: unknown[][]; results: { type: string; value: unknown }[] };
  mockReturnValue: (val: unknown) => MockFn;
  mockReturnValueOnce: (val: unknown) => MockFn;
  mockResolvedValue: (val: unknown) => MockFn;
  mockResolvedValueOnce: (val: unknown) => MockFn;
  mockRejectedValue: (val: unknown) => MockFn;
  mockRejectedValueOnce: (val: unknown) => MockFn;
  mockImplementation: (impl: (...args: unknown[]) => unknown) => MockFn;
  mockClear: () => MockFn;
  mockReset: () => MockFn;
}

function createMockFn(impl?: (...args: unknown[]) => unknown): MockFn {
  const returnOnce: unknown[] = [];
  let returnVal: unknown = undefined;
  let hasReturnVal = false;
  let currentImpl = impl;

  const fn = function mockFn(...args: unknown[]): unknown {
    fn.mock.calls.push(args);
    try {
      if (returnOnce.length > 0) {
        const val = returnOnce.shift()!;
        fn.mock.results.push({ type: 'return', value: val });
        return val;
      }
      if (hasReturnVal) {
        fn.mock.results.push({ type: 'return', value: returnVal });
        return returnVal;
      }
      if (currentImpl) {
        const result = currentImpl(...args);
        fn.mock.results.push({ type: 'return', value: result });
        return result;
      }
      fn.mock.results.push({ type: 'return', value: undefined });
      return undefined;
    } catch (e) {
      fn.mock.results.push({ type: 'throw', value: e });
      throw e;
    }
  } as MockFn;

  fn.mock = { calls: [], results: [] };
  fn.mockReturnValue = (val: unknown) => {
    hasReturnVal = true;
    returnVal = val;
    return fn;
  };
  fn.mockReturnValueOnce = (val: unknown) => {
    returnOnce.push(val);
    return fn;
  };
  fn.mockResolvedValue = (val: unknown) => fn.mockReturnValue(Promise.resolve(val));
  fn.mockResolvedValueOnce = (val: unknown) => fn.mockReturnValueOnce(Promise.resolve(val));
  fn.mockRejectedValue = (val: unknown) => fn.mockReturnValue(Promise.reject(val));
  fn.mockRejectedValueOnce = (val: unknown) => fn.mockReturnValueOnce(Promise.reject(val));
  fn.mockImplementation = (i: (...args: unknown[]) => unknown) => {
    currentImpl = i;
    return fn;
  };
  fn.mockClear = () => {
    fn.mock.calls = [];
    fn.mock.results = [];
    return fn;
  };
  fn.mockReset = () => {
    fn.mockClear();
    hasReturnVal = false;
    returnVal = undefined;
    currentImpl = undefined;
    returnOnce.length = 0;
    return fn;
  };

  return fn;
}

const spyRegistry: Array<{ target: Record<string, unknown>; method: string; original: unknown }> =
  [];

const vi = {
  fn: (impl?: (...args: unknown[]) => unknown) => createMockFn(impl),
  spyOn: (target: Record<string, unknown>, method: string) => {
    const original = target[method];
    const mock = createMockFn(
      typeof original === 'function' ? (original as (...args: unknown[]) => unknown) : undefined,
    );
    spyRegistry.push({ target, method, original });
    target[method] = mock;
    return mock;
  },
  restoreAllMocks: () => {
    for (const entry of spyRegistry) {
      entry.target[entry.method] = entry.original;
    }
    spyRegistry.length = 0;
  },
};

// ─── expect (comprehensive) ──────────────────────────────────────────────────

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const keysA = Object.keys(aObj);
  const keysB = Object.keys(bObj);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => deepEqual(aObj[k], bObj[k]));
}

function j(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function buildExpect(actual: unknown) {
  const fail = (msg: string) => {
    throw new Error(msg);
  };

  const matchers = {
    toBe: (exp: unknown) => {
      if (!Object.is(actual, exp)) fail(`Expected ${j(exp)}, received ${j(actual)}`);
    },
    toEqual: (exp: unknown) => {
      if (!deepEqual(actual, exp)) fail(`Expected ${j(exp)}, received ${j(actual)}`);
    },
    toBeTruthy: () => {
      if (!actual) fail(`Expected truthy, received ${j(actual)}`);
    },
    toBeFalsy: () => {
      if (actual) fail(`Expected falsy, received ${j(actual)}`);
    },
    toBeNull: () => {
      if (actual !== null) fail(`Expected null, received ${j(actual)}`);
    },
    toBeUndefined: () => {
      if (actual !== undefined) fail('Expected undefined');
    },
    toBeDefined: () => {
      if (actual === undefined) fail('Expected defined');
    },
    toBeNaN: () => {
      if (!Number.isNaN(actual)) fail(`Expected NaN, received ${j(actual)}`);
    },
    toBeGreaterThan: (n: number) => {
      if ((actual as number) <= n) fail(`Expected > ${n}, received ${actual}`);
    },
    toBeGreaterThanOrEqual: (n: number) => {
      if ((actual as number) < n) fail(`Expected >= ${n}, received ${actual}`);
    },
    toBeLessThan: (n: number) => {
      if ((actual as number) >= n) fail(`Expected < ${n}, received ${actual}`);
    },
    toBeLessThanOrEqual: (n: number) => {
      if ((actual as number) > n) fail(`Expected <= ${n}, received ${actual}`);
    },
    toContain: (exp: unknown) => {
      const ok = Array.isArray(actual)
        ? actual.includes(exp)
        : String(actual).includes(String(exp));
      if (!ok) fail(`Expected to contain ${j(exp)}`);
    },
    toHaveLength: (n: number) => {
      const len = (actual as unknown[] | string)?.length;
      if (len !== n) fail(`Expected length ${n}, received ${len}`);
    },
    toMatch: (pattern: RegExp | string) => {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      if (!regex.test(String(actual))) fail(`Expected ${j(actual)} to match ${pattern}`);
    },
    toThrow: (expected?: string | RegExp) => {
      if (typeof actual !== 'function') fail('Expected a function');
      let threw = false;
      let error: unknown;
      try {
        (actual as () => void)();
      } catch (e) {
        threw = true;
        error = e;
      }
      if (!threw) fail('Expected function to throw');
      if (expected) {
        const msg = error instanceof Error ? error.message : String(error);
        const ok = typeof expected === 'string' ? msg.includes(expected) : expected.test(msg);
        if (!ok) fail(`Expected throw message to match ${expected}, got "${msg}"`);
      }
    },
    toBeInstanceOf: (cls: new (...a: unknown[]) => unknown) => {
      if (!(actual instanceof cls)) fail(`Expected instance of ${cls.name}`);
    },

    // Mock matchers
    toHaveBeenCalled: () => {
      const fn = actual as MockFn;
      if (!fn?.mock?.calls?.length) fail('Expected mock to have been called');
    },
    toHaveBeenCalledTimes: (n: number) => {
      const fn = actual as MockFn;
      const count = fn?.mock?.calls?.length ?? 0;
      if (count !== n) fail(`Expected ${n} calls, received ${count}`);
    },
    toHaveBeenCalledWith: (...args: unknown[]) => {
      const fn = actual as MockFn;
      const calls = fn?.mock?.calls ?? [];
      const found = calls.some((c) => deepEqual(c, args));
      if (!found) fail(`Expected mock to have been called with ${j(args)}`);
    },

    // jest-dom matchers
    toBeInTheDocument: () => {
      const el = actual as Element | null;
      if (!el || !el.isConnected) fail('Expected element to be in the document');
    },
    toHaveTextContent: (text: string | RegExp) => {
      const el = actual as Element;
      const content = el?.textContent ?? '';
      const ok = typeof text === 'string' ? content.includes(text) : text.test(content);
      if (!ok) fail(`Expected text "${text}", received "${content}"`);
    },
    toHaveValue: (val: string) => {
      const el = actual as HTMLInputElement;
      if (el?.value !== val) fail(`Expected value "${val}", received "${el?.value}"`);
    },

    not: null as unknown,
  };

  // Build `not` variants
  matchers.not = {
    toBe: (exp: unknown) => {
      if (Object.is(actual, exp)) fail(`Expected not ${j(exp)}`);
    },
    toEqual: (exp: unknown) => {
      if (deepEqual(actual, exp)) fail(`Expected not equal to ${j(exp)}`);
    },
    toBeTruthy: () => {
      if (actual) fail('Expected not truthy');
    },
    toBeFalsy: () => {
      if (!actual) fail('Expected not falsy');
    },
    toBeNull: () => {
      if (actual === null) fail('Expected not null');
    },
    toBeUndefined: () => {
      if (actual === undefined) fail('Expected not undefined');
    },
    toContain: (exp: unknown) => {
      const has = Array.isArray(actual)
        ? actual.includes(exp)
        : String(actual).includes(String(exp));
      if (has) fail(`Expected not to contain ${j(exp)}`);
    },
    toMatch: (pattern: RegExp | string) => {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      if (regex.test(String(actual))) fail(`Expected ${j(actual)} not to match ${pattern}`);
    },
    toThrow: () => {
      if (typeof actual !== 'function') fail('Expected a function');
      let threw = false;
      try {
        (actual as () => void)();
      } catch {
        threw = true;
      }
      if (threw) fail('Expected function not to throw');
    },
    toBeInTheDocument: () => {
      const el = actual as Element | null;
      if (el && el.isConnected) fail('Expected element not to be in the document');
    },
    toHaveBeenCalled: () => {
      const fn = actual as MockFn;
      if (fn?.mock?.calls?.length) fail('Expected mock not to have been called');
    },
  };

  return matchers;
}

// ─── Testing Library shim ────────────────────────────────────────────────────

function createTestingLib() {
  let container: HTMLDivElement | null = null;
  let root: ReactDOM.Root | null = null;

  function getContainer(): HTMLDivElement {
    if (!container) {
      container = document.createElement('div');
      container.id = 'tdt-test-root';
      document.body.appendChild(container);
    }
    return container;
  }

  function cleanupContainer() {
    if (root) {
      root.unmount();
      root = null;
    }
    if (container) {
      container.remove();
      container = null;
    }
  }

  function render(element: React.ReactNode) {
    cleanupContainer();
    const c = getContainer();
    root = ReactDOMClient.createRoot(c);

    // React 18+ createRoot is async by default; use flushSync for synchronous rendering
    flushSync(() => {
      root!.render(element);
    });

    return {
      container: c,
      unmount: () => cleanupContainer(),
      rerender: (newElement: React.ReactNode) => {
        flushSync(() => {
          root!.render(newElement);
        });
      },
    };
  }

  // screen queries — delegate to container
  function getContainer_() {
    if (!container) throw new Error('No render() call — screen is empty');
    return container;
  }

  const screen = {
    getByText: (text: string | RegExp) => {
      const c = getContainer_();
      const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const match =
          typeof text === 'string'
            ? node.textContent?.includes(text)
            : text.test(node.textContent ?? '');
        if (match && node.parentElement) return node.parentElement;
      }
      // Also check element textContent
      const all = Array.from(c.querySelectorAll('*'));
      for (const el of all) {
        const content = el.textContent ?? '';
        const match =
          typeof text === 'string'
            ? content === text || content.includes(text)
            : text.test(content);
        if (match) {
          // Ensure this is the most specific element (no child matches)
          let hasChildMatch = false;
          for (const child of Array.from(el.children)) {
            const cc = child.textContent ?? '';
            const cm = typeof text === 'string' ? cc === text || cc.includes(text) : text.test(cc);
            if (cm) {
              hasChildMatch = true;
              break;
            }
          }
          if (!hasChildMatch) return el;
        }
      }
      throw new Error(`Unable to find element with text: ${text}`);
    },
    queryByText: (text: string | RegExp) => {
      try {
        return screen.getByText(text);
      } catch {
        return null;
      }
    },
    getAllByRole: (role: string) => {
      const c = getContainer_();
      const elements = Array.from(c.querySelectorAll(`[role="${role}"]`));
      // Also check implicit roles
      const implicit: Element[] = [];
      const q = (sel: string) => Array.from(c.querySelectorAll(sel));
      if (role === 'listitem') {
        implicit.push(...q('li'));
      } else if (role === 'list') {
        implicit.push(...q('ul, ol'));
      } else if (role === 'heading') {
        implicit.push(...q('h1, h2, h3, h4, h5, h6'));
      } else if (role === 'button') {
        implicit.push(...q('button, [type="button"]'));
      } else if (role === 'textbox') {
        implicit.push(...q('input[type="text"], input:not([type]), textarea'));
      } else if (role === 'paragraph') {
        implicit.push(...q('p'));
      }
      const combined = [...new Set([...elements, ...implicit])];
      if (combined.length === 0) throw new Error(`Unable to find any elements with role "${role}"`);
      return combined;
    },
    queryAllByRole: (role: string) => {
      try {
        return screen.getAllByRole(role);
      } catch {
        return [];
      }
    },
    getByRole: (role: string, options?: { level?: number; name?: string }) => {
      const all = screen.getAllByRole(role);
      if (options?.level) {
        const filtered = all.filter((el) => el.tagName === `H${options.level}`);
        if (filtered.length === 0)
          throw new Error(`Unable to find element with role "${role}" and level ${options.level}`);
        return filtered[0];
      }
      if (options?.name) {
        const filtered = all.filter((el) => {
          const txt = el.textContent ?? '';
          return typeof options.name === 'string' ? txt.includes(options.name) : false;
        });
        if (filtered.length === 0)
          throw new Error(`Unable to find element with role "${role}" and name "${options.name}"`);
        return filtered[0];
      }
      return all[0];
    },
    queryByRole: (role: string, options?: { level?: number }) => {
      try {
        return screen.getByRole(role, options);
      } catch {
        return null;
      }
    },
  };

  const fireEvent = {
    click: (el: Element) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    },
    change: (el: Element, opts?: { target?: { value?: string } }) => {
      if (opts?.target?.value !== undefined) {
        const input = el as HTMLInputElement;
        // React 16+ tracks value via internal fiber; use native setter to trigger onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, opts.target.value);
        } else {
          input.value = opts.target.value;
        }
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
  };

  async function waitFor(
    callback: () => void | Promise<void>,
    options?: { timeout?: number; interval?: number },
  ): Promise<void> {
    const timeout = options?.timeout ?? 3000;
    const interval = options?.interval ?? 50;
    const start = Date.now();
    let lastError: unknown;

    while (Date.now() - start < timeout) {
      try {
        await callback();
        return;
      } catch (e) {
        lastError = e;
      }
      await new Promise((r) => setTimeout(r, interval));
    }
    throw lastError ?? new Error('waitFor timed out');
  }

  function renderHook<T>(
    hook: (props?: Record<string, unknown>) => T,
    options?: { initialProps?: Record<string, unknown> },
  ) {
    const resultRef = { current: null as T };
    let latestProps = options?.initialProps;

    function TestComponent(props: Record<string, unknown>) {
      resultRef.current = hook(props);
      return null;
    }

    const { rerender: rerenderEl, unmount } = render(
      React.createElement(TestComponent, latestProps ?? {}),
    );

    return {
      result: resultRef,
      rerender: (newProps?: Record<string, unknown>) => {
        latestProps = newProps ?? latestProps;
        rerenderEl(React.createElement(TestComponent, latestProps ?? {}));
      },
      unmount,
    };
  }

  function act(fn: () => void | Promise<void>): void | Promise<void> {
    // Simple act: just run the function and flush
    const result = fn();
    if (result && typeof (result as Promise<void>).then === 'function') {
      return (result as Promise<void>).then(() => {
        flushSync(() => {
          /* flush pending state */
        });
      });
    }
    flushSync(() => {
      /* flush pending state */
    });
  }

  return { render, screen, fireEvent, waitFor, renderHook, act, cleanup: cleanupContainer };
}

// ─── Test harness ────────────────────────────────────────────────────────────

interface TestCase {
  title: string;
  fn: () => void | Promise<void>;
}

interface SuiteContext {
  tests: TestCase[];
  beforeEachFns: Array<() => void | Promise<void>>;
  afterEachFns: Array<() => void | Promise<void>>;
  beforeAllFns: Array<() => void | Promise<void>>;
  afterAllFns: Array<() => void | Promise<void>>;
}

// ─── Main runner ─────────────────────────────────────────────────────────────

export async function runInBrowser(implCode: string, testCode: string): Promise<RunResult> {
  const logs: string[] = [];
  const suites: SuiteContext[] = [];
  let currentSuite: SuiteContext = {
    tests: [],
    beforeEachFns: [],
    afterEachFns: [],
    beforeAllFns: [],
    afterAllFns: [],
  };
  suites.push(currentSuite);

  const testingLib = createTestingLib();

  // Harness functions
  const describeFn = (_title: string, fn: () => void) => {
    const parentSuite = currentSuite;
    currentSuite = {
      tests: [],
      beforeEachFns: [],
      afterEachFns: [],
      beforeAllFns: [],
      afterAllFns: [],
    };
    suites.push(currentSuite);
    fn();
    currentSuite = parentSuite;
  };
  const itFn = (title: string, fn: () => void | Promise<void>) =>
    currentSuite.tests.push({ title, fn });
  const beforeEachFn = (fn: () => void | Promise<void>) => currentSuite.beforeEachFns.push(fn);
  const afterEachFn = (fn: () => void | Promise<void>) => currentSuite.afterEachFns.push(fn);
  const beforeAllFn = (fn: () => void | Promise<void>) => currentSuite.beforeAllFns.push(fn);
  const afterAllFn = (fn: () => void | Promise<void>) => currentSuite.afterAllFns.push(fn);

  const consoleMock = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' ')),
    warn: (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' ')),
    info: (...args: unknown[]) => logs.push('[info] ' + args.map(String).join(' ')),
  };

  // 1. Strip imports/exports and compile
  let processedImpl = stripImports(implCode);
  processedImpl = stripExports(processedImpl);
  const processedTest = stripImports(testCode);
  const combined = `${processedImpl}\n;\n${processedTest}`;

  let compiled: string;
  try {
    compiled = compileCode(combined);
  } catch (e) {
    return {
      passed: 0,
      failed: 1,
      tests: [{ title: 'Compilation error', status: 'failed', failureMessages: [String(e)] }],
      logs: logs.join('\n'),
    };
  }

  // 2. Execute — collect test registrations
  //    Wrap compiled code so `require('./solution')` can access __exports__
  const wrappedCode = `${compiled}\nreturn typeof __exports__ !== 'undefined' ? __exports__ : {};`;

  // Placeholder for solution exports — filled after execution
  let solutionExports: Record<string, unknown> = {};

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'React',
      'useState',
      'useEffect',
      'useRef',
      'useCallback',
      'useMemo',
      'useReducer',
      'useContext',
      'createContext',
      'memo',
      'Component',
      'render',
      'screen',
      'fireEvent',
      'waitFor',
      'renderHook',
      'act',
      'expect',
      'describe',
      'it',
      'test',
      'beforeEach',
      'afterEach',
      'beforeAll',
      'afterAll',
      'vi',
      'console',
      'require',
      'document',
      wrappedCode,
    );
    solutionExports =
      fn(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useCallback,
        React.useMemo,
        React.useReducer,
        React.useContext,
        React.createContext,
        React.memo,
        React.Component,
        testingLib.render,
        testingLib.screen,
        testingLib.fireEvent,
        testingLib.waitFor,
        testingLib.renderHook,
        testingLib.act,
        buildExpect,
        describeFn,
        itFn,
        itFn,
        beforeEachFn,
        afterEachFn,
        beforeAllFn,
        afterAllFn,
        vi,
        consoleMock,
        // require shim — for tests that use require('react') / require('./solution')
        (mod: string) => {
          if (mod === 'react') return React;
          if (mod === 'react-dom') return { flushSync };
          if (mod === 'react-dom/client') return ReactDOMClient;
          if (mod === './solution' || mod === './Solution') return solutionExports;
          throw new Error(`Cannot require "${mod}" in browser`);
        },
        document,
      ) ?? {};
  } catch (e) {
    testingLib.cleanup();
    return {
      passed: 0,
      failed: 1,
      tests: [{ title: 'Runtime error', status: 'failed', failureMessages: [String(e)] }],
      logs: logs.join('\n'),
    };
  }

  // 3. Run collected tests
  const results: TestResult[] = [];

  for (const suite of suites) {
    // beforeAll
    for (const fn of suite.beforeAllFns) {
      try {
        await fn();
      } catch (e) {
        logs.push(`[beforeAll error] ${e}`);
      }
    }

    for (const t of suite.tests) {
      // beforeEach
      for (const fn of suite.beforeEachFns) {
        try {
          await fn();
        } catch (e) {
          logs.push(`[beforeEach error] ${e}`);
        }
      }

      try {
        await t.fn();
        results.push({ title: t.title, status: 'passed', failureMessages: [] });
      } catch (e) {
        results.push({ title: t.title, status: 'failed', failureMessages: [String(e)] });
      }

      // afterEach — cleanup DOM between tests
      for (const fn of suite.afterEachFns) {
        try {
          await fn();
        } catch (e) {
          logs.push(`[afterEach error] ${e}`);
        }
      }
      testingLib.cleanup();
    }

    // afterAll
    for (const fn of suite.afterAllFns) {
      try {
        await fn();
      } catch (e) {
        logs.push(`[afterAll error] ${e}`);
      }
    }
  }

  testingLib.cleanup();
  vi.restoreAllMocks();

  return {
    passed: results.filter((r) => r.status === 'passed').length,
    failed: results.filter((r) => r.status === 'failed').length,
    tests: results,
    logs: logs.join('\n'),
  };
}
