import type { ThemeTokens } from '@mas/shared/types';
import { applyTheme, removeTheme } from './apply-theme';

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
// applyTheme
// ---------------------------------------------------------------------------

describe('applyTheme', () => {
  const theme = makeTheme('dark');

  beforeEach(() => {
    // Reset :root inline styles between tests
    document.documentElement.removeAttribute('style');
  });

  it('sets --theme-mode', () => {
    applyTheme(theme);
    expect(document.documentElement.style.getPropertyValue('--theme-mode')).toBe('dark');
  });

  it('sets color variables in kebab-case', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--color-primary')).toBe('#6200ea');
    expect(s.getPropertyValue('--color-on-surface')).toBe('#ffffff');
    expect(s.getPropertyValue('--color-muted-text')).toBe('#888888');
    expect(s.getPropertyValue('--color-background')).toBe('#f5f5f5');
  });

  it('sets spacing variables with px suffix', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--spacing-xs')).toBe('4px');
    expect(s.getPropertyValue('--spacing-md')).toBe('16px');
    expect(s.getPropertyValue('--spacing-xl')).toBe('32px');
  });

  it('sets radius variables with px suffix', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--radius-sm')).toBe('4px');
    expect(s.getPropertyValue('--radius-pill')).toBe('9999px');
  });

  it('sets typography variables with px suffix', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--font-title')).toBe('24px');
    expect(s.getPropertyValue('--font-caption')).toBe('12px');
  });

  it('can target a specific element', () => {
    const div = document.createElement('div');
    applyTheme(theme, div);
    expect(div.style.getPropertyValue('--color-primary')).toBe('#6200ea');
    // :root should remain untouched
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
  });

  it('overwrites when called again with a different theme', () => {
    applyTheme(theme);
    expect(document.documentElement.style.getPropertyValue('--theme-mode')).toBe('dark');

    const light = makeTheme('light');
    light.colors.primary = '#bb86fc';
    applyTheme(light);
    expect(document.documentElement.style.getPropertyValue('--theme-mode')).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#bb86fc');
  });

  it('sets all color variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    const expectedColors = [
      'on-surface',
      'shadow',
      'background',
      'surface',
      'surface-elevated',
      'text',
      'muted-text',
      'primary',
      'secondary',
      'accent',
      'danger',
      'success',
      'warning',
      'info',
      'border',
      'track',
    ];
    for (const c of expectedColors) {
      expect(s.getPropertyValue(`--color-${c}`)).not.toBe('');
    }
  });

  it('sets scale variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--scale-primary-50')).toBe('#fafafa');
    expect(s.getPropertyValue('--scale-primary-900')).toBe('#212121');
    expect(s.getPropertyValue('--scale-neutral-500')).toBe('#9e9e9e');
  });

  it('sets transition variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--transition-fast')).toBe('120ms');
    expect(s.getPropertyValue('--transition-normal')).toBe('200ms');
    expect(s.getPropertyValue('--transition-easing')).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('sets all 5 spacing variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    for (const key of ['xs', 'sm', 'md', 'lg', 'xl']) {
      expect(s.getPropertyValue(`--spacing-${key}`)).not.toBe('');
    }
  });

  it('sets all 4 radius variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    for (const key of ['sm', 'md', 'lg', 'pill']) {
      expect(s.getPropertyValue(`--radius-${key}`)).not.toBe('');
    }
  });

  it('sets all 4 typography variables', () => {
    applyTheme(theme);
    const s = document.documentElement.style;
    for (const key of ['title', 'subtitle', 'body', 'caption']) {
      expect(s.getPropertyValue(`--font-${key}`)).not.toBe('');
    }
  });
});

// ---------------------------------------------------------------------------
// removeTheme
// ---------------------------------------------------------------------------

describe('removeTheme', () => {
  const theme = makeTheme();

  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('removes all variables set by applyTheme', () => {
    applyTheme(theme);
    // Sanity — variables exist
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#6200ea');

    removeTheme(theme);
    const s = document.documentElement.style;
    expect(s.getPropertyValue('--theme-mode')).toBe('');
    expect(s.getPropertyValue('--color-primary')).toBe('');
    expect(s.getPropertyValue('--spacing-md')).toBe('');
    expect(s.getPropertyValue('--radius-sm')).toBe('');
    expect(s.getPropertyValue('--font-title')).toBe('');
  });

  it('removes from a specific element', () => {
    const div = document.createElement('div');
    applyTheme(theme, div);
    expect(div.style.getPropertyValue('--color-primary')).toBe('#6200ea');

    removeTheme(theme, div);
    expect(div.style.getPropertyValue('--color-primary')).toBe('');
  });
});
