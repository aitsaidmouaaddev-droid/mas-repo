import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

const items = [
  { key: 'a', label: 'Tab A', content: <div>Content A</div> },
  { key: 'b', label: 'Tab B', content: <div>Content B</div> },
  { key: 'c', label: 'Tab C', disabled: true },
];

describe('Tabs', () => {
  it('renders all tabs', () => {
    render(<Tabs tabs={items} activeKey="a" onChange={vi.fn()} testId="tabs" />);
    expect(screen.getAllByRole('tab').length).toBe(3);
  });

  it('shows active tab content', () => {
    render(<Tabs tabs={items} activeKey="a" onChange={vi.fn()} testId="tabs" />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content A');
  });

  it('calls onChange on tab click', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={items} activeKey="a" onChange={onChange} testId="tabs" />);
    fireEvent.click(screen.getByText('Tab B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange for disabled tab', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={items} activeKey="a" onChange={onChange} testId="tabs" />);
    fireEvent.click(screen.getByText('Tab C'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('marks active tab with aria-selected', () => {
    render(<Tabs tabs={items} activeKey="b" onChange={vi.fn()} testId="tabs" />);
    expect(screen.getByText('Tab B')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Tab A')).toHaveAttribute('aria-selected', 'false');
  });
});
