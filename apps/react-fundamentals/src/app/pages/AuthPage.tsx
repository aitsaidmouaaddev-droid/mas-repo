/**
 * Auth page — handles login, register, forgot/reset password.
 */
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import {
  AuthPage as AuthPageLayout,
  AuthCard,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from '@mas/front-auth';
import { useNavigate } from '@mas/react-router';
import { useT } from '@mas/shared/i18n';
import { authClient, parseUserIdFromToken } from '../auth/auth.client';

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

export function AuthPage() {
  const [mode, setMode] = useState<Mode>(() => readModeFromUrl() ?? 'login');
  const [resetToken, setResetToken] = useState(() => readTokenFromUrl());
  const [error, setError] = useState<string | null>(null);
  const auth = authClient.useAuth();
  const navigate = useNavigate();
  const { t } = useT();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/learn';
      navigate(redirect, { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

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
      setError(t('auth.invalidCredentials'));
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
      setError(t('auth.registrationFailed'));
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
      setError(t('auth.resetFailed'));
      throw new Error('reset failed');
    }
  };

  if (auth.isLoading && !auth.isAuthenticated) return null;
  if (auth.isAuthenticated) return null;

  return (
    <AuthPageLayout>
      {mode === 'login' && (
        <AuthCard title={t('auth.welcomeBack')} subtitle={t('auth.signIn')}>
          <LoginForm
            onSubmit={handleLogin}
            isLoading={auth.isLoading}
            error={error}
            onForgotPasswordClick={() => switchMode('forgot')}
            onRegisterClick={() => switchMode('register')}
            socialProviders={['google']}
            onProviderLogin={(p) => {
              window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4311'}/auth/oauth/${p}`;
            }}
          />
        </AuthCard>
      )}

      {mode === 'register' && (
        <AuthCard title={t('auth.createAccount')} subtitle={t('auth.joinStart')} icon="✦">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={auth.isLoading}
            error={error}
            onLoginClick={() => switchMode('login')}
            socialProviders={['google']}
            onProviderLogin={(p) => {
              window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4311'}/auth/oauth/${p}`;
            }}
          />
        </AuthCard>
      )}

      {mode === 'forgot' && (
        <AuthCard title={t('auth.resetPassword')} subtitle={t('auth.emailLink')} icon="🔑">
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            error={error}
            onBackClick={() => switchMode('login')}
          />
        </AuthCard>
      )}

      {mode === 'reset' && (
        <AuthCard title={t('auth.newPassword')} subtitle={t('auth.strongPassword')} icon="🔒">
          <ResetPasswordForm
            token={resetToken}
            onSubmit={handleResetPassword}
            error={error}
            onBackClick={() => switchMode('login')}
          />
        </AuthCard>
      )}
    </AuthPageLayout>
  );
}
