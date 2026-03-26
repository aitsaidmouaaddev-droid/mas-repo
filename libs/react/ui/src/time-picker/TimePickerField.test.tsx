import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimePickerField, StaticTimePickerField } from './TimePickerField';

describe('TimePickerField', () => {
  it('renders label', () => {
    render(<TimePickerField label="Start time" testId="tp" />);
    expect(screen.getByText('Start time')).toBeInTheDocument();
  });

  it('shows empty input when no value', () => {
    render(<TimePickerField testId="tp" />);
    const input = screen.getByTestId('tp').querySelector('input');
    expect(input?.value).toBe('');
  });

  it('displays 24h formatted time', () => {
    const date = new Date(2024, 0, 1, 14, 30);
    render(<TimePickerField value={date} testId="tp" />);
    const input = screen.getByTestId('tp').querySelector('input');
    expect(input?.value).toBe('14:30');
  });

  it('displays 12h formatted time', () => {
    const date = new Date(2024, 0, 1, 14, 30);
    render(<TimePickerField value={date} use12Hours testId="tp" />);
    const input = screen.getByTestId('tp').querySelector('input');
    expect(input?.value).toBe('02:30 PM');
  });

  it('renders hint text', () => {
    render(<TimePickerField hint="Pick a time" testId="tp" />);
    expect(screen.getByText('Pick a time')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(<TimePickerField errorText="Required" testId="tp" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('opens clock popover on click (desktop)', () => {
    render(<TimePickerField testId="tp" variant="desktop" />);
    fireEvent.click(screen.getByTestId('tp').querySelector('input')!);
    // MultiSectionDigitalClock renders data-item buttons for hours+minutes
    expect(document.querySelectorAll('button[data-item]').length).toBeGreaterThan(0);
  });

  it('does not open when disabled', () => {
    render(<TimePickerField testId="tp" variant="desktop" disabled />);
    fireEvent.click(screen.getByTestId('tp').querySelector('input')!);
    expect(screen.queryByText('00')).toBeNull();
  });

  it('shows clear button when value is set', () => {
    const date = new Date(2024, 0, 1, 9, 0);
    render(<TimePickerField value={date} clearable testId="tp" />);
    expect(screen.getByLabelText('Clear time')).toBeInTheDocument();
  });

  it('calls onChange(null) on clear', () => {
    const onChange = vi.fn();
    const date = new Date(2024, 0, 1, 9, 0);
    render(<TimePickerField value={date} onChange={onChange} clearable testId="tp" />);
    fireEvent.click(screen.getByLabelText('Clear time'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange when a time is changed', () => {
    const onChange = vi.fn();
    const date = new Date(2024, 0, 1, 9, 0);
    render(<TimePickerField value={date} onChange={onChange} variant="desktop" testId="tp" />);
    fireEvent.click(screen.getByTestId('tp').querySelector('input')!);
    // '45' is > 23 → unique to the minutes column
    fireEvent.click(screen.getByText('45'));
    expect(onChange).toHaveBeenCalledOnce();
  });
});

describe('StaticTimePickerField', () => {
  it('renders clock inline', () => {
    render(<StaticTimePickerField testId="stp" />);
    expect(document.querySelectorAll('button[data-item]').length).toBeGreaterThan(0);
  });

  it('renders label when provided', () => {
    render(<StaticTimePickerField label="Time" testId="stp" />);
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('calls onChange when time changes', () => {
    const onChange = vi.fn();
    render(<StaticTimePickerField onChange={onChange} testId="stp" />);
    // '45' is > 23 → unique to the minutes column
    fireEvent.click(screen.getByText('45'));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
