import type { Meta, StoryObj } from '@storybook/react';
import SeeMore from './SeeMore';

const meta: Meta<typeof SeeMore> = {
  title: 'UI/SeeMore',
  component: SeeMore,
  argTypes: {
    maxHeight: { control: 'number' },
    moreLabel: { control: 'text' },
    lessLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SeeMore>;

export const ShortText: Story = {
  args: {
    text: 'This is a short piece of text that fits without truncation.',
    maxHeight: 200,
  },
};

export const LongText: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.',
    maxHeight: 80,
  },
};

export const CustomLabels: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    maxHeight: 80,
    moreLabel: 'Show all',
    lessLabel: 'Collapse',
  },
};
