import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TimePickerField,
  DesktopTimePickerField,
  MobileTimePickerField,
  StaticTimePickerField,
} from './TimePickerField';

const meta: Meta<typeof TimePickerField> = {
  title: 'Calendar/TimePickerField',
  component: TimePickerField,
};
export default meta;
type Story = StoryObj<typeof TimePickerField>;

const DefaultDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <TimePickerField label="Start time" value={value} onChange={setValue} />;
};

const TwelveHourDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <TimePickerField label="Meeting time (12h)" value={value} onChange={setValue} use12Hours />
  );
};

const FifteenMinuteStepsDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <TimePickerField
      label="Scheduled time"
      value={value}
      onChange={setValue}
      minutesStep={15}
      hint="Minutes in 15-minute increments"
    />
  );
};

const WithErrorDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <TimePickerField
      label="Departure time"
      value={value}
      onChange={setValue}
      errorText="Time is required"
    />
  );
};

const PreselectedDemo = () => {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 1, 14, 30));
  return <TimePickerField label="Current time" value={value} onChange={setValue} />;
};

const DesktopVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <DesktopTimePickerField label="Desktop time picker" value={value} onChange={setValue} />;
};

const MobileVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return <MobileTimePickerField label="Mobile time picker" value={value} onChange={setValue} />;
};

const StaticVariantDemo = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div>
      <StaticTimePickerField label="Pick a time" value={value} onChange={setValue} />
      <p style={{ marginTop: 8, fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)' }}>
        Selected:{' '}
        {value
          ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
          : 'none'}
      </p>
    </div>
  );
};

export const Default: Story = { render: () => <DefaultDemo /> };
export const TwelveHour: Story = { render: () => <TwelveHourDemo /> };
export const FifteenMinuteSteps: Story = { render: () => <FifteenMinuteStepsDemo /> };
export const WithError: Story = { render: () => <WithErrorDemo /> };
export const Preselected: Story = { render: () => <PreselectedDemo /> };
export const Disabled: Story = {
  render: () => (
    <TimePickerField label="Read-only time" value={new Date(2024, 0, 1, 9, 0)} disabled />
  ),
};
export const DesktopVariant: Story = { render: () => <DesktopVariantDemo /> };
export const MobileVariant: Story = { render: () => <MobileVariantDemo /> };
export const StaticVariant: Story = { render: () => <StaticVariantDemo /> };
