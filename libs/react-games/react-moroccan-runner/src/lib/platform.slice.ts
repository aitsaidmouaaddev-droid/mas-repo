import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLevel, LEVELS_PER_WORLD, TOTAL_WORLDS } from './levels/level.registry';

// ── Constants ─────────────────────────────────────────────────────────────────

export const GRAVITY = 0.6;
export const JUMP_FORCE = -13.5;
export const JUMP_HOLD_BONUS = -0.55;
export const JUMP_HOLD_MAX = 10;
export const WALK_SPEED = 3.5;
export const RUN_SPEED = 6.5;
export const ACCEL = 0.7;
export const FRICTION = 0.72;
export const PLATFORM_H = 18;
export const GROUND_HEIGHT = 64;
export const PLAYER_W = 34;
export const PLAYER_H = 52;
export const ENEMY_W = 36;
export const ENEMY_H = 38;
export const COIN_RADIUS = 10;
export const BOX_W = 34;
export const BOX_H = 34;
export const INITIAL_LIVES = 3;
export const LEVEL_COMPLETE_FRAMES = 130;
export const INVINCIBLE_FRAMES = 120;
export const POWERED_DURATION = 480; // 8 s at 60 fps

// ── Types ─────────────────────────────────────────────────────────────────────

export type GameStatus =
  | 'idle'
  | 'character-select'
  | 'running'
  | 'paused'
  | 'dead'
  | 'level-complete'
  | 'game-complete';

export interface Platform {
  x: number;
  /** Pixels above groundY (collision top = groundY - yFromGround) */
  yFromGround: number;
  w: number;
  h: number;
}

export interface Enemy {
  id: number;
  x: number;
  vx: number;
  patrolLeft: number;
  patrolRight: number;
  alive: boolean;
  stunnedFrames: number;
  /** 0 = walks on ground */
  yFromGround: number;
}

export interface Coin {
  x: number;
  /** Centre Y above groundY */
  yFromGround: number;
  collected: boolean;
}

export interface Box {
  id: number;
  x: number;
  /** Box bottom above groundY */
  yFromGround: number;
  hit: boolean;
  /** Countdown frames for hit-pop animation */
  hitFrames: number;
}

