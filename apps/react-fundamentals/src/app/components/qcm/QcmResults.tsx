import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client/react';
import { Typography, Container, CardWithSkeleton, Button, Stack } from '@mas/react-ui';
import { FiArrowLeft } from 'react-icons/fi';
import { selectResult } from '@mas/shared/qcm';
import { QcmSessionStatus } from '@mas/react-fundamentals-sot';
import type {
  QcmProgress,
  QcmAnswer,
  CreateQcmProgressMutation,
  UpdateQcmProgressMutation,
  FindAllQcmQuestionsQuery,
} from '@mas/react-fundamentals-sot';
import {
  FIND_MODULE_PROGRESS,
  CREATE_QCM_PROGRESS,
  UPDATE_QCM_PROGRESS,
  FIND_SESSION_ANSWERS,
  UPDATE_QCM_SESSION,
  FIND_ALL_QCM_QUESTIONS,
} from '../../../graphql/documents';
import type { RootState } from '../../../store';
import { formatDuration } from '../../utils';
import { QcmScoreCircle } from './QcmScoreCircle';
import { QcmDifficultyBreakdown } from './QcmDifficultyBreakdown';
import { QcmProgressComparison } from './QcmProgressComparison';
import styles from './QcmResults.module.scss';

interface DifficultyStats {
  total: number;
  correct: number;
  pct: number;
}

interface QcmResultsProps {
  sessionId: string;
  moduleId: string;
  onBack: () => void;
}

export function QcmResults({ sessionId, moduleId, onBack }: QcmResultsProps) {
  const didPersist = useRef(false);

  const result = useSelector(selectResult);

  // Fetch ALL answers for this session from the server (includes resumed answers)
  const { data: answersData, loading: answersLoading } = useQuery<{
    findByQcmAnswer: Pick<QcmAnswer, 'id' | 'questionId' | 'isCorrect'>[];
  }>(FIND_SESSION_ANSWERS, {
    variables: { filter: JSON.stringify({ sessionId }) },
    fetchPolicy: 'network-only',
  });

  // Fetch all module questions for total count and difficulty metadata
  const { data: questionsData, loading: questionsLoading } =
    useQuery<FindAllQcmQuestionsQuery>(FIND_ALL_QCM_QUESTIONS);

  const serverAnswers = answersData?.findByQcmAnswer ?? [];

  const moduleQuestions = useMemo(
    () => (questionsData?.findAllQcmQuestion ?? []).filter((q) => q.moduleId === moduleId),
    [questionsData, moduleId],
  );

  const totalModuleQuestions = moduleQuestions.length;

  // Use server answers for display — correct count out of total module questions
  const correctCount = useMemo(
    () => serverAnswers.filter((a) => a.isCorrect).length,
    [serverAnswers],
  );
  const pct =
    totalModuleQuestions > 0 ? Math.round((correctCount / totalModuleQuestions) * 100) : 0;

  const byDifficulty = useMemo<Record<string, DifficultyStats>>(() => {
    const map: Record<string, DifficultyStats> = {};
    const answerMap = new Map(serverAnswers.map((a) => [a.questionId, a]));
    for (const q of moduleQuestions) {
      const answer = answerMap.get(q.id);
      if (!map[q.difficulty]) map[q.difficulty] = { total: 0, correct: 0, pct: 0 };
      map[q.difficulty].total++;
      if (answer?.isCorrect) map[q.difficulty].correct++;
    }
    for (const d of Object.values(map)) {
      d.pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    }
    return map;
  }, [moduleQuestions, serverAnswers]);

  const { data: progressData, loading: progressLoading } = useQuery<{
    findByQcmProgress: QcmProgress[];
  }>(FIND_MODULE_PROGRESS, {
    variables: { filter: JSON.stringify({ moduleId }) },
    fetchPolicy: 'network-only',
  });

  const progress = progressData?.findByQcmProgress?.[0] ?? null;

  const [updateSession] = useMutation(UPDATE_QCM_SESSION);
  const [createProgress] = useMutation<CreateQcmProgressMutation>(CREATE_QCM_PROGRESS);
  const [updateProgress] = useMutation<UpdateQcmProgressMutation>(UPDATE_QCM_PROGRESS);

  // Persist session completion after all data is loaded
  useEffect(() => {
    if (
      didPersist.current ||
      answersLoading ||
      !answersData ||
      questionsLoading ||
      !questionsData ||
      progressLoading
    )
      return;
    didPersist.current = true;
    (async () => {
      const serverScore = serverAnswers.filter((a) => a.isCorrect).length;
      await updateSession({
        variables: {
          input: {
            id: sessionId,
            status: QcmSessionStatus.Completed,
            score: serverScore,
            completedAt: new Date().toISOString(),
          },
        },
      });
      const serverPct =
        totalModuleQuestions > 0
          ? Math.min(100, Math.round((serverScore / totalModuleQuestions) * 100))
          : 0;
      const now = new Date().toISOString();
      if (!progress) {
        await createProgress({ variables: { input: { moduleId } } }).then(async (res) => {
          const id = res.data?.createQcmProgress?.id;
          if (id) {
            await updateProgress({
              variables: {
                input: {
                  id,
                  attemptsCount: 1,
                  bestScore: serverPct,
                  isCompleted: true,
                  firstCompletedAt: now,
                  lastAttemptAt: now,
                  lastSessionId: sessionId,
                },
              },
            });
          }
        });
      } else {
        await updateProgress({
          variables: {
            input: {
              id: progress.id,
              attemptsCount: progress.attemptsCount + 1,
              bestScore: Math.max(progress.bestScore ?? 0, serverPct),
              isCompleted: true,
              lastAttemptAt: now,
              lastSessionId: sessionId,
            },
          },
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersLoading, answersData, questionsLoading, questionsData, progressLoading]);

  const isLoading = answersLoading || questionsLoading || progressLoading;
  const isNewBest = progress ? pct > (progress.bestScore ?? 0) : true;
  const attemptNum = progress ? progress.attemptsCount + 1 : 1;
  const previousBest = progress?.bestScore ?? null;

  return (
    <div className={styles.page}>
      <Container maxWidth="sm">
        <CardWithSkeleton loading={isLoading} className={styles.resultsCard}>
          <Stack direction="vertical" gap={20}>
            <div className={styles.header}>
              <Typography variant="title">Session Complete</Typography>
            </div>

            <QcmScoreCircle pct={pct} correctCount={correctCount} total={totalModuleQuestions} />

            <Typography variant="caption" className={styles.duration}>
              Completed in {formatDuration(result.duration)}
            </Typography>

            <QcmDifficultyBreakdown byDifficulty={byDifficulty} />

            <QcmProgressComparison
              loading={progressLoading}
              attemptNum={attemptNum}
              previousBest={previousBest}
              pct={pct}
              isNewBest={isNewBest}
            />

            <div className={styles.actions}>
              <Button
                variant="primary"
                label="Back to modules"
                startIcon={FiArrowLeft}
                onClick={onBack}
              />
            </div>
          </Stack>
        </CardWithSkeleton>
      </Container>
    </div>
  );
}
