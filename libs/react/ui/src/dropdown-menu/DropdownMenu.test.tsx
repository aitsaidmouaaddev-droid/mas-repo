import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DropdownMenu from './DropdownMenu';

const items = [
  { key: 'edit', label: 'Edit', onClick: vi.fn() },
  { key: 'sep', label: '', separator: true },
  { key: 'delete', label: 'Delete', onClick: vi.fn() },
  { key: 'disabled', label: 'Disabled', disabled: true, onClick: vi.fn() },
];

describe('DropdownMenu', () => {
  it('does not show menu initially', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items} testId="dd" />);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens menu on trigger click', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items} testId="dd" />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls item onClick and closes', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items} testId="dd" />);
    fireEvent.click(screen.getByText('Menu'));
    fireEvent.click(screen.getByText('Edit'));
    expect(items[0].onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items} testId="dd" />);
    fireEvent.click(screen.getByText('Menu'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
