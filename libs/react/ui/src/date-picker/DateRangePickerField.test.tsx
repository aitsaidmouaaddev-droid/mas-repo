import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePickerField } from './DateRangePickerField';

describe('DateRangePickerField', () => {
  it('renders start and end labels', () => {
    render(<DateRangePickerField testId="rp" />);
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByText('End date')).toBeInTheDocument();
  });

  it('renders custom labels', () => {
    render(<DateRangePickerField startLabel="Check-in" endLabel="Check-out" testId="rp" />);
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('Check-out')).toBeInTheDocument();
  });

  it('renders formatted start and end dates', () => {
    const value = { start: new Date(2024, 2, 1), end: new Date(2024, 2, 15) };
    render(<DateRangePickerField value={value} displayFormat="dd/MM/yyyy" testId="rp" />);
    const inputs = screen.getByTestId('rp').querySelectorAll('input');
    expect(inputs[0].value).toBe('01/03/2024');
    expect(inputs[1].value).toBe('15/03/2024');
  });

  it('renders hint text', () => {
    render(<DateRangePickerField hint="Select a range" testId="rp" />);
    expect(screen.getByText('Select a range')).toBeInTheDocument();
  });

  it('renders error text and hides hint', () => {
    render(<DateRangePickerField hint="Hint" errorText="Invalid range" testId="rp" />);
    expect(screen.getByText('Invalid range')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).toBeNull();
  });

  it('opens calendar when start field is clicked', () => {
    render(<DateRangePickerField testId="rp" variant="desktop" />);
    const inputs = screen.getByTestId('rp').querySelectorAll('input');
    fireEvent.click(inputs[0]);
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<DateRangePickerField testId="rp" variant="desktop" disabled />);
    const inputs = screen.getByTestId('rp').querySelectorAll('input');
    fireEvent.click(inputs[0]);
    expect(screen.queryByLabelText(/Previous month/i)).toBeNull();
  });

  it('shows clear button when range has a start date', () => {
    const value = { start: new Date(2024, 2, 1), end: null };
    render(<DateRangePickerField value={value} clearable testId="rp" />);
    expect(screen.getByLabelText('Clear range')).toBeInTheDocument();
  });

  it('calls onChange({ start: null, end: null }) on clear', () => {
    const onChange = vi.fn();
    const value = { start: new Date(2024, 2, 1), end: new Date(2024, 2, 15) };
    render(<DateRangePickerField value={value} onChange={onChange} clearable testId="rp" />);
    fireEvent.click(screen.getByLabelText('Clear range'));
    expect(onChange).toHaveBeenCalledWith({ start: null, end: null });
  });

  it('does not show clear button when no dates set', () => {
    render(<DateRangePickerField value={{ start: null, end: null }} testId="rp" />);
    expect(screen.queryByLabelText('Clear range')).toBeNull();
  });

  it('calls onChange on first day click (sets start)', () => {
    const onChange = vi.fn();
    render(<DateRangePickerField onChange={onChange} testId="rp" variant="desktop" />);
    const inputs = screen.getByTestId('rp').querySelectorAll('input');
    fireEvent.click(inputs[0]);
    const dayBtns = Array.from(document.querySelectorAll('button[aria-label]')).filter(
      (b) => /^\d+$/.test(b.textContent?.trim() ?? '') && !b.disabled,
    );
    fireEvent.click(dayBtns[0]);
    expect(onChange).toHaveBeenCalledOnce();
    const result = onChange.mock.calls[0][0] as { start: Date | null; end: Date | null };
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeNull();
  });
});
