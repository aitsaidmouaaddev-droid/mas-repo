/**
 * Core shape of an authenticated user's identity.
 *
 * Extend this interface to add application-specific fields while remaining
 * compatible with every generic in this library.
 *
 * @example
 * ```ts
 * interface AppIdentity extends AuthIdentity {
 *   role: 'admin' | 'user';
 * }
 * ```
 */
export interface AuthIdentity {
  /** Unique identifier for the identity record. */
  id: string;
  /** Primary e-mail address, if known. */
  email?: string | null;
  /** Login handle / username. */
  identityName?: string | null;
  /** Human-readable display name shown in the UI. */
  displayName?: string | null;
  /** URL of the user's profile picture. */
  avatarUrl?: string | null;
  /** Given / first name. */
  firstName?: string | null;
  /** Family / last name. */
  lastName?: string | null;
  /** Date of birth as an ISO date string (`YYYY-MM-DD`). */
  dateOfBirth?: string | null;
}

/**
 * A pair of short-lived access token and long-lived refresh token returned by
 * the authentication server on login, registration, or token refresh.
 */
export interface AuthTokenPair {
  /** Short-lived JWT used in the `Authorization` header. */
  accessToken: string;
  /** Long-lived token used to obtain a new {@link AuthTokenPair} when the access token expires. */
  refreshToken: string;
}

/**
 * The complete authentication state managed by {@link authReducer}.
 *
 * @typeParam TIdentity - Application-specific identity shape, defaults to {@link AuthIdentity}.
 */
export interface AuthState<TIdentity extends AuthIdentity = AuthIdentity> {
  /** The currently authenticated user, or `null` when logged out. */
  identity: TIdentity | null;
  /** Current short-lived JWT, or `null` when unauthenticated. */
  accessToken: string | null;
  /** Current refresh token, or `null` when unauthenticated. */
  refreshToken: string | null;
  /** `true` when a valid session exists. */
  isAuthenticated: boolean;
  /** `true` while an async auth operation (login, refresh) is in progress. */
  isLoading: boolean;
}
