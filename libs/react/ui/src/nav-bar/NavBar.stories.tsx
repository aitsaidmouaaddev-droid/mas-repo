import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NavBar from './NavBar';
import { FiHome, FiClock, FiSettings, FiUser } from 'react-icons/fi';

const meta: Meta<typeof NavBar> = {
  title: 'UI/NavBar',
  component: NavBar,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

const navItems = [
  { name: 'home', title: 'Home', icon: FiHome },
  { name: 'history', title: 'History', icon: FiClock },
  { name: 'profile', title: 'Profile', icon: FiUser },
  { name: 'settings', title: 'Settings', icon: FiSettings },
];

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return <NavBar items={navItems} activeItem={active} onItemClick={setActive} />;
  },
};

export const IconsOnly: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <NavBar items={navItems} activeItem={active} onItemClick={setActive} showLabels={false} />
    );
  },
};

export const TopIcons: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <NavBar items={navItems} activeItem={active} onItemClick={setActive} iconPosition="top" />
    );
  },
};
