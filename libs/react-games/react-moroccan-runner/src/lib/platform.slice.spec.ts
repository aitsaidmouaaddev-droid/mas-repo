import { describe, it, expect } from 'vitest';
import platformReducer, {
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
  GRAVITY,
  JUMP_FORCE,
  WALK_SPEED,
  GROUND_HEIGHT,
  PLAYER_W,
  PLAYER_H,
  ENEMY_H,
  INITIAL_LIVES,
  INVINCIBLE_FRAMES,
  POWERED_DURATION,
  type PlatformerState,
} from './platform.slice';

// ── Helpers ────────────────────────────────────────────────────────────────────

const W = 800;
const H = 500;
const GROUND_Y = H - GROUND_HEIGHT; // 436

function initial(): PlatformerState {
  return platformReducer(undefined, { type: '@@init' });
}

function withSize(): PlatformerState {
  return platformReducer(initial(), setSize({ width: W, height: H }));
}

function running(): PlatformerState {
  return platformReducer(withSize(), selectCharacter('hassan'));
}

// ── Initial state ──────────────────────────────────────────────────────────────

describe('platformSlice — initial state', () => {
  it('starts idle', () => {
    expect(initial().status).toBe('idle');
  });

  it('starts with full lives', () => {
    expect(initial().lives).toBe(INITIAL_LIVES);
  });

  it('starts at world 0 level 0', () => {
    const s = initial();
    expect(s.worldIndex).toBe(0);
    expect(s.levelIndex).toBe(0);
  });

  it('player faces right', () => {
    expect(initial().playerFacing).toBe('right');
  });

  it('has no powered state', () => {
    const s = initial();
    expect(s.isPowered).toBe(false);
    expect(s.poweredFrames).toBe(0);
  });

  it('has zero score', () => {
    expect(initial().score).toBe(0);
    expect(initial().bestScore).toBe(0);
  });
});

// ── Status transitions ────────────────────────────────────────────────────────

