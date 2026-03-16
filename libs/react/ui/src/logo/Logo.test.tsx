import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  it('renders an image with the correct src and alt', () => {
    render(<Logo src="/logo.png" alt="My Logo" testId="logo" />);
    const container = screen.getByTestId('logo');
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/logo.png');
    expect(img?.getAttribute('alt')).toBe('My Logo');
  });

  it('applies the default size', () => {
    render(<Logo src="/logo.png" testId="logo" />);
    const img = screen.getByTestId('logo').querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.style.width).toBe('120px');
    expect(img?.style.height).toBe('120px');
  });

  it('applies a custom size', () => {
    render(<Logo src="/logo.png" size={80} testId="logo" />);
    const img = screen.getByTestId('logo').querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.style.width).toBe('80px');
    expect(img?.style.height).toBe('80px');
  });

  it('sets CSS custom properties for animation', () => {
    render(
      <Logo
        src="/logo.png"
        animation={{ scaleFrom: 0.9, scaleTo: 1.1, duration: 500 }}
        testId="logo"
      />,
    );
    const img = screen.getByTestId('logo').querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.style.getPropertyValue('--logo-scale-from')).toBe('0.9');
    expect(img?.style.getPropertyValue('--logo-scale-to')).toBe('1.1');
    expect(img?.style.getPropertyValue('--logo-duration')).toBe('500ms');
  });

  it('defaults animation values when not provided', () => {
    render(<Logo src="/logo.png" testId="logo" />);
    const img = screen.getByTestId('logo').querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.style.getPropertyValue('--logo-scale-from')).toBe('1');
    expect(img?.style.getPropertyValue('--logo-scale-to')).toBe('1.05');
    expect(img?.style.getPropertyValue('--logo-duration')).toBe('1200ms');
  });
});
