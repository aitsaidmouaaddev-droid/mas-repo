import { Typography, TypographyWithSkeleton, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import styles from './QcmProgressComparison.module.scss';

interface QcmProgressComparisonProps {
  loading: boolean;
  attemptNum: number;
  previousBest: number | null;
  pct: number;
  isNewBest: boolean;
}

export function QcmProgressComparison({ loading, attemptNum, previousBest, pct, isNewBest }: QcmProgressComparisonProps) {
  const { t } = useT();

  return (
    <div className={styles.section}>
      <Typography variant="caption" className={styles.sectionTitle}>
        {t('qcm.progress')}
      </Typography>
      <Stack direction="vertical" gap={4}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>{t('qcm.attempt')}</span>
          <TypographyWithSkeleton loading={loading} variant="body" className={styles.progressValue}>
            #{attemptNum}
          </TypographyWithSkeleton>
        </div>
        {(loading || previousBest !== null) && (
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>{t('qcm.previousBest')}</span>
            <TypographyWithSkeleton loading={loading} variant="body" className={styles.progressValue}>
              {previousBest}%
            </TypographyWithSkeleton>
          </div>
        )}
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>{t('qcm.thisSession')}</span>
          <TypographyWithSkeleton
            loading={loading}
            variant="body"
            className={!loading && isNewBest ? styles.newBest : styles.progressValue}
          >
            {pct}%{isNewBest && ` — ${t('qcm.newBest')}`}
          </TypographyWithSkeleton>
        </div>
      </Stack>
    </div>
  );
}
