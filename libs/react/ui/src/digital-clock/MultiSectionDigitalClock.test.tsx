import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSectionDigitalClock } from './MultiSectionDigitalClock';

/** Total buttons with data-item attribute (all hour + minute + optional AM/PM cells). */
const dataItemCount = () => document.querySelectorAll('button[data-item]').length;

describe('MultiSectionDigitalClock', () => {
  it('renders hours and minutes columns', () => {
    // hours=9, minutes=45 — '09' appears in both columns, but '45'>23 so unique to minutes
    render(<MultiSectionDigitalClock hours={9} minutes={45} onChange={vi.fn()} />);
    expect(screen.getAllByText('09').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('45')).toBeInTheDocument(); // 45 > 23 → only in minutes
  });

  it('renders 24 hour options in 24h mode', () => {
    render(<MultiSectionDigitalClock hours={0} minutes={0} onChange={vi.fn()} />);
    // 24 hours + 60 minutes = 84 data-item buttons
    expect(dataItemCount()).toBe(84);
    // '59' only appears in minutes (> 23)
    expect(screen.getByText('59')).toBeInTheDocument();
  });

  it('renders 12 hour options in 12h mode', () => {
    render(<MultiSectionDigitalClock hours={3} minutes={0} onChange={vi.fn()} use12Hours />);
    // 12 hours + 60 minutes + 2 AM/PM = 74 data-item buttons
    expect(dataItemCount()).toBe(74);
    // 12h mode: hours go 01–12, so '00' only appears in minutes
    expect(screen.getAllByText('00').length).toBe(1);
  });

  it('renders AM/PM column when use12Hours=true', () => {
    render(
      <MultiSectionDigitalClock hours={9} minutes={0} ampm="AM" onChange={vi.fn()} use12Hours />,
    );
    expect(screen.getByText('AM')).toBeInTheDocument();
    expect(screen.getByText('PM')).toBeInTheDocument();
  });

  it('does not render AM/PM column when use12Hours=false', () => {
    render(<MultiSectionDigitalClock hours={9} minutes={0} onChange={vi.fn()} />);
    expect(screen.queryByText('AM')).toBeNull();
    expect(screen.queryByText('PM')).toBeNull();
  });

  it('calls onChange with new hours when hour is clicked', () => {
    const onChange = vi.fn();
    render(<MultiSectionDigitalClock hours={9} minutes={30} onChange={onChange} />);
    // '20' appears in hours column first (DOM order), also in minutes
    const all20 = screen.getAllByText('20');
    fireEvent.click(all20[0]); // hours column is first in DOM
    expect(onChange).toHaveBeenCalledOnce();
    const [h, m] = onChange.mock.calls[0] as [number, number];
    expect(h).toBe(20);
    expect(m).toBe(30);
  });

  it('calls onChange with new minutes when minute is clicked', () => {
    const onChange = vi.fn();
    render(<MultiSectionDigitalClock hours={9} minutes={30} onChange={onChange} />);
    // '45' only appears in the minutes column (45 > 23)
    fireEvent.click(screen.getByText('45'));
    expect(onChange).toHaveBeenCalledOnce();
    const [h, m] = onChange.mock.calls[0] as [number, number];
    expect(h).toBe(9);
    expect(m).toBe(45);
  });

  it('respects minutesStep — renders only multiples of step', () => {
    render(<MultiSectionDigitalClock hours={0} minutes={0} onChange={vi.fn()} minutesStep={15} />);
    // 24 hours + 4 minutes (0,15,30,45) = 28 data-item buttons
    expect(dataItemCount()).toBe(28);
    // '45' present (>23, unique to minutes)
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('converts PM hour on AM/PM toggle', () => {
    const onChange = vi.fn();
    render(
      <MultiSectionDigitalClock hours={9} minutes={0} ampm="AM" onChange={onChange} use12Hours />,
    );
    fireEvent.click(screen.getByText('PM'));
    expect(onChange).toHaveBeenCalledOnce();
    const [h] = onChange.mock.calls[0] as [number];
    expect(h).toBe(21); // 9 AM → 9 PM = 21:00
  });

  it('disables all buttons when disabled=true', () => {
    render(<MultiSectionDigitalClock hours={9} minutes={0} onChange={vi.fn()} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
