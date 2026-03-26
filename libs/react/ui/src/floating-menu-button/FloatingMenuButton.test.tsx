import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingMenuButton from './FloatingMenuButton';
import { FiEdit, FiCamera, FiUpload } from 'react-icons/fi';

const items = [
  { name: 'edit', label: 'Edit', icon: FiEdit },
  { name: 'camera', label: 'Camera', icon: FiCamera },
  { name: 'upload', label: 'Upload', icon: FiUpload },
];

describe('FloatingMenuButton', () => {
  it('renders the FAB button', () => {
    render(<FloatingMenuButton items={items} onItemClick={vi.fn()} testId="fab" />);
    expect(screen.getByTestId('fab-fab')).toBeTruthy();
  });

  it('opens menu on FAB click', () => {
    render(<FloatingMenuButton items={items} onItemClick={vi.fn()} testId="fab" />);
    fireEvent.click(screen.getByTestId('fab-fab'));
    expect(screen.getByTestId('fab-menu')).toBeTruthy();
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Camera')).toBeTruthy();
    expect(screen.getByText('Upload')).toBeTruthy();
  });

  it('calls onItemClick and closes menu', () => {
    const onItemClick = vi.fn();
    render(<FloatingMenuButton items={items} onItemClick={onItemClick} testId="fab" />);
    fireEvent.click(screen.getByTestId('fab-fab'));
    fireEvent.click(screen.getByText('Camera'));
    expect(onItemClick).toHaveBeenCalledWith('camera');
    expect(screen.queryByTestId('fab-menu')).toBeNull();
  });

  it('closes menu on overlay click', () => {
    render(<FloatingMenuButton items={items} onItemClick={vi.fn()} testId="fab" />);
    fireEvent.click(screen.getByTestId('fab-fab'));
    expect(screen.getByTestId('fab-menu')).toBeTruthy();
    fireEvent.click(screen.getByTestId('fab-overlay'));
    expect(screen.queryByTestId('fab-menu')).toBeNull();
  });

  it('changes FAB state when open', () => {
    render(<FloatingMenuButton items={items} onItemClick={vi.fn()} testId="fab" />);
    const fab = screen.getByTestId('fab-fab');
    expect(fab).not.toHaveAttribute('data-open');
    fireEvent.click(fab);
    expect(screen.getByTestId('fab-fab')).toHaveAttribute('data-open', 'true');
  });
});
