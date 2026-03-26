/**
 * @packageDocumentation
 *
 * `@mas/front-auth` — reusable React authentication client for Apollo v4 + JWT.
 *
 * ## Overview
 * This library provides a factory function ({@link createAuthClient}) that produces
 * a fully-wired authentication client for any React application that communicates
 * with a GraphQL backend via Apollo Client v4.
 *
 * The factory accepts application-specific configuration (endpoint URI, storage
 * adapter, compiled mutation documents) and returns:
 * - A pre-configured {@link ApolloClient} with an auth + silent-refresh link chain.
 * - A React `Provider` component to host auth state.
 * - A `useAuth()` hook that exposes state and login/register/logout actions.
 *
 * ## Quick start
 * ```ts
 * import { createAuthClient, localStorageAdapter } from '@mas/front-auth';
 *
 * export const authClient = createAuthClient<MyIdentity>({
 *   uri: 'http://localhost:3000/graphql',
 *   storage: localStorageAdapter,
 *   mutations: { login, register, logout },
 * });
 * ```
 *
 * See {@link createAuthClient} for the full API and a complete wiring example.
 */

export type { AuthIdentity, AuthTokenPair, AuthState } from './interfaces';
export type { IStorageAdapter } from './storage/storage.adapter';
export { localStorageAdapter, TOKEN_KEYS } from './storage/storage.adapter';
export { createAuthLink } from './links/auth.link';
export { createRefreshLink } from './links/refresh.link';
export type { RefreshLinkConfig } from './links/refresh.link';
export { createAuthClient } from './client/create-auth-client';
export type {
  AuthClientConfig,
  AuthClientMutations,
  AuthClient,
  MutationConfig,
} from './client/create-auth-client';
export { AuthProvider } from './context/auth.context';
export { useAuth } from './hooks/useAuth';

// UI components
export { AuthPage } from './ui/AuthPage';
export type { AuthPageProps } from './ui/AuthPage';
export { AuthCard } from './ui/AuthCard';
export type { AuthCardProps } from './ui/AuthCard';
export { LoginForm } from './ui/LoginForm';
export type { LoginFormProps } from './ui/LoginForm';
export { RegisterForm } from './ui/RegisterForm';
export type { RegisterFormProps } from './ui/RegisterForm';
export { ForgotPasswordForm } from './ui/ForgotPasswordForm';
export type { ForgotPasswordFormProps } from './ui/ForgotPasswordForm';
export { ResetPasswordForm } from './ui/ResetPasswordForm';
export type { ResetPasswordFormProps } from './ui/ResetPasswordForm';
export { SocialLoginButtons } from './ui/SocialLoginButtons';
export type { SocialLoginButtonsProps, SocialProvider } from './ui/SocialLoginButtons';
export { ProfileCard } from './ui/ProfileCard';
export type { ProfileCardProps } from './ui/ProfileCard';
export { ProfileForm } from './ui/ProfileForm';
export type { ProfileFormProps, ProfileFormData } from './ui/ProfileForm';
export { ChangePasswordForm } from './ui/ChangePasswordForm';
export type { ChangePasswordFormProps } from './ui/ChangePasswordForm';
