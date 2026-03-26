import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = { title: 'Molecules/Pagination', component: Pagination };
export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationDemo = (args: Partial<React.ComponentProps<typeof Pagination>>) => {
  const [page, setPage] = useState(args.page ?? 1);
  return <Pagination {...args} page={page} onChange={setPage} />;
};

export const Default: Story = { render: (args) => <PaginationDemo {...args} total={20} /> };
export const FewPages: Story = { render: (args) => <PaginationDemo {...args} total={5} /> };
export const FirstPage: Story = {
  render: (args) => <PaginationDemo {...args} total={20} page={1} />,
};
export const LastPage: Story = {
  render: (args) => <PaginationDemo {...args} total={20} page={20} />,
};
