import type { AuthIdentity, AuthState } from '../interfaces';

/**
 * Discriminated union of all actions accepted by {@link authReducer}.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
type AuthAction<TIdentity extends AuthIdentity> =
  | { type: 'SET_AUTHENTICATED'; identity: TIdentity; accessToken: string; refreshToken: string }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'REFRESH_SUCCESS'; accessToken: string; refreshToken: string };

/**
 * Pure reducer that manages {@link AuthState} transitions.
 *
 * | Action            | Effect                                                   |
 * |-------------------|----------------------------------------------------------|
 * | `SET_AUTHENTICATED` | Stores identity + tokens, sets `isAuthenticated=true`, `isLoading=false` |
 * | `CLEAR_AUTH`      | Resets entire state to unauthenticated defaults          |
 * | `SET_LOADING`     | Toggles the `isLoading` flag only                        |
 * | `REFRESH_SUCCESS` | Replaces both tokens, preserves identity + auth flag     |
 *
 * @typeParam TIdentity - Application-specific identity shape.
 * @param state - Current auth state.
 * @param action - Action to apply.
 * @returns New auth state (never mutates the existing object).
 */
export function authReducer<TIdentity extends AuthIdentity>(
  state: AuthState<TIdentity>,
  action: AuthAction<TIdentity>,
): AuthState<TIdentity> {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        identity: action.identity,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_AUTH':
      return {
        identity: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'REFRESH_SUCCESS':
      return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken };
  }
}

/**
 * Returns a fresh unauthenticated {@link AuthState} with all fields set to
 * their zero values (`null` / `false`).
 *
 * Pass the result directly to `useReducer` as the initial state:
 * ```ts
 * const [state, dispatch] = useReducer(authReducer<MyIdentity>, initialAuthState<MyIdentity>());
 * ```
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export function initialAuthState<TIdentity extends AuthIdentity>(): AuthState<TIdentity> {
  return {
    identity: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  };
}
