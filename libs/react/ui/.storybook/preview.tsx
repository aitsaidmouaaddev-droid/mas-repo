import React from 'react';
import ThemeProvider, { useTheme } from '../src/ThemeContext';
import { APP_FONTS } from '../src/fonts';
import type { FontKey } from '../src/fonts';

const StoryControls = ({ children }: { children: React.ReactNode }) => {
  const { toggleTheme, mode, font, setFont } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-family, system-ui, sans-serif)',
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Font picker */}
        <select
          value={
            (Object.keys(APP_FONTS) as FontKey[]).find((k) => APP_FONTS[k] === font) ??
            'robotocondensed'
          }
          onChange={(e) => setFont(e.target.value as FontKey)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {(Object.entries(APP_FONTS) as [FontKey, (typeof APP_FONTS)[FontKey]][]).map(
            ([key, f]) => (
              <option key={key} value={key}>
                {f.name}
              </option>
            ),
          )}
        </select>
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
      <StoryControls>
        <Story />
      </StoryControls>
    </ThemeProvider>
  ),
];

export default { parameters, decorators };
