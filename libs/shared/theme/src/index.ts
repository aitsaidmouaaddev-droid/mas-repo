/**
 * @packageDocumentation
 * @module @mas/shared/theme
 *
 * Framework-agnostic theme bridge for the MAS monorepo.
 *
 * Converts a {@link ThemeTokens} object (from `@mas/shared/types`) into CSS
 * custom properties so any web technology (React, Angular, Vue, plain SCSS)
 * can consume the design tokens via `var(--color-primary)`, etc.
 *
 * ## Quick start
 * ```ts
 * import { applyTheme } from '@mas/shared/theme';
 *
 * applyTheme(myTheme);            // sets CSS vars on :root
 * applyTheme(myTheme, someDiv);   // scoped to a specific element
 * removeTheme(myTheme);           // cleanup
 * ```
 *
 * ## SCSS usage
 * Once `applyTheme` has been called, use CSS variables anywhere:
 * ```scss
 * .card {
 *   background: var(--color-surface);
 *   padding: var(--spacing-md);
 *   border-radius: var(--radius-md);
 *   font-size: var(--font-body);
 * }
 * ```
 */
export { applyTheme, removeTheme } from './apply-theme.js';
