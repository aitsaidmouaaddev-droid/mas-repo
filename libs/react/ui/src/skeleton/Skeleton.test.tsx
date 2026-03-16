import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    render(<Skeleton testId="sk" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies width and height', () => {
    render(<Skeleton testId="sk" width={200} height={40} />);
    const el = screen.getByTestId('sk');
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('40px');
  });

  it('renders circular variant', () => {
    render(<Skeleton testId="sk" variant="circular" width={48} height={48} />);
    expect(screen.getByTestId('sk')).toBeInTheDocument();
  });
});
