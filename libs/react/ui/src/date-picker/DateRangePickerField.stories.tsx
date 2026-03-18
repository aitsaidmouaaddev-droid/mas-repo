import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePickerField } from './DateRangePickerField';
import type { DateRange } from './DateRangePickerField';

const meta: Meta<typeof DateRangePickerField> = {
  title: 'Calendar/DateRangePickerField',
  component: DateRangePickerField,
};
export default meta;
type Story = StoryObj<typeof DateRangePickerField>;

const DefaultDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <DateRangePickerField value={range} onChange={setRange} />
      <p style={{ marginTop: 8, fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)' }}>
        {range.start?.toDateString() ?? '–'} → {range.end?.toDateString() ?? '–'}
      </p>
    </div>
  );
};

const CustomLabelsDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <DateRangePickerField
      value={range}
      onChange={setRange}
      startLabel="Check-in"
      endLabel="Check-out"
      hint="Hotel booking dates"
    />
  );
};

const PreselectedDemo = () => {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2024, 2, 5),
    end: new Date(2024, 2, 18),
  });
  return <DateRangePickerField value={range} onChange={setRange} />;
};

const WithErrorDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <DateRangePickerField value={range} onChange={setRange} errorText="A date range is required" />
  );
};

const WithMinMaxDateDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const today = new Date();
  return (
    <DateRangePickerField
      value={range}
      onChange={setRange}
      minDate={today}
      hint="Only future dates selectable"
    />
  );
};

export const Default: Story = { render: () => <DefaultDemo /> };
export const CustomLabels: Story = { render: () => <CustomLabelsDemo /> };
export const Preselected: Story = { render: () => <PreselectedDemo /> };
export const WithError: Story = { render: () => <WithErrorDemo /> };
export const Disabled: Story = {
  render: () => (
    <DateRangePickerField
      value={{ start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) }}
      disabled
    />
  ),
};
export const WithMinMaxDate: Story = { render: () => <WithMinMaxDateDemo /> };
