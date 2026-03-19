import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import {
  AuthPage,
  AuthCard,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ProfileCard,
  ProfileForm,
  ChangePasswordForm,
} from '@mas/front-auth';
import type { ProfileFormData } from '@mas/front-auth';
import { authClient } from './auth.client';

type Mode =
  | 'login'
  | 'register'
  | 'forgot'
  | 'reset'
  | 'profile'
  | 'editProfile'
  | 'changePassword';

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

  // Sync mode/token from URL, and hydrate auth state from OAuth callback params
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
        } as Parameters<typeof auth.setAuthenticated>[0],
        { accessToken: oauthAccessToken, refreshToken: oauthRefreshToken },
      );
      // Clean up URL
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
    // Clean query params when navigating away from reset
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

  const handleProfileSave = async (data: ProfileFormData) => {
    // Placeholder — wire to a real updateIdentity mutation when available
    console.log('Profile update requested:', data);
    switchMode('profile');
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setError(null);
    try {
      // Placeholder — wire to a real changePassword mutation when available
      console.log('Change password requested:', { currentPassword, newPassword });
      switchMode('profile');
    } catch {
      setError('Failed to update password. The current password may be incorrect.');
      throw new Error('change password failed');
    }
  };

  // ── Hydrating (tokens found, me query in flight) ─────────────────────────
  if (auth.isLoading && !auth.isAuthenticated) {
    return null; // render nothing while restoring session on refresh
  }

  // ── Authenticated state ──────────────────────────────────────────────────
  if (auth.isAuthenticated && auth.identity) {
    if (mode === 'editProfile') {
      return (
        <AuthPage>
          <AuthCard title="Edit profile" subtitle="Update your information" icon="✎">
            <ProfileForm
              identity={auth.identity}
              onSubmit={handleProfileSave}
              isLoading={auth.isLoading}
              error={error}
              onCancel={() => switchMode('profile')}
            />
          </AuthCard>
        </AuthPage>
      );
    }

    if (mode === 'changePassword') {
      return (
        <AuthPage>
          <AuthCard title="Change password" subtitle="Choose a new strong password" icon="🔒">
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              isLoading={auth.isLoading}
              error={error}
              onCancel={() => switchMode('profile')}
            />
          </AuthCard>
        </AuthPage>
      );
    }

    return (
      <AuthPage>
        <AuthCard title="My profile" icon="◉">
          <ProfileCard
            identity={auth.identity}
            onEditClick={() => switchMode('editProfile')}
            onChangePasswordClick={() => switchMode('changePassword')}
            onLogout={() => {
              void auth.logout();
            }}
            isLoading={auth.isLoading}
          />
        </AuthCard>
      </AuthPage>
    );
  }

  // ── Unauthenticated states ───────────────────────────────────────────────
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
