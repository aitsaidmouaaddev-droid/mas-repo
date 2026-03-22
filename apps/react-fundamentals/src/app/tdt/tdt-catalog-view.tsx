/**
 * TDT challenge catalog.
 *
 * Fetches all challenges from GraphQL, groups them by category, and renders
 * a card grid. Clicking a card opens {@link TdtChallengeView}.
 */
import React from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  CardWithSkeleton,
  Button,
  Typography,
  Container,
  Stack,
  Badge,
  Icon,
  Alert,
} from '@mas/react-ui';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import type { TdtChallenge } from '@mas/react-fundamentals-sot';
import {
  FIND_ALL_TDT_CHALLENGES,
  CREATE_TDT_SESSION,
  FIND_ALL_TDT_SESSIONS,
  DELETE_TDT_SUBMISSION,
  FIND_TDT_SUBMISSIONS_BY_SESSION,
  UPDATE_TDT_SESSION,
} from '../../graphql/documents';
import { useAppToast } from '../ToastContext';
import {
  type TdtCategory,
  TDT_CATEGORY_META as categoryMeta,
  TDT_CATEGORIES as CATEGORIES,
  difficultyVariant,
} from '../utils';
import styles from './tdt-catalog-view.module.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

type TdtDifficulty = 'easy' | 'medium' | 'hard';

interface GqlTdtSession {
  id: string;
  challengeId: string;
  status: string;
  solvedAt: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SKELETONS_PER_CATEGORY = 3;

// Skeleton placeholder structure — mirrors real data shape so the layout is identical
const skeletonCategories = CATEGORIES.map((cat) => ({
  cat,
  items: Array.from({ length: SKELETONS_PER_CATEGORY }, (_, i) => `${cat}-sk-${i}`),
}));

// ─── Component ────────────────────────────────────────────────────────────────

export function TdtCatalogView() {
  const navigate = useNavigate();
  const addToast = useAppToast();

  const { data, loading, error } = useQuery<{ findAllTdtChallenge: TdtChallenge[] }>(
    FIND_ALL_TDT_CHALLENGES,
  );

  const { data: sessionsData, refetch: refetchSessions } = useQuery<{
    findAllTdtSession: GqlTdtSession[];
  }>(FIND_ALL_TDT_SESSIONS);

  const [createSession] = useMutation<{ createTdtSession: { id: string } }>(CREATE_TDT_SESSION);
  const [updateSession] = useMutation(UPDATE_TDT_SESSION);
  const [deleteSubmission] = useMutation(DELETE_TDT_SUBMISSION);
  const [fetchSubmissions] = useLazyQuery<
    { findByTdtSubmission: Array<{ id: string }> },
    { filter: string }
  >(FIND_TDT_SUBMISSIONS_BY_SESSION);

  // Map challengeId → solved session
  const solvedSessionMap = new Map<string, GqlTdtSession>(
    (sessionsData?.findAllTdtSession ?? [])
      .filter((s) => s.status === 'Solved')
      .map((s) => [s.challengeId, s]),
  );

  const onSelect = async (challenge: TdtChallenge) => {
    try {
      const { data: sd } = await createSession({
        variables: { input: { challengeId: challenge.id } },
      });
      const sessionId = sd?.createTdtSession?.id;
      if (!sessionId) return;
      navigate(`/tdt/${sessionId}/${challenge.id}`);
    } catch {
      addToast({ variant: 'error', message: 'Failed to start challenge' });
    }
  };

  const onRepeat = async (challenge: TdtChallenge, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = solvedSessionMap.get(challenge.id);
    if (!session) return;
    try {
      // Delete all submissions for this session
      const { data: subData } = await fetchSubmissions({
        variables: { filter: JSON.stringify({ sessionId: session.id }) },
        fetchPolicy: 'network-only',
      });
      const subs = subData?.findByTdtSubmission ?? [];
      await Promise.all(subs.map((s) => deleteSubmission({ variables: { id: s.id } })));
      // Reset session status to InProgress
      await updateSession({
        variables: { input: { id: session.id, status: 'InProgress', solvedAt: null } },
      });
      await refetchSessions();
      navigate(`/tdt/${session.id}/${challenge.id}`);
    } catch {
      addToast({ variant: 'error', message: 'Failed to reset challenge' });
    }
  };

  const challenges = data?.findAllTdtChallenge ?? [];
  const DIFF_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
  const byCategory = (cat: TdtCategory) =>
    challenges
      .filter((c: TdtChallenge) => c.category === cat)
      .sort((a, b) => (DIFF_ORDER[a.difficulty] ?? 0) - (DIFF_ORDER[b.difficulty] ?? 0));

  // Always render the same category sections — cards handle loading state via `loading` prop
  const displayCategories = loading
    ? skeletonCategories.map(({ cat, items }) => ({
        cat,
        items: items as (string | TdtChallenge)[],
      }))
    : CATEGORIES.map((cat) => ({ cat, items: byCategory(cat) as (string | TdtChallenge)[] }));

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button
          variant="ghost"
          label="Back"
          startIcon={FiArrowLeft}
          onClick={() => navigate('/')}
        />

        <Typography variant="title" className={styles.heading}>
          TDT — Test-Driven Challenges
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Tests are already written. Make them pass.
        </Typography>

        {error && <Alert variant="error">Failed to load challenges. Is the server running?</Alert>}

        {displayCategories.map(({ cat, items }) => {
          if (!loading && !items.length) return null;
          const meta = categoryMeta[cat];
          return (
            <div key={cat} className={styles.section}>
              <Stack direction="horizontal" gap={8} align="center" className={styles.sectionHeader}>
                <Icon type="vector" icon={meta.icon} size={20} className={styles.sectionIcon} />
                <Typography variant="subtitle">{meta.label}</Typography>
                {!loading && (
                  <Typography variant="caption" className={styles.sectionCount}>
                    {items.length} challenges
                  </Typography>
                )}
              </Stack>

              <div className={styles.grid}>
                {items.map((item) => {
                  const challenge = typeof item === 'string' ? null : item;
                  return (
                    <CardWithSkeleton
                      key={typeof item === 'string' ? item : item.id}
                      loading={loading}
                      className={styles.challengeCard}
                    >
                      {challenge && (
                        <div className={styles.cardContent}>
                          <div className={styles.cardHeader}>
                            <Badge
                              label={challenge.difficulty}
                              variant={
                                difficultyVariant[challenge.difficulty as TdtDifficulty] ??
                                'primary'
                              }
                            />
                            <div className={styles.cardHeaderRight}>
                              {solvedSessionMap.has(challenge.id) && (
                                <>
                                  <Badge label="Solved" variant="success" />
                                  <button
                                    className={styles.repeatBtn}
                                    title="Repeat challenge"
                                    onClick={(e) => onRepeat(challenge, e)}
                                  >
                                    <FiRefreshCw size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <Typography variant="subtitle" className={styles.cardTitle}>
                            {challenge.title}
                          </Typography>
                          <Typography variant="caption" className={styles.cardDesc}>
                            {challenge.data.description}
                          </Typography>
                          <Button
                            variant="primary"
                            size="sm"
                            label="Start"
                            onClick={() => onSelect(challenge)}
                          />
                        </div>
                      )}
                    </CardWithSkeleton>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Container>
    </div>
  );
}
