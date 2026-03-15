import React from 'react';
import ThemeProvider, { useTheme } from '../src/ThemeContext';

const ThemeToggle = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme, mode } = useTheme();
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        padding: 16,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          {mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      {children}
    </div>
  );
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
};

export const decorators = [
  (Story: React.ComponentType) => (
    <ThemeProvider>
      <ThemeToggle>
        <Story />
      </ThemeToggle>
    </ThemeProvider>
  ),
];

export default { parameters, decorators };
