import type { ThemeTokens } from '@mas/shared/types';
import { toCSSVarsString, toCSSVarsBlock } from './css-vars-string';
import { tailwindThemePreset } from './tailwind-preset';

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const STUB_SCALE = {
  50: '#fafafa', 100: '#f5f5f5', 200: '#eeeeee', 300: '#e0e0e0', 400: '#bdbdbd',
  500: '#9e9e9e', 600: '#757575', 700: '#616161', 800: '#424242', 900: '#212121',
};

function makeTheme(mode: 'light' | 'dark' = 'light'): ThemeTokens {
  return {
    mode,
    colors: {
      onSurface: '#ffffff',
      shadow: 'rgba(0,0,0,0.2)',
      background: '#f5f5f5',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#111111',
      mutedText: '#888888',
      primary: '#6200ea',
      secondary: '#03dac6',
      accent: '#7c3aed',
      danger: '#b00020',
      success: '#00c853',
      warning: '#e65100',
      info: '#0284c7',
      border: '#cccccc',
      track: '#03dac6',
    },
    scales: {
      primary: STUB_SCALE,
      neutral: STUB_SCALE,
      danger: STUB_SCALE,
      success: STUB_SCALE,
      warning: STUB_SCALE,
      accent: STUB_SCALE,
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    radius: { sm: 4, md: 8, lg: 16, pill: 9999 },
    typography: { title: 24, subtitle: 18, body: 14, caption: 12 },
    transition: {
      fast: '120ms',
      normal: '200ms',
      slow: '350ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  };
}

// ---------------------------------------------------------------------------
// toCSSVarsString
// ---------------------------------------------------------------------------

describe('toCSSVarsString', () => {
  const theme = makeTheme('dark');
  const css = toCSSVarsString(theme);

  it('starts with --theme-mode', () => {
    expect(css).toContain('--theme-mode: dark;');
  });

  it('contains color variables in kebab-case', () => {
    expect(css).toContain('--color-primary: #6200ea;');
    expect(css).toContain('--color-on-surface: #ffffff;');
    expect(css).toContain('--color-muted-text: #888888;');
  });

  it('contains spacing with px suffix', () => {
    expect(css).toContain('--spacing-xs: 4px;');
    expect(css).toContain('--spacing-md: 16px;');
  });

  it('contains radius with px suffix', () => {
    expect(css).toContain('--radius-pill: 9999px;');
    expect(css).toContain('--radius-sm: 4px;');
  });

  it('contains typography with px suffix', () => {
    expect(css).toContain('--font-title: 24px;');
    expect(css).toContain('--font-caption: 12px;');
  });

  it('returns declarations only (no selector)', () => {
    expect(css).not.toContain(':root');
    expect(css).not.toContain('{');
  });

  it('each line ends with a semicolon', () => {
    for (const line of css.split('\n')) {
      expect(line.trim()).toMatch(/;$/);
    }
  });

  it('produces the correct number of lines', () => {
    // 1 mode + 16 colors + 5 spacing + 4 radius + 4 typo + 60 scales (6×10) + 6 transition = 96
    expect(css.split('\n')).toHaveLength(96);
  });
});

// ---------------------------------------------------------------------------
// toCSSVarsBlock
// ---------------------------------------------------------------------------

describe('toCSSVarsBlock', () => {
  const theme = makeTheme();
  const block = toCSSVarsBlock(theme);

  it('wraps declarations in :root { ... }', () => {
    expect(block).toMatch(/^:root \{/);
    expect(block).toMatch(/\}$/);
  });

  it('indents each declaration with 2 spaces', () => {
    const inner = block.split('\n').slice(1, -1);
    for (const line of inner) {
      expect(line).toMatch(/^ {2}--/);
    }
  });

  it('includes all variables', () => {
    expect(block).toContain('--color-primary:');
    expect(block).toContain('--spacing-md:');
    expect(block).toContain('--theme-mode:');
  });
});

// ---------------------------------------------------------------------------
// tailwindThemePreset — structural tests
// ---------------------------------------------------------------------------

describe('tailwindThemePreset', () => {
  it('has a colors object with all 16 token keys', () => {
    expect(Object.keys(tailwindThemePreset.colors)).toHaveLength(16);
  });

  it('maps colors to CSS var references', () => {
    expect(tailwindThemePreset.colors.primary).toBe('var(--color-primary)');
    expect(tailwindThemePreset.colors['on-surface']).toBe('var(--color-on-surface)');
    expect(tailwindThemePreset.colors['muted-text']).toBe('var(--color-muted-text)');
  });

  it('has a spacing object with all 5 keys', () => {
    expect(Object.keys(tailwindThemePreset.spacing)).toHaveLength(5);
    expect(tailwindThemePreset.spacing.md).toBe('var(--spacing-md)');
  });

  it('has a borderRadius object with all 4 keys', () => {
    expect(Object.keys(tailwindThemePreset.borderRadius)).toHaveLength(4);
    expect(tailwindThemePreset.borderRadius.pill).toBe('var(--radius-pill)');
  });

  it('has a fontSize object with all 4 keys', () => {
    expect(Object.keys(tailwindThemePreset.fontSize)).toHaveLength(4);
    expect(tailwindThemePreset.fontSize.title).toBe('var(--font-title)');
  });

  it('every value is a var() reference', () => {
    const allValues = [
      ...Object.values(tailwindThemePreset.colors),
      ...Object.values(tailwindThemePreset.spacing),
      ...Object.values(tailwindThemePreset.borderRadius),
      ...Object.values(tailwindThemePreset.fontSize),
    ];
    for (const v of allValues) {
      expect(v).toMatch(/^var\(--[\w-]+\)$/);
    }
  });
});
