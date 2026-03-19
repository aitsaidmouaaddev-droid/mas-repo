/**
 * TDT challenge view — split editor.
 *
 * Left panel: pre-written test code (read-only).
 * Right panel: user's implementation (editable, seeded with starterCode).
 * Right sidebar: test results — hidden until tests run, then collapses/expands.
 *
 * Tests run entirely in-browser via a lightweight describe/it/expect harness.
 * The impl code and test code are concatenated and executed via `new Function`.
 * Test code must not use import statements — it should call functions defined
 * in the impl code directly.
 */
import { useState } from 'react';
import {
  Button,
  Typography,
  Stack,
  Badge,
  Alert,
  Icon,
  CodeEditor,
  TestResultsSidebar,
  ToastContainer,
  useToast,
} from '@mas/react-ui';
import { FiArrowLeft, FiPlay, FiRotateCcw, FiExternalLink } from 'react-icons/fi';
import type { GqlTdtChallenge } from './tdt-catalog-view';
import styles from './tdt-challenge-view.module.scss';

// ─── Browser runner ────────────────────────────────────────────────────────────

interface TestResult {
  title: string;
  status: 'passed' | 'failed';
  failureMessages: string[];
}

interface RunResult {
  passed: number;
  failed: number;
  tests: TestResult[];
  logs: string;
}

function buildExpect(actual: unknown) {
  const j = (v: unknown): string => { try { return JSON.stringify(v); } catch { return String(v); } };
  const fail = (msg: string) => { throw new Error(msg); };

  return {
    toBe: (exp: unknown) => { if (!Object.is(actual, exp)) fail(`Expected ${j(exp)}, received ${j(actual)}`); },
    toEqual: (exp: unknown) => { if (j(actual) !== j(exp)) fail(`Expected ${j(exp)}, received ${j(actual)}`); },
    toBeTruthy: () => { if (!actual) fail(`Expected truthy, received ${j(actual)}`); },
    toBeFalsy: () => { if (actual) fail(`Expected falsy, received ${j(actual)}`); },
    toBeNull: () => { if (actual !== null) fail(`Expected null, received ${j(actual)}`); },
    toBeUndefined: () => { if (actual !== undefined) fail('Expected undefined'); },
    toBeDefined: () => { if (actual === undefined) fail('Expected defined'); },
    toContain: (exp: unknown) => {
      const ok = Array.isArray(actual) ? actual.includes(exp) : String(actual).includes(String(exp));
      if (!ok) fail(`Expected to contain ${j(exp)}`);
    },
    toHaveLength: (n: number) => {
      if ((actual as unknown[])?.length !== n)
        fail(`Expected length ${n}, received ${(actual as unknown[])?.length}`);
    },
    toBeGreaterThan: (n: number) => { if ((actual as number) <= n) fail(`Expected > ${n}, received ${actual}`); },
    toBeLessThan: (n: number) => { if ((actual as number) >= n) fail(`Expected < ${n}, received ${actual}`); },
    not: {
      toBe: (exp: unknown) => { if (Object.is(actual, exp)) fail(`Expected not ${j(exp)}`); },
      toEqual: (exp: unknown) => { if (j(actual) === j(exp)) fail(`Expected not equal to ${j(exp)}`); },
      toBeTruthy: () => { if (actual) fail('Expected not truthy'); },
      toBeFalsy: () => { if (!actual) fail('Expected not falsy'); },
      toBeNull: () => { if (actual === null) fail('Expected not null'); },
      toBeUndefined: () => { if (actual === undefined) fail('Expected defined'); },
      toContain: (exp: unknown) => {
        const has = Array.isArray(actual) ? actual.includes(exp) : String(actual).includes(String(exp));
        if (has) fail(`Expected not to contain ${j(exp)}`);
      },
    },
  };
}

