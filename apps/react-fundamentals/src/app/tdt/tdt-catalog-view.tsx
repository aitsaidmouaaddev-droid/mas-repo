/**
 * TDT challenge catalog.
 *
 * Fetches all challenges from GraphQL, groups them by category, and renders
 * a card grid. Clicking a card opens {@link TdtChallengeView}.
 */
import { useQuery, useMutation } from '@apollo/client/react';
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
import { FiArrowLeft, FiCode, FiBox } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import type { IconType } from 'react-icons';
import { FIND_ALL_TDT_CHALLENGES, CREATE_TDT_SESSION } from '../../graphql/documents';
import { useAppToast } from '../ToastContext';
import styles from './tdt-catalog-view.module.scss';

// ─── Local types ──────────────────────────────────────────────────────────────

type TdtCategory = 'react-hooks' | 'architecture';
type TdtDifficulty = 'easy' | 'medium' | 'hard';

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

// ─── Constants ────────────────────────────────────────────────────────────────

const categoryMeta: Record<TdtCategory, { label: string; icon: IconType }> = {
  'react-hooks': { label: 'React & Hooks', icon: FiCode },
  architecture: { label: 'Architecture', icon: FiBox },
};

const difficultyVariant: Record<TdtDifficulty, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const CATEGORIES: TdtCategory[] = ['react-hooks', 'architecture'];
const SKELETONS_PER_CATEGORY = 3;

// Skeleton placeholder structure — mirrors real data shape so the layout is identical
const skeletonCategories = CATEGORIES.map((cat) => ({
  cat,
  items: Array.from({ length: SKELETONS_PER_CATEGORY }, (_, i) => `${cat}-sk-${i}`),
}));

// ─── Component ────────────────────────────────────────────────────────────────

export function TdtCatalogView() {
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
  const byCategory = (cat: TdtCategory) =>
    challenges.filter((c: GqlTdtChallenge) => c.category === cat);

  // Always render the same category sections — cards handle loading state via `loading` prop
  const displayCategories = loading
    ? skeletonCategories.map(({ cat, items }) => ({ cat, items: items as (string | GqlTdtChallenge)[] }))
    : CATEGORIES.map((cat) => ({ cat, items: byCategory(cat) as (string | GqlTdtChallenge)[] }));

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

        {displayCategories.map(({ cat, items }) => {
          if (!loading && !items.length) return null;
          const meta = categoryMeta[cat];
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
                              variant={difficultyVariant[challenge.difficulty as TdtDifficulty] ?? 'primary'}
                            />
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
