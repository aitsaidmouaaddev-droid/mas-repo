# react-fundamentals

> Interactive React learning app — QCM quizzes, live coding exercises, and browser games — built with Vite + Express.

---

## What it does

Three modes delivered through a single-page React app backed by a local Node.js API:

| Mode      | Description                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **QCM**   | Multiple-choice quizzes sourced from `@mas/shared/qcm` with difficulty badges, code snippets, instant feedback, and a final results screen                                                   |
| **Code**  | Write implementations in `src/coding/`, run the companion Jest test files directly from the browser; pass/fail badges update in real time                                                    |
| **Games** | Three browser games: Flappy Bird, Snake (20 speed levels + special foods), and Moroccan Runner (Mario-style platformer — 4 cities × 4 levels, 2 characters, day/night cycle, power-up boxes) |

---

## Stack

| Technology                        | Version                 | Role                               |
| --------------------------------- | ----------------------- | ---------------------------------- |
| React                             | 19.1.0                  | UI framework                       |
| Vite                              | 7                       | Dev server + bundler               |
| TypeScript                        | 5.9                     | Language                           |
| SCSS Modules                      | —                       | Component-scoped styles            |
| Redux Toolkit                     | via `@mas/shared/store` | QCM session state                  |
| Express                           | —                       | Local API (test runner + QCM data) |
| `@mas/react-ui`                   | workspace               | Design system (40+ components)     |
| `@mas/shared/qcm`                 | workspace               | Quiz engine + Redux slice          |
| `@mas/shared/store`               | workspace               | Generic Redux store factory        |
| `@mas/frontend-dal`               | workspace               | Repository contracts               |
| `@mas-repo/react-flappy-bird`     | workspace               | Flappy Bird game library           |
| `@mas-repo/react-snake-game`      | workspace               | Snake game library                 |
| `@mas-repo/react-moroccan-runner` | workspace               | Moroccan Runner platformer library |

---

## Architecture

```
apps/react-fundamentals/
├── scripts/
│   └── server.js            # Express API (port 4311)
├── src/
│   ├── api/                 # HTTP repository layer
│   │   ├── http-client.ts   # Thin fetch wrapper
│   │   ├── qcm.repository.ts
│   │   ├── catalog.repository.ts
│   │   ├── types.ts         # API shapes (ModuleEntry, RunResult…)
│   │   └── index.ts         # Singleton exports
│   ├── app/
│   │   ├── app.tsx          # Root router (mode switcher)
│   │   ├── home/            # Landing / mode selection
│   │   ├── qcm/             # QCM quiz view
│   │   └── code/            # Code exercises view
│   ├── coding/              # Student exercise files (tsx + test.tsx pairs)
│   ├── store.ts             # Redux store (qcm slice)
│   └── main.tsx             # React root
└── project.json
```

### Key design decisions

- **Repository pattern** — views consume `qcmRepository` / `catalogRepository` typed via `@mas/frontend-dal`'s `IReadRepository<T>`. Swap the HTTP implementation for a DB one without touching views.
- **No inline styles in TSX** — all spacing, colour, and layout via SCSS Module classes referencing CSS variables from `@mas/shared/theme`.
- **One component per file** — each view folder owns exactly its component file + module SCSS file. Sub-components (e.g. `ResultBlock`) live in their own files.
- **QCM state in Redux** — `@mas/shared/qcm` slice handles session lifecycle; the view layer only dispatches actions and reads selectors.

---

## Commands

```bash
# Start API + Vite dev server together
npx nx run react-fundamentals:dev

# API only  (port 4311)
npx nx run react-fundamentals:serve-api

# Typecheck
npx tsc -p apps/react-fundamentals/tsconfig.app.json --noEmit

# Lint
npx nx run react-fundamentals:lint

# Build
npx nx run react-fundamentals:build
```

---

## Adding exercises

1. Create a subfolder under `src/coding/` following the `NN-topic/` naming convention.
2. Add an implementation file (e.g. `01-my-exercise.tsx`) and a companion test file (`01-my-exercise.test.tsx`).
3. The API server auto-discovers test files; no config change needed.
4. Run the exercise from the Code Mode UI in the browser.

---

## Roadmap

- ✅ Home screen with mode selection and skeleton loading
- ✅ QCM mode — quiz engine, feedback, results, retry
- ✅ Code mode — test runner, per-test badges, failure details, logs
- ✅ Repository pattern (swappable HTTP → DB implementations)
- ✅ `@mas/react-ui` components throughout (no ad-hoc component rebuilds)
- ✅ SCSS Modules — zero inline styles
- ✅ One component per file, subfolders per view
- ✅ Games mode — Flappy Bird, Snake (20 speed levels), Moroccan Runner (Mario-style platformer)
- ⏳ Authentication (save session, resume progress)
- ⏳ Persist QCM answers to DB via `@mas/frontend-dal` write repositories
- ⏳ Fetch questions from DB instead of static JSON
- ⏳ Code editor in-browser (edit + run in one pane)
- ⏳ Progress tracking across sessions
