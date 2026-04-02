# react-flappy-bird

> Classic Flappy Bird clone built with React, Redux Toolkit, and HTML5 Canvas — fully procedural Web Audio SFX.

---

## Overview

`@mas-repo/react-flappy-bird` is a game library consumed by the `react-fundamentals` app. The bird navigates through an endless series of pipe pairs using a single-button input (tap/click/Space).

**Features**:

- Smooth 60fps canvas rendering with a day/night sky cycle
- Procedural Web Audio SFX (flap whoosh, coin-style score, pipe thud, best score fanfare)
- Redux Toolkit state — all physics in a single `tick` action
- Score persistence via GraphQL `game_score`

---

## Mechanics

| Constant        | Value | Description                              |
| --------------- | ----- | ---------------------------------------- |
| `GRAVITY`       | 0.5   | Applied every tick                       |
| `FLAP_FORCE`    | -9    | Upward velocity impulse on flap          |
| `PIPE_SPEED`    | 3     | px/frame pipes move left                 |
| `PIPE_GAP`      | 160   | Vertical gap between top and bottom pipe |
| `PIPE_WIDTH`    | 60    | Pipe width in pixels                     |
| `BIRD_RADIUS`   | 16    | Bird collision radius                    |
| `GROUND_HEIGHT` | 60    | Ground strip height                      |

### Controls

| Input               | Action                            |
| ------------------- | --------------------------------- |
| Space / click / tap | Flap (first flap starts the game) |

### Game loop (`tick`)

1. Bird velocity increases by `GRAVITY` each tick (terminal velocity: 12)
2. Bird position updates by velocity
3. Ground/ceiling collision → `status = 'dead'`
4. Pipes spawn at the right edge when there's room, move left by `PIPE_SPEED`
5. Pipes outside the left edge are removed
6. Pipe hit-box check (4 px forgiveness) → `status = 'dead'`
7. Score: +1 when the pipe's right edge passes the bird's left edge

---

## Architecture

```
src/lib/
├── FlappyGame.tsx            # Main game component + layout
├── FlappyGameProvider.tsx    # Redux Provider
├── flappy.slice.ts           # All state + physics (tick reducer)
├── flappy.descriptor.ts      # { uniqueName, hasScore, hasProgress }
├── sfx.ts                    # Web Audio procedural SFX
├── hooks/
│   ├── useFlappyGame.ts      # Input + resize + 60fps loop
│   ├── useFlappyGame.types.ts
│   └── useGameScore.ts       # Apollo mutation for score persistence
└── components/
    ├── FlappyBoardCanvas.tsx # rAF render loop — sky, pipes, bird, ground
    └── FlappyHud.tsx         # Score / best badge
```

### Redux slice

The `flappySlice` exposes:

| Action                     | Effect                                             |
| -------------------------- | -------------------------------------------------- |
| `setSize({width, height})` | Resize canvas; re-centre bird if idle              |
| `flap()`                   | `idle → running` on first call; apply FLAP_FORCE   |
| `reset()`                  | Back to idle, preserves `bestScore` and dimensions |
| `setBestScore(n)`          | Persist loaded score from DB                       |
| `tick()`                   | One physics frame                                  |

---

## API

```typescript
import { FlappyGameProvider, FlappyGame } from '@mas-repo/react-flappy-bird';
```

---

## Commands

```bash
npx nx run react-flappy-bird:build
npx nx run react-flappy-bird:test       # Vitest — 40+ tests
npx nx run react-flappy-bird:typecheck
npx nx run react-flappy-bird:lint
```
