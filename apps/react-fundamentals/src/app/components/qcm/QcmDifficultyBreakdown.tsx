import { Typography, Badge } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { DIFF_ORDER } from '../../utils';
import styles from './QcmDifficultyBreakdown.module.scss';

interface DifficultyStats {
  total: number;
  correct: number;
  pct: number;
}

interface QcmDifficultyBreakdownProps {
  byDifficulty: Record<string, DifficultyStats>;
}

export function QcmDifficultyBreakdown({ byDifficulty }: QcmDifficultyBreakdownProps) {
  const { t } = useT();

  return (
    <div className={styles.section}>
      <Typography variant="caption" className={styles.sectionTitle}>
        {t('qcm.byDifficulty')}
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
  );
}
