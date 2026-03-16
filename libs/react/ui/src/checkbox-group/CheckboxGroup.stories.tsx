import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CheckboxGroup from './CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Molecules/CheckboxGroup',
  component: CheckboxGroup,
};
export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

const options = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'py', label: 'Python', disabled: true },
];

const Demo = (args: Partial<React.ComponentProps<typeof CheckboxGroup>>) => {
  const [value, setValue] = useState<string[]>(['ts']);
  return <CheckboxGroup {...args} value={value} onChange={setValue} />;
};

export const Vertical: Story = {
  render: (args) => <Demo {...args} options={options} label="Languages" />,
};
export const Horizontal: Story = {
  render: (args) => <Demo {...args} options={options} label="Languages" direction="horizontal" />,
};
