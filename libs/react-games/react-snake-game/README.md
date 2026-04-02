# react-snake-game

> Classic Snake game with canvas 2D renderer, special foods, particle effects, and a 20-level speed system — built with React, Redux Toolkit, and the HTML5 Canvas API.

---

## Overview

`@mas-repo/react-snake-game` is a game library consumed by the `react-fundamentals` app. The snake grows by eating food, with speed levels controlling the tick interval and bonus points for fast eating.

**Features**:

- 20 speed levels (`MIN_SPEED = 1` to `MAX_SPEED = 20`), each with its own tick interval (280ms → 60ms)
- Two **special foods**: green (5s TTL, +150 pts × speed, +10 length) and yellow (10s TTL, +300 pts × speed, +5 length)
- Particle effects on food collection
- Day/night background cycle on the game board
- Web Audio API SFX (eat, special eat, game over)
- Redux Toolkit state — pure reducers, no side effects in the slice
- Score persistence via GraphQL `game_score`

---

## Mechanics

| Constant        | Value | Description                       |
| --------------- | ----- | --------------------------------- |
| `CELL_SIZE`     | 20    | Board cell size in pixels (fixed) |
| `DEFAULT_SPEED` | 5     | Starting speed level              |
| `MIN_SPEED`     | 1     | Slowest speed (280ms per tick)    |
| `MAX_SPEED`     | 20    | Fastest speed (60ms per tick)     |

### `tickInterval(level)`

```typescript
// 280ms at level 1, 60ms at level 20, linear interpolation
tickInterval(level: number): number
```

### Controls

| Key           | Action         |
| ------------- | -------------- |
| ↑ / W         | Move up        |
| ↓ / S         | Move down      |
| ← / A         | Move left      |
| → / D         | Move right     |
| Space / Enter | Start game     |
| P             | Pause / resume |

### Scoring

| Event              | Points                               |
| ------------------ | ------------------------------------ |
| Eat regular food   | `speedLevel × 10 + timeBonus`        |
| Time bonus         | `max(0, 300 - elapsed_seconds × 20)` |
| Eat green special  | `150 × speedLevel`                   |
| Eat yellow special | `300 × speedLevel`                   |

### Direction constraint

Opposite direction is blocked — pressing LEFT while moving RIGHT is a no-op, preventing immediate self-collision.

---

## Architecture

```
src/lib/
├── SnakeGame.tsx            # Main game component + layout
├── SnakeGameProvider.tsx    # Redux Provider
├── snake.slice.ts           # All state + tick logic
├── snake.descriptor.ts      # { uniqueName, hasScore, hasProgress }
├── sfx.ts                   # Web Audio procedural SFX
├── hooks/
│   ├── useSnakeGame.ts      # Keyboard + tick interval scheduler
│   ├── useSnakeGame.types.ts
│   └── useGameScore.ts      # Apollo mutation for score persistence
└── components/
    ├── SnakeBoard.tsx        # Board wrapper
    ├── SnakeBoardCanvas.tsx  # Canvas renderer — cells, food, particles, day/night
    ├── SnakeControls.tsx     # On-screen direction pad
    ├── SnakeHud.tsx          # Score / best / speed badge
    └── SpeedBar.tsx          # Speed level selector
```

### Redux slice (`snakeSlice`)

| Action                       | Effect                               |
| ---------------------------- | ------------------------------------ |
| `setBoardSize({cols, rows})` | Resize board; recentre snake if idle |
| `start(nowMs)`               | `idle → running`, set `lastFoodTime` |
| `pause()`                    | Toggle `running ↔ paused`           |
| `reset()`                    | Back to idle, preserves board size   |
| `setDirection(dir)`          | Queue direction (opposite blocked)   |
| `setSpeedLevel(n)`           | Clamp to `[MIN_SPEED, MAX_SPEED]`    |
| `setBestScore(n)`            | Persist loaded score from DB         |
| `tick(nowMs)`                | One game step                        |

### `tick` pipeline

1. Expire special food if `now >= expiresAt`
2. Maybe spawn special food (1.5% chance per tick; green = 1/3, yellow = 2/3)
3. Apply `nextDirection` to `direction`
4. Compute `newHead` from direction delta
5. Wall collision → `dead`, update `bestScore`
6. Self collision → `dead`, update `bestScore`
7. `unshift(newHead)` onto snake
8. Regular food eaten → score, new food, snake keeps tail (grows by 1)
9. Special food eaten → score × speed, `pendingGrowth += growth - 1`, clear special food
10. `pendingGrowth > 0` → skip tail pop (extra growth cell)
11. Otherwise → pop tail (no growth)

---

## API

```typescript
import { SnakeGameProvider, SnakeGame } from '@mas-repo/react-snake-game';
```

---

## Commands

```bash
npx nx run react-snake-game:build
npx nx run react-snake-game:test       # Vitest
npx nx run react-snake-game:typecheck
```
