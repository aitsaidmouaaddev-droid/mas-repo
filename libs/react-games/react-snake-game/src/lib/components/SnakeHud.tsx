import { useSelector } from 'react-redux';
import { Typography, Badge } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { RootState } from '../hooks/useSnakeGame.types';
import styles from './SnakeHud.module.scss';

export function SnakeHud() {
  const score = useSelector((s: RootState) => s.snake.score);
  const bestScore = useSelector((s: RootState) => s.snake.bestScore);
  const status = useSelector((s: RootState) => s.snake.status);
  const { t } = useT();

  const statusVariant =
    status === 'running'
      ? 'success'
      : status === 'paused'
        ? 'warning'
        : status === 'dead'
          ? 'error'
          : 'secondary';

  return (
    <div className={styles.hud}>
      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <Typography variant="caption" className={styles.label}>
            {t('games.snake.score')}
          </Typography>
          <Typography variant="body" className={styles.value}>
            {score}
          </Typography>
        </div>
        <div className={styles.scoreItem}>
          <Typography variant="caption" className={styles.label}>
            {t('games.snake.best')}
          </Typography>
          <Typography variant="body" className={styles.value}>
            {bestScore}
          </Typography>
        </div>
      </div>
      <Badge label={t(`games.snake.status.${status}`)} variant={statusVariant} />
    </div>
  );
}
