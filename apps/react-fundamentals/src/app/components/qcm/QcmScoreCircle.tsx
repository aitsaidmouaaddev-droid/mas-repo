import styles from './QcmScoreCircle.module.scss';

interface QcmScoreCircleProps {
  pct: number;
  correctCount: number;
  total: number;
}

export function QcmScoreCircle({ pct, correctCount, total }: QcmScoreCircleProps) {
  return (
    <div className={styles.scoreCircle} data-passed={String(pct >= 70)}>
      <span className={styles.scoreValue}>{pct}%</span>
      <span className={styles.scoreLabel}>{correctCount} / {total}</span>
    </div>
  );
}
