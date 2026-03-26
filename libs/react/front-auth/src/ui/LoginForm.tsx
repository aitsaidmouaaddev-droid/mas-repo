import { useState } from 'react';
import { FiEye, FiEyeOff, FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Alert, Button, Form, Input, InputField, Link, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
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
  /** Label for the login field. Uses t('auth.email') by default. */
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

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  loginLabel,
  loginPlaceholder = 'you@example.com',
  onForgotPasswordClick,
  onRegisterClick,
  socialProviders,
  onProviderLogin,
  socialLayout = 'icons',
}: LoginFormProps) {
  const { t } = useT();
  const label = loginLabel ?? t('auth.email');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!login.trim()) {
      setLoginError(t('auth.emailRequired'));
      valid = false;
    } else setLoginError('');
    if (!password) {
      setPasswordError(t('auth.passwordRequired'));
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ login: login.trim(), password });
  };

  return (
    <Form
      className={styles.form}
      onSubmit={() => {
        void handleSubmit();
      }}
      noValidate
    >
      <Stack direction="vertical" gap={16}>
        <InputField
          label={label}
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

        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.password')}</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              disabled={isLoading}
              startIcon={FiLock}
              autoComplete="current-password"
              testId="login-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {passwordError && <span className={styles.passwordError}>{passwordError}</span>}
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
              {t('auth.forgotPassword')}
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
          label={isLoading ? t('auth.signingIn') : t('auth.signInBtn')}
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
          <span>{t('auth.noAccount')}</span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
          >
            {t('auth.createAccount')}
          </Link>
        </div>
      )}
    </Form>
  );
}
