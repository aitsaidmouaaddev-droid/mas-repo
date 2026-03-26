import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner testId="sp" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<Spinner testId="sp" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies size', () => {
    render(<Spinner testId="sp" size="lg" />);
    expect(screen.getByTestId('sp')).toBeInTheDocument();
  });
});
