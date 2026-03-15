import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';
import { FiStar, FiHeart } from 'react-icons/fi';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  decorators: [
    (Story) => (
      <div style={{ padding: 40, maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Fig', value: 'fig' },
];

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    return <Select options={fruits} value={value} onSelect={(v) => setValue(v as string)} />;
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<Array<string | number>>([]);
    return (
      <Select
        options={fruits}
        value={value}
        onSelect={(v) => setValue(v as Array<string | number>)}
        multiple
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    const opts = [
      { label: 'Favourite', value: 'fav', startIcon: FiHeart },
      { label: 'Starred', value: 'star', startIcon: FiStar },
    ];
    return <Select options={opts} value={value} onSelect={(v) => setValue(v as string)} />;
  },
};

export const MenuTop: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ marginTop: 300 }}>
        <Select
          options={fruits}
          value={value}
          onSelect={(v) => setValue(v as string)}
          menuPosition="top"
        />
      </div>
    );
  },
};
