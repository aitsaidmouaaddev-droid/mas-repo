# storybook-launcher

Interactive Node.js CLI that generates and launches Storybook for any lib or app in the monorepo.

---

## What it does

1. **Detects** all libs and apps in the monorepo that have `.stories.tsx` / `.stories.ts` files
2. **Presents** a coloured interactive selection menu (via `prompts`)
3. **Generates** Storybook config (`main.ts`, `preview.tsx`, `storybook.requires.ts`) for the selected target
4. **Caches** the generated config per lib in `apps/storybook-native/configs/{lib}/` (gitignored)
5. **Launches** Expo start inside `apps/storybook-native`

---

## Usage

```bash
# From monorepo root (recommended)
npm run storybook
```

Select the target lib/app from the menu, then scan the QR in Expo Go or a dev client.

---

## Architecture

```
apps/storybook-launcher/
  index.mjs               # Entry point — menu + orchestration
  detectors/
    stories.mjs           # Scans monorepo for .stories.* files by framework
  runners/
    react-native.mjs      # Generates RN Storybook config + launches expo start
    web.mjs               # Generates web Storybook config (React/Angular/Vue)
```

---

## Supported frameworks

| Framework           | Storybook renderer        |
| ------------------- | ------------------------- |
| React Native / Expo | `@storybook/react-native` |
| React               | `@storybook/react`        |
| Angular             | `@storybook/angular`      |
| Vue 3               | `@storybook/vue3`         |

---

## Per-lib config cache

Config files are cached at `apps/storybook-native/configs/{lib-name}/`. On a subsequent run for the same lib the launcher reuses the cached config unless the stories list has changed.

---

## Dependencies

| Package   | Role                 |
| --------- | -------------------- |
| `prompts` | Interactive CLI menu |
