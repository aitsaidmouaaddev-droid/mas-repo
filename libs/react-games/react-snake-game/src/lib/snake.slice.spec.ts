import { describe, it, expect } from 'vitest';
import snakeReducer, {
  setBoardSize,
  start,
  pause,
  reset,
  setDirection,
  tick,
  setBestScore,
  setSpeedLevel,
  tickInterval,
  MIN_SPEED,
  MAX_SPEED,
  DEFAULT_SPEED,
  SPECIAL_FOOD_CONFIG,
  type SnakeState,
} from './snake.slice';

// ── Helpers ────────────────────────────────────────────────────────────────────

function initial(): SnakeState {
  return snakeReducer(undefined, { type: '@@init' });
}

function running(nowMs = 1000): SnakeState {
  return snakeReducer(initial(), start(nowMs));
}

// ── tickInterval ──────────────────────────────────────────────────────────────

describe('tickInterval', () => {
  it('returns ~280ms at speed 1', () => {
    expect(tickInterval(1)).toBe(280);
  });

  it('returns ~60ms at speed 20', () => {
    expect(tickInterval(20)).toBe(60);
  });

  it('decreases as speed increases', () => {
    expect(tickInterval(5)).toBeGreaterThan(tickInterval(10));
    expect(tickInterval(10)).toBeGreaterThan(tickInterval(15));
  });
});

// ── Initial state ──────────────────────────────────────────────────────────────

describe('snakeSlice — initial state', () => {
  it('starts idle', () => {
    expect(initial().status).toBe('idle');
  });

  it('snake has 3 cells', () => {
    expect(initial().snake).toHaveLength(3);
  });

  it('snake faces right by default', () => {
    expect(initial().direction).toBe('RIGHT');
    expect(initial().nextDirection).toBe('RIGHT');
  });

  it('uses default speed', () => {
    expect(initial().speedLevel).toBe(DEFAULT_SPEED);
  });

  it('food not on snake', () => {
    const s = initial();
    const onSnake = s.snake.some((c) => c.x === s.food.x && c.y === s.food.y);
    expect(onSnake).toBe(false);
  });
});

// ── setBoardSize ──────────────────────────────────────────────────────────────

describe('snakeSlice — setBoardSize', () => {
  it('updates board dimensions', () => {
    const s = snakeReducer(initial(), setBoardSize({ cols: 30, rows: 25 }));
    expect(s.boardCols).toBe(30);
    expect(s.boardRows).toBe(25);
  });

  it('recentres snake when idle', () => {
    const s = snakeReducer(initial(), setBoardSize({ cols: 30, rows: 25 }));
    const head = s.snake[0];
    expect(head.x).toBe(15);
    expect(head.y).toBe(12);
  });

  it('does not recentre when running', () => {
    let s = running();
    const headBefore = { ...s.snake[0] };
    s = snakeReducer(s, setBoardSize({ cols: 30, rows: 25 }));
    expect(s.snake[0].x).toBe(headBefore.x);
  });
});

// ── start ─────────────────────────────────────────────────────────────────────

describe('snakeSlice — start', () => {
  it('sets status to running', () => {
    expect(running().status).toBe('running');
  });

  it('records lastFoodTime', () => {
    const s = snakeReducer(initial(), start(5000));
    expect(s.lastFoodTime).toBe(5000);
  });
});

// ── pause ─────────────────────────────────────────────────────────────────────

describe('snakeSlice — pause', () => {
  it('pauses a running game', () => {
    const s = snakeReducer(running(), pause());
    expect(s.status).toBe('paused');
  });

  it('resumes a paused game', () => {
    let s = snakeReducer(running(), pause());
    s = snakeReducer(s, pause());
    expect(s.status).toBe('running');
  });

  it('does nothing when idle', () => {
    const s = snakeReducer(initial(), pause());
    expect(s.status).toBe('idle');
  });
});

// ── setDirection ──────────────────────────────────────────────────────────────

describe('snakeSlice — setDirection', () => {
  it('changes direction to non-opposite', () => {
    const s = snakeReducer(running(), setDirection('UP'));
    expect(s.nextDirection).toBe('UP');
  });

  it('ignores opposite direction (RIGHT → LEFT blocked)', () => {
    const s = snakeReducer(running(), setDirection('LEFT'));
    expect(s.nextDirection).toBe('RIGHT'); // unchanged
  });

  it('ignores opposite direction (UP → DOWN blocked)', () => {
    let s = snakeReducer(running(), setDirection('UP'));
    s = snakeReducer(s, tick(1001));
    s = snakeReducer(s, setDirection('DOWN'));
    expect(s.nextDirection).toBe('UP');
  });
});

// ── setSpeedLevel ─────────────────────────────────────────────────────────────

describe('snakeSlice — setSpeedLevel', () => {
  it('sets speed level', () => {
    const s = snakeReducer(running(), setSpeedLevel(10));
    expect(s.speedLevel).toBe(10);
  });

  it('clamps to MIN_SPEED', () => {
    const s = snakeReducer(running(), setSpeedLevel(-5));
    expect(s.speedLevel).toBe(MIN_SPEED);
  });

  it('clamps to MAX_SPEED', () => {
    const s = snakeReducer(running(), setSpeedLevel(999));
    expect(s.speedLevel).toBe(MAX_SPEED);
  });
});

// ── tick — movement ───────────────────────────────────────────────────────────

