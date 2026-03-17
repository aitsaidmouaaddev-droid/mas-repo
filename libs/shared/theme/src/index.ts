/**
 * @packageDocumentation
 * @module @mas/shared/theme
 *
 * Framework-agnostic theme bridge for the MAS monorepo.
 *
 * Converts a {@link ThemeTokens} object (from `@mas/shared/types`) into
 * CSS custom properties consumable by **any** web styling technology.
 *
 * ## Adapters by technology
 *
 * | Tech                          | What to use                              |
 * |-------------------------------|------------------------------------------|
 * | **CSS / SCSS / SASS / LESS**  | `applyTheme(theme)` → `var(--color-*)` in stylesheets |
 * | **styled-components**         | Pass `ThemeTokens` to `<ThemeProvider>` directly, or use `toCSSVarsString()` with `createGlobalStyle` |
 * | **\@emotion/styled**          | Same as styled-components — `ThemeProvider` or `toCSSVarsString()` with `<Global>` |
 * | **Tailwind CSS**              | Spread `tailwindThemePreset` in `theme.extend` → classes like `bg-primary`, `p-md` |
 * | **None / JS inline styles**   | Import `ThemeTokens` directly from `@mas/shared/types` |
 *
 * ## Quick start
 * ```ts
 * import { applyTheme } from '@mas/shared/theme';
 * applyTheme(myTheme);
 * ```
 *
 * ## styled-components / emotion
 * ```ts
 * import { toCSSVarsString } from '@mas/shared/theme';
 * const GlobalStyle = createGlobalStyle`:root { ${toCSSVarsString(theme)} }`;
 * ```
 *
 * ## Tailwind CSS
 * ```ts
 * import { tailwindThemePreset } from '@mas/shared/theme';
 * export default { theme: { extend: tailwindThemePreset } };
 * ```
 */

// DOM-based bridge (CSS / SCSS / SASS / LESS)
export { applyTheme, removeTheme } from './apply-theme.js';

// String-based bridge (styled-components / @emotion / SSR / <style> injection)
export { toCSSVarsString, toCSSVarsBlock } from './css-vars-string.js';

// Tailwind CSS preset
export { tailwindThemePreset } from './tailwind-preset.js';