async function runInBrowser(implCode: string, testCode: string): Promise<RunResult> {
  const results: TestResult[] = [];
  const logs: string[] = [];
  const pending: Array<{ title: string; fn: () => void | Promise<void> }> = [];

  const itFn = (title: string, fn: () => void | Promise<void>) => pending.push({ title, fn });
  const describeFn = (_: string, fn: () => void) => fn();
  const consoleMock = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' ')),
    warn: (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' ')),
    info: (...args: unknown[]) => logs.push('[info] ' + args.map(String).join(' ')),
  };

  try {
    // eslint-disable-next-line no-new-func
    new Function('expect', 'it', 'test', 'describe', 'console',
      `"use strict";\n${implCode}\n${testCode}`,
    )(buildExpect, itFn, itFn, describeFn, consoleMock);
  } catch (e) {
    return {
      passed: 0,
      failed: 1,
      tests: [{ title: 'Runtime error', status: 'failed', failureMessages: [String(e)] }],
      logs: logs.join('\n'),
    };
  }

  for (const t of pending) {
    try {
      await t.fn();
      results.push({ title: t.title, status: 'passed', failureMessages: [] });
    } catch (e) {
      results.push({ title: t.title, status: 'failed', failureMessages: [String(e)] });
    }
  }

  return {
    passed: results.filter((r) => r.status === 'passed').length,
    failed: results.filter((r) => r.status === 'failed').length,
    tests: results,
    logs: logs.join('\n'),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TdtChallengeViewProps {
  challenge: GqlTdtChallenge;
  onBack: () => void;
}

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

const categoryLabel: Record<string, string> = {
  'react-hooks': 'React & Hooks',
  architecture: 'Architecture',
};

export function TdtChallengeView({ challenge, onBack }: TdtChallengeViewProps) {
  const [impl, setImpl] = useState(challenge.data.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toasts, add: addToast, dismiss } = useToast();

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await runInBrowser(impl, challenge.data.testCode);
      setResult(res);
      if (res.failed === 0) {
        addToast({ variant: 'success', message: 'Tests passed' });
      } else {
        addToast({ variant: 'error', message: 'Tests failed' });
      }
    } catch {
      setError('Test runner encountered an unexpected error.');
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setImpl(challenge.data.starterCode);
    setResult(null);
    setError(null);
  };

  const sidebarResult = result
    ? {
        passed: result.passed,
        failed: result.failed,
        tests: result.tests.map((t) => ({
          title: t.title,
          status: t.status,
          failureMessages: t.failureMessages,
        })),
      }
    : null;

  const difficulty = challenge.difficulty as keyof typeof difficultyVariant;

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />

        <Stack direction="horizontal" gap={8} align="center">
          <Typography variant="subtitle" className={styles.challengeTitle}>
            {challenge.title}
          </Typography>
          <Badge label={categoryLabel[challenge.category] ?? challenge.category} variant="secondary" />
          <Badge
            label={challenge.difficulty}
            variant={difficultyVariant[difficulty] ?? 'primary'}
          />
        </Stack>

        <Stack direction="horizontal" gap={8}>
          <Button
            variant="ghost"
            size="sm"
            label="Reset"
            startIcon={FiRotateCcw}
            onClick={handleReset}
          />
          <Button
            variant="primary"
            size="sm"
            label={running ? 'Running…' : 'Run tests'}
            startIcon={FiPlay}
            disabled={running}
            onClick={handleRun}
          />
        </Stack>
      </div>

      {/* ── Description ── */}
      <div className={styles.descBar}>
        <Stack direction="horizontal" gap={12} align="center">
          <Typography variant="caption" className={styles.desc}>
            {challenge.data.description}
          </Typography>
          {challenge.data.docs && (
            <a
              href={challenge.data.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <Icon type="vector" icon={FiExternalLink} size={12} />
              Docs
            </a>
          )}
        </Stack>
      </div>

      {/* ── Error bar ── */}
      {error && (
        <div className={styles.errorBar}>
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* ── Split editor + results sidebar ── */}
      <div className={styles.editors}>
        <div className={styles.editorPanel}>
          <Typography variant="caption" className={styles.panelLabel}>
            Tests (read-only)
          </Typography>
          <div className={styles.editorWrapper}>
            <CodeEditor
              code={challenge.data.testCode}
              language="typescript"
              mode="view"
              filename="solution.test.ts"
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.editorPanel}>
          <Typography variant="caption" className={styles.panelLabel}>
            Your implementation
          </Typography>
          <div className={styles.editorWrapper}>
            <CodeEditor
              code={impl}
              language="typescript"
              mode="write"
              filename="solution.ts"
              onChange={setImpl}
            />
          </div>
        </div>

        <TestResultsSidebar result={sidebarResult} running={running} />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
