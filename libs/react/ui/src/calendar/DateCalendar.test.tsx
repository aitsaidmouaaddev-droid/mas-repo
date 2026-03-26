import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateCalendar } from './DateCalendar';

const MARCH_2024 = new Date(2024, 2, 15); // March 2024, selected on 15th

describe('DateCalendar', () => {
  it('renders the current month name and year', () => {
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} value={null} />);
    expect(screen.getByText('March')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders day-of-week headers (Mon–Sun by default)', () => {
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} />);
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Su')).toBeInTheDocument();
  });

  it('renders Sun-first headers when weekStartsOn=0', () => {
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} weekStartsOn={0} />);
    const headers = screen.getAllByText(/^(Su|Mo|Tu|We|Th|Fr|Sa)$/);
    expect(headers[0].textContent).toBe('Su');
  });

  it('calls onChange when a day is clicked', () => {
    const onChange = vi.fn();
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} onChange={onChange} />);
    // click "10" inside March
    fireEvent.click(screen.getByLabelText('March 10th, 2024'));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('does not call onChange for disabled days (before minDate)', () => {
    const onChange = vi.fn();
    render(
      <DateCalendar
        month={MARCH_2024}
        onMonthChange={vi.fn()}
        onChange={onChange}
        minDate={new Date(2024, 2, 20)}
      />,
    );
    fireEvent.click(screen.getByLabelText('March 5th, 2024'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('navigates to next month on right chevron click', () => {
    const onMonthChange = vi.fn();
    render(<DateCalendar month={MARCH_2024} onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(onMonthChange).toHaveBeenCalledOnce();
    const next = onMonthChange.mock.calls[0][0] as Date;
    expect(next.getMonth()).toBe(3); // April
  });

  it('navigates to previous month on left chevron click', () => {
    const onMonthChange = vi.fn();
    render(<DateCalendar month={MARCH_2024} onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(onMonthChange).toHaveBeenCalledOnce();
    const prev = onMonthChange.mock.calls[0][0] as Date;
    expect(prev.getMonth()).toBe(1); // February
  });

  it('switches to months view when month button is clicked', () => {
    const onViewChange = vi.fn();
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} onViewChange={onViewChange} />);
    fireEvent.click(screen.getByText('March'));
    expect(onViewChange).toHaveBeenCalledWith('months');
  });

  it('switches to years view when year button is clicked', () => {
    const onViewChange = vi.fn();
    render(<DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} onViewChange={onViewChange} />);
    fireEvent.click(screen.getByText('2024'));
    expect(onViewChange).toHaveBeenCalledWith('years');
  });

  it('renders month grid in months view', () => {
    render(
      <DateCalendar
        month={MARCH_2024}
        onMonthChange={vi.fn()}
        view="months"
        onViewChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });

  it('navigates to days view when month cell is clicked', () => {
    const onViewChange = vi.fn();
    render(
      <DateCalendar
        month={MARCH_2024}
        onMonthChange={vi.fn()}
        view="months"
        onViewChange={onViewChange}
      />,
    );
    fireEvent.click(screen.getByText('Jun'));
    expect(onViewChange).toHaveBeenCalledWith('days');
  });

  it('renders year grid in years view', () => {
    render(
      <DateCalendar
        month={MARCH_2024}
        onMonthChange={vi.fn()}
        view="years"
        onViewChange={vi.fn()}
      />,
    );
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Select year')).toBeInTheDocument();
  });

  it('calls onRangeChange in range mode', () => {
    const onRangeChange = vi.fn();
    render(
      <DateCalendar
        month={MARCH_2024}
        onMonthChange={vi.fn()}
        selectionMode="range"
        onRangeChange={onRangeChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('March 5th, 2024'));
    expect(onRangeChange).toHaveBeenCalledOnce();
  });

  it('marks selected day with accessible aria-label', () => {
    render(
      <DateCalendar month={MARCH_2024} onMonthChange={vi.fn()} value={new Date(2024, 2, 15)} />,
    );
    const btn = screen.getByLabelText('March 15th, 2024');
    expect(btn).toBeInTheDocument();
  });
});
