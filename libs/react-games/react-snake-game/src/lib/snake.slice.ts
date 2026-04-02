import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const CELL_SIZE = 20; // fixed px — never changes
export const MIN_SPEED = 1;
export const MAX_SPEED = 20;
export const DEFAULT_SPEED = 5;

/** ms per tick for a given speed level (280ms at 1, 60ms at 20) */
export function tickInterval(level: number): number {
  return Math.round(280 - (level - 1) * ((280 - 60) / (MAX_SPEED - 1)));
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'running' | 'paused' | 'dead';
export type Cell = { x: number; y: number };
export type SpecialFoodType = 'green' | 'yellow';
export interface SpecialFood extends Cell {
  type: SpecialFoodType;
  expiresAt: number; // ms timestamp
}

// Green: disappears in 5s, +150 pts, +10 length. Yellow: disappears in 10s, +300 pts, +5 length.
// Green appears 2x less often than yellow (1/3 vs 2/3).
export const SPECIAL_FOOD_CONFIG: Record<
  SpecialFoodType,
  { ttl: number; bonus: number; growth: number }
> = {
  green: { ttl: 5000, bonus: 150, growth: 10 },
  yellow: { ttl: 10000, bonus: 300, growth: 5 },
};

// ~1.5% chance per tick to spawn a special food (if none active)
const SPECIAL_SPAWN_CHANCE = 0.015;

function randomFood(snake: Cell[], cols: number, rows: number, extras: Cell[] = []): Cell {
  let food: Cell;
  do {
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (
    snake.some((c) => c.x === food.x && c.y === food.y) ||
    extras.some((c) => c.x === food.x && c.y === food.y)
  );
  return food;
}

function centerSnake(cols: number, rows: number): Cell[] {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 20;

const defaultSnake = centerSnake(DEFAULT_COLS, DEFAULT_ROWS);

export interface SnakeState {
  boardCols: number;
  boardRows: number;
  snake: Cell[];
  food: Cell;
  specialFood: SpecialFood | null;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  bestScore: number;
  status: GameStatus;
  speedLevel: number;
  lastFoodTime: number;
  pendingGrowth: number; // extra cells to add over next ticks
}

const initialState: SnakeState = {
  boardCols: DEFAULT_COLS,
  boardRows: DEFAULT_ROWS,
  snake: defaultSnake,
  food: randomFood(defaultSnake, DEFAULT_COLS, DEFAULT_ROWS),
  specialFood: null,
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  bestScore: 0,
  status: 'idle',
  speedLevel: DEFAULT_SPEED,
  lastFoodTime: 0,
  pendingGrowth: 0,
};

export const snakeSlice = createSlice({
  name: 'snake',
  initialState,
  reducers: {
    setBoardSize(state, action: PayloadAction<{ cols: number; rows: number }>) {
      const { cols, rows } = action.payload;
      state.boardCols = cols;
      state.boardRows = rows;
      // Recentre snake whenever board resizes (only when idle)
      if (state.status === 'idle') {
        const snake = centerSnake(cols, rows);
        state.snake = snake;
        state.food = randomFood(snake, cols, rows);
        state.specialFood = null;
      }
    },
    start(state, action: PayloadAction<number>) {
      state.status = 'running';
      state.lastFoodTime = action.payload;
    },
    pause(state) {
      if (state.status === 'running') state.status = 'paused';
      else if (state.status === 'paused') state.status = 'running';
    },
    reset(state) {
      const snake = centerSnake(state.boardCols, state.boardRows);
      state.snake = snake;
      state.food = randomFood(snake, state.boardCols, state.boardRows);
      state.specialFood = null;
      state.direction = 'RIGHT';
      state.nextDirection = 'RIGHT';
      state.score = 0;
      state.status = 'idle';
      state.lastFoodTime = 0;
      state.pendingGrowth = 0;
    },
    setSpeedLevel(state, action: PayloadAction<number>) {
      state.speedLevel = Math.max(MIN_SPEED, Math.min(MAX_SPEED, action.payload));
    },
    setDirection(state, action: PayloadAction<Direction>) {
      const { direction } = state;
      const next = action.payload;
      const opposite: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };
      if (next !== opposite[direction]) {
        state.nextDirection = next;
      }
    },
    tick(state, action: PayloadAction<number>) {
      if (state.status !== 'running') return;
      const now = action.payload;

      // Expire special food
      if (state.specialFood && now >= state.specialFood.expiresAt) {
        state.specialFood = null;
      }

      // Maybe spawn special food (green 1/3, yellow 2/3)
      if (!state.specialFood && Math.random() < SPECIAL_SPAWN_CHANCE) {
        const type: SpecialFoodType = Math.random() < 0.333 ? 'green' : 'yellow';
        const cell = randomFood(state.snake, state.boardCols, state.boardRows, [state.food]);
        state.specialFood = { ...cell, type, expiresAt: now + SPECIAL_FOOD_CONFIG[type].ttl };
      }

      state.direction = state.nextDirection;
      const head = state.snake[0];
      const deltas: Record<Direction, Cell> = {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 },
      };
      const delta = deltas[state.direction];
      const newHead: Cell = { x: head.x + delta.x, y: head.y + delta.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= state.boardCols ||
        newHead.y < 0 ||
        newHead.y >= state.boardRows
      ) {
        state.status = 'dead';
        if (state.score > state.bestScore) state.bestScore = state.score;
        return;
      }

      // Self collision
      if (state.snake.some((c) => c.x === newHead.x && c.y === newHead.y)) {
        state.status = 'dead';
        if (state.score > state.bestScore) state.bestScore = state.score;
        return;
      }

      const ate = newHead.x === state.food.x && newHead.y === state.food.y;
      const ateSpecial =
        state.specialFood && newHead.x === state.specialFood.x && newHead.y === state.specialFood.y;

      state.snake.unshift(newHead);

      if (ate) {
        const elapsed = state.lastFoodTime > 0 ? (now - state.lastFoodTime) / 1000 : 0;
        const timeBonus = Math.max(0, Math.round(300 - elapsed * 20));
        state.score += state.speedLevel * 10 + timeBonus;
        state.lastFoodTime = now;
        state.food = randomFood(
          state.snake,
          state.boardCols,
          state.boardRows,
          state.specialFood ? [state.specialFood] : [],
        );
        // regular food grows by 1 (tail not popped)
      } else if (ateSpecial && state.specialFood) {
        state.score += SPECIAL_FOOD_CONFIG[state.specialFood.type].bonus * state.speedLevel;
        state.pendingGrowth += SPECIAL_FOOD_CONFIG[state.specialFood.type].growth - 1;
        state.specialFood = null;
        // 1 cell already grown (unshift without pop), schedule rest via pendingGrowth
      } else if (state.pendingGrowth > 0) {
        // grow one extra cell this tick
        state.pendingGrowth -= 1;
      } else {
        state.snake.pop();
      }
    },
    setBestScore(state, action: PayloadAction<number>) {
      state.bestScore = action.payload;
    },
  },
});

export const {
  setBoardSize,
  setSpeedLevel,
  start,
  pause,
  reset,
  setDirection,
  tick,
  setBestScore,
} = snakeSlice.actions;
export default snakeSlice.reducer;
