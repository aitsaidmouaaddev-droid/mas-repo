import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb, { BreadcrumbWithSkeleton } from './Breadcrumb';
// import { BreadcrumbSkeleton } from '../skeletons/BreadcrumbSkeleton';


const meta: Meta<typeof Breadcrumb> = { title: 'UI/Breadcrumb', component: Breadcrumb };
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }, { label: 'Data' }],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [{ label: 'Home', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Profile' }],
    separator: '›',
  },
};

export const Skeleton: Story = {
  render: () => <BreadcrumbWithSkeleton loading items={[]} />,
};
