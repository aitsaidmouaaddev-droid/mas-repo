import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxGroup from './CheckboxGroup';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

describe('CheckboxGroup', () => {
  it('renders all options', () => {
    render(<CheckboxGroup options={options} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<CheckboxGroup options={options} label="Pick items" />);
    expect(screen.getByText('Pick items')).toBeInTheDocument();
  });

  it('calls onChange adding value', () => {
    const fn = vi.fn();
    render(<CheckboxGroup options={options} value={['a']} onChange={fn} />);
    fireEvent.click(screen.getByText('Beta'));
    expect(fn).toHaveBeenCalledWith(['a', 'b']);
  });

  it('calls onChange removing value', () => {
    const fn = vi.fn();
    render(<CheckboxGroup options={options} value={['a', 'b']} onChange={fn} />);
    fireEvent.click(screen.getByText('Alpha'));
    expect(fn).toHaveBeenCalledWith(['b']);
  });

  it('has group role', () => {
    render(<CheckboxGroup options={options} />);
    const groups = screen.getAllByRole('group');
    expect(groups.length).toBeGreaterThanOrEqual(1);
  });

  it('applies testId', () => {
    render(<CheckboxGroup options={options} testId="cbg" />);
    expect(screen.getByTestId('cbg')).toBeInTheDocument();
  });
});
