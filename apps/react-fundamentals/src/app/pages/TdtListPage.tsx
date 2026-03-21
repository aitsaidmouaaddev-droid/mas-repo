/**
 * TDT challenge catalog — list of all TDT challenges.
 */
import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Button,
  Typography,
  CardWithSkeleton,
  Container,
  Stack,
  Badge,
  Icon,
  Alert,
} from '@mas/react-ui';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { FIND_ALL_TDT_CHALLENGES, CREATE_TDT_SESSION } from '../../graphql/documents';
import { useAppToast } from '../ToastContext';
import { difficultyVariant, TDT_CATEGORY_META, TDT_CATEGORIES } from '../utils';
import type { TdtCategory, TdtDifficulty } from '../utils';
import styles from '../tdt/tdt-catalog-view.module.scss';

const SKELETONS_PER_SECTION = 3;

export type GqlTdtChallenge = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  sortOrder: number;
  data: {
    description: string;
    starterCode: string;
    testCode: string;
    docs?: string | null;
  };
};

export function TdtListPage() {
  const navigate  = useNavigate();
  const addToast  = useAppToast();

  const { data, loading, error } = useQuery<{ findAllTdtChallenge: GqlTdtChallenge[] }>(
    FIND_ALL_TDT_CHALLENGES,
  );

  const [createSession] = useMutation<{
    createTdtSession: { id: string };
  }>(CREATE_TDT_SESSION);

  const onSelect = async (challenge: GqlTdtChallenge) => {
    try {
      const { data: sd } = await createSession({ variables: { input: { challengeId: challenge.id } } });
      const sessionId = sd?.createTdtSession?.id;
      if (!sessionId) return;
      navigate(`/tdt/${sessionId}/${challenge.id}`);
    } catch {
      addToast({ variant: 'error', message: 'Failed to start challenge' });
    }
  };

  const challenges = data?.findAllTdtChallenge ?? [];

  const displaySections = useMemo(() => {
    if (loading) {
      return TDT_CATEGORIES.map((cat) => ({
        cat,
        items: Array.from({ length: SKELETONS_PER_SECTION }, (_, i) => `sk-${cat}-${i}` as string | GqlTdtChallenge),
      }));
    }
    return TDT_CATEGORIES
      .map((cat) => ({ cat, items: challenges.filter((c) => c.category === cat) as (string | GqlTdtChallenge)[] }))
      .filter((g) => g.items.length > 0);
  }, [loading, challenges]);

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/')} />

        <Typography variant="title" className={styles.heading}>
          TDT — Test-Driven Challenges
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Tests are already written. Make them pass.
        </Typography>

        {error && (
          <Alert variant="error">Failed to load challenges. Is the server running?</Alert>
        )}

        {displaySections.map(({ cat, items }) => {
          const meta = TDT_CATEGORY_META[cat];
          return (
            <div key={cat} className={styles.section}>
              <Stack
                direction="horizontal"
                gap={8}
                align="center"
                className={styles.sectionHeader}
              >
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
                  const isSkeleton = typeof item === 'string';
                  const challenge = isSkeleton ? null : (item as GqlTdtChallenge);
                  return (
                    <CardWithSkeleton
                      key={isSkeleton ? item : challenge!.id}
                      loading={loading}
                      className={styles.challengeCard}
                    >
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          {!isSkeleton && (
                            <Badge
                              label={challenge!.difficulty}
                              variant={difficultyVariant[challenge!.difficulty as TdtDifficulty] ?? 'primary'}
                            />
                          )}
                        </div>
                        {!isSkeleton && (
                          <>
                            <Typography variant="subtitle" className={styles.cardTitle}>
                              {challenge!.title}
                            </Typography>
                            <Typography variant="caption" className={styles.cardDesc}>
                              {challenge!.data.description}
                            </Typography>
                            <Button
                              variant="primary"
                              size="sm"
                              label="Start"
                              onClick={() => onSelect(challenge!)}
                            />
                          </>
                        )}
                      </div>
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
