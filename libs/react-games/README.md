# react-games

React game libraries for the `react-fundamentals` app — each game is a standalone Nx library following the same architecture pattern.

---

## Games

| Library                                                    | Package                           | Type                   | Worlds/Levels            |
| ---------------------------------------------------------- | --------------------------------- | ---------------------- | ------------------------ |
| [react-flappy-bird](./react-flappy-bird/README.md)         | `@mas-repo/react-flappy-bird`     | Endless runner         | 1 infinite world         |
| [react-snake-game](./react-snake-game/README.md)           | `@mas-repo/react-snake-game`      | Classic snake          | 1 board, 20 speed levels |
| [react-moroccan-runner](./react-moroccan-runner/README.md) | `@mas-repo/react-moroccan-runner` | Mario-style platformer | 4 cities × 4 levels      |

---

## Common architecture pattern

All three libraries follow the same structure:

```
src/
├── index.ts                  # Public barrel exports
└── lib/
    ├── <Game>.tsx             # Main React component
    ├── <Game>Provider.tsx     # Redux Provider (wraps the game)
    ├── <game>.slice.ts        # Redux slice — ALL state + physics in one tick() reducer
    ├── <game>.descriptor.ts   # { uniqueName, hasScore, hasProgress }
    ├── sfx.ts                 # Web Audio API procedural SFX
    ├── hooks/
    │   ├── use<Game>.ts       # Input + resize + game loop
    │   └── useGameScore.ts    # Score persistence (Apollo GraphQL)
    └── components/
        ├── <Game>BoardCanvas.tsx   # requestAnimationFrame render loop
        └── <Game>Hud.tsx           # Score / status HUD
```

### Key design decisions

1. **Redux slice = single source of truth**: Physics, collision detection, AI, and scoring are all pure reducer logic inside `tick()`. No side effects in the slice.

2. **Canvas rendering is decoupled**: The canvas component reads Redux state every frame and redraws everything. No imperative game objects — the render is a pure function of state.

3. **Web Audio via procedural synthesis**: No audio files. All SFX are generated with the Web Audio API oscillators. No loading time, no licensing issues.

4. **Registries for extensibility**: The Moroccan Runner uses pluggable `WORLD_REGISTRY` and `CHARACTER_REGISTRY` — add a new world or character by appending one entry.

5. **Game descriptor**: Each game exports a `GameDescriptor` with `uniqueName`, `hasScore`, `hasProgress` so the `react-fundamentals` app can register games dynamically.

---

## Shared patterns

### Provider wrapping

```tsx
import { FlappyGameProvider, FlappyGame } from '@mas-repo/react-flappy-bird';

<FlappyGameProvider>
  <FlappyGame />
</FlappyGameProvider>;
```

### Score persistence

Each game has a `useGameScore` hook that calls the `saveScore` GraphQL mutation when the game ends.

### Building

```bash
npx nx run react-flappy-bird:build
npx nx run react-snake-game:build
npx nx run react-moroccan-runner:build
```

### Testing

```bash
npx nx run react-flappy-bird:test
npx nx run react-snake-game:test
npx nx run react-moroccan-runner:test
```
