/**
 * TDT challenge view — split editor.
 *
 * Left panel: pre-written test code (read-only).
 * Right panel: user's implementation (editable, seeded with starterCode).
 * Bottom: test results after clicking "Run tests".
 */
import { useState } from 'react';
import { Button, Typography, Stack, Badge, Alert, Icon, Spinner, CodeEditor } from '@mas/react-ui';
import {
  FiArrowLeft,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRotateCcw,
} from 'react-icons/fi';
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

  const allPassed = result && result.failed === 0 && result.passed > 0;

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
        <Typography variant="caption" className={styles.desc}>
          {challenge.description}
        </Typography>
      </div>

      {/* ── Split editor ── */}
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
      </div>

      {/* ── Results ── */}
      <div className={styles.results}>
        {running && (
          <Stack direction="horizontal" gap={8} align="center">
            <Spinner size="sm" />
            <Typography variant="caption">Running tests…</Typography>
          </Stack>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {result && !running && (
          <>
            <Stack direction="horizontal" gap={12} align="center" className={styles.resultSummary}>
              <Icon
                type="vector"
                icon={allPassed ? FiCheckCircle : FiXCircle}
                size={20}
                className={allPassed ? styles.iconPass : styles.iconFail}
              />
              <Typography variant="body">
                <strong>{result.passed}</strong> passed &nbsp;·&nbsp;
                <strong>{result.failed}</strong> failed
              </Typography>
              {allPassed && <Badge label="All tests passing" variant="success" />}
            </Stack>

            <div className={styles.testList}>
              {result.tests.map((t, i) => (
                <div key={i} className={styles.testRow}>
                  <Icon
                    type="vector"
                    icon={t.status === 'passed' ? FiCheckCircle : FiAlertCircle}
                    size={14}
                    className={t.status === 'passed' ? styles.iconPass : styles.iconFail}
                  />
                  <Typography variant="caption" className={styles.testTitle}>
                    {t.title}
                  </Typography>
                  {t.failureMessages.length > 0 && (
                    <pre className={styles.failureMsg}>
                      {t.failureMessages[0].split('\n').slice(0, 6).join('\n')}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
