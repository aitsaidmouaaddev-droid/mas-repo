import { useSelector } from 'react-redux';
import { Typography, Badge } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { RootState } from '../hooks/useFlappyGame.types';
import styles from './FlappyHud.module.scss';

export function FlappyHud() {
  const score = useSelector((s: RootState) => s.flappy.score);
  const bestScore = useSelector((s: RootState) => s.flappy.bestScore);
  const status = useSelector((s: RootState) => s.flappy.status);
  const { t } = useT();

  const statusVariant =
    status === 'running' ? 'success' : status === 'dead' ? 'error' : 'secondary';

  return (
    <div className={styles.hud}>
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
          {t('games.flappyBird.best')}
        </Typography>
        <Typography variant="body" className={styles.value}>
          {bestScore}
        </Typography>
      </div>
      <Badge label={t(`games.flappyBird.status.${status}`)} variant={statusVariant} />
    </div>
  );
}
