import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TypedText from './TypedText';

describe('TypedText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with testId', () => {
    render(<TypedText strings={['Hello']} testId="tt" />);
    expect(screen.getByTestId('tt')).toBeInTheDocument();
  });

  it('initially shows empty text', () => {
    render(<TypedText strings={['Hello']} testId="tt" />);
    // The span should exist but display text is empty before any timer fires
    expect(screen.getByTestId('tt').textContent).toBe('');
  });

  it('types characters over time', () => {
    render(<TypedText strings={['React']} typeSpeed={80} testId="tt" />);

    // Advance enough time for several characters to be typed
    // Each character takes 80ms, so after 400ms we should have ~5 characters
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(80);
      });
    }

    const text = screen.getByTestId('tt').textContent ?? '';
    expect(text.length).toBeGreaterThan(0);
    expect('React'.startsWith(text) || text === 'React').toBe(true);
  });
});
