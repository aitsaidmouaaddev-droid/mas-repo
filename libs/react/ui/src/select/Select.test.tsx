import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Select', () => {
  it('renders with placeholder', () => {
    render(<Select options={options} value="" onSelect={vi.fn()} testId="sel" />);
    expect(screen.getByTestId('sel')).toHaveTextContent('Select...');
  });

  it('shows selected value label', () => {
    render(<Select options={options} value="banana" onSelect={vi.fn()} testId="sel" />);
    expect(screen.getByTestId('sel')).toHaveTextContent('Banana');
  });

  it('opens menu on click', () => {
    render(<Select options={options} value="" onSelect={vi.fn()} testId="sel" />);
    fireEvent.click(screen.getByTestId('sel'));
    expect(screen.getByTestId('select-menu')).toBeTruthy();
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.getByText('Cherry')).toBeTruthy();
  });

  it('calls onSelect and closes on option click', () => {
    const onSelect = vi.fn();
    render(<Select options={options} value="" onSelect={onSelect} testId="sel" />);
    fireEvent.click(screen.getByTestId('sel'));
    fireEvent.click(screen.getByText('Cherry'));
    expect(onSelect).toHaveBeenCalledWith('cherry');
    expect(screen.queryByTestId('select-menu')).toBeNull();
  });

  it('supports multiple selection', () => {
    const onSelect = vi.fn();
    render(
      <Select options={options} value={['apple']} onSelect={onSelect} multiple testId="sel" />,
    );
    fireEvent.click(screen.getByTestId('sel'));
    fireEvent.click(screen.getByText('Banana'));
    expect(onSelect).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('closes on overlay click', () => {
    render(<Select options={options} value="" onSelect={vi.fn()} testId="sel" />);
    fireEvent.click(screen.getByTestId('sel'));
    expect(screen.getByTestId('select-menu')).toBeTruthy();
    fireEvent.click(screen.getByTestId('select-overlay'));
    expect(screen.queryByTestId('select-menu')).toBeNull();
  });

  it('closes on Escape key', () => {
    render(<Select options={options} value="" onSelect={vi.fn()} testId="sel" />);
    fireEvent.click(screen.getByTestId('sel'));
    expect(screen.getByTestId('select-menu')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('select-menu')).toBeNull();
  });
});
