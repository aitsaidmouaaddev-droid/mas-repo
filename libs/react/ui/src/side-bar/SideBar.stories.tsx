import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SideBar from './SideBar';
import { FiHome, FiClock, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';

const meta: Meta<typeof SideBar> = {
  title: 'UI/SideBar',
  component: SideBar,
  decorators: [
    (Story) => (
      <div style={{ height: 500, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SideBar>;

const sections = [
  {
    title: 'Navigation',
    items: [
      { name: 'home', title: 'Home', icon: FiHome },
      { name: 'history', title: 'History', icon: FiClock },
      { name: 'profile', title: 'Profile', icon: FiUser },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'settings', title: 'Settings', icon: FiSettings },
      { name: 'help', title: 'Help', icon: FiHelpCircle },
    ],
  },
];

const DefaultDemo = () => {
  const [active, setActive] = useState('home');
  return <SideBar sections={sections} activeItem={active} onItemClick={setActive} />;
};

const CollapsedDemo = () => {
  const [active, setActive] = useState('home');
  return <SideBar sections={sections} activeItem={active} onItemClick={setActive} collapsed />;
};

const SingleSectionDemo = () => {
  const [active, setActive] = useState('home');
  return (
    <SideBar
      sections={[{ items: sections[0].items }]}
      activeItem={active}
      onItemClick={setActive}
    />
  );
};

export const Default: Story = { render: () => <DefaultDemo /> };
export const Collapsed: Story = { render: () => <CollapsedDemo /> };
export const SingleSection: Story = { render: () => <SingleSectionDemo /> };
