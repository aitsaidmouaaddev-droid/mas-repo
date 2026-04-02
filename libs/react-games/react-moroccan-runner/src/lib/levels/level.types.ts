// ── Level type contracts ───────────────────────────────────────────────────────

export interface LevelPlatform {
  x: number;
  /** Pixels above ground top (0 = ground level, used as step-up platforms) */
  yFromGround: number;
  w: number;
}

export interface LevelEnemy {
  x: number;
  patrolLeft: number;
  patrolRight: number;
  /** px/frame, default 1.5 */
  speed?: number;
  /** Pixels above ground — 0 = walks on ground */
  yFromGround?: number;
}

export interface LevelCoin {
  x: number;
  /** Pixels above ground for coin centre */
  yFromGround: number;
}

export interface LevelBox {
  x: number;
  /** Distance of box BOTTOM above ground (yFromGround=80 → box bottom is 80px above groundY) */
  yFromGround: number;
}

export interface LevelLayout {
  width: number;
  flagX: number;
  /** x ranges where solid ground exists — gaps have no ground */
  groundSegments: [number, number][];
  /** Elevated platforms (not ground level) */
  platforms: LevelPlatform[];
  enemies: LevelEnemy[];
  coins: LevelCoin[];
  /** Power-up boxes — hit from below to get powered */
  boxes: LevelBox[];
}
