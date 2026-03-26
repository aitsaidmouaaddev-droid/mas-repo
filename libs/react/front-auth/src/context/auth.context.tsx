import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AuthIdentity, AuthState, AuthTokenPair } from '../interfaces';
import { authReducer, initialAuthState } from '../store/auth.store';

/**
 * Imperative actions exposed alongside the auth state via {@link AuthContext}.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthStateActions<TIdentity extends AuthIdentity> {
  /** Set authenticated state after a successful login/register. */
  setAuthenticated: (identity: TIdentity, tokens: AuthTokenPair) => void;
  /** Clear authenticated state on logout. */
  clearAuth: () => void;
  /** Update stored tokens after a silent refresh. */
  refreshTokens: (tokens: AuthTokenPair) => void;
  /**
   * Toggle the loading indicator while an async auth operation is in flight.
   *
   * @param isLoading - `true` to show a loading state, `false` to hide it.
   */
  setLoading: (isLoading: boolean) => void;
}

/**
 * Combined value exposed by {@link AuthContext} — both the current
 * {@link AuthState} snapshot and the {@link AuthStateActions} to mutate it.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthContextValue<TIdentity extends AuthIdentity = AuthIdentity>
  extends AuthState<TIdentity>,
    AuthStateActions<TIdentity> {}

/** Internal React context — consumers must use {@link useAuthContext}. */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provider that initialises {@link authReducer} and makes {@link AuthContextValue}
 * available to the component subtree.
 *
 * Wrap your application (or auth-protected subtree) with this component:
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 *
 * @param props.children - Subtree that needs access to auth state.
 */
export function AuthProvider({
  children,
  initialIsLoading = false,
}: {
  children: ReactNode;
  initialIsLoading?: boolean;
}) {
  const [state, dispatch] = useReducer(authReducer<AuthIdentity>, {
    ...initialAuthState<AuthIdentity>(),
    isLoading: initialIsLoading,
  });

  const actions: AuthStateActions<AuthIdentity> = {
    setAuthenticated: (identity, tokens) =>
      dispatch({ type: 'SET_AUTHENTICATED', identity, ...tokens }),
    clearAuth: () => dispatch({ type: 'CLEAR_AUTH' }),
    refreshTokens: (tokens) => dispatch({ type: 'REFRESH_SUCCESS', ...tokens }),
    setLoading: (isLoading) => dispatch({ type: 'SET_LOADING', isLoading }),
  };

  return <AuthContext.Provider value={{ ...state, ...actions }}>{children}</AuthContext.Provider>;
}

/**
 * Reads the current {@link AuthContextValue} from the nearest {@link AuthProvider}.
 *
 * @typeParam TIdentity - Application-specific identity shape; must match the
 *   type used when the Provider was configured.
 * @throws {Error} When called outside of an `<AuthProvider>` tree.
 * @returns The combined auth state + action object.
 *
 * @example
 * ```tsx
 * function ProfileBadge() {
 *   const { identity, isAuthenticated } = useAuthContext<AppIdentity>();
 *   if (!isAuthenticated) return null;
 *   return <span>{identity?.displayName}</span>;
 * }
 * ```
 */
export function useAuthContext<
  TIdentity extends AuthIdentity = AuthIdentity,
>(): AuthContextValue<TIdentity> {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx as unknown as AuthContextValue<TIdentity>;
}
