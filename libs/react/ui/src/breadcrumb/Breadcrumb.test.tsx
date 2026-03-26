import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from './Breadcrumb';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
];

describe('Breadcrumb', () => {
  it('renders all items', () => {
    render(<Breadcrumb items={items} testId="bc" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Widget')).toBeInTheDocument();
  });

  it('marks last item as current', () => {
    render(<Breadcrumb items={items} testId="bc" />);
    expect(screen.getByText('Widget')).toHaveAttribute('aria-current', 'page');
  });

  it('renders separators', () => {
    render(<Breadcrumb items={items} separator=">" testId="bc" />);
    const seps = screen.getAllByText('>');
    expect(seps.length).toBe(2);
  });

  it('has breadcrumb nav landmark', () => {
    render(<Breadcrumb items={items} testId="bc" />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });
});
