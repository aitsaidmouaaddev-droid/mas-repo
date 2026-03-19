/**
 * Public auth route — handles login, register, forgot/reset password.
 *
 * Redirects to `/` immediately when the user is already authenticated.
 * Profile management lives at the protected `/profile` route.
 */
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import {
  AuthPage,
  AuthCard,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from '@mas/front-auth';
import { useNavigate } from '@mas/react-router';
import { authClient, parseUserIdFromToken } from './auth.client';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

function readTokenFromUrl(): string {
  return new URLSearchParams(window.location.search).get('token') ?? '';
}

function readModeFromUrl(): Mode | null {
  const m = new URLSearchParams(window.location.search).get('mode');
  if (m === 'reset' || m === 'forgot' || m === 'login' || m === 'register') return m;
  return null;
}

export function AuthRoute() {
  const [mode, setMode] = useState<Mode>(() => readModeFromUrl() ?? 'login');
  const [resetToken, setResetToken] = useState(() => readTokenFromUrl());
  const [error, setError] = useState<string | null>(null);
  const auth = authClient.useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the app
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  // Sync mode/token from URL and handle OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // OAuth callback: ?accessToken=...&refreshToken=...&identityId=...
    const oauthAccessToken = params.get('accessToken');
    const oauthRefreshToken = params.get('refreshToken');
    const oauthIdentityId = params.get('identityId');

    if (oauthAccessToken && oauthRefreshToken && oauthIdentityId) {
      localStorage.setItem('auth.accessToken', oauthAccessToken);
      localStorage.setItem('auth.refreshToken', oauthRefreshToken);
      auth.setAuthenticated(
        {
          id: oauthIdentityId,
          email: params.get('email') || undefined,
          displayName: params.get('displayName') || undefined,
          avatarUrl: params.get('avatarUrl') || undefined,
          userId: parseUserIdFromToken(oauthAccessToken),
        } as Parameters<typeof auth.setAuthenticated>[0],
        { accessToken: oauthAccessToken, refreshToken: oauthRefreshToken },
      );
      const clean = new URL(window.location.href);
      ['accessToken', 'refreshToken', 'identityId', 'email', 'displayName', 'avatarUrl'].forEach(
        (k) => clean.searchParams.delete(k),
      );
      window.history.replaceState({}, '', clean.toString());
      return;
    }

    const urlMode = readModeFromUrl();
    const urlToken = readTokenFromUrl();
    if (urlToken) setResetToken(urlToken);
    if (urlMode) setMode(urlMode);
    else if (urlToken) setMode('reset');
  }, []);

  const switchMode = (next: Mode) => {
    setError(null);
    setMode(next);
    if (next !== 'reset') {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleLogin = async ({ login, password }: { login: string; password: string }) => {
    setError(null);
    try {
      await auth.login({ login, password });
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async ({
    email,
    password,
    displayName,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setError(null);
    try {
      await auth.register({ email, password, displayName, firstName, lastName, identityName: email });
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  const handleForgotPassword = async (email: string) => {
    setError(null);
    await authClient.apolloClient.mutate({
      mutation: FORGOT_PASSWORD,
      variables: { email },
    });
  };

  const handleResetPassword = async (token: string, newPassword: string) => {
    setError(null);
    try {
      await authClient.apolloClient.mutate({
        mutation: RESET_PASSWORD,
        variables: { token, newPassword },
      });
    } catch {
      setError('Reset failed. The link may have expired.');
      throw new Error('reset failed');
    }
  };

  // While hydrating, render nothing
  if (auth.isLoading && !auth.isAuthenticated) return null;

  // Already authenticated — redirect effect will fire, render nothing in the meantime
  if (auth.isAuthenticated) return null;

  return (
    <AuthPage>
      {mode === 'login' && (
        <AuthCard title="Welcome back" subtitle="Sign in to your account">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={auth.isLoading}
            error={error}
            onForgotPasswordClick={() => switchMode('forgot')}
            onRegisterClick={() => switchMode('register')}
            socialProviders={['google']}
            onProviderLogin={(p) => {
              window.location.href = `http://localhost:4311/auth/oauth/${p}`;
            }}
          />
        </AuthCard>
      )}

      {mode === 'register' && (
        <AuthCard title="Create account" subtitle="Join and start learning" icon="✦">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={auth.isLoading}
            error={error}
            onLoginClick={() => switchMode('login')}
            socialProviders={['google']}
            onProviderLogin={(p) => {
              window.location.href = `http://localhost:4311/auth/oauth/${p}`;
            }}
          />
        </AuthCard>
      )}

      {mode === 'forgot' && (
        <AuthCard title="Reset password" subtitle="We'll email you a link" icon="🔑">
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            error={error}
            onBackClick={() => switchMode('login')}
          />
        </AuthCard>
      )}

      {mode === 'reset' && (
        <AuthCard title="New password" subtitle="Choose a strong password" icon="🔒">
          <ResetPasswordForm
            token={resetToken}
            onSubmit={handleResetPassword}
            error={error}
            onBackClick={() => switchMode('login')}
          />
        </AuthCard>
      )}
    </AuthPage>
  );
}
