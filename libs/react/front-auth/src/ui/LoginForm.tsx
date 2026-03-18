import { useState, type FormEvent } from 'react';
import { FiEye, FiEyeOff, FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Alert, Button, InputField, Link, Stack } from '@mas/react-ui';
import { SocialLoginButtons } from './SocialLoginButtons';
import type { SocialLoginButtonsProps, SocialProvider } from './SocialLoginButtons';
import styles from './auth-form.module.scss';

/**
 * Props for {@link LoginForm}.
 */
export interface LoginFormProps {
  /** Called with `{ login, password }` when the form is submitted and passes validation. */
  onSubmit: (credentials: { login: string; password: string }) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state on the submit button. */
  isLoading?: boolean;
  /** Server or network error message to display above the submit button. */
  error?: string | null;
  /** Label for the login field. @default 'Email' */
  loginLabel?: string;
  /** Placeholder for the login field. @default 'you@example.com' */
  loginPlaceholder?: string;
  /** Called when the user clicks "Forgot password?". */
  onForgotPasswordClick?: () => void;
  /** Called when the user clicks the "Create account" link. */
  onRegisterClick?: () => void;
  /**
   * Social provider buttons rendered below a divider.
   * Pass `providers={[]}` to hide social login entirely.
   */
  socialProviders?: SocialProvider[];
  /** Called when a social provider button is clicked. */
  onProviderLogin?: SocialLoginButtonsProps['onProviderLogin'];
  /** Layout for social buttons. @default 'icons' */
  socialLayout?: SocialLoginButtonsProps['layout'];
}

/**
 * Login form with email/password fields, show/hide password toggle, and error display.
 *
 * Fully controlled via props — bring your own `useAuth()` or any other state handler.
 *
 * @example
 * ```tsx
 * const { login, isLoading } = authClient.useAuth();
 * const [error, setError] = useState<string | null>(null);
 *
 * <LoginForm
 *   onSubmit={async ({ login: l, password }) => {
 *     try { await login({ login: l, password }); }
 *     catch (e) { setError('Invalid credentials'); }
 *   }}
 *   isLoading={isLoading}
 *   error={error}
 *   onRegisterClick={() => setMode('register')}
 * />
 * ```
 */
export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  loginLabel = 'Email',
  loginPlaceholder = 'you@example.com',
  onForgotPasswordClick,
  onRegisterClick,
  socialProviders,
  onProviderLogin,
  socialLayout = 'icons',
}: LoginFormProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!login.trim()) {
      setLoginError(`${loginLabel} is required`);
      valid = false;
    } else setLoginError('');
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ login: login.trim(), password });
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      noValidate
    >
      <Stack direction="vertical" gap={16}>
        <InputField
          label={loginLabel}
          type="email"
          placeholder={loginPlaceholder}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          errorText={loginError}
          disabled={isLoading}
          startIcon={FiMail}
          autoComplete="email"
          testId="login-email"
        />

        <div className={styles.passwordWrap}>
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={passwordError}
            disabled={isLoading}
            startIcon={FiLock}
            autoComplete="current-password"
            testId="login-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        {onForgotPasswordClick && (
          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onForgotPasswordClick();
              }}
              style={{ fontSize: 'var(--font-caption)' }}
            >
              Forgot password?
            </Link>
          </div>
        )}

        {error && (
          <Alert variant="error" onClose={undefined}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          label={isLoading ? 'Signing in…' : 'Sign in'}
          variant="primary"
          size="md"
          disabled={isLoading}
          startIcon={isLoading ? undefined : FiLogIn}
          style={{ width: '100%' }}
          testId="login-submit"
        />

        {onProviderLogin && (
          <SocialLoginButtons
            providers={socialProviders}
            onProviderLogin={onProviderLogin}
            disabled={isLoading}
            layout={socialLayout}
          />
        )}
      </Stack>

      {onRegisterClick && (
        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
          >
            Create account
          </Link>
        </div>
      )}
    </form>
  );
}
