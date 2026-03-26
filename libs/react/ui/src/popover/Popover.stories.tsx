import { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import Button from '../button/Button';

const meta: Meta<typeof Popover> = {
  title: 'Calendar/Popover',
  component: Popover,
};
export default meta;
type Story = StoryObj<typeof Popover>;

const PopoverDemo = ({ placement = 'bottom-start' }: { placement?: string }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
      <div ref={anchorRef}>
        <Button label="Toggle popover" onClick={() => setOpen((p) => !p)} />
      </div>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        placement={placement as 'bottom-start'}
      >
        <div
          style={{
            padding: '16px 20px',
            minWidth: 200,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p style={{ margin: 0, fontSize: 'var(--font-sm)' }}>Popover content here.</p>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 'var(--font-caption)',
              color: 'var(--color-muted-text)',
            }}
          >
            Click outside or press Esc to close.
          </p>
        </div>
      </Popover>
    </div>
  );
};

export const Default: Story = {
  render: () => <PopoverDemo placement="bottom-start" />,
};

export const TopStart: Story = {
  render: () => <PopoverDemo placement="top-start" />,
};

export const BottomEnd: Story = {
  render: () => <PopoverDemo placement="bottom-end" />,
};
