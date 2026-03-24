import { useState, useRef } from 'react';
import { Alert } from '@mas/react-ui';
import { useMutation, useQuery } from '@apollo/client/react';
import type { TdtChallenge, FindTdtProgressByChallengeQuery, CreateTdtProgressMutation } from '@mas/react-fundamentals-sot';
import { runInBrowser } from '../services/browser-test-runner';
import type { RunResult } from '../services/browser-test-runner';
import { useAppToast } from '../contexts/ToastContext';
import { TdtTopBar } from '../components/tdt/TdtTopBar';
import { TdtDescBar } from '../components/tdt/TdtDescBar';
import { TdtSplitEditor } from '../components/tdt/TdtSplitEditor';
import {
  UPDATE_TDT_SESSION,
  CREATE_TDT_SUBMISSION,
  FIND_TDT_PROGRESS_BY_CHALLENGE,
  FIND_ALL_TDT_PROGRESS,
  CREATE_TDT_PROGRESS,
  UPDATE_TDT_PROGRESS,
} from '../../graphql/documents';
import styles from './TdtChallengePage.module.scss';

interface TdtChallengePageProps {
  challenge: TdtChallenge;
  sessionId: string;
  onBack: () => void;
}

export function TdtChallengePage({ challenge, sessionId, onBack }: TdtChallengePageProps) {
  const [impl, setImpl] = useState(challenge.data.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const addToast = useAppToast();

  const { data: progressData, refetch: refetchProgress } = useQuery<FindTdtProgressByChallengeQuery>(FIND_TDT_PROGRESS_BY_CHALLENGE, {
    variables: { filter: JSON.stringify({ challengeId: challenge.id }) },
    fetchPolicy: 'network-only',
  });
  const progress = progressData?.findByTdtProgress?.[0] ?? null;

  const [updateSession] = useMutation(UPDATE_TDT_SESSION);
  const [createSubmission] = useMutation(CREATE_TDT_SUBMISSION);
  const [createProgress] = useMutation<CreateTdtProgressMutation>(CREATE_TDT_PROGRESS, {
    refetchQueries: [{ query: FIND_ALL_TDT_PROGRESS }],
  });
  const [updateProgress] = useMutation(UPDATE_TDT_PROGRESS, {
    refetchQueries: [{ query: FIND_ALL_TDT_PROGRESS }],
  });

  const allPassed = result !== null && result.failed === 0;

  const upsertProgress = async (opts: { isSolved?: boolean }) => {
    const now = new Date().toISOString();
    if (!progress) {
      const res = await createProgress({
        variables: { input: { challengeId: challenge.id } },
      });
      const id = res.data?.createTdtProgress?.id;
      if (id) {
        await updateProgress({
          variables: {
            input: {
              id,
              totalAttempts: 1,
              lastAttemptAt: now,
              ...(opts.isSolved ? { isSolved: true, firstSolvedAt: now } : {}),
            },
          },
        });
      }
    } else {
      await updateProgress({
        variables: {
          input: {
            id: progress.id,
            totalAttempts: progress.totalAttempts + 1,
            lastAttemptAt: now,
            ...(opts.isSolved && !progress.isSolved ? { isSolved: true, firstSolvedAt: now } : {}),
          },
        },
      });
    }
    refetchProgress();
  };

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    const runStart = Date.now();
    try {
      const res = await runInBrowser(impl, challenge.data.testCode);
      setResult(res);

      const duration = (Date.now() - runStart) / 1000;
      const status = res.failed === 0 ? 'Passed' : 'Failed';

      await createSubmission({
        variables: {
          input: {
            sessionId,
            status,
            totalTests: res.passed + res.failed,
            data: { code: impl, duration },
          },
        },
      });

      await upsertProgress({ isSolved: res.failed === 0 });

      if (res.failed === 0) {
        addToast({ variant: 'success', message: 'All tests passed! Ready to submit.' });
      } else {
        addToast({ variant: 'error', message: `${res.failed} test(s) failed` });
      }
    } catch (error) {
      console.error(error);
      setError('Test runner encountered an unexpected error.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await updateSession({
        variables: {
          input: { id: sessionId, status: 'Solved', solvedAt: new Date().toISOString() },
        },
      });
      addToast({ variant: 'success', message: 'Challenge submitted!' });
      onBack();
    } catch {
      addToast({ variant: 'error', message: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setImpl(challenge.data.starterCode);
    setResult(null);
    setError(null);
    startedAt.current = Date.now();
  };

  return (
    <div className={styles.page}>
      <TdtTopBar
        challenge={challenge}
        running={running}
        submitting={submitting}
        allPassed={allPassed}
        onBack={onBack}
        onReset={handleReset}
        onRun={handleRun}
        onSubmit={handleSubmit}
      />

      <TdtDescBar description={challenge.data.description} docs={challenge.data.docs ?? undefined} />

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
