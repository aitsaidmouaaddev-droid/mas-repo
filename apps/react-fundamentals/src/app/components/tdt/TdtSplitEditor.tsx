import { Typography, CodeEditor, TestResultsSidebar } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { RunResult } from '../../services/browser-test-runner';
import styles from './TdtSplitEditor.module.scss';

interface TdtSplitEditorProps {
  testCode: string;
  impl: string;
  result: RunResult | null;
  running: boolean;
  onImplChange: (v: string) => void;
}

export function TdtSplitEditor({ testCode, impl, result, running, onImplChange }: TdtSplitEditorProps) {
  const { t } = useT();

  const sidebarResult = result
    ? {
        passed: result.passed,
        failed: result.failed,
        tests: result.tests.map((r) => ({
          title: r.title,
          status: r.status,
          failureMessages: r.failureMessages,
        })),
      }
    : null;

  return (
    <div className={styles.editors}>
      <div className={styles.editorPanel}>
        <Typography variant="caption" className={styles.panelLabel}>
          {t('tdt.testsReadOnly')}
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
          {t('tdt.yourImpl')}
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
