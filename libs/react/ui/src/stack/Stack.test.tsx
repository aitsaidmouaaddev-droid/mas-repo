import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stack from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('applies gap as inline style', () => {
    render(
      <Stack gap={24} testId="stk">
        <span>X</span>
      </Stack>,
    );
    expect(screen.getByTestId('stk').style.gap).toBe('24px');
  });

  it('applies testId', () => {
    render(
      <Stack testId="stk">
        <span>Y</span>
      </Stack>,
    );
    expect(screen.getByTestId('stk')).toBeInTheDocument();
  });
});
