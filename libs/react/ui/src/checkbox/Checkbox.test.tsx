import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox testId="cb" label="Accept" />);
    const input = screen.getByTestId('cb').querySelector('input');
    expect(input).not.toBeChecked();
  });

  it('renders checked state', () => {
    render(<Checkbox testId="cb" checked label="Accept" />);
    const input = screen.getByTestId('cb').querySelector('input');
    expect(input).toBeChecked();
  });

  it('calls onChange on click', () => {
    const onChange = vi.fn();
    render(<Checkbox testId="cb" onChange={onChange} />);
    const input = screen.getByTestId('cb').querySelector('input');
    expect(input).toBeTruthy();
    fireEvent.click(input as HTMLInputElement);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Checkbox testId="cb" disabled onChange={onChange} />);
    const input = screen.getByTestId('cb').querySelector('input');
    expect(input).toBeTruthy();
    fireEvent.click(input as HTMLInputElement);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays label text', () => {
    render(<Checkbox testId="cb" label="I agree" />);
    expect(screen.getByTestId('cb')).toHaveTextContent('I agree');
  });
});
