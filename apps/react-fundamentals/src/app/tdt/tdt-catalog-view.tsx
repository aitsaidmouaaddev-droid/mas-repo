/**
 * TDT challenge catalog.
 *
 * Fetches all challenges from /api/tdt, groups them by category, and renders
 * a card grid. Clicking a card opens {@link TdtChallengeView}.
 */
import { useEffect, useState } from 'react';
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
import { FiArrowLeft, FiCode, FiCpu, FiBox } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { tdtRepository } from '../../api';
import type { TdtChallenge, TdtCategory } from '../../api';
import styles from './tdt-catalog-view.module.scss';

interface TdtCatalogViewProps {
  onBack: () => void;
  onSelect: (challenge: TdtChallenge) => void;
}

const categoryMeta: Record<TdtCategory, { label: string; icon: IconType }> = {
  algorithms: { label: 'Algorithms', icon: FiCpu },
  'react-hooks': { label: 'React Hooks', icon: FiCode },
  architecture: { label: 'Architecture', icon: FiBox },
};

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

const CATEGORIES: TdtCategory[] = ['algorithms', 'react-hooks', 'architecture'];

export function TdtCatalogView({ onBack, onSelect }: TdtCatalogViewProps) {
  const [challenges, setChallenges] = useState<TdtChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    tdtRepository
      .getAll()
      .then(setChallenges)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = (cat: TdtCategory) => challenges.filter((c) => c.category === cat);

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
          <Alert variant="error">Failed to load challenges. Is the API server running?</Alert>
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
                  {items.map((challenge) => (
                    <Card key={challenge.id} className={styles.challengeCard}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Badge
                            label={challenge.difficulty}
                            variant={difficultyVariant[challenge.difficulty]}
                          />
                        </div>
                        <Typography variant="subtitle" className={styles.cardTitle}>
                          {challenge.title}
                        </Typography>
                        <Typography variant="caption" className={styles.cardDesc}>
                          {challenge.description}
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
