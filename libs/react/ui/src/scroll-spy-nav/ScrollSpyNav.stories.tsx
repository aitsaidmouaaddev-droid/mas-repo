import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiHome, FiUser, FiMail, FiSettings, FiStar, FiHeart } from 'react-icons/fi';
import ScrollSpyNav from './ScrollSpyNav';

const meta: Meta<typeof ScrollSpyNav> = {
  title: 'UI/ScrollSpyNav',
  component: ScrollSpyNav,
};

export default meta;
type Story = StoryObj<typeof ScrollSpyNav>;

export const Default: Story = {
  args: {
    items: [
      { id: 'hero', label: 'Home', icon: FiHome },
      { id: 'about', label: 'About', icon: FiUser },
      { id: 'contact', label: 'Contact', icon: FiMail },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { id: 'hero', label: 'Home', icon: FiHome },
      { id: 'about', label: 'About', icon: FiUser },
      { id: 'contact', label: 'Contact', icon: FiMail },
      { id: 'settings', label: 'Settings', icon: FiSettings },
      { id: 'favorites', label: 'Favorites', icon: FiStar },
      { id: 'likes', label: 'Likes', icon: FiHeart },
    ],
  },
};
