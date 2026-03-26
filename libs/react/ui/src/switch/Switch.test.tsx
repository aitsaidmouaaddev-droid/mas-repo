import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

describe('Switch', () => {
  it('renders off by default', () => {
    render(<Switch testId="sw" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('renders on when on=true', () => {
    render(<Switch testId="sw" on />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onChange on toggle', () => {
    const onChange = vi.fn();
    render(<Switch testId="sw" onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Switch testId="sw" disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays label', () => {
    render(<Switch testId="sw" label="Dark mode" />);
    expect(screen.getByTestId('sw')).toHaveTextContent('Dark mode');
  });
});
