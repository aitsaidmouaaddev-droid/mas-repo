import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeTokens } from '@mas/shared/types';
import { applyTheme, removeTheme } from '@mas/shared/theme';
import { lightTheme } from './light';
import { darkTheme } from './dark';

export interface ThemeContextValue {
  theme: ThemeTokens;
  mode: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export interface ThemeProviderProps {
  initialMode?: 'light' | 'dark';
  children: React.ReactNode;
}

export default function ThemeProvider({ initialMode = 'dark', children }: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    applyTheme(theme);
    return () => removeTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      isDark: mode === 'dark',
      toggleTheme: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [theme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
