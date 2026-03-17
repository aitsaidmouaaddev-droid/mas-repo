/**
 * Displays the aggregated pass/fail result for a single test-file run.
 *
 * Renders an {@link Alert} summary line, expandable failure pre-blocks for
 * each failing test, and an optional collapsible log panel.
 */
import { useState } from 'react';
import { Button, Alert, Stack } from '@mas/react-ui';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { RunResult } from '../../api';
import styles from './code-view.module.scss';

export function ResultBlock({ result }: { result: RunResult }) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <Stack direction="vertical" gap={8}>
      <Alert variant={result.failed > 0 ? 'error' : 'success'}>
        {result.passed} passed · {result.failed} failed
        {result.logs && (
          <Button
            variant="ghost"
            size="sm"
            label={showLogs ? 'Hide logs' : 'Show logs'}
            endIcon={showLogs ? FiChevronUp : FiChevronDown}
            onClick={() => setShowLogs((v) => !v)}
          />
        )}
      </Alert>

      {result.failed > 0 &&
        result.tests
          .filter((t) => t.status === 'failed')
          .map((t, i) => (
            <pre key={i} className={styles.failurePre}>
              {t.failureMessages.join('\n')}
            </pre>
          ))}

      {showLogs && <pre className={styles.logPre}>{result.logs}</pre>}
    </Stack>
  );
}
