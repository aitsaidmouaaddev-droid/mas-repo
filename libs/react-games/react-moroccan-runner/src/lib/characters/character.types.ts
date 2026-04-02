import type { PlatformerState } from '../platform.slice';

// ── Character descriptor ──────────────────────────────────────────────────────

export interface CharacterDescriptor {
  /** Unique kebab-case identifier stored in progress */
  id: string;
  /** Display name (used in character select screen) */
  name: string;
  /** Short flavour text shown on character select card */
  flavour: string;
  /** Primary colour hex — used for card accent */
  color: string;
  /** Draw the character sprite at the player position from state */
  draw(ctx: CanvasRenderingContext2D, state: PlatformerState, nowMs: number): void;
  /** Play jump SFX */
  playJump(): void;
  /** Play coin collect SFX */
  playCoin(): void;
  /** Play death SFX */
  playDeath(): void;
  /** Play enemy killed SFX */
  playKillEnemy(): void;
  /** Play lose-a-life SFX */
  playLoseLife(): void;
}
