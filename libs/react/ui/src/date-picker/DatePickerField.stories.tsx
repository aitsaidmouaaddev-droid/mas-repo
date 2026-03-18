import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DatePickerField,
  DesktopDatePickerField,
  MobileDatePickerField,
  StaticDatePickerField,
} from './DatePickerField';

const meta: Meta<typeof DatePickerField> = {
  title: 'Calendar/DatePickerField',
  component: DatePickerField,
};
export default meta;
type Story = StoryObj<typeof DatePickerField>;

const DefaultDemo = (args: Partial<React.ComponentProps<typeof DatePickerField>>) => {
  const [value, setValue] = useState<Date | null>(null);
  return <DatePickerField {...args} value={value} onChange={setValue} />;
};

const WithHintDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePickerField
      label="Appointment date"
      hint="Select a date within the next 30 days"
      value={value}
      onChange={setValue}
      minDate={new Date()}
    />
  );
};

const WithErrorDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePickerField
      label="Departure date"
      errorText="Date is required"
      value={value}
      onChange={setValue}
    />
  );
};

const PreselectedDemo = () => {
  const [value, setValue] = useState<Date | null>(new Date(2024, 2, 15));
  return (
    <DatePickerField
      label="Selected date"
      value={value}
      onChange={setValue}
      displayFormat="MMMM d, yyyy"
    />
  );
};

const DesktopVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <DesktopDatePickerField label="Desktop picker" value={value} onChange={setValue} />;
};

const MobileVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <MobileDatePickerField label="Mobile picker" value={value} onChange={setValue} />;
};

const StaticVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div>
      <StaticDatePickerField
        label="Pick a date"
        value={value}
        onChange={setValue}
        hint="Always visible — no popover"
      />
      <p style={{ marginTop: 8, fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)' }}>
        Selected: {value ? value.toDateString() : 'none'}
      </p>
    </div>
  );
};

const WithMinMaxDateDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  const today = new Date();
  const min = new Date(today.getFullYear(), today.getMonth(), 1);
  const max = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return (
    <DatePickerField
      label="This month only"
      value={value}
      onChange={setValue}
      minDate={min}
      maxDate={max}
      hint="Only dates within the current month are selectable"
    />
  );
};

export const Default: Story = {
  args: { label: 'Date of birth', displayFormat: 'dd/MM/yyyy' },
  render: (args) => <DefaultDemo {...args} />,
};

export const WithHint: Story = { render: () => <WithHintDemo /> };
export const WithError: Story = { render: () => <WithErrorDemo /> };
export const Preselected: Story = { render: () => <PreselectedDemo /> };
export const Disabled: Story = {
  args: { label: 'Locked date', disabled: true, value: new Date(2024, 0, 1) },
};
export const DesktopVariant: Story = { render: () => <DesktopVariantDemo /> };
export const MobileVariant: Story = { render: () => <MobileVariantDemo /> };
export const StaticVariant: Story = { render: () => <StaticVariantDemo /> };
export const WithMinMaxDate: Story = { render: () => <WithMinMaxDateDemo /> };