export interface PlatformerState {
  status: GameStatus;
  playerX: number;
  playerY: number;
  playerVX: number;
  playerVY: number;
  playerFacing: 'left' | 'right';
  isOnGround: boolean;
  jumpHeldFrames: number;
  cameraX: number;
  lives: number;
  invincibleFrames: number;
  /** countdown for level-complete animation */
  statusFrames: number;
  worldIndex: number;
  levelIndex: number;
  platforms: Platform[];
  groundSegments: [number, number][];
  enemies: Enemy[];
  coins: Coin[];
  flagX: number;
  levelWidth: number;
  score: number;
  bestScore: number;
  totalCoins: number;
  characterId: string;
  boxes: Box[];
  isPowered: boolean;
  poweredFrames: number;
  width: number;
  height: number;
  frameCount: number;
  progressLoaded: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadLevelGeometry(
  worldIndex: number,
  levelIndex: number,
  _width: number,
  height: number,
): Pick<
  PlatformerState,
  | 'platforms'
  | 'groundSegments'
  | 'enemies'
  | 'coins'
  | 'boxes'
  | 'flagX'
  | 'levelWidth'
  | 'playerX'
  | 'playerY'
  | 'cameraX'
> {
  const layout = getLevel(worldIndex, levelIndex);
  const groundY = height - GROUND_HEIGHT;

  return {
    playerX: 80,
    playerY: groundY - PLAYER_H,
    cameraX: 0,
    platforms: layout.platforms.map((p) => ({
      x: p.x,
      yFromGround: p.yFromGround,
      w: p.w,
      h: PLATFORM_H,
    })),
    groundSegments: layout.groundSegments,
    enemies: layout.enemies.map((e, i) => ({
      id: i,
      x: e.x,
      vx: e.speed ?? 1.5,
      patrolLeft: e.patrolLeft,
      patrolRight: e.patrolRight,
      alive: true,
      stunnedFrames: 0,
      yFromGround: e.yFromGround ?? 0,
    })),
    coins: layout.coins.map((c) => ({
      x: c.x,
      yFromGround: c.yFromGround,
      collected: false,
    })),
    boxes: (layout.boxes ?? []).map((b, i) => ({
      id: i,
      x: b.x,
      yFromGround: b.yFromGround,
      hit: false,
      hitFrames: 0,
    })),
    flagX: layout.flagX,
    levelWidth: layout.width,
  };
}

function buildInitialState(width = 800, height = 500): PlatformerState {
  const geo = loadLevelGeometry(0, 0, width, height);
  return {
    status: 'idle',
    playerX: geo.playerX,
    playerY: geo.playerY,
    playerVX: 0,
    playerVY: 0,
    playerFacing: 'right',
    isOnGround: true,
    jumpHeldFrames: 0,
    cameraX: 0,
    lives: INITIAL_LIVES,
    invincibleFrames: 0,
    statusFrames: 0,
    worldIndex: 0,
    levelIndex: 0,
    platforms: geo.platforms,
    groundSegments: geo.groundSegments,
    enemies: geo.enemies,
    coins: geo.coins,
    flagX: geo.flagX,
    levelWidth: geo.levelWidth,
    score: 0,
    bestScore: 0,
    totalCoins: 0,
    characterId: '',
    boxes: geo.boxes,
    isPowered: false,
    poweredFrames: 0,
    width,
    height,
    frameCount: 0,
    progressLoaded: false,
  };
}

// ── Slice ─────────────────────────────────────────────────────────────────────

export const platformSlice = createSlice({
  name: 'platform',
  initialState: buildInitialState(),
  reducers: {
    setSize(state, action: PayloadAction<{ width: number; height: number }>) {
      const changed =
        state.width !== action.payload.width || state.height !== action.payload.height;
      state.width = action.payload.width;
      state.height = action.payload.height;
      if (changed && state.status !== 'idle' && state.status !== 'character-select') {
        // Recompute level geometry for new canvas size
        const geo = loadLevelGeometry(
          state.worldIndex,
          state.levelIndex,
          action.payload.width,
          action.payload.height,
        );
        state.platforms = geo.platforms;
        state.groundSegments = geo.groundSegments;
        // Don't reset player/enemies/coins — those are live state
      }
    },

    showCharacterSelect(state) {
      state.status = 'character-select';
    },

    selectCharacter(state, action: PayloadAction<string>) {
      state.characterId = action.payload;
      state.status = 'running';
    },

    pause(state) {
      if (state.status === 'running') state.status = 'paused';
    },

    resume(state) {
      if (state.status === 'paused') state.status = 'running';
    },

    reset(state) {
      const geo = loadLevelGeometry(state.worldIndex, state.levelIndex, state.width, state.height);
      state.status = 'character-select';
      state.playerX = geo.playerX;
      state.playerY = geo.playerY;
      state.playerVX = 0;
      state.playerVY = 0;
      state.playerFacing = 'right';
      state.isOnGround = true;
      state.jumpHeldFrames = 0;
      state.cameraX = 0;
      state.lives = INITIAL_LIVES;
      state.invincibleFrames = 0;
      state.statusFrames = 0;
      state.isPowered = false;
      state.poweredFrames = 0;
      state.platforms = geo.platforms;
      state.groundSegments = geo.groundSegments;
      state.enemies = geo.enemies;
      state.coins = geo.coins;
      state.boxes = geo.boxes;
      state.flagX = geo.flagX;
      state.levelWidth = geo.levelWidth;
      state.score = 0;
      state.frameCount = 0;
    },

    resetToWorld0(state) {
      state.worldIndex = 0;
      state.levelIndex = 0;
      const geo = loadLevelGeometry(0, 0, state.width, state.height);
      state.status = 'character-select';
      state.playerX = geo.playerX;
      state.playerY = geo.playerY;
      state.playerVX = 0;
      state.playerVY = 0;
      state.playerFacing = 'right';
      state.isOnGround = true;
      state.jumpHeldFrames = 0;
      state.cameraX = 0;
      state.lives = INITIAL_LIVES;
      state.invincibleFrames = 0;
      state.statusFrames = 0;
      state.isPowered = false;
      state.poweredFrames = 0;
      state.platforms = geo.platforms;
      state.groundSegments = geo.groundSegments;
      state.enemies = geo.enemies;
      state.coins = geo.coins;
      state.boxes = geo.boxes;
      state.flagX = geo.flagX;
      state.levelWidth = geo.levelWidth;
      state.score = 0;
      state.frameCount = 0;
    },

    setBestScore(state, action: PayloadAction<number>) {
      if (action.payload > state.bestScore) state.bestScore = action.payload;
    },

    loadProgress(
      state,
      action: PayloadAction<{
        characterId: string;
        worldIndex: number;
        levelIndex: number;
        totalCoins: number;
      }>,
    ) {
      const { characterId, worldIndex, levelIndex, totalCoins } = action.payload;
      state.characterId = characterId;
      state.worldIndex = worldIndex;
      state.levelIndex = levelIndex;
      state.totalCoins = totalCoins;
      state.progressLoaded = true;
      // Load level geometry for the saved world/level
      const geo = loadLevelGeometry(worldIndex, levelIndex, state.width, state.height);
      Object.assign(state, geo);
    },

    tick(
      state,
      action: PayloadAction<{
        left: boolean;
        right: boolean;
        jumpHeld: boolean;
        jumpJustPressed: boolean;
        run: boolean;
      }>,
    ) {
      const { left, right, jumpHeld, jumpJustPressed, run } = action.payload;

      // ── Level complete countdown ─────────────────────────────────────────
      if (state.status === 'level-complete') {
        state.statusFrames--;
        if (state.statusFrames <= 0) {
          const nextLevel = state.levelIndex + 1;
          const nextWorld = nextLevel >= LEVELS_PER_WORLD ? state.worldIndex + 1 : state.worldIndex;
          const finalLevel = nextLevel >= LEVELS_PER_WORLD ? 0 : nextLevel;

          if (nextWorld >= TOTAL_WORLDS) {
            state.status = 'game-complete';
            if (state.score > state.bestScore) state.bestScore = state.score;
            return;
          }

          state.worldIndex = nextWorld;
          state.levelIndex = finalLevel;
          const geo = loadLevelGeometry(nextWorld, finalLevel, state.width, state.height);
          Object.assign(state, geo);
          state.status = 'running';
          state.playerVX = 0;
          state.playerVY = 0;
          state.isOnGround = true;
          state.jumpHeldFrames = 0;
          state.invincibleFrames = 0;
        }
        return;
      }

      if (state.status !== 'running') return;

      state.frameCount++;

      const groundY = state.height - GROUND_HEIGHT;

      // ── Horizontal movement ────────────────────────────────────────────────
      const maxSpeed = run ? RUN_SPEED : WALK_SPEED;

      if (left) {
        state.playerVX = Math.max(state.playerVX - ACCEL, -maxSpeed);
        state.playerFacing = 'left';
      } else if (right) {
        state.playerVX = Math.min(state.playerVX + ACCEL, maxSpeed);
        state.playerFacing = 'right';
      } else {
        state.playerVX *= FRICTION;
        if (Math.abs(state.playerVX) < 0.2) state.playerVX = 0;
      }

      state.playerX += state.playerVX;
      state.playerX = Math.max(0, Math.min(state.playerX, state.levelWidth - PLAYER_W));

      // ── Jump ───────────────────────────────────────────────────────────────
      if (jumpJustPressed && state.isOnGround) {
        state.playerVY = JUMP_FORCE;
        state.isOnGround = false;
        state.jumpHeldFrames = 1;
      }

      if (jumpHeld && state.jumpHeldFrames > 0 && state.jumpHeldFrames < JUMP_HOLD_MAX) {
        state.playerVY += JUMP_HOLD_BONUS;
        state.jumpHeldFrames++;
      }

      if (!jumpHeld) state.jumpHeldFrames = 0;

      // ── Vertical physics ───────────────────────────────────────────────────
      state.playerVY = Math.min(state.playerVY + GRAVITY, 16);
      state.playerY += state.playerVY;
      state.isOnGround = false;

      const playerBottom = state.playerY + PLAYER_H;
      const playerLeft = state.playerX + 4;
      const playerRight = state.playerX + PLAYER_W - 4;

      // Ground segment collision
      for (const [x1, x2] of state.groundSegments) {
        if (playerRight > x1 && playerLeft < x2) {
          if (playerBottom >= groundY && state.playerVY >= 0) {
            state.playerY = groundY - PLAYER_H;
            state.playerVY = 0;
            state.isOnGround = true;
            state.jumpHeldFrames = 0;
            break;
          }
        }
      }

      // Elevated platform collision (one-way, land on top only)
      if (!state.isOnGround) {
        for (const p of state.platforms) {
          const platTop = groundY - p.yFromGround;
          if (playerRight > p.x + 4 && playerLeft < p.x + p.w - 4) {
            const wasAbove = playerBottom - state.playerVY <= platTop + 2;
            if (wasAbove && playerBottom >= platTop && state.playerVY >= 0) {
              state.playerY = platTop - PLAYER_H;
              state.playerVY = 0;
              state.isOnGround = true;
              state.jumpHeldFrames = 0;
              break;
            }
          }
        }
      }

      // ── Fall off screen → lose a life ─────────────────────────────────────
      if (state.playerY > state.height + 80) {
        state.lives--;
        state.invincibleFrames = INVINCIBLE_FRAMES;
        if (state.lives <= 0) {
          state.status = 'dead';
          if (state.score > state.bestScore) state.bestScore = state.score;
          return;
        }
        // Respawn at level start
        const geo = loadLevelGeometry(
          state.worldIndex,
          state.levelIndex,
          state.width,
          state.height,
        );
        Object.assign(state, geo);
        state.status = 'running';
        state.playerVX = 0;
        state.playerVY = 0;
        state.isOnGround = true;
        state.jumpHeldFrames = 0;
        state.isPowered = false;
        state.poweredFrames = 0;
        return;
      }

      // ── Invincibility countdown ────────────────────────────────────────────
      if (state.invincibleFrames > 0) state.invincibleFrames--;

      // ── Enemy AI (patrol) ─────────────────────────────────────────────────
      for (const enemy of state.enemies) {
        if (!enemy.alive) {
          if (enemy.stunnedFrames > 0) enemy.stunnedFrames--;
          continue;
        }
        enemy.x += enemy.vx;
        if (enemy.x <= enemy.patrolLeft) {
          enemy.x = enemy.patrolLeft;
          enemy.vx = Math.abs(enemy.vx);
        } else if (enemy.x + ENEMY_W >= enemy.patrolRight) {
          enemy.x = enemy.patrolRight - ENEMY_W;
          enemy.vx = -Math.abs(enemy.vx);
        }
      }

      // ── Player ↔ enemy collision ──────────────────────────────────────────
      for (const enemy of state.enemies) {
        if (!enemy.alive) continue;
        const enemyTop = groundY - enemy.yFromGround - ENEMY_H;
        const eRight = enemy.x + ENEMY_W;

        const overlapX = playerRight > enemy.x && playerLeft < eRight;
        if (!overlapX) continue;

        const pBottom = state.playerY + PLAYER_H;
        const overlapY = pBottom > enemyTop && state.playerY < enemyTop + ENEMY_H;
        if (!overlapY) continue;

        const stomping = state.playerVY > 0 && pBottom < enemyTop + ENEMY_H * 0.5;

        if (stomping || state.isPowered) {
          enemy.alive = false;
          enemy.stunnedFrames = 20;
          if (stomping) state.playerVY = -9; // bounce on stomp
          state.score += state.isPowered && !stomping ? 150 : 100;
        } else if (state.invincibleFrames === 0) {
          state.lives--;
          state.invincibleFrames = INVINCIBLE_FRAMES;
          // Knockback
          state.playerVX = state.playerX + PLAYER_W / 2 < enemy.x + ENEMY_W / 2 ? -5 : 5;
          if (state.lives <= 0) {
            state.status = 'dead';
            if (state.score > state.bestScore) state.bestScore = state.score;
            return;
          }
        }
      }

      // ── Box collision (hit from below) ───────────────────────────────────
      for (const box of state.boxes) {
        if (box.hit) {
          if (box.hitFrames > 0) box.hitFrames--;
          continue;
        }
        const boxBottomY = groundY - box.yFromGround;
        const boxTopY = boxBottomY - BOX_H;
        const overlapX = playerRight > box.x + 4 && playerLeft < box.x + BOX_W - 4;
        // Player head hits box bottom while moving up
        if (
          overlapX &&
          state.playerVY < 0 &&
          state.playerY <= boxBottomY + 4 &&
          state.playerY >= boxTopY
        ) {
          box.hit = true;
          box.hitFrames = 24;
          state.playerVY = Math.max(state.playerVY, 2); // small downward bounce
          state.isPowered = true;
          state.poweredFrames = POWERED_DURATION;
          state.score += 50;
        }
      }

      // ── Powered countdown ─────────────────────────────────────────────────
      if (state.isPowered) {
        state.poweredFrames--;
        if (state.poweredFrames <= 0) {
          state.isPowered = false;
          state.poweredFrames = 0;
        }
      }

      // ── Coin collection ───────────────────────────────────────────────────
      for (const coin of state.coins) {
        if (coin.collected) continue;
        const cx = coin.x;
        const cy = groundY - coin.yFromGround;
        const pcx = state.playerX + PLAYER_W / 2;
        const pcy = state.playerY + PLAYER_H / 2;
        const dx = pcx - cx;
        const dy = pcy - cy;
        if (dx * dx + dy * dy < (COIN_RADIUS + 18) ** 2) {
          coin.collected = true;
          state.score += 10;
          state.totalCoins++;
        }
      }

      // ── Score: 1pt per 90 frames ──────────────────────────────────────────
      if (state.frameCount % 90 === 0) state.score++;

      // ── Flag (level complete) ─────────────────────────────────────────────
      if (state.playerX + PLAYER_W >= state.flagX) {
        state.score += 500;
        const nextLevel = state.levelIndex + 1;
        const nextWorld = nextLevel >= LEVELS_PER_WORLD ? state.worldIndex + 1 : state.worldIndex;

        if (nextWorld >= TOTAL_WORLDS) {
          state.status = 'game-complete';
          if (state.score > state.bestScore) state.bestScore = state.score;
        } else {
          state.status = 'level-complete';
          state.statusFrames = LEVEL_COMPLETE_FRAMES;
        }
        return;
      }

      // ── Camera (follows player, lookahead 40% from left) ─────────────────
      const target = state.playerX - state.width * 0.38;
      state.cameraX = Math.max(0, Math.min(target, state.levelWidth - state.width));
    },
  },
});

export const {
  setSize,
  showCharacterSelect,
  selectCharacter,
  pause,
  resume,
  reset,
  resetToWorld0,
  setBestScore,
  loadProgress,
  tick,
} = platformSlice.actions;

export default platformSlice.reducer;
