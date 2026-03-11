import type { StyleProp } from "react-native";

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
export interface ThemeTokens {
  /**
   * Current colour mode of the theme.
   * Use this to conditionally render mode-specific assets or adjust logic
   * without comparing individual colour values.
   */
  mode: "light" | "dark";

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
    /** Destructive-action colour (delete, discard swipe). */
    danger: string;
    /** Positive-action colour (keep, confirm swipe). */
    success: string;
    /** Border and divider colour used with the `outline` button variant. */
    border: string;
    /**
     * Kept for backward compatibility with pre-refactor styles.
     * New code should prefer {@link ThemeTokens.colors.secondary | colors.secondary}.
     */
    track: string;
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
}

/**
 * Utility type that lets a consumer override individual named styles of a
 * component without replacing the entire stylesheet.
 *
 * `S` is the type of the component's internal `StyleSheet.create({...})` object.
 * Each key maps to any valid React Native `StyleProp` so callers can pass both
 * plain style objects and `StyleSheet` numeric IDs.
 *
 * @typeParam S - The shape of the component's stylesheet (e.g. `typeof styles`).
 *
 * @example
 * ```tsx
 * import type { StylesOverride } from '@mas/shared-types';
 *
 * type ButtonStyles = { root: ViewStyle; label: TextStyle };
 *
 * function Button({ stylesOverride }: { stylesOverride?: StylesOverride<ButtonStyles> }) {
 *   return (
 *     <TouchableOpacity style={[styles.root, stylesOverride?.root]}>
 *       <Text style={[styles.label, stylesOverride?.label]}>Press me</Text>
 *     </TouchableOpacity>
 *   );
 * }
 * ```
 *
 * @see {@link ThemeTokens} for the theme shape used across all components
 */
export type StylesOverride<S> = Partial<Record<keyof S, StyleProp<any>>>;
