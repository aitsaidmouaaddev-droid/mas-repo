/**
 * Tailwind CSS theme preset that maps {@link ThemeTokens} CSS variables to
 * Tailwind utility classes.
 *
 * ## How it works
 *
 * 1. Call `applyTheme(theme)` (or inject `toCSSVarsBlock(theme)`) to set CSS
 *    custom properties on `:root`.
 * 2. Spread `tailwindThemePreset` into your `tailwind.config` `theme.extend`.
 * 3. Use Tailwind classes like `bg-primary`, `text-surface`, `p-md`, `rounded-pill`.
 *
 * ## Example `tailwind.config.ts`
 * ```ts
 * import { tailwindThemePreset } from '@mas/shared/theme';
 *
 * export default {
 *   content: ['./src/** /*.{ts,tsx,html}'],
 *   theme: {
 *     extend: tailwindThemePreset,
 *   },
 * };
 * ```
 *
 * ## Resulting class mapping
 *
 * | Tailwind class       | CSS variable resolved     |
 * |----------------------|---------------------------|
 * | `bg-primary`         | `var(--color-primary)`    |
 * | `text-on-surface`    | `var(--color-on-surface)` |
 * | `p-md`               | `var(--spacing-md)`       |
 * | `rounded-pill`       | `var(--radius-pill)`      |
 * | `text-title`         | `var(--font-title)`       |
 */

/**
 * Tailwind `theme.extend` object that references the CSS variables set by
 * `applyTheme()` or `toCSSVarsBlock()`.
 *
 * This object is **static** — it maps utility names to `var(--token)` references.
 * The actual values come from whichever `ThemeTokens` object you apply at runtime,
 * so switching themes at runtime automatically updates Tailwind-styled elements.
 */
export const tailwindThemePreset = {
  colors: {
    'on-surface': 'var(--color-on-surface)',
    shadow: 'var(--color-shadow)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    'surface-elevated': 'var(--color-surface-elevated)',
    text: 'var(--color-text)',
    'muted-text': 'var(--color-muted-text)',
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    border: 'var(--color-border)',
    track: 'var(--color-track)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
  },
  borderRadius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    pill: 'var(--radius-pill)',
  },
  fontSize: {
    title: 'var(--font-title)',
    subtitle: 'var(--font-subtitle)',
    body: 'var(--font-body)',
    caption: 'var(--font-caption)',
  },
} as const;
