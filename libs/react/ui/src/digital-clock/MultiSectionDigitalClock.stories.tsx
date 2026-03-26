import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiSectionDigitalClock } from './MultiSectionDigitalClock';

const meta: Meta<typeof MultiSectionDigitalClock> = {
  title: 'Calendar/MultiSectionDigitalClock',
  component: MultiSectionDigitalClock,
};
export default meta;
type Story = StoryObj<typeof MultiSectionDigitalClock>;

const ClockDemo = ({
  use12Hours = false,
  minutesStep = 1,
  disabled = false,
}: {
  use12Hours?: boolean;
  minutesStep?: number;
  disabled?: boolean;
}) => {
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(30);
  const [ampm, setAmPm] = useState<'AM' | 'PM'>('AM');

  return (
    <div>
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'inline-block',
          background: 'var(--color-surface)',
        }}
      >
        <MultiSectionDigitalClock
          hours={hours}
          minutes={minutes}
          ampm={ampm}
          onChange={(h, m, a) => {
            setHours(h);
            setMinutes(m);
            if (a) setAmPm(a);
          }}
          use12Hours={use12Hours}
          minutesStep={minutesStep}
          disabled={disabled}
        />
      </div>
      <p style={{ marginTop: 12, fontSize: 'var(--font-sm)', color: 'var(--color-muted-text)' }}>
        Selected: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
        {use12Hours ? ` ${ampm}` : ''}
      </p>
    </div>
  );
};

export const TwentyFourHour: Story = { render: () => <ClockDemo /> };
export const TwelveHour: Story = { render: () => <ClockDemo use12Hours /> };
export const FifteenMinuteSteps: Story = { render: () => <ClockDemo minutesStep={15} /> };
export const ThirtyMinuteSteps: Story = { render: () => <ClockDemo minutesStep={30} /> };
export const Disabled: Story = { render: () => <ClockDemo disabled /> };
