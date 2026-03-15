import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" testId="btn" />);
    expect(screen.getByTestId('btn')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Go" testId="btn" onClick={onClick} />);
    fireEvent.click(screen.getByTestId('btn'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button label="Go" testId="btn" disabled onClick={onClick} />);
    fireEvent.click(screen.getByTestId('btn'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders start and end icons', () => {
    render(<Button label="Submit" startIcon={FiCheck} endIcon={FiArrowRight} testId="btn" />);
    const btn = screen.getByTestId('btn');
    const svgs = btn.querySelectorAll('svg');
    expect(svgs.length).toBe(2);
  });

  it('renders icon-only when no label is provided', () => {
    render(<Button startIcon={FiCheck} testId="btn" />);
    const btn = screen.getByTestId('btn');
    expect(btn.querySelectorAll('svg').length).toBe(1);
    expect(btn.textContent).toBe('');
  });

  it('applies disabled class', () => {
    render(<Button label="Disabled" testId="btn" disabled />);
    expect(screen.getByTestId('btn')).toBeDisabled();
  });
});
