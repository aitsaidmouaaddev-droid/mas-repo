import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePickerField, StaticDatePickerField } from './DatePickerField';

describe('DatePickerField', () => {
  it('renders label', () => {
    render(<DatePickerField label="Birthday" testId="dp" />);
    expect(screen.getByText('Birthday')).toBeInTheDocument();
  });

  it('renders empty placeholder when no value', () => {
    render(<DatePickerField label="Date" testId="dp" />);
    const input = screen.getByTestId('dp').querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input?.value).toBe('');
  });

  it('shows formatted value when value is provided', () => {
    const date = new Date(2024, 2, 15); // 15 Mar 2024
    render(<DatePickerField value={date} displayFormat="dd/MM/yyyy" testId="dp" />);
    const input = screen.getByTestId('dp').querySelector('input');
    expect(input?.value).toBe('15/03/2024');
  });

  it('renders hint text', () => {
    render(<DatePickerField hint="Pick a date" testId="dp" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders error text and hides hint', () => {
    render(<DatePickerField hint="Hint" errorText="Required" testId="dp" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).toBeNull();
  });

  it('opens calendar popover on input click (desktop variant)', () => {
    render(<DatePickerField label="Date" testId="dp" variant="desktop" />);
    const input = screen.getByTestId('dp').querySelector('input')!;
    fireEvent.click(input);
    // Calendar should appear (look for month/year)
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<DatePickerField label="Date" testId="dp" variant="desktop" disabled />);
    const input = screen.getByTestId('dp').querySelector('input')!;
    fireEvent.click(input);
    expect(screen.queryByLabelText(/Previous month/i)).toBeNull();
  });

  it('calls onChange when a date is selected', () => {
    const onChange = vi.fn();
    render(<DatePickerField onChange={onChange} variant="desktop" testId="dp" />);
    fireEvent.click(screen.getByTestId('dp').querySelector('input')!);
    // click the first non-disabled day button (text is a plain number)
    const dayBtns = Array.from(document.querySelectorAll('button[aria-label]')).filter(
      (b) => /^\d+$/.test(b.textContent?.trim() ?? '') && !b.disabled,
    );
    fireEvent.click(dayBtns[0]);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('shows clear button when value is set and clearable=true', () => {
    const date = new Date(2024, 2, 15);
    render(<DatePickerField value={date} clearable testId="dp" />);
    expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
  });

  it('calls onChange(null) when clear button is clicked', () => {
    const onChange = vi.fn();
    const date = new Date(2024, 2, 15);
    render(<DatePickerField value={date} onChange={onChange} clearable testId="dp" />);
    fireEvent.click(screen.getByLabelText('Clear date'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('does not show clear button when clearable=false', () => {
    const date = new Date(2024, 2, 15);
    render(<DatePickerField value={date} clearable={false} testId="dp" />);
    expect(screen.queryByLabelText('Clear date')).toBeNull();
  });
});

describe('StaticDatePickerField', () => {
  it('renders calendar inline without trigger', () => {
    render(<StaticDatePickerField testId="static" />);
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<StaticDatePickerField label="Choose date" testId="static" />);
    expect(screen.getByText('Choose date')).toBeInTheDocument();
  });

  it('calls onChange when a day is selected', () => {
    const onChange = vi.fn();
    render(<StaticDatePickerField onChange={onChange} testId="static" />);
    const dayBtns = Array.from(document.querySelectorAll('button[aria-label]')).filter(
      (b) => /^\d+$/.test(b.textContent?.trim() ?? '') && !b.disabled,
    );
    fireEvent.click(dayBtns[0]);
    expect(onChange).toHaveBeenCalled();
  });
});
