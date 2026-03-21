import { useState } from 'react';
import { Alert } from '@mas/react-ui';
import type { GqlTdtChallenge } from '../pages/TdtListPage';
import { runInBrowser } from '../tdt/browser-test-runner';
import type { RunResult } from '../tdt/browser-test-runner';
import { useAppToast } from '../ToastContext';
import { TdtTopBar } from '../components/tdt/TdtTopBar';
import { TdtDescBar } from '../components/tdt/TdtDescBar';
import { TdtSplitEditor } from '../components/tdt/TdtSplitEditor';
import styles from './TdtChallengePage.module.scss';

interface TdtChallengePageProps {
  challenge: GqlTdtChallenge;
  onBack: () => void;
}

export function TdtChallengePage({ challenge, onBack }: TdtChallengePageProps) {
  const [impl, setImpl] = useState(challenge.data.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useAppToast();

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

  return (
    <div className={styles.page}>
      <TdtTopBar
        challenge={challenge}
        running={running}
        onBack={onBack}
        onReset={handleReset}
        onRun={handleRun}
      />

      <TdtDescBar
        description={challenge.data.description}
        docs={challenge.data.docs}
      />

      {error && (
        <div className={styles.errorBar}>
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <TdtSplitEditor
        testCode={challenge.data.testCode}
        impl={impl}
        result={result}
        running={running}
        onImplChange={setImpl}
      />
    </div>
  );
}
