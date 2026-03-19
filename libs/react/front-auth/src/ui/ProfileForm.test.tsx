import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from './ProfileForm';
import type { AuthIdentity } from '../interfaces';

const identity: AuthIdentity = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Jane Doe',
  identityName: 'janedoe',
  avatarUrl: 'https://example.com/avatar.jpg',
  firstName: 'Jane',
  lastName: 'Doe',
};

function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(testId: string, value: string) {
  fireEvent.change(getInput(testId), { target: { value } });
}

describe('ProfileForm', () => {
  it('pre-populates text fields from identity', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} />);
    expect(getInput('profile-first-name')).toHaveValue('Jane');
    expect(getInput('profile-last-name')).toHaveValue('Doe');
    expect(getInput('profile-display-name')).toHaveValue('Jane Doe');
    expect(getInput('profile-identity-name')).toHaveValue('janedoe');
    expect(getInput('profile-avatar-url')).toHaveValue('https://example.com/avatar.jpg');
  });

  it('shows the email read-only with a "cannot be changed" note', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} />);
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText(/cannot be changed after registration/i)).toBeInTheDocument();
  });

  it('does not show email section when email is not set', () => {
    render(<ProfileForm identity={{ ...identity, email: undefined }} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/cannot be changed/i)).toBeNull();
  });

  it('calls onSubmit with updated field values when saved', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProfileForm identity={identity} onSubmit={onSubmit} />);
    fill('profile-first-name', 'Alice');
    fill('profile-last-name', 'Smith');
    fireEvent.click(screen.getByTestId('profile-save'));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Alice', lastName: 'Smith' }),
      ),
    );
  });

  it('trims whitespace from text fields on submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProfileForm identity={identity} onSubmit={onSubmit} />);
    fill('profile-display-name', '  Bob  ');
    fireEvent.click(screen.getByTestId('profile-save'));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ displayName: 'Bob' }),
      ),
    );
  });

  it('renders Cancel button when onCancel is provided', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByTestId('profile-cancel')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('profile-cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not render Cancel button when onCancel is not provided', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} />);
    expect(screen.queryByTestId('profile-cancel')).toBeNull();
  });

  it('shows loading label on save button when isLoading', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('profile-save')).toHaveTextContent('Saving…');
  });

  it('disables fields when isLoading', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} isLoading />);
    expect(getInput('profile-first-name')).toBeDisabled();
    expect(getInput('profile-display-name')).toBeDisabled();
  });

  it('displays the error prop', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} error="Save failed." />);
    expect(screen.getByText('Save failed.')).toBeInTheDocument();
  });

  it('does not display error when error is null', () => {
    render(<ProfileForm identity={identity} onSubmit={vi.fn()} error={null} />);
    expect(screen.queryByText('Save failed.')).toBeNull();
  });
});
