import { render, screen } from '@testing-library/react';
import { StatusBadge, AdminPanel } from './02-conditional-rendering';

describe('02 — Conditional Rendering', () => {
  it('StatusBadge shows Online when isOnline is true', () => {
    render(<StatusBadge isOnline={true} />);
    const badge = screen.getByText('Online');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('online');
  });

  it('StatusBadge shows Offline when isOnline is false', () => {
    render(<StatusBadge isOnline={false} />);
    const badge = screen.getByText('Offline');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('offline');
  });

  it('AdminPanel renders welcome message when isAdmin is true', () => {
    render(<AdminPanel isAdmin={true} />);
    expect(screen.getByText('Welcome, admin')).toBeInTheDocument();
  });

  it('AdminPanel renders nothing when isAdmin is false', () => {
    const { container } = render(<AdminPanel isAdmin={false} />);
    expect(container.innerHTML).toBe('');
  });
});
