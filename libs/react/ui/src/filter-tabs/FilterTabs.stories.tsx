import type { Meta, StoryObj } from '@storybook/react';
import FilterTabs from './FilterTabs';

const meta: Meta<typeof FilterTabs> = {
  title: 'UI/FilterTabs',
  component: FilterTabs,
};

export default meta;
type Story = StoryObj<typeof FilterTabs>;

export const Default: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'All' },
      { key: 'web', label: 'Web' },
      { key: 'app', label: 'App' },
      { key: 'card', label: 'Card' },
    ],
    activeKey: 'all',
    onTabChange: () => {
      /* noop */
    },
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'All' },
      { key: 'react', label: 'React' },
      { key: 'angular', label: 'Angular' },
      { key: 'vue', label: 'Vue' },
      { key: 'svelte', label: 'Svelte' },
      { key: 'node', label: 'Node' },
      { key: 'python', label: 'Python' },
      { key: 'rust', label: 'Rust' },
      { key: 'go', label: 'Go' },
    ],
    activeKey: 'react',
    onTabChange: () => {
      /* noop */
    },
  },
};
