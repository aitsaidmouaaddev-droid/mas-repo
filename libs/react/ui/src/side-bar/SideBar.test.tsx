import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBar from './SideBar';
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';

const sections = [
  {
    title: 'Main',
    items: [
      { name: 'home', title: 'Home', icon: FiHome },
      { name: 'profile', title: 'Profile', icon: FiUser },
    ],
  },
  {
    title: 'System',
    items: [{ name: 'settings', title: 'Settings', icon: FiSettings }],
  },
];

describe('SideBar', () => {
  it('renders all items and section titles', () => {
    render(<SideBar sections={sections} activeItem="home" onItemClick={vi.fn()} testId="sb" />);
    expect(screen.getByText('Main')).toBeTruthy();
    expect(screen.getByText('System')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('calls onItemClick with correct name', () => {
    const onItemClick = vi.fn();
    render(<SideBar sections={sections} activeItem="home" onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(onItemClick).toHaveBeenCalledWith('settings');
  });

  it('applies different class to active item', () => {
    render(<SideBar sections={sections} activeItem="profile" onItemClick={vi.fn()} />);
    const profileBtn = screen.getByText('Profile').closest('button');
    const homeBtn = screen.getByText('Home').closest('button');
    expect(profileBtn).toBeTruthy();
    expect(homeBtn).toBeTruthy();
    expect(profileBtn).toHaveAttribute('data-active', 'true');
    expect(homeBtn).not.toHaveAttribute('data-active');
  });

  it('hides labels when collapsed', () => {
    render(
      <SideBar sections={sections} activeItem="home" onItemClick={vi.fn()} collapsed testId="sb" />,
    );
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByText('Main')).toBeNull();
  });

  it('shows item title as tooltip when collapsed', () => {
    render(<SideBar sections={sections} activeItem="home" onItemClick={vi.fn()} collapsed />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].getAttribute('title')).toBe('Home');
  });
});
