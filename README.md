# MAS Monorepo

Nx monorepo hosting multiple projects — a React Native mobile app and shared libraries — unified under a single toolchain and `nx affected` CI/CD pipeline.

---

## Vision

One repo for **all projects**:

- Shared architecture across radically different stacks (mobile, web)
- Libraries extracted once, consumed everywhere
- Granular CI/CD: only what changes is retested, rebuilt, redeployed
- Consistent discipline: lint, format, tests, Storybook, docs

---

## Table of Contents

- [Why Nx](#why-nx)
- [Monorepo structure](#monorepo-structure)
- [Apps](#apps)
- [Libraries](#libraries)
- [Storybook](#storybook)
- [Commands](#commands)
- [CI/CD](#cicd)
- [Quick start](#quick-start)
- [Roadmap](#roadmap)

---

## Why Nx

### `nx affected` — only work on what changed

```bash
nx affected:test     # test only projects impacted by the diff
nx affected:lint     # same for lint
nx affected:build    # same for build
```

When a PR touches `@mas/rn/ui`, only the projects that depend on it are replayed. Everything else is skipped.

### Dependency graph

```bash
npx nx graph         # visualise all inter-project relationships
```

### Distributed cache

Nx caches the output of every task. If nothing changed, the result is replayed instantly.

### Scalability

Add a new project (Angular, Node, Python…) without touching existing tooling. Each project owns its `project.json`, its targets, its rules.

---

## Monorepo structure

```text
mas-repo/
│
├─ apps/
│  ├─ rn-pic-swipe-wipe/        # React Native / Expo — gallery sorting app
│  ├─ js-fundamentals/           # Interactive JavaScript learning app
│  ├─ ts-fundamentals/           # Interactive TypeScript learning app (QCM + code)
│  ├─ react-fundamentals/        # Interactive React learning app (Vite + Express)
│  ├─ storybook-native/          # Expo shell for on-device Storybook
│  └─ storybook-launcher/        # CLI that generates Storybook config per lib
│
├─ libs/
│  ├─ react/
│  │  ├─ ui/          @mas/react-ui        # Web Design System — 40+ React components
│  │  └─ router/      @mas/react-router    # Redux-backed client router (nested routes, guards, breadcrumbs)
│  │
│  ├─ react-native/
│  │  ├─ ui/          @mas/rn/ui           # Design System + React Native components
│  │  ├─ media/       @mas/rn/media        # Gallery scan + permissions (business-agnostic)
│  │  └─ database/    @mas/rn/database     # ExpoSQLiteAdapter + MediaLedgerRepository
│  │
│  └─ shared/
│     ├─ store/        @mas/shared/store   # Generic Redux store factory (framework-agnostic)
│     ├─ qcm/          @mas/shared/qcm     # QCM quiz engine + Redux slice
│     ├─ theme/        @mas/shared/theme   # CSS variable bridge (SCSS/styled/emotion/Tailwind)
│     ├─ types/        @mas/shared/types   # ThemeTokens (platform-agnostic types)
│     ├─ frontend-dal/ @mas/frontend-dal   # IRepository<T> — database-agnostic CRUD contract
│     └─ mas-sqlite/   @mas/mas-sqlite     # BaseSQLiteRepository<T>, DatabaseManager
│
├─ tsconfig.base.json    # Centralised @mas/* path aliases
├─ nx.json
└─ package.json          # npm workspaces, legacy-peer-deps
```

### Import conventions

| Context        | Rule                                               |
| -------------- | -------------------------------------------------- |
| Cross-lib      | `@mas/*` (tsconfig alias)                          |
| Same lib       | relative paths                                     |
| App → libs     | `@mas/*`                                           |
| App → internal | local aliases (`@components/*`, `@styles/*`, etc.) |

---

## Apps

### [`rn-pic-swipe-wipe`](apps/rn-pic-swipe-wipe/README.md) — Mobile gallery sorting app

React Native / Expo app to sort thousands of photos and videos through a gesture-driven UI (swipe keep/trash), with local persistence and a layered architecture.

**Stack**: Expo SDK 54, RN 0.81.5, Expo Router v6, Redux Toolkit, Reanimated v4, SQLite, expo-media-library

**Philosophy**:

- Strict SoC: screens / components / store / services / database / hooks
- Offline-first: zero network dependency, transactional SQLite ledger
- 60 FPS: UI-thread animations (worklets), memoised styles

**Key targets**: `start`, `android`, `typecheck`, `test`, `lint`

---

### [`js-fundamentals`](apps/js-fundamentals/README.md) — JavaScript learning app

Interactive JavaScript fundamentals course with progressive modules — from basics to advanced patterns.

**Stack**: Vanilla JS, esbuild

**Modules**: 01-basics, 02-functions, 03-arrays, 04-objects, 05-this-and-binding, 06-async, 07-advanced, 08-algorithms, 09-patterns, 10-codingame

**Key targets**: `solution` (run solutions), `play` (interactive mode), `sync:solutions` (generate metadata)

---

### [`ts-fundamentals`](apps/ts-fundamentals/README.md) — TypeScript learning app

Interactive TypeScript fundamentals with two learning modes: quiz (QCM) and code exercises validated through Jest tests.

**Stack**: TypeScript, esbuild, Jest

**Key targets**: `qcm` (quiz mode), `qcm:play` (interactive quiz), `code` (run tests), `code:watch` (watch mode), `code:play` (run solutions)

---

### [`react-fundamentals`](apps/react-fundamentals/README.md) — React learning app

Full-stack React learning app with interactive coding exercises served via a Vite frontend and a Node.js backend API that runs tests in the browser.

**Stack**: React, Vite, Node.js (Express), SCSS

**Key targets**: `serve:api` (backend), `serve:app` (Vite dev server), `dev` (both concurrently)

---

### [`storybook-native`](apps/storybook-native/README.md) — Expo Storybook shell

Dedicated Expo shell for on-device Storybook. Not the main app — it is an isolation environment to preview components from any lib in the monorepo.

Active config (`main.ts`, `preview.tsx`, `storybook.requires.ts`) is auto-generated by the launcher and gitignored.

---

### [`storybook-launcher`](apps/storybook-launcher/README.md) — Interactive CLI

Interactive Node.js script that:

1. Scans the monorepo, detects all libs/apps with stories
2. Presents a coloured selection menu
3. Dynamically generates the Storybook config for the chosen lib
4. Launches `expo start` inside `storybook-native`

**Per-lib cache**: each lib has its own `configs/{lib}/` folder (gitignored) with cached `main.ts`, `preview.tsx`, and `storybook.requires.ts` to avoid unnecessary regeneration.

---

## Libraries

### [`@mas/react-ui`](libs/react/ui/README.md) — React Web Design System

40 atomic components for React web apps, matching `@mas/rn/ui` conventions:

- SCSS Modules + CSS variables via `@mas/shared/theme`
- `useStyles(scss, classOverride?, styleOverride?)` — class/style merging with `clsx`
- ThemeProvider + useTheme (light/dark), Icon, Button, Card, Logo, ProgressBar, Select, NavBar, SideBar, FloatingMenuButton
- Typography, Input, Checkbox, Radio, Switch, Avatar, Badge, Tag, Divider, Spinner, Tooltip, Link, Skeleton
- InputField, SearchBar, Tabs, Accordion, Alert, Toast (portal + useToast), Modal, DropdownMenu, Pagination
- RadioGroup, CheckboxGroup, Form, Table (sortable), Breadcrumb, Header, Container, Stack, Grid
- Storybook 10 (react-vite), 185+ Vitest tests

---

### [`@mas/react-router`](libs/react/router/README.md) — Redux-backed React router

Lightweight client-side router that stores all navigation state in Redux — no hidden Context magic, no parallel state:

- **Nested routes** — `<Outlet />` renders the matched component at each depth level
- **Dynamic segments** — `/users/:id` → `useParams().id`
- **Async navigation guards** — `canActivate: () => Promise<boolean>` with `redirectTo`
- **Breadcrumbs** — `useBreadcrumbs()` walks the matched tree via `meta.breadcrumb`
- **Search params** — `useSearchParams()` with typed read/write helpers
- **Redux-driven** — `routerReducer` plugs into `createAppStore` from `@mas/shared/store`
- **Active link styling** — `<Link activeClassName="active" exact>`
- **Declarative redirect** — `<Redirect to="/login" />`
- **Zero extra deps** — only `react-redux` and `@reduxjs/toolkit`
- 32 Vitest tests (matcher + slice)

---

### [`@mas/rn/ui`](libs/react-native/ui/README.md) — React Native Design System

- Atomic and organism components (`CardsDeck`, `VideoContainer`, `Icon`, `Button`, `Select`, `TabBar`…)
- `ThemeProvider` + `useTheme` (light/dark, typed tokens via `@mas/shared/types`)
- **Style Factory** pattern (`makeStyles` + `StylesOverride<T>`)
- `useResultedStyle` — composes base styles + per-key overrides
- Clean Storybook preview: `ThemeProvider` + `ThemeToggle`

---

### [`@mas/rn/media`](libs/react-native/media/README.md) — Gallery scanner (mission library)

Completely business-agnostic (no knowledge of verdicts, buckets, Redux):

- Types: `MediaAsset`, `AppMediaType`, `AppPermissionStatus`
- Functions: `requestMediaPermission()`, `scanMedia({ limit, mediaTypes? })`
- Returns a flat `MediaAsset[]` — nothing more

---

### [`@mas/rn/database`](libs/react-native/database/README.md) — SQLite adapter (React Native)

`ExpoSQLiteAdapter` implements `ISQLiteAdapter` from `@mas/mas-sqlite`.
`MediaLedgerRepository` extends `BaseSQLiteRepository` for the `MediaDecisionRow` entity.
Table schema and database config are defined here and passed to `DatabaseManager.mount`.

---

### [`@mas/shared/store`](libs/shared/store/README.md) — Generic Redux store factory (framework-agnostic)

Creates a generic Redux Toolkit store. No knowledge of slices or business logic. Compatible with React, React Native, Angular, Vue, Node.js:

- `createAppStore<TReducers, TExtra>(reducers, extra?)` — injects `extra` into every thunk via `thunkApi.extra`
- Each app provides its own reducers, types, and slices

---

### [`@mas/shared/qcm`](libs/shared/qcm/README.md) — QCM quiz engine

Framework-agnostic quiz (QCM) library — works in Node, browsers, React, React Native, or any JS runtime:

- **Types** — `QcmQuestion`, `QcmModule`, `QcmData`, `SessionConfig`, `QcmResult`…
- **Engine** — pure functions: `checkAnswer`, `scoreAnswers`, `shuffleChoices`, `filterByDifficulty`, `filterByTags`, `getRetryQuestions`…
- **Validators** — runtime validation of raw JSON payloads with human-readable errors
- **Session** — stateful `QcmSession` class with auto-advance, timer, streak tracking, and retry
- **Redux slice** — `qcmReducer` + actions (`startSession`, `answerQuestion`, `skipQuestion`, `retrySession`…) + typed selectors (`selectCurrentQuestion`, `selectProgress`, `selectResult`…)

Weighted scoring (easy=1, medium=2, hard=3), partial scoring for multi-choice, configurable pass threshold.

---

### [`@mas/shared/theme`](libs/shared/theme/README.md) — CSS variable bridge (framework-agnostic)

Converts `ThemeTokens` into CSS custom properties consumable by any web technology:

- **CSS / SCSS / SASS / LESS** — `applyTheme(theme)` → `var(--color-primary)` in stylesheets
- **styled-components / @emotion** — `toCSSVarsString()` for `createGlobalStyle` / `<Global>`
- **Tailwind CSS** — `tailwindThemePreset` in `theme.extend` → `bg-primary`, `p-md` classes
- **SSR** — `toCSSVarsBlock()` for `<style>` injection before hydration
- Scoped themes, runtime switching, cleanup for tests
- 30 tests (DOM bridge + string adapters + Tailwind preset)

---

### [`@mas/shared/types`](libs/shared/types/README.md) — Shared types

`ThemeTokens` — platform-agnostic type consumed by all libs and apps. `StylesOverride<S>` lives in `@mas/rn/ui` (depends on React Native's `StyleProp`). No runtime code.

---

### [`@mas/frontend-dal`](libs/shared/frontend-dal/README.md) — CRUD abstraction

Database-agnostic repository contract. Libs and services depend on `IRepository<T>`, never on a concrete driver:

- `IReadRepository<T>` — read-only: paginate, filter, cursor
- `IWriteRepository<T>` — write: save, update, delete
- `IRepository<T>` — full CRUD (extends both)
- Query types: `PageParams`, `CursorParams`, `FilterCriteria`, `SortParam`…

No runtime code — types only.

---

### [`@mas/mas-sqlite`](libs/shared/mas-sqlite/README.md) — Generic SQLite implementation

Bridges `@mas/frontend-dal` and any platform SQLite driver:

- `ISQLiteAdapter` — driver contract (implement once per platform/driver)
- `DatabaseManager` — singleton: opens DB, applies PRAGMAs, creates tables
- `BaseSQLiteRepository<T>` — abstract class implementing `IRepository<T>` over any `ISQLiteAdapter`

---

## Storybook

```bash
npm run storybook
```

Select a lib from the menu → Expo start → scan the QR in Expo Go.

| Lib                 | Preview                                         | Features                                        |
| ------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `@mas/rn/ui`        | `libs/react-native/ui/.storybook/preview.tsx`   | ThemeProvider + ThemeToggle (light/dark switch) |
| `rn-pic-swipe-wipe` | `apps/rn-pic-swipe-wipe/.storybook/preview.tsx` | ThemeProvider                                   |

---

## Commands

### Project generator

```bash
npm run generate           # Scaffold a new app or lib (interactive)
npm run generate:test      # Run a test scenario + integrated git undo
```

Supported stacks: Angular, React, React Native / Expo, Vue, NestJS, Node.js.

### Mobile app

```bash
npm run start              # Expo start
npm run android            # Run on Android
npm run storybook          # Interactive Storybook launcher
```

### Push (with docs regeneration)

```bash
npm run push               # Regenerate TypeDoc locally, then git push
```

Equivalent to `npm run docs && git push`. The `docs/` folder is gitignored so no docs commit is created — the generated site is refreshed locally before the push lands on the remote.

Use `git push` directly to skip docs regeneration.

### Tests

```bash
npm run test               # Run all tests across all projects
npm run affected:test      # Tests for projects changed vs origin/dev (pre-push)
```

### Lint & format

```bash
npm run lint               # ESLint across all projects
npm run lint:fix           # ESLint with auto-fix
npm run format             # Prettier write all files
npm run format:check       # Prettier check (CI-safe, no writes)
npm run affected:lint      # Lint projects affected by staged changes (Husky pre-commit)
npm run affected:ci        # lint + test affected vs origin/main (GitHub Actions)
```

### Nx

```bash
npx nx graph                          # Dependency graph
nx run rn-pic-swipe-wipe:typecheck   # Typecheck app
nx affected --target=test             # Test only affected projects
nx affected --target=lint             # Lint only affected projects
```

---

## CI/CD

### Architecture

| Workflow file                                | Trigger                                             | What it does                                         |
| -------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `.github/workflows/ci.yml`                   | PR or push to `dev`/`main`                          | `nx affected` lint + test + typecheck + format check |
| `.github/workflows/rn-pic-swipe-wipe-ci.yml` | Changes to `apps/rn-pic-swipe-wipe/**` or `libs/**` | App-level: typecheck + Expo config validation        |
| `.github/workflows/rn-pic-swipe-wipe-cd.yml` | Push to `dev` (preview) or `main` (production)      | EAS Build — Android APK via Expo cloud               |

### Why app-level workflow files

- Global CI covers all projects uniformly via `nx affected`
- Each app can have extra CI steps that don't apply to others (Expo config check, native build gates, platform-specific linting)
- CD is always app-local — React Native deploys via EAS; a future web app or Node service would own its own deployment workflow independently

### Required secrets (GitHub → Settings → Secrets)

| Secret       | Used by                    | Purpose                                      |
| ------------ | -------------------------- | -------------------------------------------- |
| `EXPO_TOKEN` | `rn-pic-swipe-wipe-cd.yml` | Authenticates EAS CLI with your Expo account |

---

## Quick start

### Prerequisites

- Node.js + npm
- Android Studio (for mobile dev)
- A physical device recommended (MediaLibrary + video performance)

### Install

```bash
npm install
```

### Mobile app

```bash
npm run start
```

### Docs

```bash
npm run docs          # generate TypeDoc site for all libs
```

### Storybook

```bash
npm run storybook
```

---

## Roadmap

### Monorepo tooling

- ✅ Nx + npm workspaces structure
- ✅ `@mas/*` libs extracted following mission-library principle (ui, store, media, database, shared)
- ✅ Mission-library architecture: libs without business logic, DI via RTK extraArgument
- ✅ Centralised TypeScript aliases (`tsconfig.base.json`)
- ✅ On-device Storybook with per-lib launcher
- ✅ Interactive `npm run generate` generator (Angular/React/RN/Vue/NestJS/Node)
- ✅ Nx `project.json` for all projects
- ✅ TSDoc/JSDoc on all libs (TypeDoc-compatible)
- ✅ TypeDoc setup: `typedoc.json` + `npm run docs` (all libs + apps, 85 pages)
- ✅ ESLint flat config monorepo-wide (per-project configs, React rules, Prettier integration)
- ✅ Prettier configured (`printWidth: 100`, trailing commas, single quotes)
- ✅ Husky + lint-staged (`nx affected:lint` on pre-commit, `nx affected:test` on pre-push)
- ✅ Jest configured on all projects with tests (`nx affected --target=test`)
- ✅ GitHub Actions CI with `nx affected` (lint + test + typecheck, affected vs origin/main)
- ✅ App-level CI: supplementary RN checks (typecheck, Expo config validation)
- ✅ App-level CD: EAS Build (Android) on push to dev/main
- ⏳ CD for docs site (GitHub Pages / Netlify)

### `rn-pic-swipe-wipe`

- ✅ Gallery scan + MediaItem normalisation
- ✅ Gesture deck (swipe keep/trash)
- ✅ SQLite ledger + resume sorting
- ⏳ "Commit screen": Keep/Trash summary + confirmation
- ⏳ Filters: screenshots, short videos, sizes, dates
- ⏳ "Review Trash" mode before final deletion
- ⏳ Ledger export/backup

### `@mas/shared/qcm`

- ✅ Core types (QcmQuestion, QcmModule, QcmData, SessionConfig, QcmResult…)
- ✅ Engine: scoring, shuffling, filtering, streak, retry (pure functions)
- ✅ Validators: runtime JSON validation with friendly errors
- ✅ Session: stateful class with auto-advance, timer, retry
- ✅ Redux Toolkit slice: qcmReducer, 8 actions, 7 typed selectors
- ✅ 89 tests (engine, validators, session, slice)
- ✅ Full JSDoc + comprehensive README with use cases

### `@mas/shared/theme`

- ✅ DOM bridge: applyTheme() / removeTheme() with scoped element support
- ✅ CSS string generation: toCSSVarsString() / toCSSVarsBlock() for SSR + CSS-in-JS
- ✅ Tailwind preset: tailwindThemePreset mapping tokens to var() references
- ✅ 30 tests (jsdom)
- ✅ Full README with use cases for CSS, SCSS, styled-components, emotion, Tailwind, Angular, Vue

### `react-fundamentals`

- ✅ QCM mode — quiz engine, feedback, results, retry wrong
- ✅ Code mode — in-browser test runner, per-test badges, failure/log details
- ✅ Repository pattern with `@mas/frontend-dal` contracts (HTTP → DB swappable)
- ✅ `@mas/react-ui` design system throughout — no ad-hoc component rebuilds
- ✅ SCSS Modules — zero inline styles, CSS variable tokens
- ✅ One component per file, view subfolders
- ⏳ Authentication + session persistence
- ⏳ Write repositories: save QCM answers and code results to DB
- ⏳ Fetch questions from DB instead of static JSON
- ⏳ In-browser code editor (edit + run in one pane)

### `@mas/react-router`

- ✅ Redux slice: `routerReducer`, `push/replace/pop`, `setMatchedTree`, `setError`, `setIdle`
- ✅ Route matching: static segments, `:param` dynamic segments, `*` wildcard, nested tree
- ✅ `<RouterProvider>` — mounts history listener, runs async guards, dispatches match tree
- ✅ `<Outlet>` — depth-aware nested route rendering
- ✅ `<Link>` — client-side anchor with `activeClassName` and `exact` support
- ✅ `<Redirect>` — declarative imperative redirect on mount
- ✅ Hooks: `useNavigate`, `useParams`, `useLocation`, `useMatch`, `useSearchParams`, `useBreadcrumbs`
- ✅ 32 Vitest tests (matcher utilities + Redux slice + selectors)
- ✅ Full README with 10 use cases (auth guards, breadcrumbs, nested routes, search params…)
- ⏳ Scroll restoration on navigation
- ⏳ Code-split / lazy-loaded route components
- ⏳ `<Prompt>` — block navigation with unsaved changes

### `@mas/react-ui`

- ✅ 40+ atomic React web components
- ✅ SCSS Modules + CSS variables via `@mas/shared/theme`
- ✅ ThemeProvider + useTheme (light/dark), full Storybook 10
- ✅ 185+ Vitest tests
- ✅ TSDoc on all public APIs
- ⏳ Font system (Google Fonts, switchable in Storybook)
- ⏳ Semantic shadow CSS variables (`--shadow-sm/md/lg/xl`)

### Node.js / AI services

- ⏳ To be defined per project

---

## Status

**MAS Repo v0.8.0** — Private monorepo under active development.
Mission-library architecture in place. All libs fully documented with TSDoc and fully tested.
Global CI + app-level CI/CD workflows in place (GitHub Actions, provider-agnostic scripts).
`react-fundamentals` interactive learning app live with QCM + TDT (Test-Driven Training) modes.
`@mas/react-router` Redux-backed client router added — nested routes, async guards, breadcrumbs.