describe('platformSlice — status transitions', () => {
  it('showCharacterSelect → character-select', () => {
    const s = platformReducer(withSize(), showCharacterSelect());
    expect(s.status).toBe('character-select');
  });

  it('selectCharacter → running', () => {
    expect(running().status).toBe('running');
  });

  it('selectCharacter sets characterId', () => {
    expect(running().characterId).toBe('hassan');
  });

  it('pause → paused', () => {
    const s = platformReducer(running(), pause());
    expect(s.status).toBe('paused');
  });

  it('pause does nothing when not running', () => {
    const s = platformReducer(withSize(), pause());
    expect(s.status).toBe('idle');
  });

  it('resume → running', () => {
    let s = platformReducer(running(), pause());
    s = platformReducer(s, resume());
    expect(s.status).toBe('running');
  });

  it('resume does nothing when not paused', () => {
    const s = platformReducer(running(), resume());
    expect(s.status).toBe('running');
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('platformSlice — reset', () => {
  it('resets score to 0', () => {
    let s: PlatformerState = { ...running(), score: 500 };
    s = platformReducer(s, reset());
    expect(s.score).toBe(0);
  });

  it('resets to character-select status', () => {
    const s = platformReducer(running(), reset());
    expect(s.status).toBe('character-select');
  });

  it('restores full lives', () => {
    let s: PlatformerState = { ...running(), lives: 1 };
    s = platformReducer(s, reset());
    expect(s.lives).toBe(INITIAL_LIVES);
  });

  it('resets powered state', () => {
    let s: PlatformerState = { ...running(), isPowered: true, poweredFrames: 200 };
    s = platformReducer(s, reset());
    expect(s.isPowered).toBe(false);
    expect(s.poweredFrames).toBe(0);
  });
});

// ── resetToWorld0 ─────────────────────────────────────────────────────────────

describe('platformSlice — resetToWorld0', () => {
  it('returns to world 0 level 0', () => {
    let s: PlatformerState = { ...running(), worldIndex: 2, levelIndex: 3 };
    s = platformReducer(s, resetToWorld0());
    expect(s.worldIndex).toBe(0);
    expect(s.levelIndex).toBe(0);
  });
});

// ── setBestScore ───────────────────────────────────────────────────────────────

describe('platformSlice — setBestScore', () => {
  it('sets bestScore when higher', () => {
    const s = platformReducer(initial(), setBestScore(100));
    expect(s.bestScore).toBe(100);
  });

  it('ignores lower value', () => {
    let s = platformReducer(initial(), setBestScore(100));
    s = platformReducer(s, setBestScore(50));
    expect(s.bestScore).toBe(100);
  });
});

// ── loadProgress ──────────────────────────────────────────────────────────────

describe('platformSlice — loadProgress', () => {
  it('loads saved progress', () => {
    const s = platformReducer(
      withSize(),
      loadProgress({
        characterId: 'fatima',
        worldIndex: 2,
        levelIndex: 1,
        totalCoins: 42,
      }),
    );
    expect(s.characterId).toBe('fatima');
    expect(s.worldIndex).toBe(2);
    expect(s.levelIndex).toBe(1);
    expect(s.totalCoins).toBe(42);
    expect(s.progressLoaded).toBe(true);
  });
});

// ── setSize ───────────────────────────────────────────────────────────────────

describe('platformSlice — setSize', () => {
  it('updates canvas dimensions', () => {
    const s = platformReducer(initial(), setSize({ width: 1024, height: 600 }));
    expect(s.width).toBe(1024);
    expect(s.height).toBe(600);
  });
});

// ── tick — does nothing when not running ─────────────────────────────────────

describe('platformSlice — tick guard', () => {
  it('does nothing when idle', () => {
    const s = initial();
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.playerX).toBe(s.playerX);
    expect(next.playerVX).toBe(0);
  });

  it('does nothing when paused', () => {
    const s = platformReducer(running(), pause());
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.playerX).toBe(s.playerX);
  });
});

// ── tick — horizontal movement ────────────────────────────────────────────────

describe('platformSlice — tick horizontal movement', () => {
  it('accelerates right when right key held', () => {
    const s = running();
    const next = platformReducer(
      s,
      tick({ left: false, right: true, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.playerVX).toBeGreaterThan(0);
    expect(next.playerFacing).toBe('right');
  });

  it('accelerates left when left key held', () => {
    const s = running();
    const next = platformReducer(
      s,
      tick({ left: true, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.playerVX).toBeLessThan(0);
    expect(next.playerFacing).toBe('left');
  });

  it('decelerates when no key held', () => {
    let s: PlatformerState = { ...running(), playerVX: 4 };
    s = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(Math.abs(s.playerVX)).toBeLessThan(4);
  });

  it('caps walk speed', () => {
    let s: PlatformerState = { ...running(), playerVX: 10 };
    s = platformReducer(
      s,
      tick({ left: false, right: true, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(s.playerVX).toBeLessThanOrEqual(WALK_SPEED);
  });

  it('allows higher speed when running (Shift)', () => {
    let s: PlatformerState = { ...running(), playerVX: WALK_SPEED };
    for (let i = 0; i < 10; i++) {
      s = platformReducer(
        s,
        tick({ left: false, right: true, jumpHeld: false, jumpJustPressed: false, run: true }),
      );
    }
    expect(s.playerVX).toBeGreaterThan(WALK_SPEED);
  });

  it('does not move left beyond x=0', () => {
    let s: PlatformerState = { ...running(), playerX: 0, playerVX: -10 };
    s = platformReducer(
      s,
      tick({ left: true, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(s.playerX).toBeGreaterThanOrEqual(0);
  });
});

// ── tick — jump ───────────────────────────────────────────────────────────────

describe('platformSlice — tick jump', () => {
  it('applies JUMP_FORCE when jumping from ground', () => {
    const s: PlatformerState = { ...running(), isOnGround: true };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: true, jumpJustPressed: true, run: false }),
    );
    expect(next.playerVY).toBeLessThan(0); // negative = upward
  });

  it('does not jump when already in air', () => {
    const s: PlatformerState = { ...running(), isOnGround: false, playerVY: -5 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: true, jumpJustPressed: true, run: false }),
    );
    // VY changes due to gravity + hold bonus, but not reset to JUMP_FORCE
    expect(next.playerVY).toBeGreaterThan(JUMP_FORCE);
  });

  it('increments jumpHeldFrames while holding jump', () => {
    const s: PlatformerState = { ...running(), isOnGround: true };
    const after1 = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: true, jumpJustPressed: true, run: false }),
    );
    expect(after1.jumpHeldFrames).toBeGreaterThan(0);
  });

  it('resets jumpHeldFrames when jump released', () => {
    let s: PlatformerState = { ...running(), isOnGround: true, jumpHeldFrames: 5 };
    s = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(s.jumpHeldFrames).toBe(0);
  });
});

// ── tick — gravity ────────────────────────────────────────────────────────────

describe('platformSlice — tick gravity', () => {
  it('applies gravity each tick', () => {
    const s: PlatformerState = { ...running(), isOnGround: false, playerVY: 0, playerY: 100 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.playerVY).toBeCloseTo(GRAVITY);
  });
});

// ── tick — invincibility ──────────────────────────────────────────────────────

describe('platformSlice — tick invincibility countdown', () => {
  it('counts down invincibleFrames each tick', () => {
    const s: PlatformerState = { ...running(), invincibleFrames: 50 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.invincibleFrames).toBe(49);
  });

  it('does not go below 0', () => {
    const s: PlatformerState = { ...running(), invincibleFrames: 0 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.invincibleFrames).toBe(0);
  });
});

// ── tick — powered countdown ──────────────────────────────────────────────────

describe('platformSlice — tick powered countdown', () => {
  it('counts down poweredFrames each tick', () => {
    const s: PlatformerState = { ...running(), isPowered: true, poweredFrames: 100 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.poweredFrames).toBe(99);
    expect(next.isPowered).toBe(true);
  });

  it('clears isPowered when poweredFrames reaches 0', () => {
    const s: PlatformerState = { ...running(), isPowered: true, poweredFrames: 1 };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.isPowered).toBe(false);
    expect(next.poweredFrames).toBe(0);
  });
});

// ── tick — coin collection ────────────────────────────────────────────────────

describe('platformSlice — tick coin collection', () => {
  it('collects a coin when player centre overlaps it', () => {
    const playerX = 200;
    const playerY = GROUND_Y - PLAYER_H;
    const coinX = playerX + PLAYER_W / 2; // exact player centre X
    const coinYFromGround = 26; // coin centre at groundY - 26 ≈ player centre Y
    const s: PlatformerState = {
      ...running(),
      playerX,
      playerY,
      coins: [{ x: coinX, yFromGround: coinYFromGround, collected: false }],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.coins[0].collected).toBe(true);
    expect(next.score).toBeGreaterThan(s.score);
    expect(next.totalCoins).toBe(1);
  });

  it('does not collect already-collected coins', () => {
    const s: PlatformerState = {
      ...running(),
      score: 50,
      coins: [{ x: running().playerX + PLAYER_W / 2, yFromGround: 26, collected: true }],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.score).toBe(s.score); // no extra points
  });
});

// ── tick — box collision ──────────────────────────────────────────────────────

describe('platformSlice — tick box power-up', () => {
  it('activates power-up when player head hits box bottom', () => {
    // Player needs to be below the box, moving upward (VY < 0)
    // Box bottom at: groundY - yFromGround
    // Player Y needs to be at: ≈ box bottom level, VY < 0
    const boxYFromGround = 120; // box bottom 120px above ground = groundY - 120
    const boxBottomY = GROUND_Y - boxYFromGround; // = 316
    const playerY = boxBottomY - 2; // player head just below box bottom, VY < 0
    const boxX = 200;

    const s: PlatformerState = {
      ...running(),
      playerX: boxX - 4, // overlapping X
      playerY,
      playerVY: -5, // moving upward
      isPowered: false,
      poweredFrames: 0,
      boxes: [
        {
          id: 0,
          x: boxX,
          yFromGround: boxYFromGround,
          hit: false,
          hitFrames: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({
        left: false,
        right: false,
        jumpHeld: false,
        jumpJustPressed: false,
        run: false,
      }),
    );
    expect(next.isPowered).toBe(true);
    expect(next.poweredFrames).toBe(POWERED_DURATION - 1); // countdown runs in same tick after set
    expect(next.boxes[0].hit).toBe(true);
    expect(next.score).toBeGreaterThan(s.score);
  });

  it('does not re-trigger an already-hit box', () => {
    const boxX = 200;
    const s: PlatformerState = {
      ...running(),
      playerX: boxX - 4,
      playerVY: -5,
      boxes: [{ id: 0, x: boxX, yFromGround: 120, hit: true, hitFrames: 10 }],
    };
    const next = platformReducer(
      s,
      tick({
        left: false,
        right: false,
        jumpHeld: false,
        jumpJustPressed: false,
        run: false,
      }),
    );
    expect(next.boxes[0].hit).toBe(true);
    // hitFrames counts down
    expect(next.boxes[0].hitFrames).toBe(9);
  });
});

// ── tick — enemy patrol AI ────────────────────────────────────────────────────

describe('platformSlice — tick enemy patrol', () => {
  it('moves enemy by its vx each tick', () => {
    const enemyX = 300;
    const s: PlatformerState = {
      ...running(),
      enemies: [
        {
          id: 0,
          x: enemyX,
          vx: 2,
          patrolLeft: 200,
          patrolRight: 400,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].x).toBe(enemyX + 2);
  });

  it('reverses at patrolRight boundary', () => {
    const s: PlatformerState = {
      ...running(),
      enemies: [
        {
          id: 0,
          x: 395,
          vx: 10,
          patrolLeft: 200,
          patrolRight: 400,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].vx).toBeLessThan(0);
  });

  it('reverses at patrolLeft boundary', () => {
    const s: PlatformerState = {
      ...running(),
      enemies: [
        {
          id: 0,
          x: 205,
          vx: -10,
          patrolLeft: 200,
          patrolRight: 400,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].vx).toBeGreaterThan(0);
  });

  it('dead enemies count down stunnedFrames', () => {
    const s: PlatformerState = {
      ...running(),
      enemies: [
        {
          id: 0,
          x: 300,
          vx: 2,
          patrolLeft: 200,
          patrolRight: 400,
          alive: false,
          stunnedFrames: 10,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].stunnedFrames).toBe(9);
  });
});

// ── tick — enemy stomp ────────────────────────────────────────────────────────

describe('platformSlice — tick enemy stomp', () => {
  it('kills enemy when player stomps from above', () => {
    const enemyY = GROUND_Y - ENEMY_H; // enemy sits on ground
    const s: PlatformerState = {
      ...running(),
      playerX: 200,
      playerY: enemyY - PLAYER_H + 2, // player just above enemy top
      playerVY: 5, // falling down
      invincibleFrames: 0,
      enemies: [
        {
          id: 0,
          x: 200,
          vx: 1,
          patrolLeft: 100,
          patrolRight: 350,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].alive).toBe(false);
    expect(next.score).toBeGreaterThan(s.score);
  });

  it('powered player kills enemy from side', () => {
    const s: PlatformerState = {
      ...running(),
      playerX: 195,
      playerY: GROUND_Y - PLAYER_H,
      playerVY: 0,
      isPowered: true,
      poweredFrames: 100,
      invincibleFrames: 0,
      enemies: [
        {
          id: 0,
          x: 210,
          vx: 1,
          patrolLeft: 100,
          patrolRight: 350,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.enemies[0].alive).toBe(false);
    expect(next.score).toBeGreaterThan(s.score);
  });

  it('player loses a life when hitting enemy while not invincible', () => {
    const s: PlatformerState = {
      ...running(),
      playerX: 200,
      playerY: GROUND_Y - PLAYER_H,
      playerVY: 0,
      isPowered: false,
      invincibleFrames: 0,
      enemies: [
        {
          id: 0,
          x: 200,
          vx: 1,
          patrolLeft: 100,
          patrolRight: 350,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.lives).toBe(s.lives - 1);
    expect(next.invincibleFrames).toBe(INVINCIBLE_FRAMES);
  });

  it('becomes dead when last life is lost', () => {
    const s: PlatformerState = {
      ...running(),
      lives: 1,
      playerX: 200,
      playerY: GROUND_Y - PLAYER_H,
      playerVY: 0,
      isPowered: false,
      invincibleFrames: 0,
      enemies: [
        {
          id: 0,
          x: 200,
          vx: 1,
          patrolLeft: 100,
          patrolRight: 350,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.status).toBe('dead');
  });

  it('invincibility prevents damage', () => {
    const s: PlatformerState = {
      ...running(),
      playerX: 200,
      playerY: GROUND_Y - PLAYER_H,
      playerVY: 0,
      isPowered: false,
      invincibleFrames: 60, // still invincible
      enemies: [
        {
          id: 0,
          x: 200,
          vx: 1,
          patrolLeft: 100,
          patrolRight: 350,
          alive: true,
          stunnedFrames: 0,
          yFromGround: 0,
        },
      ],
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.lives).toBe(s.lives); // no damage
  });
});

// ── tick — flag / level complete ──────────────────────────────────────────────

describe('platformSlice — tick flag', () => {
  it('triggers level-complete when player reaches flag', () => {
    const flagX = 500;
    const s: PlatformerState = {
      ...running(),
      playerX: flagX - PLAYER_W + 1, // overlapping flag
      flagX,
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.status).toBe('level-complete');
    expect(next.score).toBeGreaterThan(s.score); // 500 bonus
  });

  it('triggers game-complete on last level', () => {
    const flagX = 500;
    const s: PlatformerState = {
      ...running(),
      playerX: flagX - PLAYER_W + 1,
      flagX,
      worldIndex: 3, // last world
      levelIndex: 3, // last level
    };
    const next = platformReducer(
      s,
      tick({ left: false, right: false, jumpHeld: false, jumpJustPressed: false, run: false }),
    );
    expect(next.status).toBe('game-complete');
  });
});
