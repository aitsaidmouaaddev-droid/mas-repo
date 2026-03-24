import type { ThemeTokens } from '@mas/shared/types';

/**
 * Converts a camelCase key to kebab-case: `onSurface` → `on-surface`.
 */
function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates a raw CSS string of custom property declarations from a {@link ThemeTokens} object.
 *
 * Use this when you cannot (or prefer not to) call `applyTheme()` on the DOM directly:
 *
 * - **styled-components** — feed into `createGlobalStyle`
 * - **\@emotion/styled** — feed into `<Global styles={...} />`
 * - **SSR** — embed in `<style>` during server render
 * - **`<style>` injection** — insert via `document.head.appendChild`
 *
 * The return value is a **declarations-only** block (no selector). Wrap it yourself:
 *
 * ```ts
 * const vars = toCSSVarsString(theme);
 * // → "--theme-mode: dark;\n--color-primary: #6200ea;\n..."
 *
 * // styled-components
 * const GlobalStyle = createGlobalStyle`
 *   :root { ${toCSSVarsString(theme)} }
 * `;
 *
 * // emotion
 * <Global styles={css`:root { ${toCSSVarsString(theme)} }`} />
 *
 * // Plain HTML
 * `<style>:root { ${toCSSVarsString(theme)} }</style>`
 * ```
 *
 * @param theme - The theme to serialize.
 * @returns CSS custom property declarations (no wrapping selector).
 */
export function toCSSVarsString(theme: ThemeTokens): string {
  const lines: string[] = [];

  lines.push(`--theme-mode: ${theme.mode};`);

  for (const [key, value] of Object.entries(theme.colors)) {
    lines.push(`--color-${toKebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(theme.spacing)) {
    lines.push(`--spacing-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    lines.push(`--radius-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.typography)) {
    lines.push(`--font-${key}: ${value}px;`);
  }

  if (theme.scales) {
    for (const [scaleName, scale] of Object.entries(theme.scales)) {
      for (const [step, value] of Object.entries(scale)) {
        lines.push(`--scale-${toKebab(scaleName)}-${step}: ${value};`);
      }
    }
  }

  if (theme.transition) {
    for (const [key, value] of Object.entries(theme.transition)) {
      lines.push(`--transition-${toKebab(key)}: ${value};`);
    }
  }

  return lines.join('\n');
}

/**
 * Wraps {@link toCSSVarsString} with a `:root` selector — a complete, injectable CSS block.
 *
 * ```ts
 * document.head.insertAdjacentHTML('beforeend',
 *   `<style>${toCSSVarsBlock(theme)}</style>`
 * );
 * ```
 */
export function toCSSVarsBlock(theme: ThemeTokens): string {
  return `:root {\n${toCSSVarsString(theme)
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n')}\n}`;
}
