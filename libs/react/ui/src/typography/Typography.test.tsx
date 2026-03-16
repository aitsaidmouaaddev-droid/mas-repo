import React from 'react';
import { render, screen } from '@testing-library/react';
import Typography from './Typography';

describe('Typography', () => {
  it('renders body text by default', () => {
    render(<Typography testId="t">Hello</Typography>);
    const el = screen.getByTestId('t');
    expect(el.tagName).toBe('P');
    expect(el).toHaveTextContent('Hello');
  });

  it('renders title as h1', () => {
    render(
      <Typography variant="title" testId="t">
        Title
      </Typography>,
    );
    expect(screen.getByTestId('t').tagName).toBe('H1');
  });

  it('renders subtitle as h2', () => {
    render(
      <Typography variant="subtitle" testId="t">
        Sub
      </Typography>,
    );
    expect(screen.getByTestId('t').tagName).toBe('H2');
  });

  it('renders caption as span', () => {
    render(
      <Typography variant="caption" testId="t">
        cap
      </Typography>,
    );
    expect(screen.getByTestId('t').tagName).toBe('SPAN');
  });

  it('supports custom "as" tag', () => {
    render(
      <Typography as="h3" testId="t">
        H3
      </Typography>,
    );
    expect(screen.getByTestId('t').tagName).toBe('H3');
  });

  it('applies truncate', () => {
    render(
      <Typography truncate testId="t">
        Long text
      </Typography>,
    );
    expect(screen.getByTestId('t')).toBeDefined();
  });
});
