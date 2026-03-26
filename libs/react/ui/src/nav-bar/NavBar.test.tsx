import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from './NavBar';
import { FiHome, FiSettings } from 'react-icons/fi';

const items = [
  { name: 'home', title: 'Home', icon: FiHome },
  { name: 'settings', title: 'Settings', icon: FiSettings },
];

describe('NavBar', () => {
  it('renders all items', () => {
    render(<NavBar items={items} activeItem="home" onItemClick={vi.fn()} testId="nav" />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('calls onItemClick with correct name', () => {
    const onItemClick = vi.fn();
    render(<NavBar items={items} activeItem="home" onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(onItemClick).toHaveBeenCalledWith('settings');
  });

  it('hides labels when showLabels is false', () => {
    render(<NavBar items={items} activeItem="home" onItemClick={vi.fn()} showLabels={false} />);
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByText('Settings')).toBeNull();
  });

  it('highlights the active item differently from inactive', () => {
    render(<NavBar items={items} activeItem="settings" onItemClick={vi.fn()} />);
    const activeLabel = screen.getByText('Settings');
    const inactiveLabel = screen.getByText('Home');
    expect(activeLabel).toHaveAttribute('data-active', 'true');
    expect(inactiveLabel).not.toHaveAttribute('data-active');
  });

  it('applies flex direction based on iconPosition', () => {
    render(<NavBar items={items} activeItem="home" onItemClick={vi.fn()} iconPosition="right" />);
    const content = screen.getByTestId('nav-item-content-home');
    expect(content.style.flexDirection).toBe('row-reverse');
  });
});
