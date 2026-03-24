/**
 * Design-token contract that every theme in the MAS monorepo must satisfy.
 *
 * A *theme* is a plain object that implements this interface.
 * Both the {@link https://github.com/aitsaidmouaaddev-droid/mas-repo dark} and
 * {@link https://github.com/aitsaidmouaaddev-droid/mas-repo light} theme objects
 * (defined in `@mas/rn-ui`) conform to this shape, and the
 * {@link ThemeProvider} component distributes a `ThemeTokens` instance via React context.
 *
 * Consumers access the current theme through the `useTheme` hook exported from `@mas/rn-ui`.
 *
 * @example
 * ```ts
 * import type { ThemeTokens } from '@mas/shared-types';
 *
 * function MyComponent({ theme }: { theme: ThemeTokens }) {
 *   return <View style={{ backgroundColor: theme.colors.background }} />;
 * }
 * ```
 *
 * @see {@link StylesOverride} for per-component style customisation
 * @packageDocumentation
 */
/** 10-step colour graduation scale (50–900). */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTokens {
  /**
   * Current colour mode of the theme.
   * Use this to conditionally render mode-specific assets or adjust logic
   * without comparing individual colour values.
   */
  mode: 'light' | 'dark';

  /**
   * Semantic colour palette.
   * All colour values are valid CSS / React Native colour strings (hex, rgb, etc.).
   */
  colors: {
    /** Foreground colour rendered on top of a surface (e.g. icon on a card). */
    onSurface: string;
    /** Elevation shadow colour (typically a semi-transparent black). */
    shadow: string;
    /** Page / screen background colour. */
    background: string;
    /** Card, sidebar and elevated-surface background colour. */
    surface: string;
    /** Elevated surface — popovers, dropdowns, modals. */
    surfaceElevated: string;
    /** Primary body text colour. */
    text: string;
    /** Secondary / placeholder text colour. */
    mutedText: string;
    /** Brand primary action colour (buttons, highlights). */
    primary: string;
    /**
     * Brand secondary / accent colour.
     * Renamed from `track` for semantic clarity; `track` is kept for
     * backward-compatibility — see below.
     */
    secondary: string;
    /** Accent colour — complementary to primary (purple/violet). */
    accent: string;
    /** Destructive-action colour (delete, discard swipe). */
    danger: string;
    /** Positive-action colour (keep, confirm swipe). */
    success: string;
    /** Warning / caution colour. */
    warning: string;
    /** Informational colour. */
    info: string;
    /** Border and divider colour used with the `outline` button variant. */
    border: string;
    /**
     * Kept for backward compatibility with pre-refactor styles.
     * New code should prefer {@link ThemeTokens.colors.secondary | colors.secondary}.
     */
    track: string;
  };

  /** Graduated colour scales for fine-grained control. */
  scales: {
    primary: ColorScale;
    neutral: ColorScale;
    danger: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    accent: ColorScale;
  };

  /**
   * Spacing scale (in logical pixels / dp).
   * Use these values for margin, padding, and gap to keep layouts consistent.
   */
  spacing: {
    /** Extra-small — 4 dp equivalent. */
    xs: number;
    /** Small — 8 dp equivalent. */
    sm: number;
    /** Medium — 16 dp equivalent. */
    md: number;
    /** Large — 24 dp equivalent. */
    lg: number;
    /** Extra-large — 32 dp equivalent. */
    xl: number;
  };

  /**
   * Border-radius scale (in logical pixels / dp).
   * Apply these to `borderRadius` style props.
   */
  radius: {
    /** Small radius — suitable for chips and small buttons. */
    sm: number;
    /** Medium radius — suitable for cards and input fields. */
    md: number;
    /** Large radius — suitable for bottom sheets and modals. */
    lg: number;
    /** Pill radius — use `9999` or equivalent to produce fully rounded shapes. */
    pill: number;
  };

  /**
   * Font-size scale (in sp / logical pixels).
   * Do not use raw numbers for font sizes outside this object.
   */
  typography: {
    /** Screen / section title font size. */
    title: number;
    /** Card subtitle or secondary heading font size. */
    subtitle: number;
    /** Default body copy font size. */
    body: number;
    /** Helper text, labels, and timestamps font size. */
    caption: number;
  };

  /** Transition / animation timing tokens. */
  transition: {
    /** Fast micro-interactions — 120ms. */
    fast: string;
    /** Default transitions — 200ms. */
    normal: string;
    /** Deliberate, noticeable animations — 350ms. */
    slow: string;
    /** Default easing curve. */
    easing: string;
    /** Easing for elements entering the screen. */
    easingIn: string;
    /** Easing for elements leaving the screen. */
    easingOut: string;
  };
}
