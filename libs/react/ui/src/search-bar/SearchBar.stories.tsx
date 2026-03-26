import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = { title: 'UI/SearchBar', component: SearchBar };
export default meta;
type Story = StoryObj<typeof SearchBar>;

const SearchBarDemo = () => {
  const [value, setValue] = useState('');
  return <SearchBar value={value} onChange={setValue} placeholder="Search items..." />;
};

export const Default: Story = {
  render: () => <SearchBarDemo />,
};
