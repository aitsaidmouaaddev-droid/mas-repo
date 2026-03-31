import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ── Constants ────────────────────────────────────────────────────────────────

export const GRAVITY = 0.5;
export const FLAP_FORCE = -9;
export const PIPE_SPEED = 3;
export const PIPE_GAP = 160; // vertical gap between top/bottom pipe
export const PIPE_WIDTH = 60;
export const PIPE_INTERVAL = 280; // px between pipe pairs
export const BIRD_X = 80; // fixed horizontal position of bird
export const BIRD_RADIUS = 16;
export const GROUND_HEIGHT = 60;

// ── Types ────────────────────────────────────────────────────────────────────

export type GameStatus = 'idle' | 'running' | 'dead';

export interface Pipe {
  x: number;
  gapY: number; // center Y of the gap
  scored: boolean;
}

export interface FlappyState {
  status: GameStatus;
  birdY: number;
  birdVY: number;
  pipes: Pipe[];
  score: number;
  bestScore: number;
  width: number;
  height: number;
  frameCount: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomGapY(height: number): number {
  const minY = PIPE_GAP / 2 + 40;
  const maxY = height - GROUND_HEIGHT - PIPE_GAP / 2 - 40;
  return Math.floor(Math.random() * (maxY - minY)) + minY;
}

function initialState(width = 400, height = 600): FlappyState {
  return {
    status: 'idle',
    birdY: height / 2,
    birdVY: 0,
    pipes: [],
    score: 0,
    bestScore: 0,
    width,
    height,
    frameCount: 0,
  };
}

// ── Slice ─────────────────────────────────────────────────────────────────────

export const flappySlice = createSlice({
  name: 'flappy',
  initialState: initialState(),
  reducers: {
    setSize(state, action: PayloadAction<{ width: number; height: number }>) {
      state.width = action.payload.width;
      state.height = action.payload.height;
      // Re-centre bird only when idle
      if (state.status === 'idle') {
        state.birdY = action.payload.height / 2;
      }
    },

    flap(state) {
      if (state.status === 'dead') return;
      if (state.status === 'idle') {
        state.status = 'running';
      }
      state.birdVY = FLAP_FORCE;
    },

    reset(state) {
      const next = initialState(state.width, state.height);
      next.bestScore = state.bestScore;
      return next;
    },

    setBestScore(state, action: PayloadAction<number>) {
      state.bestScore = action.payload;
    },

    tick(state) {
      if (state.status !== 'running') return;

      state.frameCount += 1;

      // ── Bird physics ──────────────────────────────────────────────────────
      state.birdVY += GRAVITY;
      state.birdVY = Math.min(state.birdVY, 12); // terminal velocity
      state.birdY += state.birdVY;

      // ── Ground / ceiling collision ────────────────────────────────────────
      const groundLine = state.height - GROUND_HEIGHT - BIRD_RADIUS;
      if (state.birdY >= groundLine || state.birdY - BIRD_RADIUS <= 0) {
        state.status = 'dead';
        if (state.score > state.bestScore) state.bestScore = state.score;
        return;
      }

      // ── Spawn new pipes ───────────────────────────────────────────────────
      const lastPipe = state.pipes[state.pipes.length - 1];
      const shouldSpawn = !lastPipe || lastPipe.x < state.width - PIPE_INTERVAL;
      if (shouldSpawn) {
        state.pipes.push({
          x: state.width + PIPE_WIDTH,
          gapY: randomGapY(state.height),
          scored: false,
        });
      }

      // ── Move & remove pipes ───────────────────────────────────────────────
      state.pipes = state.pipes
        .map((p) => ({ ...p, x: p.x - PIPE_SPEED }))
        .filter((p) => p.x + PIPE_WIDTH > -10);

      // ── Collision detection & scoring ─────────────────────────────────────
      for (const pipe of state.pipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const gapTop = pipe.gapY - PIPE_GAP / 2;
        const gapBottom = pipe.gapY + PIPE_GAP / 2;

        const birdRight = BIRD_X + BIRD_RADIUS;
        const birdLeft = BIRD_X - BIRD_RADIUS;
        const birdTop = state.birdY - BIRD_RADIUS;
        const birdBottom = state.birdY + BIRD_RADIUS;

        // AABB with slight forgiveness (shrink hitbox by 4px)
        const hitX = birdRight - 4 > pipeLeft && birdLeft + 4 < pipeRight;
        const hitY = birdTop + 4 < gapTop || birdBottom - 4 > gapBottom;

        if (hitX && hitY) {
          state.status = 'dead';
          if (state.score > state.bestScore) state.bestScore = state.score;
          return;
        }

        // Score: passed the pipe
        if (!pipe.scored && pipeRight < BIRD_X - BIRD_RADIUS) {
          pipe.scored = true;
          state.score += 1;
        }
      }
    },
  },
});

export const { setSize, flap, reset, setBestScore, tick } = flappySlice.actions;
export default flappySlice.reducer;
