import { describe, it, expect, beforeEach } from 'vitest';
import flappyReducer, {
  setSize,
  flap,
  reset,
  setBestScore,
  tick,
  GRAVITY,
  FLAP_FORCE,
  PIPE_SPEED,
  PIPE_WIDTH,
  BIRD_X,
  BIRD_RADIUS,
  GROUND_HEIGHT,
  type FlappyState,
} from './flappy.slice';

// ── Helpers ────────────────────────────────────────────────────────────────────

function initial(): FlappyState {
  return flappyReducer(undefined, { type: '@@init' });
}

function runningState(): FlappyState {
  // flap once → transitions from idle to running
  return flappyReducer(initial(), flap());
}

// ── Initial state ──────────────────────────────────────────────────────────────

describe('flappySlice — initial state', () => {
  it('starts idle', () => {
    expect(initial().status).toBe('idle');
  });

  it('bird starts at vertical centre', () => {
    const s = initial();
    expect(s.birdY).toBe(s.height / 2);
  });

  it('has default dimensions', () => {
    const s = initial();
    expect(s.width).toBe(400);
    expect(s.height).toBe(600);
  });

  it('has empty pipes and zero score', () => {
    const s = initial();
    expect(s.pipes).toHaveLength(0);
    expect(s.score).toBe(0);
    expect(s.bestScore).toBe(0);
  });
});

// ── setSize ───────────────────────────────────────────────────────────────────

describe('flappySlice — setSize', () => {
  it('updates width and height', () => {
    const s = flappyReducer(initial(), setSize({ width: 800, height: 500 }));
    expect(s.width).toBe(800);
    expect(s.height).toBe(500);
  });

  it('re-centres bird when idle', () => {
    const s = flappyReducer(initial(), setSize({ width: 800, height: 500 }));
    expect(s.birdY).toBe(250);
  });

  it('does NOT re-centre bird when running', () => {
    let s = runningState();
    const origY = s.birdY;
    s = flappyReducer(s, setSize({ width: 800, height: 500 }));
    expect(s.birdY).toBe(origY);
  });
});

// ── flap ──────────────────────────────────────────────────────────────────────

describe('flappySlice — flap', () => {
  it('transitions idle → running on first flap', () => {
    expect(runningState().status).toBe('running');
  });

  it('applies FLAP_FORCE to birdVY', () => {
    expect(runningState().birdVY).toBe(FLAP_FORCE);
  });

  it('does nothing when dead', () => {
    let s: FlappyState = { ...initial(), status: 'dead', birdVY: 0 };
    s = flappyReducer(s, flap());
    expect(s.birdVY).toBe(0);
    expect(s.status).toBe('dead');
  });
});

// ── tick — physics ────────────────────────────────────────────────────────────

describe('flappySlice — tick physics', () => {
  let s: FlappyState;
  beforeEach(() => {
    s = runningState();
  });

  it('applies gravity each tick', () => {
    const before = s.birdVY;
    s = flappyReducer(s, tick());
    expect(s.birdVY).toBeCloseTo(before + GRAVITY);
  });

  it('moves bird by birdVY each tick', () => {
    const before = s.birdY;
    const vy = s.birdVY;
    s = flappyReducer(s, tick());
    expect(s.birdY).toBeCloseTo(before + vy + GRAVITY);
  });

  it('caps velocity at terminal velocity (12)', () => {
    s = { ...s, birdVY: 100 };
    s = flappyReducer(s, tick());
    expect(s.birdVY).toBeLessThanOrEqual(12 + GRAVITY);
  });

  it('does nothing when not running', () => {
    const idle = initial();
    const after = flappyReducer(idle, tick());
    expect(after.birdY).toBe(idle.birdY);
    expect(after.frameCount).toBe(0);
  });
});

// ── tick — ground/ceiling collision ──────────────────────────────────────────

describe('flappySlice — collision with ground / ceiling', () => {
  it('dies when bird hits ground', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: 600 - GROUND_HEIGHT - BIRD_RADIUS - 1, // one tick above ground
      birdVY: 5,
    };
    const next = flappyReducer(s, tick());
    expect(next.status).toBe('dead');
  });

  it('dies when bird hits ceiling', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: BIRD_RADIUS + 1,
      birdVY: -5,
    };
    const next = flappyReducer(s, tick());
    expect(next.status).toBe('dead');
  });

  it('saves best score on death', () => {
    const s: FlappyState = {
      ...runningState(),
      score: 7,
      bestScore: 3,
      birdY: 600 - GROUND_HEIGHT - BIRD_RADIUS - 1,
      birdVY: 5,
    };
    const next = flappyReducer(s, tick());
    expect(next.status).toBe('dead');
    expect(next.bestScore).toBe(7);
  });
});

