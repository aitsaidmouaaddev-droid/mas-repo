import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from './Divider';

describe('Divider', () => {
  it('renders horizontal separator', () => {
    render(<Divider testId="d" />);
    const el = screen.getByTestId('d');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('HR');
  });

  it('renders vertical separator', () => {
    render(<Divider testId="d" direction="vertical" />);
    expect(screen.getByTestId('d')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Divider testId="d" label="OR" />);
    expect(screen.getByTestId('d')).toHaveTextContent('OR');
  });
});