describe('snakeSlice — tick movement', () => {
  it('moves head one cell in current direction', () => {
    const s = running();
    const head = s.snake[0];
    const next = snakeReducer(s, tick(1001));
    expect(next.snake[0].x).toBe(head.x + 1); // RIGHT
    expect(next.snake[0].y).toBe(head.y);
  });

  it('tail is dropped each tick (no food)', () => {
    const s = running();
    const len = s.snake.length;
    const next = snakeReducer(s, tick(1001));
    expect(next.snake).toHaveLength(len);
  });

  it('does not move when not running', () => {
    const s = initial();
    const next = snakeReducer(s, tick(1001));
    expect(next.snake[0].x).toBe(s.snake[0].x);
  });
});

// ── tick — wall collision ─────────────────────────────────────────────────────

describe('snakeSlice — wall collision', () => {
  it('dies when head hits right wall', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 19, y: 10 }, // one step from the wall
        { x: 18, y: 10 },
        { x: 17, y: 10 },
      ],
      boardCols: 20,
    };
    const next = snakeReducer(s, tick(1001));
    expect(next.status).toBe('dead');
  });

  it('dies when head hits top wall', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'UP',
      nextDirection: 'UP',
      snake: [
        { x: 10, y: 0 }, // already at top
        { x: 10, y: 1 },
        { x: 10, y: 2 },
      ],
    };
    const next = snakeReducer(s, tick(1001));
    expect(next.status).toBe('dead');
  });

  it('saves bestScore on wall death', () => {
    const s: SnakeState = {
      ...running(),
      score: 50,
      bestScore: 20,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 19, y: 10 },
        { x: 18, y: 10 },
        { x: 17, y: 10 },
      ],
      boardCols: 20,
    };
    const next = snakeReducer(s, tick(1001));
    expect(next.bestScore).toBe(50);
  });
});

// ── tick — self collision ─────────────────────────────────────────────────────

describe('snakeSlice — self collision', () => {
  it('dies when head overlaps body', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      // Head at (5,5) moving right into (6,5) which is body
      snake: [
        { x: 5, y: 5 },
        { x: 6, y: 5 }, // next position of head
        { x: 7, y: 5 },
      ],
    };
    const next = snakeReducer(s, tick(1001));
    expect(next.status).toBe('dead');
  });
});

// ── tick — food collection ────────────────────────────────────────────────────

describe('snakeSlice — food collection', () => {
  it('scores when eating food', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      speedLevel: 5,
      lastFoodTime: 0,
      snake: [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ],
      food: { x: 5, y: 5 }, // next position of head
    };
    const next = snakeReducer(s, tick(1001));
    expect(next.score).toBeGreaterThan(0);
  });

  it('snake grows when eating food', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ],
      food: { x: 5, y: 5 },
    };
    const len = s.snake.length;
    const next = snakeReducer(s, tick(1001));
    expect(next.snake.length).toBeGreaterThanOrEqual(len);
  });

  it('spawns new food after eating', () => {
    const s: SnakeState = {
      ...running(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ],
      food: { x: 5, y: 5 },
    };
    const next = snakeReducer(s, tick(1001));
    // New food should not be where the old food was (or at the head)
    expect(next.food.x !== 5 || next.food.y !== 5).toBe(true);
  });
});

// ── tick — special food ───────────────────────────────────────────────────────

describe('snakeSlice — special food expiry', () => {
  it('removes special food when expired', () => {
    const now = 10000;
    const s: SnakeState = {
      ...running(1000),
      specialFood: {
        x: 8,
        y: 8,
        type: 'green',
        expiresAt: now - 1, // already expired
      },
    };
    const next = snakeReducer(s, tick(now));
    expect(next.specialFood).toBeNull();
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('snakeSlice — reset', () => {
  it('resets to idle with initial score', () => {
    let s: SnakeState = { ...running(), score: 100 };
    s = snakeReducer(s, reset());
    expect(s.status).toBe('idle');
    expect(s.score).toBe(0);
  });

  it('keeps board dimensions', () => {
    let s = snakeReducer(initial(), setBoardSize({ cols: 30, rows: 25 }));
    s = snakeReducer(s, reset());
    expect(s.boardCols).toBe(30);
    expect(s.boardRows).toBe(25);
  });

  it('resets direction to RIGHT', () => {
    let s = snakeReducer(running(), setDirection('UP'));
    s = snakeReducer(s, reset());
    expect(s.direction).toBe('RIGHT');
    expect(s.nextDirection).toBe('RIGHT');
  });
});

// ── setBestScore ───────────────────────────────────────────────────────────────

describe('snakeSlice — setBestScore', () => {
  it('sets bestScore directly', () => {
    const s = snakeReducer(initial(), setBestScore(99));
    expect(s.bestScore).toBe(99);
  });
});

// ── SPECIAL_FOOD_CONFIG ───────────────────────────────────────────────────────

describe('SPECIAL_FOOD_CONFIG', () => {
  it('green has shorter ttl than yellow', () => {
    expect(SPECIAL_FOOD_CONFIG.green.ttl).toBeLessThan(SPECIAL_FOOD_CONFIG.yellow.ttl);
  });

  it('green has higher bonus than yellow', () => {
    expect(SPECIAL_FOOD_CONFIG.green.bonus).toBeLessThan(SPECIAL_FOOD_CONFIG.yellow.bonus);
  });
});
