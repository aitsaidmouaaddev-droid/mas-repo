import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateTimePickerField, StaticDateTimePickerField } from './DateTimePickerField';

describe('DateTimePickerField', () => {
  it('renders label', () => {
    render(<DateTimePickerField label="Event time" testId="dtp" />);
    expect(screen.getByText('Event time')).toBeInTheDocument();
  });

  it('shows empty input when no value', () => {
    render(<DateTimePickerField testId="dtp" />);
    const input = screen.getByTestId('dtp').querySelector('input');
    expect(input?.value).toBe('');
  });

  it('displays formatted date and time', () => {
    const date = new Date(2024, 2, 15, 14, 30);
    render(<DateTimePickerField value={date} displayFormat="dd/MM/yyyy HH:mm" testId="dtp" />);
    const input = screen.getByTestId('dtp').querySelector('input');
    expect(input?.value).toBe('15/03/2024 14:30');
  });

  it('renders hint text', () => {
    render(<DateTimePickerField hint="Pick a date and time" testId="dtp" />);
    expect(screen.getByText('Pick a date and time')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(<DateTimePickerField errorText="Invalid" testId="dtp" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('opens picker on click (desktop)', () => {
    render(<DateTimePickerField testId="dtp" variant="desktop" />);
    fireEvent.click(screen.getByTestId('dtp').querySelector('input')!);
    // Both calendar nav and time clock should be present
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(document.querySelectorAll('button[data-item]').length).toBeGreaterThan(0);
  });

  it('does not open when disabled', () => {
    render(<DateTimePickerField testId="dtp" variant="desktop" disabled />);
    fireEvent.click(screen.getByTestId('dtp').querySelector('input')!);
    expect(screen.queryByLabelText(/Previous month/i)).toBeNull();
  });

  it('shows clear button when value is set', () => {
    render(<DateTimePickerField value={new Date()} clearable testId="dtp" />);
    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
  });

  it('calls onChange(null) on clear', () => {
    const onChange = vi.fn();
    render(<DateTimePickerField value={new Date()} onChange={onChange} clearable testId="dtp" />);
    fireEvent.click(screen.getByLabelText('Clear'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange when a date is selected', () => {
    const onChange = vi.fn();
    render(<DateTimePickerField onChange={onChange} variant="desktop" testId="dtp" />);
    fireEvent.click(screen.getByTestId('dtp').querySelector('input')!);
    const dayBtns = Array.from(document.querySelectorAll('button[aria-label]')).filter(
      (b) => /^\d+$/.test(b.textContent?.trim() ?? '') && !b.disabled,
    );
    fireEvent.click(dayBtns[0]);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('preserves time when only date changes', () => {
    const onChange = vi.fn();
    const initial = new Date(2024, 2, 10, 14, 30); // 10 Mar 2024 14:30
    render(
      <DateTimePickerField value={initial} onChange={onChange} variant="desktop" testId="dtp" />,
    );
    fireEvent.click(screen.getByTestId('dtp').querySelector('input')!);
    // Click a different day (20th of March 2024 is visible since month is fixed to initial value)
    fireEvent.click(screen.getByLabelText(/March 20/));
    expect(onChange).toHaveBeenCalledOnce();
    const result = onChange.mock.calls[0][0] as Date;
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });
});

describe('StaticDateTimePickerField', () => {
  it('renders both calendar and clock inline', () => {
    render(<StaticDateTimePickerField testId="sdtp" />);
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<StaticDateTimePickerField label="Scheduled at" testId="sdtp" />);
    expect(screen.getByText('Scheduled at')).toBeInTheDocument();
  });

  it('calls onChange when a date is clicked', () => {
    const onChange = vi.fn();
    render(<StaticDateTimePickerField onChange={onChange} testId="sdtp" />);
    const dayBtns = Array.from(document.querySelectorAll('button[aria-label]')).filter(
      (b) => /^\d+$/.test(b.textContent?.trim() ?? '') && !b.disabled,
    );
    fireEvent.click(dayBtns[0]);
    expect(onChange).toHaveBeenCalledOnce();
  });
});
