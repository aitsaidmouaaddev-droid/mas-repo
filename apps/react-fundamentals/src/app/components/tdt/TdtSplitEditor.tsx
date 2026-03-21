import { Typography, CodeEditor, TestResultsSidebar } from '@mas/react-ui';
import type { RunResult } from '../../tdt/browser-test-runner';
import styles from './TdtSplitEditor.module.scss';

interface TdtSplitEditorProps {
  testCode: string;
  impl: string;
  result: RunResult | null;
  running: boolean;
  onImplChange: (v: string) => void;
}

export function TdtSplitEditor({ testCode, impl, result, running, onImplChange }: TdtSplitEditorProps) {
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

  return (
    <div className={styles.editors}>
      <div className={styles.editorPanel}>
        <Typography variant="caption" className={styles.panelLabel}>
          Tests (read-only)
        </Typography>
        <div className={styles.editorWrapper}>
          <CodeEditor
            code={testCode}
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
            onChange={onImplChange}
          />
        </div>
      </div>

      <TestResultsSidebar result={sidebarResult} running={running} />
    </div>
  );
}
