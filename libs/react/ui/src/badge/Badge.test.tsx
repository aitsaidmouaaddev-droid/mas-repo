import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge testId="b" label="New" />);
    expect(screen.getByTestId('b')).toHaveTextContent('New');
  });

  it('renders as dot without text', () => {
    render(<Badge testId="b" dot />);
    expect(screen.getByTestId('b')).toHaveTextContent('');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge testId="b" label="Ok" variant="success" />);
    expect(screen.getByTestId('b')).toBeInTheDocument();
    rerender(<Badge testId="b" label="Err" variant="error" />);
    expect(screen.getByTestId('b')).toHaveTextContent('Err');
  });
});
