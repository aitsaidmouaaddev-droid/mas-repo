import { Typography, TypographyWithSkeleton, Stack } from '@mas/react-ui';
import styles from './QcmProgressComparison.module.scss';

interface QcmProgressComparisonProps {
  loading: boolean;
  attemptNum: number;
  previousBest: number | null;
  pct: number;
  isNewBest: boolean;
}

export function QcmProgressComparison({ loading, attemptNum, previousBest, pct, isNewBest }: QcmProgressComparisonProps) {
  return (
    <div className={styles.section}>
      <Typography variant="caption" className={styles.sectionTitle}>
        Progress
      </Typography>
      <Stack direction="vertical" gap={4}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Attempt</span>
          <TypographyWithSkeleton loading={loading} variant="body" className={styles.progressValue}>
            #{attemptNum}
          </TypographyWithSkeleton>
        </div>
        {(loading || previousBest !== null) && (
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Previous best</span>
            <TypographyWithSkeleton loading={loading} variant="body" className={styles.progressValue}>
              {previousBest}%
            </TypographyWithSkeleton>
          </div>
        )}
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>This session</span>
          <TypographyWithSkeleton
            loading={loading}
            variant="body"
            className={!loading && isNewBest ? styles.newBest : styles.progressValue}
          >
            {pct}%{isNewBest && ' — New best!'}
          </TypographyWithSkeleton>
        </div>
      </Stack>
    </div>
  );
}
