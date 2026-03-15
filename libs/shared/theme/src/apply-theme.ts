import type { ThemeTokens } from '@mas/shared/types';

/**
 * Converts a `ThemeTokens` key like `onSurface` to a kebab-case CSS variable
 * segment: `on-surface`.
 */
function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Applies a {@link ThemeTokens} object as CSS custom properties on a DOM element.
 *
 * Every token is mapped to a `--{group}-{key}` variable:
 *
 * | Token                  | CSS variable            |
 * |------------------------|-------------------------|
 * | `colors.primary`       | `--color-primary`       |
 * | `colors.onSurface`     | `--color-on-surface`    |
 * | `spacing.md`           | `--spacing-md`          |
 * | `radius.pill`          | `--radius-pill`         |
 * | `typography.title`     | `--font-title`          |
 * | `mode`                 | `--theme-mode`          |
 *
 * **Framework-agnostic** — works identically in React, Angular, Vue, Svelte,
 * or any web environment that exposes a DOM.
 *
 * @param theme  - The theme object to apply.
 * @param target - The DOM element to set properties on. Defaults to `document.documentElement` (`:root`).
 *
 * @example
 * ```ts
 * import { applyTheme } from '@mas/shared/theme';
 * import { lightTheme } from './themes';
 *
 * // Apply once at app bootstrap
 * applyTheme(lightTheme);
 *
 * // Switch theme at runtime
 * applyTheme(darkTheme);
 * ```
 */
export function applyTheme(
  theme: ThemeTokens,
  target: HTMLElement = document.documentElement,
): void {
  const s = target.style;

  // Mode
  s.setProperty('--theme-mode', theme.mode);

  // Colors
  for (const [key, value] of Object.entries(theme.colors)) {
    s.setProperty(`--color-${toKebab(key)}`, value);
  }

  // Spacing (px)
  for (const [key, value] of Object.entries(theme.spacing)) {
    s.setProperty(`--spacing-${key}`, `${value}px`);
  }

  // Radius (px)
  for (const [key, value] of Object.entries(theme.radius)) {
    s.setProperty(`--radius-${key}`, `${value}px`);
  }

  // Typography (px)
  for (const [key, value] of Object.entries(theme.typography)) {
    s.setProperty(`--font-${key}`, `${value}px`);
  }
}

/**
 * Removes all CSS custom properties previously set by {@link applyTheme}.
 *
 * Useful for cleanup in tests or when unmounting a themed subtree.
 *
 * @param theme  - The theme whose variables should be removed.
 * @param target - The DOM element to clear properties from. Defaults to `:root`.
 */
export function removeTheme(
  theme: ThemeTokens,
  target: HTMLElement = document.documentElement,
): void {
  const s = target.style;

  s.removeProperty('--theme-mode');

  for (const key of Object.keys(theme.colors)) {
    s.removeProperty(`--color-${toKebab(key)}`);
  }
  for (const key of Object.keys(theme.spacing)) {
    s.removeProperty(`--spacing-${key}`);
  }
  for (const key of Object.keys(theme.radius)) {
    s.removeProperty(`--radius-${key}`);
  }
  for (const key of Object.keys(theme.typography)) {
    s.removeProperty(`--font-${key}`);
  }
}
