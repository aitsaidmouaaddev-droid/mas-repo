import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioGroup from './RadioGroup';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    render(<RadioGroup name="test" options={options} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RadioGroup name="test" options={options} label="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('calls onChange when option clicked', () => {
    const fn = vi.fn();
    render(<RadioGroup name="test" options={options} onChange={fn} />);
    fireEvent.click(screen.getByText('Beta'));
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('has radiogroup role', () => {
    render(<RadioGroup name="test" options={options} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('applies testId', () => {
    render(<RadioGroup name="test" options={options} testId="rg" />);
    expect(screen.getByTestId('rg')).toBeInTheDocument();
  });
});
