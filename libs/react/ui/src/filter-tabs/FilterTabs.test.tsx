import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterTabs from './FilterTabs';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'app', label: 'App' },
  { key: 'card', label: 'Card' },
];

describe('FilterTabs', () => {
  it('renders all tab labels', () => {
    render(<FilterTabs tabs={tabs} activeKey="all" onTabChange={vi.fn()} testId="tabs" />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('App')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<FilterTabs tabs={tabs} activeKey="web" onTabChange={vi.fn()} testId="tabs" />);
    const webButton = screen.getByText('Web');
    expect(webButton).toBeInTheDocument();
  });

  it('calls onTabChange with correct key on click', () => {
    const onTabChange = vi.fn();
    render(<FilterTabs tabs={tabs} activeKey="all" onTabChange={onTabChange} testId="tabs" />);
    fireEvent.click(screen.getByText('Card'));
    expect(onTabChange).toHaveBeenCalledWith('card');
  });
});
