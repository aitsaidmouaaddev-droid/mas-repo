# @mas/shared/theme

**Framework-agnostic** theme bridge for the MAS monorepo.
Converts a `ThemeTokens` object (from `@mas/shared/types`) into CSS custom properties consumable by **any** web styling technology.

Zero framework deps — works in React, Angular, Vue, Svelte, vanilla JS, SSR, or any DOM environment.

---

## Features

| Feature                   | Details                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| **DOM bridge**            | `applyTheme()` sets CSS custom properties on `:root` or any element |
| **CSS string generation** | `toCSSVarsString()` / `toCSSVarsBlock()` for SSR and CSS-in-JS      |
| **Tailwind preset**       | `tailwindThemePreset` maps tokens to Tailwind utility classes       |
| **Scoped themes**         | Apply different themes to different DOM subtrees                    |
| **Runtime switching**     | Call `applyTheme()` again to switch light/dark instantly            |
| **Cleanup**               | `removeTheme()` strips all injected variables                       |
| **Zero dependencies**     | Pure TypeScript, no runtime deps                                    |

---

## Architecture

```
src/
├── apply-theme.ts       # DOM-based bridge: applyTheme(), removeTheme()
├── css-vars-string.ts   # String-based bridge: toCSSVarsString(), toCSSVarsBlock()
├── tailwind-preset.ts   # Tailwind theme.extend preset
├── index.ts             # Barrel with per-technology documentation
├── apply-theme.test.ts  # 13 tests (DOM bridge)
└── adapters.test.ts     # 17 tests (string bridge + Tailwind preset)
```

### CSS variable naming

| Token              | CSS variable         |
| ------------------ | -------------------- |
| `mode`             | `--theme-mode`       |
| `colors.primary`   | `--color-primary`    |
| `colors.onSurface` | `--color-on-surface` |
| `colors.mutedText` | `--color-muted-text` |
| `spacing.md`       | `--spacing-md`       |
| `radius.pill`      | `--radius-pill`      |
| `typography.title` | `--font-title`       |

CamelCase keys are converted to kebab-case. Numeric values get a `px` suffix.

---

## Adapter per technology

### CSS / SCSS / SASS / LESS

Call `applyTheme()` once, then use `var()` in your stylesheets.

```ts
import { applyTheme } from '@mas/shared/theme';

applyTheme(lightTheme);
```

```scss
// Any .scss, .sass, .less, or .css file
.card {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-body);
}

.card__title {
  color: var(--color-primary);
  font-size: var(--font-title);
}

.badge--danger {
  background: var(--color-danger);
  border-radius: var(--radius-pill);
}
```

### styled-components

Use `toCSSVarsString()` with `createGlobalStyle` for CSS variable injection, and access `ThemeTokens` directly via `<ThemeProvider>` for JS-level props.

```tsx
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { toCSSVarsString } from '@mas/shared/theme';
import type { ThemeTokens } from '@mas/shared/types';

const theme: ThemeTokens = {
  /* ... */
};

// Option A: CSS variables (works with any child component, even non-styled)
const GlobalTheme = createGlobalStyle`
  :root { ${toCSSVarsString(theme)} }
`;

function App() {
  return (
    <>
      <GlobalTheme />
      <MyPage />
    </>
  );
}

// Option B: JS theme via ThemeProvider (access theme.colors.primary in JS)
function AppWithProvider() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalTheme />
      <MyPage />
    </ThemeProvider>
  );
}

// In styled components, use either CSS vars or theme props
const Card = styled.div`
  background: var(--color-surface);
  padding: var(--spacing-md);
  color: ${(props) => props.theme.colors.text};
`;
```

### @emotion/styled

Same pattern as styled-components — `toCSSVarsString()` with `<Global>`, or `ThemeProvider` for JS access.

```tsx
import { Global, css, ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { toCSSVarsString } from '@mas/shared/theme';
import type { ThemeTokens } from '@mas/shared/types';

const theme: ThemeTokens = {
  /* ... */
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          :root {
            ${toCSSVarsString(theme)}
          }
        `}
      />
      <MyPage />
    </ThemeProvider>
  );
}

// CSS variables
const Card = styled.div`
  background: var(--color-surface);
  padding: var(--spacing-md);
`;

// JS theme access
const Title = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.title}px;
`;
```

### Tailwind CSS

Spread `tailwindThemePreset` into your Tailwind config. The preset maps tokens to `var()` references, so switching themes at runtime updates all Tailwind-styled elements.

```ts
// tailwind.config.ts
import { tailwindThemePreset } from '@mas/shared/theme';

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: tailwindThemePreset,
  },
};
```

Then call `applyTheme()` (or inject `toCSSVarsBlock()`) in your app bootstrap.

```tsx
import { applyTheme } from '@mas/shared/theme';

applyTheme(lightTheme);
```

Now use Tailwind classes:

