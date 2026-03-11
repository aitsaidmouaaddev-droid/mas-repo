# storybook-native

Dedicated Expo shell for on-device Storybook previews.

This is **not** the main app — it is an isolated environment used exclusively to run Storybook for any lib or app in the monorepo on a physical device or emulator.

The active config (`main.ts`, `preview.tsx`, `storybook.requires.ts`) is generated dynamically by the [storybook-launcher](../storybook-launcher/README.md) CLI and gitignored — do not edit it manually.

---

## How it works

1. Run `npm run storybook` from the monorepo root
2. The launcher detects all libs/apps with stories
3. Select a target from the menu
4. The launcher writes `main.ts`, `preview.tsx`, and `storybook.requires.ts` into `configs/{lib}/`
5. `expo start` launches inside this shell

---

## Commands

```bash
# Via the launcher (recommended)
npm run storybook

# Direct Expo start (requires manually written config)
nx run storybook-native:sb-expo-go
```

---

## Per-lib config cache

Each lib has its own cached config folder at `apps/storybook-native/configs/{lib}/` (gitignored). The launcher reuses cached configs to avoid unnecessary regeneration on subsequent runs.

---

## Dependencies

| Package | Role |
|---|---|
| `@storybook/react-native` | Storybook renderer for React Native |
| `expo` | Shell runtime |
