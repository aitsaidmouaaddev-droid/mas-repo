import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateCalendar } from './DateCalendar';

const meta: Meta<typeof DateCalendar> = {
  title: 'Calendar/DateCalendar',
  component: DateCalendar,
};
export default meta;
type Story = StoryObj<typeof DateCalendar>;

const SingleDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  return (
    <div style={{ display: 'inline-block' }}>
      <DateCalendar
        value={value}
        onChange={setValue}
        month={month}
        onMonthChange={setMonth}
        view={view}
        onViewChange={setView}
      />
      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)', marginTop: 8 }}>
        Selected: {value ? value.toDateString() : 'none'}
      </p>
    </div>
  );
};

const RangeDemo = () => {
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [phase, setPhase] = useState<'start' | 'end'>('start');

  const handleRange = (d: Date) => {
    if (phase === 'start') {
      setRangeStart(d);
      setRangeEnd(null);
      setPhase('end');
    } else {
      setRangeEnd(d);
      setPhase('start');
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <DateCalendar
        selectionMode="range"
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onRangeChange={handleRange}
        month={month}
        onMonthChange={setMonth}
        view={view}
        onViewChange={setView}
      />
      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)', marginTop: 8 }}>
        {phase === 'start' ? 'Click start date' : 'Click end date'} —{' '}
        {rangeStart?.toDateString() ?? '–'} → {rangeEnd?.toDateString() ?? '–'}
      </p>
    </div>
  );
};

const MonthsViewDemo = () => {
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('months');
  return <DateCalendar month={month} onMonthChange={setMonth} view={view} onViewChange={setView} />;
};

const YearsViewDemo = () => {
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('years');
  return <DateCalendar month={month} onMonthChange={setMonth} view={view} onViewChange={setView} />;
};

export const Single: Story = { render: () => <SingleDemo /> };
export const RangeSelection: Story = { render: () => <RangeDemo /> };
export const MonthsView: Story = { render: () => <MonthsViewDemo /> };
export const YearsView: Story = { render: () => <YearsViewDemo /> };

const WithMinMaxDateDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  return (
    <div style={{ display: 'inline-block' }}>
      <DateCalendar
        value={value}
        onChange={setValue}
        month={month}
        onMonthChange={setMonth}
        view={view}
        onViewChange={setView}
        minDate={minDate}
        maxDate={maxDate}
      />
      <p
        style={{
          fontSize: 'var(--font-caption)',
          color: 'var(--color-muted-text)',
          marginTop: 8,
        }}
      >
        Only ±7 days from today are selectable.
      </p>
    </div>
  );
};

const SundayStartDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  return (
    <DateCalendar
      value={value}
      onChange={setValue}
      month={month}
      onMonthChange={setMonth}
      view={view}
      onViewChange={setView}
      weekStartsOn={0}
    />
  );
};

export const WithMinMaxDate: Story = { render: () => <WithMinMaxDateDemo /> };
export const SundayStart: Story = { render: () => <SundayStartDemo /> };
