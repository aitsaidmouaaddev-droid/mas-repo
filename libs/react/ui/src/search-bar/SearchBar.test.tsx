import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    render(<SearchBar testId="sb" value="" onChange={vi.fn()} placeholder="Search..." />);
    const input = screen.getByTestId('sb').querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Search...');
  });

  it('calls onChange on input', () => {
    const onChange = vi.fn();
    render(<SearchBar testId="sb" value="" onChange={onChange} />);
    const input = screen.getByTestId('sb').querySelector('input');
    expect(input).toBeTruthy();
    fireEvent.change(input as HTMLInputElement, {
      target: { value: 'test' },
    });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('shows clear button when value is present', () => {
    render(<SearchBar testId="sb" value="hello" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar testId="sb" value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText('Clear search')).toBeNull();
  });

  it('clears on clear button click', () => {
    const onChange = vi.fn();
    render(<SearchBar testId="sb" value="hello" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
