import React from 'react';
import { render, screen } from '@testing-library/react';
import { FiHome, FiUser, FiMail } from 'react-icons/fi';
import ScrollSpyNav from './ScrollSpyNav';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  })),
);

const items = [
  { id: 'hero', label: 'Home', icon: FiHome },
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'contact', label: 'Contact', icon: FiMail },
];

describe('ScrollSpyNav', () => {
  it('renders all nav buttons', () => {
    render(<ScrollSpyNav items={items} testId="spy-nav" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('each button has correct aria-label', () => {
    render(<ScrollSpyNav items={items} testId="spy-nav" />);
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(<ScrollSpyNav items={items} testId="spy-nav" />);
    expect(screen.getByTestId('spy-nav')).toBeInTheDocument();
  });
});
