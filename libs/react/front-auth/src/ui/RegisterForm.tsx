import { useState } from 'react';
import { FiEye, FiEyeOff, FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Alert, Button, Form, InputField, Link, Stack } from '@mas/react-ui';
import { SocialLoginButtons } from './SocialLoginButtons';
import type { SocialLoginButtonsProps, SocialProvider } from './SocialLoginButtons';
import styles from './auth-form.module.scss';

/**
 * Props for {@link RegisterForm}.
 */
export interface RegisterFormProps {
  /**
   * Called when the form is submitted and passes validation.
   * `displayName` is `undefined` when the field is left empty.
   */
  onSubmit: (data: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state on the submit button. */
  isLoading?: boolean;
  /** Server or network error message to display above the submit button. */
  error?: string | null;
  /** When `false`, the display name field is hidden. @default true */
  showDisplayName?: boolean;
  /** Called when the user clicks the "Sign in" link. */
  onLoginClick?: () => void;
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
 * Registration form with display name (optional), email, password, and confirm-password fields.
 *
 * Passwords are validated for match on the client before `onSubmit` is called.
 *
 * @example
 * ```tsx
 * const { register, isLoading } = authClient.useAuth();
 * const [error, setError] = useState<string | null>(null);
 *
 * <RegisterForm
 *   onSubmit={async ({ email, password, displayName }) => {
 *     try { await register({ email, password, displayName }); }
 *     catch (e) { setError('Registration failed'); }
 *   }}
 *   isLoading={isLoading}
 *   error={error}
 *   onLoginClick={() => setMode('login')}
 * />
 * ```
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  showDisplayName = true,
  onLoginClick,
  socialProviders,
  onProviderLogin,
  socialLayout = 'icons',
}: RegisterFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validate = () => {
    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRe.test(email.trim())) {
      setEmailError('Invalid email address');
      valid = false;
    } else setEmailError('');

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Minimum 8 characters');
      valid = false;
    } else setPasswordError('');

    if (!confirm) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (confirm !== password) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else setConfirmError('');

    setNameError('');
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      email: email.trim(),
      password,
      displayName: displayName.trim() || undefined,
    });
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
        {showDisplayName && (
          <InputField
            label="Display name"
            type="text"
            placeholder="Jane Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            errorText={nameError}
            disabled={isLoading}
            startIcon={FiUser}
            autoComplete="name"
            hint="Optional — how you'll appear to others"
            testId="register-display-name"
          />
        )}

        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorText={emailError}
          disabled={isLoading}
          startIcon={FiMail}
          autoComplete="email"
          testId="register-email"
        />

        <div className={styles.passwordWrap}>
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={passwordError}
            disabled={isLoading}
            startIcon={FiLock}
            autoComplete="new-password"
            testId="register-password"
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

        <div className={styles.passwordWrap}>
          <InputField
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            errorText={confirmError}
            disabled={isLoading}
            startIcon={FiLock}
            autoComplete="new-password"
            testId="register-confirm"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        {error && (
          <Alert variant="error" onClose={undefined}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          label={isLoading ? 'Creating account…' : 'Create account'}
          variant="primary"
          size="md"
          disabled={isLoading}
          startIcon={isLoading ? undefined : FiUserPlus}
          style={{ width: '100%' }}
          testId="register-submit"
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

      {onLoginClick && (
        <div className={styles.footer}>
          <span>Already have an account?</span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLoginClick();
            }}
          >
            Sign in
          </Link>
        </div>
      )}
    </Form>
  );
}
