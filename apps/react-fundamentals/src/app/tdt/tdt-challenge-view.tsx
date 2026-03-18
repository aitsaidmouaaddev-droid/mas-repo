/**
 * TDT challenge view — split editor.
 *
 * Left panel: pre-written test code (read-only).
 * Right panel: user's implementation (editable, seeded with starterCode).
 * Right sidebar: test results — hidden until tests run, then collapses/expands.
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
} from '@mas/react-ui';
import { FiArrowLeft, FiPlay, FiRotateCcw, FiExternalLink } from 'react-icons/fi';
import { tdtRepository } from '../../api';
import type { TdtChallenge, RunResult } from '../../api';
import styles from './tdt-challenge-view.module.scss';

interface TdtChallengeViewProps {
  challenge: TdtChallenge;
  onBack: () => void;
}

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

const categoryLabel: Record<TdtChallenge['category'], string> = {
  'react-hooks': 'React & Hooks',
  architecture: 'Architecture',
};

export function TdtChallengeView({ challenge, onBack }: TdtChallengeViewProps) {
  const [impl, setImpl] = useState(challenge.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await tdtRepository.run(challenge.id, impl);
      setResult(res);
    } catch {
      setError('Could not reach the test runner. Is the API server running?');
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setImpl(challenge.starterCode);
    setResult(null);
    setError(null);
  };

  const sidebarResult = result
    ? {
        passed: result.passed,
        failed: result.failed,
        tests: result.tests.map((t) => ({
          title: t.title,
          status: t.status as 'passed' | 'failed',
          failureMessages: t.failureMessages,
        })),
      }
    : null;

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />

        <Stack direction="horizontal" gap={8} align="center">
          <Typography variant="subtitle" className={styles.challengeTitle}>
            {challenge.title}
          </Typography>
          <Badge label={categoryLabel[challenge.category]} variant="secondary" />
          <Badge label={challenge.difficulty} variant={difficultyVariant[challenge.difficulty]} />
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
            {challenge.description}
          </Typography>
          {challenge.docs && (
            <a
              href={challenge.docs}
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
              code={challenge.testCode}
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
    </div>
  );
}
