/**
 * @module ThemeContext
 * React context providing the active {@link ThemeTokens} and theme controls to the component tree.
 *
 * Wrap your app (or a sub-tree) with {@link ThemeProvider} and consume via the {@link useTheme} hook.
 *
 * ```tsx
 * import ThemeProvider, { useTheme } from '@mas/rn/ui';
 *
 * // Wrap once at the root:
 * <ThemeProvider><App /></ThemeProvider>
 *
 * // Consume anywhere below:
 * const { theme, isDark, toggleTheme } = useTheme();
 * ```
 *
 * @see {@link ThemeProvider} — Context provider
 * @see {@link useTheme} — Consumer hook
 * @see {@link darkTheme} — Dark token set
 * @see {@link lightTheme} — Light token set
 */
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeTokens } from '@mas/shared/types';
import { lightTheme } from './light';
import { darkTheme } from './dark';

/**
 * Shape of the value exposed by {@link ThemeContext}.
 *
 * @see {@link useTheme} — hook that returns this value
 */
interface ThemeContextType {
  /** Current resolved theme token set (light or dark). */
  theme: ThemeTokens;
  /** `true` when the active mode is `"dark"`. */
  isDark: boolean;
  /** Toggles between light and dark mode. */
  toggleTheme: () => void;
  /** Active colour mode string. */
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Context provider that makes theme tokens and controls available
 * to any descendant component via {@link useTheme}.
 *
 * Defaults to `"dark"` mode. Toggle with the `toggleTheme` callback.
 *
 * @param children - React node tree to wrap.
 */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      theme: mode === 'light' ? lightTheme : darkTheme,
      isDark: mode === 'dark',
      toggleTheme,
      mode,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Returns the current theme context value.
 *
 * Must be called inside a {@link ThemeProvider} tree — throws otherwise.
 *
 * @returns `{ theme, isDark, toggleTheme, mode }` — see {@link ThemeContextType}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeProvider;
