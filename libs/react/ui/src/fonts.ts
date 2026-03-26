/**
 * Web font registry for `@mas/react-ui`.
 *
 * Each entry describes a Google Font family and exposes helpers to inject
 * the stylesheet into the document `<head>` and apply a `--font-family`
 * CSS custom property consumed by all components.
 *
 * @example — apply at app bootstrap
 * ```ts
 * import { APP_FONTS, applyFont } from '@mas/react-ui';
 * applyFont(APP_FONTS.librebaskerville);
 * ```
 *
 * @example — change font at runtime
 * ```ts
 * // via ThemeProvider context
 * const { setFont } = useTheme();
 * setFont('thasadith');
 * ```
 *
 * @packageDocumentation
 */

/**
 * Descriptor for a single Google Font family.
 */
export interface AppFont {
  /** Human-readable display name shown in UI selectors. */
  name: string;
  /** CSS `font-family` declaration value, ready to use verbatim. */
  family: string;
  /** Full Google Fonts stylesheet URL for `<link>` injection. */
  googleUrl: string;
}

/** Union of valid font keys in {@link APP_FONTS}. */
export type FontKey = 'robotocondensed' | 'librebaskerville' | 'thasadith';

/**
 * Registry of all available application fonts.
 *
 * Import this at the app level to build font pickers or to call
 * {@link applyFont} directly.
 *
 * @example
 * ```ts
 * import { APP_FONTS, applyFont } from '@mas/react-ui';
 *
 * // Apply a specific font
 * applyFont(APP_FONTS.robotocondensed);
 *
 * // Build a picker
 * Object.entries(APP_FONTS).map(([key, font]) => font.name);
 * ```
 */
export const APP_FONTS: Record<FontKey, AppFont> = {
  robotocondensed: {
    name: 'Roboto Condensed',
    family: "'Roboto Condensed', sans-serif",
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap',
  },
  librebaskerville: {
    name: 'Libre Baskerville',
    family: "'Libre Baskerville', serif",
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&display=swap',
  },
  thasadith: {
    name: 'Thasadith',
    family: "'Thasadith', sans-serif",
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Thasadith:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  },
};

const LINK_ID_PREFIX = 'mas-font-';

/**
 * Applies a font to the page by:
 * 1. Injecting a `<link>` stylesheet into `<head>` (idempotent — only once per font).
 * 2. Setting the `--font-family` CSS custom property on `target` (defaults to `:root`).
 *
 * Safe to call repeatedly — the `<link>` element is identified by a stable `id`
 * so duplicate injections are silently skipped.
 *
 * @remarks
 * The `<link>` is never removed by {@link removeFont} — fonts are cached by the
 * browser and removing them causes a flash of unstyled text (FOUT) on re-application.
 *
 * @param font   - Font to apply (use an entry from {@link APP_FONTS}).
 * @param target - DOM element to set `--font-family` on. Defaults to `document.documentElement`.
 *
 * @example
 * ```ts
 * import { APP_FONTS, applyFont } from '@mas/react-ui';
 * applyFont(APP_FONTS.thasadith);
 * ```
 */
export function applyFont(font: AppFont, target: HTMLElement = document.documentElement): void {
  if (typeof document === 'undefined') return;

  const id = `${LINK_ID_PREFIX}${font.name.replace(/\s+/g, '-').toLowerCase()}`;

  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = font.googleUrl;
    document.head.appendChild(link);
  }

  target.style.setProperty('--font-family', font.family);
}

/**
 * Removes the `--font-family` CSS custom property from `target`.
 *
 * Does **not** remove the injected `<link>` stylesheet — see {@link applyFont}
 * remarks for rationale.
 *
 * @param target - DOM element to remove `--font-family` from. Defaults to `:root`.
 */
export function removeFont(target: HTMLElement = document.documentElement): void {
  if (typeof document === 'undefined') return;
  target.style.removeProperty('--font-family');
}
