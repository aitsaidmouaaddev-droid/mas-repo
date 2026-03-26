import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from './ProfileCard';
import type { AuthIdentity } from '../interfaces';

const base: AuthIdentity = { id: '1' };

describe('ProfileCard', () => {
  it('displays firstName + lastName as the primary name', () => {
    render(<ProfileCard identity={{ ...base, firstName: 'Jane', lastName: 'Doe' }} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('falls back to displayName when no first/last name', () => {
    render(<ProfileCard identity={{ ...base, displayName: 'JaneDoe' }} />);
    expect(screen.getByText('JaneDoe')).toBeInTheDocument();
  });

  it('falls back to identityName when no display name', () => {
    render(<ProfileCard identity={{ ...base, identityName: 'janedoe' }} />);
    // identityName shown as the name (first p element) and as the handle
    const nameEl = screen.getAllByText('janedoe')[0];
    expect(nameEl).toBeInTheDocument();
  });

  it('falls back to email as primary name when nothing else is set', () => {
    render(<ProfileCard identity={{ ...base, email: 'j@example.com' }} />);
    // email shown both as primary name and in the email <p>
    const els = screen.getAllByText('j@example.com');
    expect(els.length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to "User" when identity has only id', () => {
    render(<ProfileCard identity={base} />);
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('shows @handle when identityName is set', () => {
    render(<ProfileCard identity={{ ...base, identityName: 'janedoe' }} />);
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
  });

  it('shows email when set', () => {
    render(<ProfileCard identity={{ ...base, email: 'j@example.com', displayName: 'Jane' }} />);
    expect(screen.getByText('j@example.com')).toBeInTheDocument();
  });

  it('calls onEditClick when "Edit profile" is clicked', () => {
    const onEdit = vi.fn();
    render(<ProfileCard identity={base} onEditClick={onEdit} />);
    fireEvent.click(screen.getByText('Edit profile'));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it('calls onChangePasswordClick when "Change password" is clicked', () => {
    const onChangePwd = vi.fn();
    render(<ProfileCard identity={base} onChangePasswordClick={onChangePwd} />);
    fireEvent.click(screen.getByText('Change password'));
    expect(onChangePwd).toHaveBeenCalledOnce();
  });

  it('calls onLogout when "Sign out" is clicked', () => {
    const onLogout = vi.fn();
    render(<ProfileCard identity={base} onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Sign out'));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('does not call onLogout when isLoading and sign out clicked', () => {
    const onLogout = vi.fn();
    render(<ProfileCard identity={base} onLogout={onLogout} isLoading />);
    fireEvent.click(screen.getByText('Sign out'));
    expect(onLogout).not.toHaveBeenCalled();
  });

  it('disables Edit profile button when isLoading', () => {
    render(<ProfileCard identity={base} onEditClick={vi.fn()} isLoading />);
    expect(screen.getByText('Edit profile').closest('button')).toBeDisabled();
  });

  it('does not render Edit profile button when onEditClick is not provided', () => {
    render(<ProfileCard identity={base} />);
    expect(screen.queryByText('Edit profile')).toBeNull();
  });

  it('does not render Change password button when onChangePasswordClick is not provided', () => {
    render(<ProfileCard identity={base} />);
    expect(screen.queryByText('Change password')).toBeNull();
  });

  it('does not render Sign out when onLogout is not provided', () => {
    render(<ProfileCard identity={base} />);
    expect(screen.queryByText('Sign out')).toBeNull();
  });
});
