import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Radio from './Radio';

describe('Radio', () => {
  it('renders unselected by default', () => {
    render(<Radio value="a" testId="r" label="Option A" />);
    const input = screen.getByTestId('r').querySelector('input');
    expect(input).not.toBeChecked();
  });

  it('renders selected state', () => {
    render(<Radio value="a" testId="r" selected label="Option A" />);
    const input = screen.getByTestId('r').querySelector('input');
    expect(input).toBeChecked();
  });

  it('calls onChange with value', () => {
    const onChange = vi.fn();
    render(<Radio value="b" testId="r" onChange={onChange} />);
    const input = screen.getByTestId('r').querySelector('input');
    expect(input).toBeTruthy();
    fireEvent.click(input as HTMLInputElement);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Radio value="b" testId="r" disabled onChange={onChange} />);
    const input = screen.getByTestId('r').querySelector('input');
    expect(input).toBeTruthy();
    fireEvent.click(input as HTMLInputElement);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays label', () => {
    render(<Radio value="a" testId="r" label="Pick me" />);
    expect(screen.getByTestId('r')).toHaveTextContent('Pick me');
  });
});
