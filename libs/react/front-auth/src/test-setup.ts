import '@testing-library/jest-dom/vitest';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

/* eslint-disable @typescript-eslint/no-empty-function */
Element.prototype.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

/**
 * Initialise a shared i18next instance with English translations so that
 * components using `useT()` render readable text in tests.
 */
i18next.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        auth: {
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm password',
          firstName: 'First name',
          lastName: 'Last name',
          displayName: 'Display name',
          username: 'Username',
          avatarUrl: 'Avatar URL',
          dateOfBirth: 'Date of birth',
          emailRequired: 'Email is required',
          invalidEmail: 'Invalid email address',
          passwordRequired: 'Password is required',
          minChars: 'Minimum 8 characters',
          confirmRequired: 'Please confirm your password',
          passwordsMismatch: 'Passwords do not match',
          currentPassword: 'Current password',
          currentRequired: 'Current password is required',
          newPassword: 'New password',
          newPasswordRequired: 'New password is required',
          confirmNewRequired: 'Please confirm your new password',
          confirmNewPassword: 'Confirm new password',
          signingIn: 'Signing in\u2026',
          signInBtn: 'Sign in',
          forgotPassword: 'Forgot password?',
          noAccount: "Don't have an account?",
          createAccount: 'Create account',
          creatingAccount: 'Creating account\u2026',
          hasAccount: 'Already have an account?',
          displayNameHint: "Optional \u2014 how you'll appear to others",
          avatarHint: 'Paste any public image URL',
          avatarPreview: 'Avatar preview',
          emailReadonly: 'Email cannot be changed after registration',
          saving: 'Saving\u2026',
          saveChanges: 'Save changes',
          updating: 'Updating\u2026',
          updatePassword: 'Update password',
          forgotDesc: "Enter your email and we'll send you a link to reset your password.",
          sending: 'Sending\u2026',
          sendResetLink: 'Send reset link',
          resetSent:
            'If <strong>{{email}}</strong> is registered, a reset link has been sent. Check your inbox.',
          backToSignIn: 'Back to sign in',
          missingToken: 'Missing reset token. Please use the link from your email.',
          passwordUpdated: 'Password updated successfully.',
          signInNewPassword: 'Sign in with new password',
          resetDesc: 'Choose a strong password of at least 8 characters.',
          setNewPassword: 'Set new password',
          editProfile: 'Edit profile',
          changePassword: 'Change password',
          signOut: 'Sign out',
          active: 'Active',
          member: 'Member',
          orContinueWith: 'or continue with',
          continueWith: 'Continue with {{provider}}',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
        },
        common: {
          cancel: 'Cancel',
        },
      },
    },
  },
  interpolation: { escapeValue: false },
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
