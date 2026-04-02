import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './usePlatformerGame.types';
import { sharedSfx } from '../sfx';
import { getCharacter } from '../characters/character.registry';

/**
 * Watches state transitions and fires the correct SFX.
 * Must be called inside the Redux Provider.
 */
export function useGameSfx() {
  const status = useSelector((s: RootState) => s.platform.status);
  const lives = useSelector((s: RootState) => s.platform.lives);
  const score = useSelector((s: RootState) => s.platform.score);
  const isPowered = useSelector((s: RootState) => s.platform.isPowered);
  const poweredFrames = useSelector((s: RootState) => s.platform.poweredFrames);
  const characterId = useSelector((s: RootState) => s.platform.characterId);
  const boxes = useSelector((s: RootState) => s.platform.boxes);

  const prev = useRef({
    status,
    lives,
    score,
    isPowered,
    poweredFrames,
    hitBoxCount: 0,
  });

  const character = characterId ? getCharacter(characterId) : null;

  // Count hit boxes to detect new hits each frame
  const hitBoxCount = boxes.filter((b) => b.hit).length;

  useEffect(() => {
    const p = prev.current;

    // Status transitions
    if (status !== p.status) {
      if (status === 'level-complete') sharedSfx.levelComplete();
      if (status === 'game-complete') sharedSfx.gameComplete();
      if (status === 'dead' && p.status === 'running' && lives <= 0) {
        character?.playDeath();
      }
    }

    // Lose a life (lives decreased while running — invincible frames just set)
    if (lives < p.lives && status === 'running') {
      character?.playLoseLife();
    }

    // Score increase while running — detect kills (score jumps by 100 or 150 at once)
    if (score > p.score && status === 'running') {
      const delta = score - p.score;
      if (delta >= 100) {
        character?.playKillEnemy();
      }
    }

    // New box hit
    if (hitBoxCount > p.hitBoxCount) {
      sharedSfx.boxHit();
    }

    // Power-up acquired
    if (isPowered && !p.isPowered) {
      sharedSfx.powerUp();
    }

    // Power-down (frames hit 0 from above — was powered, now not)
    if (!isPowered && p.isPowered && poweredFrames === 0) {
      sharedSfx.powerDown();
    }

    prev.current = { status, lives, score, isPowered, poweredFrames, hitBoxCount };
  });
}
