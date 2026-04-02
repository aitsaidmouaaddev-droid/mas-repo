# react-moroccan-runner

> A full Mario-style platformer game set in 4 iconic Moroccan cities — built entirely with React, Redux Toolkit, and the HTML5 Canvas API.

---

## Table of Contents

- [Overview](#overview)
- [Game Mechanics](#game-mechanics)
- [Characters](#characters)
- [Worlds & Levels](#worlds--levels)
- [Architecture](#architecture)
- [Redux Slice (`platform.slice.ts`)](#redux-slice-platformslicets)
- [Level System](#level-system)
- [World System](#world-system)
- [Character System](#character-system)
- [Day/Night Cycle](#daynight-cycle)
- [Canvas Rendering](#canvas-rendering)
- [Sound Effects](#sound-effects)
- [Background Music](#background-music)
- [Power-Up Boxes](#power-up-boxes)
- [Game Progress & Persistence](#game-progress--persistence)
- [HUD](#hud)
- [Adding New Worlds / Characters](#adding-new-worlds--characters)
- [API Reference](#api-reference)
- [Commands](#commands)

---

## Overview

`@mas-repo/react-moroccan-runner` is a platformer game library consumed by the `react-fundamentals` app. It features:

- **4 Moroccan cities** as worlds: Marrakech, Fès, Chefchaouen, Essaouira
- **4 levels per world** (16 levels total), each 6 000–9 600 px wide
- **2 selectable characters**: Hassan and Fatima, with distinct visual styles and SFX
- **Full Mario-style mechanics**: gravity, variable-height jump, walk/run, stomp enemies, collect coins
- **Power-up boxes**: hit from below while jumping → 8 seconds of power to run through enemies
- **Enemies**: city-specific enemies (market cat, rooftop pigeon, mountain goat, seagull) with patrol AI
- **Day/night cycle**: 120-second cycle with smooth transitions, star-filled night sky
- **Web Audio API SFX and background music**: procedural step-sequencer themes per city
- **Save/load progress** via GraphQL `game_progress.data` jsonb blob

---

## Game Mechanics

### Movement

| Key           | Action                                         |
| ------------- | ---------------------------------------------- |
| ← / A         | Move left                                      |
| → / D         | Move right                                     |
| Shift         | Hold to run (up to `RUN_SPEED = 6.5 px/frame`) |
| Space / W / ↑ | Jump (hold for higher jump)                    |
| P / Escape    | Pause / resume                                 |

Physics constants (from `platform.slice.ts`):

| Constant          | Value | Description                              |
| ----------------- | ----- | ---------------------------------------- |
| `GRAVITY`         | 0.6   | Applied every tick                       |
| `JUMP_FORCE`      | -13.5 | Initial vertical impulse                 |
| `JUMP_HOLD_BONUS` | -0.55 | Extra force per frame while holding jump |
| `JUMP_HOLD_MAX`   | 10    | Max frames of hold bonus                 |
| `WALK_SPEED`      | 3.5   | Max px/frame when walking                |
| `RUN_SPEED`       | 6.5   | Max px/frame when running                |
| `ACCEL`           | 0.7   | Horizontal acceleration per tick         |
| `FRICTION`        | 0.72  | Horizontal deceleration multiplier       |

### Lives & Invincibility

- Player starts with **3 lives** (`INITIAL_LIVES = 3`)
- Hitting an enemy (from the side, without power): lose 1 life + **120 frames** (`INVINCIBLE_FRAMES`) of invincibility (player blinks on canvas)
- Falling off screen: lose 1 life, respawn at level start
- 0 lives → `status = 'dead'`

### Scoring

| Event                            | Points |
| -------------------------------- | ------ |
| Collect coin                     | +10    |
| Stomp enemy                      | +100   |
| Powered run-through of enemy     | +150   |
| Hit box                          | +50    |
| Reach flag                       | +500   |
| Survive time (1pt per 90 frames) | +1/90f |

---

## Characters

Characters are defined in `src/lib/characters/` and implement `CharacterDescriptor`.

### Hassan

- **Color**: `#e08040` (warm orange)
- **Visual**: hand-drawn canvas sprite — djellaba silhouette, animated legs when running
- **SFX**: warm triangle-wave tones for jump/coin/kill; descending sawtooth for lose-life

### Fatima

- **Color**: `#e060a0` (rose)
- **Visual**: hand-drawn canvas sprite — haik silhouette, animated legs when running
- **SFX**: bright sine tones for jump/coin/kill; descending triangle for lose-life

### `CharacterDescriptor` interface

```typescript
interface CharacterDescriptor {
  id: string;
  name: string;
  flavour: string; // Short description shown on character select screen
  color: string; // CSS color for HUD world name
  draw(ctx: CanvasRenderingContext2D, state: PlatformerState, nowMs: number): void;
  playJump(): void;
  playCoin(): void;
  playDeath(): void;
  playKillEnemy(): void;
  playLoseLife(): void;
}
```

---

## Worlds & Levels

### The 4 Worlds

| Index | ID            | City        | Enemy          | Theme                                            |
| ----- | ------------- | ----------- | -------------- | ------------------------------------------------ |
| 0     | `marrakech`   | Marrakech   | Market cat     | Warm terracotta, Atlas mountains, palm trees     |
| 1     | `fes`         | Fès         | Rooftop pigeon | Deep blue medina, blue tile roofs, minarets      |
| 2     | `chefchaouen` | Chefchaouen | Mountain goat  | Blue-washed houses, mountain cliffs, flower pots |
| 3     | `essaouira`   | Essaouira   | Seagull        | Coastal ramparts, animated sea waves, clouds     |

### Level Sizes

| Level       | Width    |
| ----------- | -------- |
| L0 (intro)  | 6 400 px |
| L1          | 7 200 px |
| L2          | 8 000 px |
| L3 (finale) | 9 600 px |

Each level contains: **ground segments** (gaps = fall zone), **elevated platforms**, **enemies** with patrol ranges, **coins**, **power-up boxes**, and a **flag** at the right end.

---

## Architecture

```
src/
├── index.ts                   # Barrel: public API exports
├── lib/
│   ├── MoroccanRunnerGame.tsx         # Main game UI component
│   ├── MoroccanRunnerGame.module.scss
│   ├── MoroccanRunnerGameProvider.tsx # Redux store provider
│   ├── platform.slice.ts              # Redux slice — all game state + physics
│   ├── moroccan-runner.descriptor.ts  # Game metadata
│   ├── dayNight.ts                    # Day/night cycle utilities
│   ├── music.ts                       # Web Audio step-sequencer background music
│   ├── sfx.ts                         # Web Audio procedural SFX
│   ├── characters/
│   │   ├── character.types.ts         # CharacterDescriptor interface
│   │   ├── character.registry.ts      # Map<id, CharacterDescriptor>
│   │   ├── hassan.character.ts        # Hassan sprite + SFX wiring
│   │   └── fatima.character.ts        # Fatima sprite + SFX wiring
│   ├── components/
│   │   ├── MoroccanBoardCanvas.tsx    # Canvas game renderer (rAF loop)
│   │   ├── CharacterSelect.tsx        # Character selection screen
│   │   ├── CharacterSelect.module.scss
│   │   ├── PlatformerHud.tsx          # Score / lives / world / powered HUD
│   │   └── PlatformerHud.module.scss
│   ├── hooks/
│   │   ├── usePlatformerGame.ts       # Keyboard + resize + 60fps game loop
│   │   ├── usePlatformerGame.types.ts # RootState type
│   │   ├── useGameProgress.ts         # Save/load GraphQL progress
│   │   └── useGameSfx.ts              # Watches state transitions, fires SFX
│   ├── levels/
│   │   ├── level.types.ts             # LevelLayout, LevelPlatform, LevelEnemy, etc.
│   │   ├── level.registry.ts          # LEVEL_REGISTRY[][], getLevel(w,l)
│   │   ├── marrakech.levels.ts        # 4 level definitions for Marrakech
│   │   ├── fes.levels.ts              # 4 level definitions for Fès
│   │   ├── chefchaouen.levels.ts      # 4 level definitions for Chefchaouen
│   │   └── essaouira.levels.ts        # 4 level definitions for Essaouira
│   └── worlds/
│       ├── world.types.ts             # WorldDescriptor interface
│       ├── world.registry.ts          # WORLD_REGISTRY[], getWorld(i)
│       ├── marrakech.world.ts         # Canvas draw functions + palette
│       ├── fes.world.ts
│       ├── chefchaouen.world.ts
│       └── essaouira.world.ts
```

---

## Redux Slice (`platform.slice.ts`)

All game state lives in a single Redux slice. The `tick` action drives the entire physics simulation.

### State shape (`PlatformerState`)

```typescript
interface PlatformerState {
  status:
    | 'idle'
    | 'character-select'
    | 'running'
    | 'paused'
    | 'dead'
    | 'level-complete'
    | 'game-complete';
  // Player physics
  playerX: number;
  playerY: number;
  playerVX: number;
  playerVY: number;
  playerFacing: 'left' | 'right';
  isOnGround: boolean;
  jumpHeldFrames: number;
  cameraX: number;
  // Game state
  lives: number;
  invincibleFrames: number;
  statusFrames: number; // countdown for level-complete animation
  worldIndex: number;
  levelIndex: number;
  // Level geometry
  platforms: Platform[];
  groundSegments: [number, number][];
  enemies: Enemy[];
  coins: Coin[];
  boxes: Box[];
  flagX: number;
  levelWidth: number;
  // Score
  score: number;
  bestScore: number;
  totalCoins: number;
  // Power-up
  isPowered: boolean;
  poweredFrames: number;
  // Meta
  characterId: string;
  width: number;
  height: number;
  frameCount: number;
  progressLoaded: boolean;
}
```

### Actions

| Action                | Payload                                             | Effect                                                          |
| --------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| `setSize`             | `{width, height}`                                   | Updates canvas dimensions; recomputes level geometry if in-game |
| `showCharacterSelect` | —                                                   | `status → 'character-select'`                                   |
| `selectCharacter`     | `characterId: string`                               | Sets character, `status → 'running'`                            |
| `pause`               | —                                                   | `running → paused`                                              |
| `resume`              | —                                                   | `paused → running`                                              |
| `reset`               | —                                                   | Restores current world/level, `status → 'character-select'`     |
| `resetToWorld0`       | —                                                   | Returns to world 0 level 0                                      |
| `setBestScore`        | `number`                                            | Updates bestScore if higher                                     |
| `loadProgress`        | `{characterId, worldIndex, levelIndex, totalCoins}` | Restores saved progress                                         |
| `tick`                | `{left, right, jumpHeld, jumpJustPressed, run}`     | Runs one physics frame                                          |

### `tick` — physics pipeline

Every tick (60 fps) the following happens in order:

1. **Level-complete countdown**: if `status === 'level-complete'`, decrement `statusFrames`; transition to next level or `game-complete` when it hits 0
2. **Horizontal movement**: apply acceleration toward `maxSpeed` (walk or run), apply friction when no key held, clamp to `[0, levelWidth - PLAYER_W]`
3. **Jump**: `jumpJustPressed + isOnGround` → `playerVY = JUMP_FORCE`; hold bonus applies for up to `JUMP_HOLD_MAX` frames
4. **Gravity**: `playerVY += GRAVITY`, capped at 16 px/frame
5. **Ground collision**: check each `groundSegment`; land player on top when `playerVY ≥ 0`
6. **Platform collision**: one-way (land on top only); only if player was above the platform last frame
7. **Fall detection**: `playerY > height + 80` → lose 1 life, respawn at level start (or `status = 'dead'`)
8. **Invincibility countdown**
9. **Enemy patrol AI**: each alive enemy moves by `vx`, reverses at patrol boundaries
10. **Player ↔ enemy collision**: stomp (VY > 0, head below halfway) → kill enemy, bounce; powered side-collision → kill; otherwise → lose life (if not invincible)
11. **Box collision**: player head hits box bottom while `VY < 0` → `isPowered = true`, `poweredFrames = 480`
12. **Powered countdown**: decrement each tick; clear when 0
13. **Coin collection**: circular distance check, radius = `COIN_RADIUS + 18 = 28`
14. **Time score**: +1 every 90 frames
15. **Flag**: player right edge ≥ `flagX` → +500, `status = 'level-complete'` (or `game-complete`)
16. **Camera**: follows player with 38% left offset, clamped to `[0, levelWidth - width]`

---

## Level System

### `LevelLayout` structure

```typescript
interface LevelLayout {
  width: number; // Total level width in pixels
  flagX: number; // X position of the finish flag
  groundSegments: [number, number][]; // [startX, endX] pairs — gaps have no floor
  platforms: LevelPlatform[];
  enemies: LevelEnemy[];
  coins: LevelCoin[];
  boxes: LevelBox[]; // Power-up boxes (hit from below)
}
```

### Registry

```typescript
// level.registry.ts
const LEVEL_REGISTRY: LevelLayout[][] = [
  MARRAKECH_LEVELS, // world 0 — 4 levels
  FES_LEVELS, // world 1 — 4 levels
  CHEFCHAOUEN_LEVELS, // world 2 — 4 levels
  ESSAOUIRA_LEVELS, // world 3 — 4 levels
];

export function getLevel(worldIndex: number, levelIndex: number): LevelLayout;
```

`getLevel` never throws — it falls back to world 0 / level 0 for out-of-range indices.

---

## World System

### `WorldDescriptor` interface

```typescript
interface WorldDescriptor {
  id: string;
  name: string;
  groundColor: string;
  groundHeight: number;
  drawBackground(ctx, state, nowMs): void; // Sky, parallax layers, buildings
  drawGround(ctx, state): void; // Ground tiles per segment
  drawPlatform(ctx, x, y, w, h): void; // Themed elevated platform
  drawCoin(ctx, x, y, nowMs): void; // Bouncing coin with city motif
  drawEnemy(ctx, x, y, vx, nowMs): void; // Animated city enemy
  drawFlag(ctx, x, groundY): void; // Goal flag with local design
}
```

All worlds integrate the **day/night cycle** in `drawBackground` — see [Day/Night Cycle](#daynight-cycle).

---

## Character System

The character registry is a `Map<string, CharacterDescriptor>`. Characters are looked up by id at render time and in the SFX hook.

```typescript
// Adding a new character:
// 1. Create libs/react-games/react-moroccan-runner/src/lib/characters/my-char.character.ts
// 2. Import and add to CHARACTER_REGISTRY in character.registry.ts
// → It appears automatically on the character-select screen
```

---

## Day/Night Cycle

`dayNight.ts` exports pure functions for a **120-second cycle** (same smoothstep approach used in the Flappy Bird canvas):

```typescript
getDayFraction(nowMs: number): number  // 1 = full day, 0 = full night
lerpN(a, b, t): number                 // Integer linear interpolation
lerpRGB(r1,g1,b1, r2,g2,b2, t): string // CSS rgb() string
starAlpha(df: number): number          // Star visibility (0 = day, 1 = night)
```

### Cycle timing

| Phase              | Cycle %  | Duration |
| ------------------ | -------- | -------- |
| Full day           | 0%–42%   | 50.4 s   |
| Sunset transition  | 42%–50%  | 9.6 s    |
| Full night         | 50%–92%  | 50.4 s   |
| Sunrise transition | 92%–100% | 9.6 s    |

### How worlds use it

Each `drawBackground` method:

1. Calls `getDayFraction(nowMs)` → `df`
2. Lerps sky gradient colours between day and night palettes
3. Draws twinkling stars when `starAlpha(df) > 0` (fades in/out over the transitions)
4. Draws parallax background layers (mountains, buildings, etc.)
5. Applies a dark semi-transparent overlay at night (`alpha = (1-df) * 0.4–0.45`)

---

## Canvas Rendering

`MoroccanBoardCanvas.tsx` runs a `requestAnimationFrame` loop with the following draw order:

1. `world.drawBackground(ctx, state, nowMs)` — sky, stars, buildings, day/night
2. `world.drawGround(ctx, state)` — ground segments with themed tile pattern
3. Elevated platforms (world-themed via `world.drawPlatform`)
4. **Boxes** — golden `?` box (unhit) with pop animation on hit; cracked grey box after being hit
5. Coins (via `world.drawCoin`)
6. Enemies — alive (via `world.drawEnemy`) or death-flash (fading out)
7. Flag (via `world.drawFlag`)
8. Player character (via `character.draw`) with:
   - **Blink** effect when `invincibleFrames > 0` (every 6 frames)
   - **Power aura**: yellow ellipse outline; flashes when `poweredFrames < 120` (< 2 s remaining)
   - Drop shadow ellipse
9. Level-complete yellow flash overlay
10. Dead / game-complete dark overlay

Camera offset: every world-space X is offset by `state.cameraX` before drawing.

---

## Sound Effects

`sfx.ts` uses the Web Audio API (no external dependencies) to generate all sounds procedurally.

### Shared SFX (`sharedSfx`)

| Method            | Sound                                |
| ----------------- | ------------------------------------ |
| `boxHit()`        | Three-tone box impact                |
| `powerUp()`       | 4-note ascending chime (C5-E5-G5-C6) |
| `powerDown()`     | 4-note descending chime              |
| `levelComplete()` | 7-note fanfare                       |
| `gameComplete()`  | 13-note victory fanfare              |

### Character SFX

Each character has its own timbres — Hassan uses triangle waves (warm), Fatima uses sine waves (bright):

| Method            | Hassan                               | Fatima                  |
| ----------------- | ------------------------------------ | ----------------------- |
| `playJump()`      | Triangle 330→440 Hz                  | Sine 523→659 Hz         |
| `playCoin()`      | Triangle 660→880→1100 Hz             | Sine 784→1047→1319 Hz   |
| `playKillEnemy()` | Triangle 440→660→880 Hz              | Sine 523→784→1047 Hz    |
| `playLoseLife()`  | Sawtooth 300→220→165 Hz (descending) | Triangle 392→294→220 Hz |
| `playDeath()`     | Sawtooth+square low register         | Triangle low register   |

### SFX wiring (`useGameSfx.ts`)

`useGameSfx` is a hook called inside `PlatformerHud`. On every render it compares current state to previous and fires the correct SFX:

- `lives` decreased → `character.playLoseLife()`
- `score` increased by ≥ 100 → `character.playKillEnemy()`
- `hitBoxCount` increased → `sharedSfx.boxHit()`
- `isPowered` became `true` → `sharedSfx.powerUp()`
- `isPowered` became `false` (natural expiry) → `sharedSfx.powerDown()`
- `status` → `level-complete` → `sharedSfx.levelComplete()`
- `status` → `game-complete` → `sharedSfx.gameComplete()`

---

## Background Music

`music.ts` implements a **Web Audio step-sequencer** with 4 city themes. Music starts automatically when the game starts and stops on unmount.

```typescript
startMusic(worldIndex: number): void   // Start themed loop for world 0–3
stopMusic(): void                      // Stop and clear loop timer
setMusicVolume(v: number): void        // 0.0–1.0 (default 0.06)
```

Each theme is a short repeating melodic sequence (different scale, tempo, and waveform per city) that loops using `AudioContext` absolute time scheduling to avoid drift.

---

## Power-Up Boxes

Boxes (`Box` type) are placed in each level at key positions, typically before a dense enemy section.

### Mechanics

1. Player jumps under a box (head hits box bottom while `playerVY < 0`)
2. Box is marked `hit = true`, `hitFrames = 24` (pop animation countdown)
3. `isPowered = true`, `poweredFrames = POWERED_DURATION` (480 frames = 8 seconds at 60 fps)
4. While powered:
   - Running into an enemy from the side kills them (+150 pts) instead of the player losing a life
   - Stomping still works (+100 pts, bounce)
   - A **yellow aura** pulses around the player
   - The HUD shows `⭐ Powered!` badge (flashes when < 2 s remain)
5. After 480 frames, `isPowered → false`, `sharedSfx.powerDown()` fires

### Visual

- **Unhit**: golden gradient box with `?` symbol, highlighted top-left edges, dark brown border
- **Hit**: grey cracked box with crack lines; pops upward by 4 px during `hitFrames` countdown

---

## Game Progress & Persistence

`useGameProgress.ts` handles save/load via Apollo GraphQL:

### Progress blob (stored in `game_progress.data` jsonb)

```typescript
{
  characterId: string,
  worldIndex: number,
  levelIndex: number,
  totalCoins: number,
  gamesPlayed: number,
}
```

- **Load**: on mount, dispatches `loadProgress(blob)` to restore world/level/character
- **Save**: on `status === 'dead'` or `status === 'game-complete'`, saves updated blob

---

## HUD

`PlatformerHud.tsx` displays:

| Element      | Data source                                                |
| ------------ | ---------------------------------------------------------- |
| Score        | `state.score`                                              |
| Best         | `state.bestScore`                                          |
| Lives        | `❤️ × state.lives`                                         |
| World name   | `getWorld(worldIndex).name` (colored with character color) |
| Level        | `world × 4 + level + 1 / 16`                               |
| ⭐ Powered!  | Shown when `isPowered`; flashes when `poweredFrames < 120` |
| Status badge | `status` mapped to success/warning/error variant           |

The HUD also calls `useGameSfx()` to wire SFX to state transitions.

---

## Adding New Worlds / Characters

### New world (city)

1. Create `src/lib/levels/MY_CITY.levels.ts` with a `LevelLayout[]` of 4 levels
2. Create `src/lib/worlds/my-city.world.ts` implementing `WorldDescriptor`
3. Append to `LEVEL_REGISTRY` in `level.registry.ts` (**same index**)
4. Append to `WORLD_REGISTRY` in `world.registry.ts` (**same index**)
5. Add a new step-sequencer theme in `music.ts` at the same index
6. Add i18n keys if needed

### New character

1. Create `src/lib/characters/my-char.character.ts` implementing `CharacterDescriptor`
2. Add to `CHARACTER_REGISTRY` map in `character.registry.ts`
3. The character select screen discovers it automatically

---

## API Reference

### Exports (`src/index.ts`)

```typescript
// Components
export { MoroccanRunnerGameProvider }; // Redux Provider — wrap the game with this
export { MoroccanRunnerGame }; // Main game component

// Metadata
export { MOROCCAN_RUNNER_DESCRIPTOR }; // { uniqueName, hasScore, hasProgress }

// Redux
export { platformSlice }; // The Redux slice (also default export)
export type { PlatformerState, GameStatus, Platform, Coin, Enemy };

// Registries
export { getWorld, getAllWorlds };
export { getCharacter, getAllCharacters };
export { getLevel };

// Types
export type { WorldDescriptor, CharacterDescriptor, LevelLayout };
```

### Usage in `react-fundamentals`

```tsx
import { MoroccanRunnerGameProvider, MoroccanRunnerGame } from '@mas-repo/react-moroccan-runner';

function MoroccanRunnerPage() {
  return (
    <MoroccanRunnerGameProvider>
      <MoroccanRunnerGame />
    </MoroccanRunnerGameProvider>
  );
}
```

---

## Commands

```bash
# Build the library
npx nx run react-moroccan-runner:build

# Run tests (Vitest)
npx nx run react-moroccan-runner:test

# Typecheck
npx nx run react-moroccan-runner:typecheck

# Lint
npx nx run react-moroccan-runner:lint
```

### Test coverage

| File                         | Tests                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `platform.slice.spec.ts`     | Initial state, transitions, tick (movement, jump, coins, boxes, enemies, flag) |
| `dayNight.spec.ts`           | `getDayFraction`, `lerpN`, `lerpRGB`, `starAlpha`                              |
| `level.registry.spec.ts`     | All 16 levels valid, structure checks, fallback behaviour                      |
| `world.registry.spec.ts`     | All 4 worlds, draw methods, fallback                                           |
| `character.registry.spec.ts` | Hassan & Fatima, SFX methods, fallback                                         |
