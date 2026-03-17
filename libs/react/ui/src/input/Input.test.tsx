import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import { FiSearch } from 'react-icons/fi';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input testId="inp" placeholder="Type..." />);
    expect(screen.getByTestId('inp')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Input testId="inp" onChange={onChange} />);
    fireEvent.change(screen.getByTestId('inp'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input testId="inp" disabled />);
    expect(screen.getByTestId('inp')).toBeDisabled();
  });

  it('renders with start icon', () => {
    const { container } = render(<Input testId="inp" startIcon={FiSearch} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} testId="inp" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
