import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { ThemeTokens } from '@mas/shared/types';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { applyTheme, removeTheme } from '@mas/shared/theme';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { APP_FONTS, applyFont, removeFont } from './fonts';
import type { AppFont, FontKey } from './fonts';

/**
 * Shape of the value exposed by {@link ThemeProvider} via React context.
 *
 * @example
 * ```tsx
 * const { isDark, toggleTheme } = useTheme();
 * ```
 */
export interface ThemeContextValue {
  /** Resolved design-token map for the active theme. */
  theme: ThemeTokens;
  /** Current colour-scheme identifier. */
  mode: 'light' | 'dark';
  /** Convenience flag — `true` when `mode` is `'dark'`. */
  isDark: boolean;
  /** Toggles between light and dark mode. */
  toggleTheme: () => void;
  /** Currently active font definition. */
  font: AppFont;
  /** Switch to any registered font by key. */
  setFont: (key: FontKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Reads the current {@link ThemeContextValue} from the nearest {@link ThemeProvider}.
 *
 * @throws If called outside a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { theme, toggleTheme } = useTheme();
 *   return <button onClick={toggleTheme}>Toggle</button>;
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

/**
 * Props for {@link ThemeProvider}.
 */
export interface ThemeProviderProps {
  /**
   * Colour-scheme to start with.
   * @default 'dark'
   */
  initialMode?: 'light' | 'dark';
  /**
   * Font family to activate on mount.
   * @default 'robotocondensed'
   */
  initialFont?: FontKey;
  /** React children that may consume the theme via {@link useTheme}. */
  children: React.ReactNode;
}

/**
 * Provides theme tokens and a light/dark toggle to all descendants.
 *
 * Applies the active theme's CSS custom properties on mount and
 * cleans them up on unmount via {@link applyTheme}/{@link removeTheme}.
 *
 * @example
 * ```tsx
 * <ThemeProvider initialMode="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
const STORAGE_KEY = 'mas-theme-mode';

export default function ThemeProvider({
  initialMode = 'dark',
  initialFont = 'robotocondensed',
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // localStorage unavailable (SSR / private browsing)
    }
    return initialMode;
  });
  const [fontKey, setFontKey] = useState<FontKey>(initialFont);

  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const font = APP_FONTS[fontKey];

  useEffect(() => {
    applyTheme(theme);
    return () => removeTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyFont(font);
    return () => removeFont();
  }, [font]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      isDark: mode === 'dark',
      toggleTheme: () =>
        setMode((m) => {
          const next = m === 'dark' ? 'light' : 'dark';
          try {
            localStorage.setItem(STORAGE_KEY, next);
          } catch {
            /* ignore */
          }
          return next;
        }),
      font,
      setFont: setFontKey,
    }),
    [theme, mode, font],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