```html
<div class="bg-surface text-text p-md rounded-md text-body">
  <h2 class="text-primary text-title">Hello</h2>
  <span class="text-muted-text text-caption">Subtitle</span>
  <button class="bg-danger rounded-pill p-sm">Delete</button>
</div>
```

### None / JS inline styles

Import `ThemeTokens` directly — no bridge needed:

```ts
import type { ThemeTokens } from '@mas/shared/types';

function applyInlineStyles(el: HTMLElement, theme: ThemeTokens) {
  el.style.backgroundColor = theme.colors.surface;
  el.style.padding = `${theme.spacing.md}px`;
}
```

---

## Use cases

### 1. Light / dark mode toggle

```ts
import { applyTheme } from '@mas/shared/theme';
import { lightTheme, darkTheme } from './themes';

let isDark = false;

function toggleTheme() {
  isDark = !isDark;
  applyTheme(isDark ? darkTheme : lightTheme);
}

// Initial apply
applyTheme(lightTheme);
document.getElementById('toggle')?.addEventListener('click', toggleTheme);
```

All elements using `var(--color-*)` update instantly — no re-render needed for CSS/SCSS consumers.

### 2. Scoped themes (nested)

Apply different themes to different DOM subtrees:

```ts
import { applyTheme } from '@mas/shared/theme';

// Light theme on the page
applyTheme(lightTheme);

// Dark theme on the sidebar only
const sidebar = document.querySelector('.sidebar') as HTMLElement;
applyTheme(darkTheme, sidebar);
```

```scss
// .sidebar children automatically pick up dark theme CSS vars
.sidebar .card {
  background: var(--color-surface); // dark surface
}
```

### 3. SSR — inject in `<head>` before hydration

```ts
import { toCSSVarsBlock } from '@mas/shared/theme';

// On the server
function renderHTML(theme: ThemeTokens) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${toCSSVarsBlock(theme)}</style>
    </head>
    <body>...</body>
    </html>
  `;
}
```

No flash of unstyled content — variables are available before JS hydration.

### 4. Angular — apply in root component

```ts
import { Component, OnInit } from '@angular/core';
import { applyTheme } from '@mas/shared/theme';
import { lightTheme } from './themes';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements OnInit {
  ngOnInit() {
    applyTheme(lightTheme);
  }
}
```

Then use it in any Angular component's SCSS:

```scss
:host {
  background: var(--color-background);
  color: var(--color-text);
}
```

### 5. Vue — apply in composable

```ts
// useTheme.ts
import { applyTheme, removeTheme } from '@mas/shared/theme';
import { onMounted, onUnmounted } from 'vue';
import type { ThemeTokens } from '@mas/shared/types';

export function useTheme(theme: ThemeTokens) {
  onMounted(() => applyTheme(theme));
  onUnmounted(() => removeTheme(theme));
}
```

```vue
<script setup>
import { useTheme } from './useTheme';
import { lightTheme } from './themes';

useTheme(lightTheme);
</script>

<style scoped>
.card {
  background: var(--color-surface);
  padding: var(--spacing-md);
}
</style>
```

### 6. Dynamic style injection without DOM access

```ts
import { toCSSVarsBlock } from '@mas/shared/theme';

const style = document.createElement('style');
style.textContent = toCSSVarsBlock(myTheme);
document.head.appendChild(style);
```

### 7. Cleanup in tests

```ts
import { applyTheme, removeTheme } from '@mas/shared/theme';

beforeEach(() => applyTheme(testTheme));
afterEach(() => removeTheme(testTheme));
```

---

## API reference

### `applyTheme(theme, target?)`

Sets all `ThemeTokens` fields as CSS custom properties on the target element.

| Param    | Type          | Default                    | Description            |
| -------- | ------------- | -------------------------- | ---------------------- |
| `theme`  | `ThemeTokens` | —                          | The theme to apply     |
| `target` | `HTMLElement` | `document.documentElement` | Element to set vars on |

### `removeTheme(theme, target?)`

Removes all CSS custom properties previously set by `applyTheme`.

### `toCSSVarsString(theme)`

Returns a string of CSS declarations (no selector). Use inside `createGlobalStyle`, `<Global>`, or `<style>` tags.

```
--theme-mode: dark;
--color-primary: #6200ea;
--spacing-md: 16px;
...
```

### `toCSSVarsBlock(theme)`

Returns a complete CSS block with `:root { ... }` selector. Ready for `<style>` injection or SSR.

### `tailwindThemePreset`

A static `theme.extend` object for `tailwind.config`. Maps:

- `colors.*` → `var(--color-*)`
- `spacing.*` → `var(--spacing-*)`
- `borderRadius.*` → `var(--radius-*)`
- `fontSize.*` → `var(--font-*)`

---

## Tests

```bash
npx jest --config libs/shared/theme/jest.config.js
```

**30 tests** across 2 suites:

- `apply-theme.test.ts` — 13 tests: DOM apply/remove, scoped elements, theme switching
- `adapters.test.ts` — 17 tests: CSS string output, `:root` block wrapping, Tailwind preset structure
