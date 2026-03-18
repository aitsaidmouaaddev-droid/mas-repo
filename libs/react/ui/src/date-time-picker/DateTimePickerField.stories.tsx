import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DateTimePickerField,
  DesktopDateTimePickerField,
  MobileDateTimePickerField,
  StaticDateTimePickerField,
} from './DateTimePickerField';

const meta: Meta<typeof DateTimePickerField> = {
  title: 'Calendar/DateTimePickerField',
  component: DateTimePickerField,
};
export default meta;
type Story = StoryObj<typeof DateTimePickerField>;

const DefaultDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <DateTimePickerField label="Event date & time" value={value} onChange={setValue} />;
};

const TwelveHourDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DateTimePickerField
      label="Appointment (12h)"
      value={value}
      onChange={setValue}
      use12Hours
      displayFormat="dd/MM/yyyy hh:mm aa"
    />
  );
};

const WithHintDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DateTimePickerField
      label="Meeting time"
      value={value}
      onChange={setValue}
      hint="Select date and time for the meeting"
    />
  );
};

const WithErrorDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DateTimePickerField
      label="Deadline"
      value={value}
      onChange={setValue}
      errorText="A date and time is required"
    />
  );
};

const PreselectedDemo = () => {
  const [value, setValue] = useState<Date | null>(new Date(2024, 2, 15, 14, 30));
  return <DateTimePickerField label="Pre-filled date time" value={value} onChange={setValue} />;
};

const FifteenMinuteStepsDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DateTimePickerField
      label="Slot time"
      value={value}
      onChange={setValue}
      minutesStep={15}
      hint="Minutes in 15-minute increments"
    />
  );
};

const DesktopVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DesktopDateTimePickerField label="Desktop datetime picker" value={value} onChange={setValue} />
  );
};

const MobileVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <MobileDateTimePickerField label="Mobile datetime picker" value={value} onChange={setValue} />
  );
};

const StaticVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div>
      <StaticDateTimePickerField label="Schedule" value={value} onChange={setValue} />
      <p style={{ marginTop: 8, fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)' }}>
        Selected: {value ? value.toLocaleString() : 'none'}
      </p>
    </div>
  );
};

export const Default: Story = { render: () => <DefaultDemo /> };
export const TwelveHour: Story = { render: () => <TwelveHourDemo /> };
export const WithHint: Story = { render: () => <WithHintDemo /> };
export const WithError: Story = { render: () => <WithErrorDemo /> };
export const Preselected: Story = { render: () => <PreselectedDemo /> };
export const Disabled: Story = {
  render: () => (
    <DateTimePickerField label="Read-only" value={new Date(2024, 0, 1, 10, 0)} disabled />
  ),
};
export const FifteenMinuteSteps: Story = { render: () => <FifteenMinuteStepsDemo /> };
export const DesktopVariant: Story = { render: () => <DesktopVariantDemo /> };
export const MobileVariant: Story = { render: () => <MobileVariantDemo /> };
export const StaticVariant: Story = { render: () => <StaticVariantDemo /> };
