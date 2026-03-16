import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = { title: 'UI/Tabs', component: Tabs };
export default meta;
type Story = StoryObj<typeof Tabs>;

const tabItems = [
  { key: 'overview', label: 'Overview', content: <p>Overview content here.</p> },
  { key: 'details', label: 'Details', content: <p>Details content here.</p> },
  { key: 'settings', label: 'Settings', content: <p>Settings content here.</p> },
  { key: 'disabled', label: 'Disabled', disabled: true },
];

const TabsDemo = () => {
  const [active, setActive] = useState('overview');
  return <Tabs tabs={tabItems} activeKey={active} onChange={setActive} />;
};

export const Default: Story = {
  render: () => <TabsDemo />,
};
