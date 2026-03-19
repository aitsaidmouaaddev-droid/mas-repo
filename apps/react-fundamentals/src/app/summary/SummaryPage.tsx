/**
 * Global progress summary page — `/summary`.
 *
 * - **QCM section**: last session result from the Redux store (`selectResult`).
 * - **TDT section**: solved / attempted count from the GraphQL `findAllTdtProgress` query,
 *   cross-referenced with `findAllTdtChallenge` for titles.
 */
import { useSelector } from 'react-redux';
import { selectResult, selectModules } from '@mas/shared/qcm';
import {
  Typography,
  Container,
  Stack,
  Card,
  ProgressBar,
  Badge,
  Button,
  Alert,
  Spinner,
} from '@mas/react-ui';
import { useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
import { FiBookOpen, FiTerminal, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FIND_ALL_TDT_CHALLENGES, FIND_ALL_TDT_PROGRESS } from '../../graphql/documents';
import type { RootState } from '../../store';
import styles from './SummaryPage.module.scss';

// ─── GQL shapes ────────────────────────────────────────────────────────────────

interface GqlTdtChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: string;
}

interface GqlTdtProgress {
  id: string;
  challengeId: string;
  isSolved: boolean;
  totalAttempts: number;
  firstSolvedAt: string | null;
  lastAttemptAt: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SummaryPage() {
  const navigate = useNavigate();
  const qcmResult = useSelector((s: RootState) => selectResult(s));
  const qcmModules = useSelector((s: RootState) => selectModules(s));

  const { data: challengesData, loading: challengesLoading, error: challengesError } = useQuery<{
    findAllTdtChallenge: GqlTdtChallenge[];
  }>(FIND_ALL_TDT_CHALLENGES);

  const { data: progressData, loading: progressLoading, error: progressError } = useQuery<{
    findAllTdtProgress: GqlTdtProgress[];
  }>(FIND_ALL_TDT_PROGRESS);

  const tdtLoading = challengesLoading || progressLoading;
  const tdtError = !!(challengesError || progressError);

  const challenges = challengesData?.findAllTdtChallenge ?? [];
  const tdtProgress = progressData?.findAllTdtProgress ?? [];

  const challengeMap = new Map(challenges.map((c) => [c.id, c]));
  const solvedCount = tdtProgress.filter((p) => p.isSolved).length;
  const attemptedCount = tdtProgress.filter((p) => p.totalAttempts > 0).length;
  const tdtTotal = challenges.length;

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Typography variant="title" className={styles.heading}>
          My Progress
        </Typography>

        <Stack direction="vertical" gap={32}>

          {/* ── QCM ── */}
          <section>
            <Stack direction="horizontal" gap={8} align="center" className={styles.sectionHeader}>
              <FiBookOpen size={20} />
              <Typography variant="subtitle">QCM</Typography>
              <Button
                variant="ghost"
                size="sm"
                label="Go to QCM"
                endIcon={FiArrowRight}
                onClick={() => navigate('/qcm')}
              />
            </Stack>

            {qcmResult ? (
              <Card className={styles.card}>
                <Stack direction="vertical" gap={12}>
                  <Stack direction="horizontal" gap={12} align="center">
                    <Typography variant="subtitle">Last session</Typography>
                    <Badge
                      label={qcmResult.passed ? 'Passed' : 'Failed'}
                      variant={qcmResult.passed ? 'success' : 'error'}
                    />
                  </Stack>

                  <Stack direction="horizontal" gap={16} wrap>
                    <Typography variant="body">
                      Score: <strong>{qcmResult.score}/{qcmResult.maxScore} pts</strong>
                    </Typography>
                    <Typography variant="body">
                      Questions: <strong>{qcmResult.total}</strong>
                    </Typography>
                    <Typography variant="body">
                      Streak: <strong>{qcmResult.streak}</strong>
                    </Typography>
                    <Typography variant="body">
                      Duration: <strong>{Math.round(qcmResult.duration / 1000)}s</strong>
                    </Typography>
                  </Stack>

                  <ProgressBar value={qcmResult.percentage / 100} />
                  <Typography variant="caption">{qcmResult.percentage}%</Typography>

                  {Object.keys(qcmResult.byModule).length > 1 && (
                    <Stack direction="vertical" gap={8} className={styles.moduleBreakdown}>
                      <Typography variant="caption" className={styles.breakdownLabel}>By module</Typography>
                      {Object.entries(qcmResult.byModule).map(([id, ms]) => {
                        const label = qcmModules.find((m) => m.id === id)?.label ?? id;
                        return (
                          <Stack key={id} direction="horizontal" gap={8} align="center">
                            <Typography variant="caption" className={styles.moduleName}>{label}</Typography>
                            <ProgressBar value={ms.percentage / 100} style={{ flex: 1 }} />
                            <Typography variant="caption">{ms.percentage}%</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              </Card>
            ) : (
              <Card className={styles.card}>
                <Stack direction="vertical" gap={8} align="center">
                  <Typography variant="body">No QCM session recorded yet.</Typography>
                  <Button
                    variant="primary"
                    size="sm"
                    label="Start a session"
                    onClick={() => navigate('/qcm')}
                  />
                </Stack>
              </Card>
            )}
          </section>

          {/* ── TDT ── */}
          <section>
            <Stack direction="horizontal" gap={8} align="center" className={styles.sectionHeader}>
              <FiTerminal size={20} />
              <Typography variant="subtitle">TDT</Typography>
              <Button
                variant="ghost"
                size="sm"
                label="Go to TDT"
                endIcon={FiArrowRight}
                onClick={() => navigate('/tdt')}
              />
            </Stack>

            {tdtError && <Alert variant="error">Failed to load TDT progress.</Alert>}

            {tdtLoading ? (
              <div className={styles.spinnerWrapper}><Spinner size="md" /></div>
            ) : (
              <Card className={styles.card}>
                <Stack direction="vertical" gap={12}>
                  <Stack direction="horizontal" gap={16} wrap>
                    <Typography variant="body">
                      Solved: <strong>{solvedCount} / {tdtTotal}</strong>
                    </Typography>
                    <Typography variant="body">
                      Attempted: <strong>{attemptedCount}</strong>
                    </Typography>
                  </Stack>

                  {tdtTotal > 0 && (
                    <>
                      <ProgressBar value={tdtTotal > 0 ? solvedCount / tdtTotal : 0} />
                      <Typography variant="caption">
                        {tdtTotal > 0 ? Math.round((solvedCount / tdtTotal) * 100) : 0}% complete
                      </Typography>
                    </>
                  )}

                  {tdtProgress.length > 0 && (
                    <Stack direction="vertical" gap={4} className={styles.tdtList}>
                      {tdtProgress.map((p) => {
                        const challenge = challengeMap.get(p.challengeId);
                        return (
                          <Stack
                            key={p.id}
                            direction="horizontal"
                            gap={8}
                            align="center"
                            className={styles.tdtRow}
                          >
                            {p.isSolved
                              ? <FiCheckCircle className={styles.solvedIcon} size={14} />
                              : <span className={styles.dotIcon} />
                            }
                            <Typography variant="caption" className={styles.tdtTitle}>
                              {challenge?.title ?? p.challengeId}
                            </Typography>
                            <Badge
                              label={challenge?.difficulty ?? '?'}
                              variant={
                                challenge?.difficulty === 'easy' ? 'success'
                                : challenge?.difficulty === 'medium' ? 'warning'
                                : 'error'
                              }
                            />
                            <Typography variant="caption" className={styles.attempts}>
                              {p.totalAttempts} attempt{p.totalAttempts !== 1 ? 's' : ''}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}

                  {tdtProgress.length === 0 && !tdtLoading && (
                    <Stack direction="vertical" gap={8} align="center">
                      <Typography variant="body">No TDT challenges attempted yet.</Typography>
                      <Button
                        variant="primary"
                        size="sm"
                        label="Browse challenges"
                        onClick={() => navigate('/tdt')}
                      />
                    </Stack>
                  )}
                </Stack>
              </Card>
            )}
          </section>

        </Stack>
      </Container>
    </div>
  );
}
