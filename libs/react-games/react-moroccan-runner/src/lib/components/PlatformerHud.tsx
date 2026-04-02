import { useSelector } from 'react-redux';
import { Typography, Badge } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { RootState } from '../hooks/usePlatformerGame.types';
import { getCharacter } from '../characters/character.registry';
import { getWorld } from '../worlds/world.registry';
import { TOTAL_WORLDS, LEVELS_PER_WORLD } from '../levels/level.registry';
import { useGameSfx } from '../hooks/useGameSfx';
import styles from './PlatformerHud.module.scss';

const STATUS_VARIANT: Record<string, 'secondary' | 'success' | 'warning' | 'error'> = {
  idle: 'secondary',
  'character-select': 'secondary',
  running: 'success',
  paused: 'warning',
  dead: 'error',
  'level-complete': 'success',
  'game-complete': 'success',
};

export function PlatformerHud() {
  const { t } = useT();
  const status = useSelector((s: RootState) => s.platform.status);
  const score = useSelector((s: RootState) => s.platform.score);
  const bestScore = useSelector((s: RootState) => s.platform.bestScore);
  const lives = useSelector((s: RootState) => s.platform.lives);
  const characterId = useSelector((s: RootState) => s.platform.characterId);
  const worldIndex = useSelector((s: RootState) => s.platform.worldIndex);
  const levelIndex = useSelector((s: RootState) => s.platform.levelIndex);
  const isPowered = useSelector((s: RootState) => s.platform.isPowered);
  const poweredFrames = useSelector((s: RootState) => s.platform.poweredFrames);

  // Fire SFX on state transitions
  useGameSfx();

  const character = characterId ? getCharacter(characterId) : null;
  const world = getWorld(worldIndex);
  const statusVariant = STATUS_VARIANT[status] ?? 'default';

  // Flash the powered indicator when < 2 s remain (120 frames)
  const poweredFlash = isPowered && poweredFrames < 120 && Math.floor(poweredFrames / 12) % 2 === 0;

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
          {t('games.snake.best')}
        </Typography>
        <Typography variant="body" className={styles.value}>
          {bestScore}
        </Typography>
      </div>
      <div className={styles.scoreItem}>
        <Typography variant="caption" className={styles.label}>
          {t('games.moroccanRunner.lives')}
        </Typography>
        <Typography variant="body" className={styles.value}>
          {'❤️'.repeat(lives)}
        </Typography>
      </div>
      <div className={styles.scoreItem}>
        <Typography variant="caption" className={styles.label}>
          {t('games.moroccanRunner.world')}
        </Typography>
        <Typography variant="body" className={styles.value} style={{ color: character?.color }}>
          {world.name}
        </Typography>
      </div>
      <div className={styles.scoreItem}>
        <Typography variant="caption" className={styles.label}>
          {t('games.moroccanRunner.level')}
        </Typography>
        <Typography variant="body" className={styles.value}>
          {worldIndex * LEVELS_PER_WORLD + levelIndex + 1}/{TOTAL_WORLDS * LEVELS_PER_WORLD}
        </Typography>
      </div>
      {isPowered && (
        <div className={styles.scoreItem} style={{ opacity: poweredFlash ? 0.4 : 1 }}>
          <Typography variant="body" className={styles.value} style={{ color: '#f0e040' }}>
            <span role="img" aria-label="star">
              ⭐
            </span>{' '}
            {t('games.moroccanRunner.powered')}
          </Typography>
        </div>
      )}
      <Badge label={t(`games.moroccanRunner.status.${status}`)} variant={statusVariant} />
    </div>
  );
}
