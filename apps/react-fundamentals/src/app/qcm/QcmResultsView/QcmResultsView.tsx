import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  Typography,
  Container,
  Card,
  Badge,
  Button,
  Stack,
  Spinner,
} from '@mas/react-ui';
import { FiArrowLeft } from 'react-icons/fi';
import { selectResult } from '@mas/shared/qcm';
import { QcmSessionStatus } from '@mas/react-fundamentals-sot';
import type {
  QcmProgress,
  QcmAnswer as GqlAnswer,
  CreateQcmProgressMutation,
  UpdateQcmProgressMutation,
} from '@mas/react-fundamentals-sot';
import {
  FIND_MODULE_PROGRESS,
  CREATE_QCM_PROGRESS,
  UPDATE_QCM_PROGRESS,
  FIND_SESSION_ANSWERS,
  UPDATE_QCM_SESSION,
} from '../../../graphql/documents';
import type { RootState } from '../../../store';
import styles from './QcmResultsView.module.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DifficultyStats {
  total: number;
  correct: number;
  pct: number;
}

type GqlProgress = Pick<
  QcmProgress,
  'id' | 'moduleId' | 'attemptsCount' | 'bestScore' | 'isCompleted' | 'firstCompletedAt' | 'lastAttemptAt' | 'lastSessionId'
>;

interface QcmResultsViewProps {
  sessionId: string;
  moduleId: string;
  onBack: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

const DIFF_ORDER = ['easy', 'medium', 'hard'] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function QcmResultsView({ sessionId, moduleId, onBack }: QcmResultsViewProps) {
  const didPersist = useRef(false);

  // ── Redux ──────────────────────────────────────────────────────────────────

  const result = useSelector(selectResult);

  const questions = useSelector((s: RootState) => s.qcm.questions);

  // Simple correct count (not weighted)
  const correctCount = useMemo(
    () => result.answers.filter((a) => a.correct).length,
    [result.answers],
  );

  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // ── Difficulty breakdown ───────────────────────────────────────────────────

  const byDifficulty = useMemo<Record<string, DifficultyStats>>(() => {
    const map: Record<string, DifficultyStats> = {};
    for (const q of questions) {
      const answer = result.answers.find((a) => a.questionId === q.id);
      if (!map[q.difficulty]) map[q.difficulty] = { total: 0, correct: 0, pct: 0 };
      map[q.difficulty].total++;
      if (answer?.correct) map[q.difficulty].correct++;
    }
    for (const d of Object.values(map)) {
      d.pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    }
    return map;
  }, [questions, result.answers]);

  // ── Progress (historical comparison) ───────────────────────────────────────

  const { data: progressData, loading: progressLoading } = useQuery<{
    findByQcmProgress: GqlProgress[];
  }>(FIND_MODULE_PROGRESS, {
    variables: { filter: JSON.stringify({ moduleId }) },
    fetchPolicy: 'network-only',
  });

  const progress = progressData?.findByQcmProgress?.[0] ?? null;

  // ── Persist: update session + upsert progress (once) ───────────────────────

  const [fetchAnswers] = useLazyQuery<{ findByQcmAnswer: Pick<GqlAnswer, 'id' | 'isCorrect'>[] }>(FIND_SESSION_ANSWERS);
  const [updateSession] = useMutation(UPDATE_QCM_SESSION);
  const [createProgress] = useMutation<CreateQcmProgressMutation>(CREATE_QCM_PROGRESS);
  const [updateProgress] = useMutation<UpdateQcmProgressMutation>(UPDATE_QCM_PROGRESS);

  useEffect(() => {
    if (didPersist.current) return;
    didPersist.current = true;

    (async () => {
      // 1. Close session
      const { data: ansData } = await fetchAnswers({
        variables: { filter: JSON.stringify({ sessionId }) },
      });
      const serverAnswers = ansData?.findByQcmAnswer ?? [];
      const serverScore = serverAnswers.filter((a) => a.isCorrect).length;

      await updateSession({
        variables: {
          input: { id: sessionId, status: QcmSessionStatus.Completed, score: serverScore, completedAt: new Date().toISOString() },
        },
      });

      // 2. Upsert progress
      const serverPct = questions.length > 0 ? Math.round((serverScore / questions.length) * 100) : 0;
      const now = new Date().toISOString();

      if (!progress) {
        await createProgress({
          variables: { input: { moduleId } },
        }).then(async (res) => {
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
  }, []);

  // ── Derived comparison ─────────────────────────────────────────────────────

  const isNewBest = progress ? pct > (progress.bestScore ?? 0) : true;
  const attemptNum = progress ? progress.attemptsCount + 1 : 1;
  const previousBest = progress?.bestScore ?? null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <Container maxWidth="sm">
        <Card className={styles.resultsCard}>
          <Stack direction="vertical" gap={20}>

            {/* Header */}
            <div className={styles.header}>
              <Typography variant="title">Session Complete</Typography>
            </div>

            {/* Score circle */}
            <div className={styles.scoreCircle} data-passed={String(pct >= 70)}>
              <span className={styles.scoreValue}>{pct}%</span>
              <span className={styles.scoreLabel}>{correctCount} / {questions.length}</span>
            </div>

            {/* Duration */}
            <Typography variant="caption" className={styles.duration}>
              Completed in {formatDuration(result.duration)}
            </Typography>

            {/* Difficulty breakdown */}
            <div className={styles.section}>
              <Typography variant="caption" className={styles.sectionTitle}>
                By Difficulty
              </Typography>
              {DIFF_ORDER.filter((d) => byDifficulty[d]).map((d) => {
                const stats = byDifficulty[d];
                return (
                  <div key={d} className={styles.diffRow}>
                    <Badge
                      label={d}
                      variant={d === 'easy' ? 'success' : d === 'medium' ? 'warning' : 'error'}
                      className={styles.diffLabel}
                    />
                    <div className={styles.diffBar}>
                      <div
                        className={styles.diffFill}
                        data-variant={d}
                        style={{ width: `${stats.pct}%` }}
                      />
                    </div>
                    <span className={styles.diffScore}>
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress comparison */}
            <div className={styles.section}>
              <Typography variant="caption" className={styles.sectionTitle}>
                Progress
              </Typography>

              {progressLoading ? (
                <Spinner size="sm" />
              ) : (
                <Stack direction="vertical" gap={4}>
                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>Attempt</span>
                    <span className={styles.progressValue}>#{attemptNum}</span>
                  </div>

                  {previousBest !== null && (
                    <div className={styles.progressRow}>
                      <span className={styles.progressLabel}>Previous best</span>
                      <span className={styles.progressValue}>{previousBest}%</span>
                    </div>
                  )}

                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>This session</span>
                    <span className={isNewBest ? styles.newBest : styles.progressValue}>
                      {pct}%{isNewBest && ' — New best!'}
                    </span>
                  </div>
                </Stack>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <Button
                variant="primary"
                label="Back to modules"
                startIcon={FiArrowLeft}
                onClick={onBack}
              />
            </div>

          </Stack>
        </Card>
      </Container>
    </div>
  );
}
