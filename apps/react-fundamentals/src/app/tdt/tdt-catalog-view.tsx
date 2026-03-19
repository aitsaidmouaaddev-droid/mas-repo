/**
 * TDT challenge catalog.
 *
 * Fetches all challenges from GraphQL, groups them by category, and renders
 * a card grid. Clicking a card opens {@link TdtChallengeView}.
 */
import { useQuery } from '@apollo/client/react';
import {
  Button,
  Typography,
  Card,
  Container,
  Stack,
  Badge,
  Icon,
  CardSkeleton,
  Alert,
} from '@mas/react-ui';
import { FiArrowLeft, FiCode, FiBox } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import type { IconType } from 'react-icons';
import { FIND_ALL_TDT_CHALLENGES } from '../../graphql/documents';
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

// ─── Component ────────────────────────────────────────────────────────────────

export function TdtCatalogView() {
  const navigate = useNavigate();
  const onBack = () => navigate('/');
  const onSelect = (challenge: GqlTdtChallenge) => navigate(`/tdt/${challenge.id}`);

  const { data, loading, error } = useQuery<{ findAllTdtChallenge: GqlTdtChallenge[] }>(
    FIND_ALL_TDT_CHALLENGES,
  );

  const challenges = data?.findAllTdtChallenge ?? [];
  const byCategory = (cat: TdtCategory) =>
    challenges.filter((c: GqlTdtChallenge) => c.category === cat);

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />

        <Typography variant="title" className={styles.heading}>
          TDT — Test-Driven Challenges
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Tests are already written. Make them pass.
        </Typography>

        {error && (
          <Alert variant="error">Failed to load challenges. Is the server running?</Alert>
        )}

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          CATEGORIES.map((cat) => {
            const items = byCategory(cat);
            if (!items.length) return null;
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
                  <Typography variant="caption" className={styles.sectionCount}>
                    {items.length} challenges
                  </Typography>
                </Stack>

                <div className={styles.grid}>
                  {items.map((challenge: GqlTdtChallenge) => (
                    <Card key={challenge.id} className={styles.challengeCard}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Badge
                            label={challenge.difficulty}
                            variant={
                              difficultyVariant[challenge.difficulty as TdtDifficulty] ?? 'primary'
                            }
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
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </Container>
    </div>
  );
}
