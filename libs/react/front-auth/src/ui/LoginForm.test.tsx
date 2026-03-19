import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';

/** Gets the underlying <input> regardless of whether testId is on a wrapper or the input itself. */
function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(testId: string, value: string) {
  fireEvent.change(getInput(testId), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByTestId('login-submit'));
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    expect(getInput('login-email')).toBeInTheDocument();
    expect(getInput('login-password')).toBeInTheDocument();
  });

  it('shows "Email is required" when submitted empty', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });

  it('shows "Password is required" when password is empty', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    fill('login-email', 'user@example.com');
    submit();
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });

  it('calls onSubmit with trimmed login and password when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);
    fill('login-email', '  user@example.com  ');
    fill('login-password', 'secret');
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ login: 'user@example.com', password: 'secret' }),
    );
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays the error prop', () => {
    render(<LoginForm onSubmit={vi.fn()} error="Invalid credentials." />);
    expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
  });

  it('shows loading label on submit button when isLoading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('login-submit')).toHaveTextContent('Signing in…');
  });

  it('disables fields when isLoading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />);
    expect(getInput('login-email')).toBeDisabled();
    expect(getInput('login-password')).toBeDisabled();
  });

  it('calls onForgotPasswordClick when link is clicked', () => {
    const onForgot = vi.fn();
    render(<LoginForm onSubmit={vi.fn()} onForgotPasswordClick={onForgot} />);
    fireEvent.click(screen.getByText('Forgot password?'));
    expect(onForgot).toHaveBeenCalledOnce();
  });

  it('calls onRegisterClick when "Create account" is clicked', () => {
    const onRegister = vi.fn();
    render(<LoginForm onSubmit={vi.fn()} onRegisterClick={onRegister} />);
    fireEvent.click(screen.getByText('Create account'));
    expect(onRegister).toHaveBeenCalledOnce();
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    const input = getInput('login-password');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByLabelText('Show password'));
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('uses custom loginLabel as field label and error message', async () => {
    render(<LoginForm onSubmit={vi.fn()} loginLabel="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    submit();
    await waitFor(() => expect(screen.getByText('Username is required')).toBeInTheDocument());
  });
});