// ── tick — pipe scoring ───────────────────────────────────────────────────────

describe('flappySlice — pipe scoring', () => {
  it('increments score when bird passes a pipe', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: 300,
      pipes: [
        {
          x: BIRD_X - BIRD_RADIUS - PIPE_WIDTH - 1, // pipe just left of bird
          gapY: 300,
          scored: false,
        },
      ],
    };
    const next = flappyReducer(s, tick());
    expect(next.score).toBe(1);
    expect(next.pipes[0].scored).toBe(true);
  });

  it('does not double-count an already-scored pipe', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: 300,
      score: 5,
      pipes: [
        {
          x: BIRD_X - BIRD_RADIUS - PIPE_WIDTH - 1,
          gapY: 300,
          scored: true, // already counted
        },
      ],
    };
    const next = flappyReducer(s, tick());
    expect(next.score).toBe(5);
  });
});

// ── tick — pipe collision ─────────────────────────────────────────────────────

describe('flappySlice — pipe collision', () => {
  it('dies when hitting a pipe vertically', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: 100, // far from gap
      pipes: [
        {
          x: BIRD_X - BIRD_RADIUS + 2, // overlapping bird X
          gapY: 400, // gap far below → bird hits top pipe
          scored: false,
        },
      ],
    };
    const next = flappyReducer(s, tick());
    expect(next.status).toBe('dead');
  });

  it('survives when flying through gap', () => {
    const gapY = 300;
    const s: FlappyState = {
      ...runningState(),
      birdY: gapY, // dead centre of gap
      birdVY: 0,
      pipes: [
        {
          x: BIRD_X - BIRD_RADIUS + 2, // overlapping bird X
          gapY,
          scored: false,
        },
      ],
    };
    const next = flappyReducer(s, tick());
    expect(next.status).toBe('running');
  });
});

// ── tick — pipe management ────────────────────────────────────────────────────

describe('flappySlice — pipe management', () => {
  it('spawns a pipe when none exist', () => {
    const s = runningState();
    const next = flappyReducer(s, tick());
    expect(next.pipes.length).toBeGreaterThanOrEqual(1);
  });

  it('moves pipes left by PIPE_SPEED each tick', () => {
    const pipeX = 300;
    const s: FlappyState = {
      ...runningState(),
      birdY: 300,
      pipes: [{ x: pipeX, gapY: 300, scored: false }],
    };
    const next = flappyReducer(s, tick());
    const movedPipe = next.pipes.find((p) => !p.scored);
    if (movedPipe) {
      expect(movedPipe.x).toBeCloseTo(pipeX - PIPE_SPEED);
    }
  });

  it('removes pipes that go off screen', () => {
    const s: FlappyState = {
      ...runningState(),
      birdY: 300,
      pipes: [{ x: -PIPE_WIDTH - 20, gapY: 300, scored: true }],
    };
    const next = flappyReducer(s, tick());
    const offScreenPipes = next.pipes.filter((p) => p.x < -PIPE_WIDTH);
    expect(offScreenPipes).toHaveLength(0);
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('flappySlice — reset', () => {
  it('resets to idle with empty pipes', () => {
    let s = runningState();
    s = { ...s, score: 10, pipes: [{ x: 100, gapY: 200, scored: false }] };
    s = flappyReducer(s, reset());
    expect(s.status).toBe('idle');
    expect(s.pipes).toHaveLength(0);
    expect(s.score).toBe(0);
  });

  it('preserves bestScore across reset', () => {
    let s: FlappyState = { ...runningState(), bestScore: 15 };
    s = flappyReducer(s, reset());
    expect(s.bestScore).toBe(15);
  });

  it('preserves dimensions across reset', () => {
    let s = flappyReducer(initial(), setSize({ width: 800, height: 500 }));
    s = flappyReducer(s, reset());
    expect(s.width).toBe(800);
    expect(s.height).toBe(500);
  });
});

// ── setBestScore ───────────────────────────────────────────────────────────────

describe('flappySlice — setBestScore', () => {
  it('sets bestScore directly', () => {
    const s = flappyReducer(initial(), setBestScore(42));
    expect(s.bestScore).toBe(42);
  });
});
