import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
  type DocumentNode,
} from '@apollo/client';
import { type ReactNode, type ReactElement, useEffect } from 'react';
import type { AuthIdentity, AuthTokenPair } from '../interfaces';
import type { IStorageAdapter } from '../storage/storage.adapter';
import { TOKEN_KEYS } from '../storage/storage.adapter';
import { createAuthLink } from '../links/auth.link';
import { createRefreshLink } from '../links/refresh.link';
import { AuthProvider, useAuthContext } from '../context/auth.context';

/**
 * Describes how to call a single GraphQL mutation and extract a typed result
 * from the raw response data.
 *
 * @typeParam TData - Shape of the raw `data` object returned by Apollo.
 * @typeParam TResult - Extracted, strongly-typed result passed to the caller.
 */
export interface MutationConfig<TData, TResult> {
  /** Compiled GraphQL mutation document (use `gql` tag or codegen output). */
  document: DocumentNode;
  /**
   * Extracts the meaningful result from the raw mutation `data` object.
   *
   * @param data - Raw `data` field from the Apollo mutation response.
   * @returns The typed result used by login/register actions.
   */
  extract: (data: TData) => TResult;
  /** Optional factory for query variables (used by the `me` query). */
  variables?: () => Record<string, unknown>;
}

/**
 * The three standard auth mutations that `@mas/front-auth` orchestrates.
 *
 * `logout` is optional — omit it if the backend does not implement server-side
 * session invalidation, and the client will only clear local state.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthClientMutations<TIdentity extends AuthIdentity> {
  /** Login mutation — must return `{ identity, accessToken, refreshToken }`. */
  login: MutationConfig<unknown, { identity: TIdentity } & AuthTokenPair>;
  /** Registration mutation — must return `{ identity, accessToken, refreshToken }`. */
  register: MutationConfig<unknown, { identity: TIdentity } & AuthTokenPair>;
  /** Optional server-side logout mutation. */
  logout?: MutationConfig<unknown, unknown>;
}

/**
 * Configuration object passed to {@link createAuthClient}.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthClientConfig<TIdentity extends AuthIdentity> {
  /** GraphQL endpoint URL (e.g. `http://localhost:3000/graphql`). */
  uri: string;
  /**
   * Token persistence strategy.
   *
   * Use {@link localStorageAdapter} for browser apps or supply a custom
   * {@link IStorageAdapter} for React Native / AsyncStorage.
   */
  storage: IStorageAdapter;
  /** Compiled mutation documents + extractors for each auth operation. */
  mutations: AuthClientMutations<TIdentity>;
  /**
   * Optional `me` query used to hydrate identity on page refresh.
   *
   * When provided, the `Provider` will call this query on mount if stored
   * tokens exist, restoring the authenticated session without a re-login.
   *
   * @example
   * ```ts
   * me: { document: ME, extract: (d: any) => d.me }
   * ```
   */
  me?: MutationConfig<unknown, TIdentity>;
}

/**
 * Strongly-typed auth actions returned by the `useAuth()` hook produced by
 * {@link createAuthClient}.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthActions<TIdentity extends AuthIdentity> {
  /**
   * Executes the login mutation, persists tokens, and updates auth state.
   *
   * @param input - Mutation variables (e.g. `{ login, password }`).
   * @returns The identity and token pair on success.
   */
  login: (input: Record<string, unknown>) => Promise<{ identity: TIdentity } & AuthTokenPair>;
  /**
   * Executes the register mutation, persists tokens, and updates auth state.
   *
   * @param input - Mutation variables (e.g. `{ email, password, ... }`).
   * @returns The identity and token pair on success.
   */
  register: (input: Record<string, unknown>) => Promise<{ identity: TIdentity } & AuthTokenPair>;
  /**
   * Clears local tokens, resets auth state, and optionally calls the server-side
   * logout mutation if one was configured.
   */
  logout: () => Promise<void>;
}

/**
 * Return type of the `useAuth()` hook — merges context state with imperative
 * auth actions.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export type UseAuthReturn<TIdentity extends AuthIdentity> = ReturnType<
  typeof useAuthContext<TIdentity>
> &
  AuthActions<TIdentity>;

/**
 * The object returned by {@link createAuthClient}.
 *
 * @typeParam TIdentity - Application-specific identity shape.
 */
export interface AuthClient<TIdentity extends AuthIdentity> {
  /** Pre-configured Apollo Client instance with auth + refresh link chain. */
  apolloClient: ApolloClient;
  /**
   * React Provider component that must wrap any subtree using `useAuth()`.
   *
   * @param props.children - Component subtree.
   */
  Provider: (props: { children: ReactNode }) => ReactElement;
  /**
   * React hook that returns the current auth state plus login/register/logout actions.
   *
   * Must be called inside `<Provider>`.
   */
  useAuth: () => UseAuthReturn<TIdentity>;
}

/**
 * Factory that creates a fully wired auth client tailored to a specific
 * GraphQL backend and identity shape.
 *
 * The returned {@link AuthClient} encapsulates:
 * - An Apollo Client with a three-link chain: `refreshLink → authLink → httpLink`
 * - A React `Provider` component that hosts the auth state
 * - A `useAuth()` hook exposing state + login/register/logout actions
 *
 * Token storage and mutation definitions are supplied via `config`, keeping
 * this factory decoupled from any concrete backend schema.
 *
 * ### Link chain explained
 * ```
 * refreshLink  — intercepts UNAUTHENTICATED errors, silently refreshes, retries
 *    │
 * authLink     — injects `Authorization: Bearer <token>` on every request
 *    │
 * httpLink     — sends the request over HTTP
 * ```
 *
 * @typeParam TIdentity - Application-specific identity shape extending
 *   {@link AuthIdentity}. All hooks and return types are narrowed to this type.
 *
 * @param config - {@link AuthClientConfig} with endpoint URI, storage adapter,
 *   and compiled mutation documents.
 * @returns An {@link AuthClient} ready to be integrated into your app.
 *
 * @example
 * ```tsx
 * import { gql } from '@apollo/client';
 * import { createAuthClient, localStorageAdapter } from '@mas/front-auth';
 * import type { Identity } from '@mas/react-fundamentals-sot';
 *
 * const LOGIN = gql`
 *   mutation Login($input: LoginInput!) {
 *     login(input: $input) { accessToken refreshToken identity { id email displayName } }
 *   }
 * `;
 *
 * const REGISTER = gql`
 *   mutation Register($input: RegisterInput!) {
 *     register(input: $input) { accessToken refreshToken identity { id email displayName } }
 *   }
 * `;
 *
 * const LOGOUT = gql`
 *   mutation Logout($refreshToken: String!) { logout(refreshToken: $refreshToken) }
 * `;
 *
 * export const authClient = createAuthClient<Identity>({
 *   uri: 'http://localhost:3000/graphql',
 *   storage: localStorageAdapter,
 *   mutations: {
 *     login:    { document: LOGIN,    extract: (d: any) => d.login },
 *     register: { document: REGISTER, extract: (d: any) => d.register },
 *     logout:   { document: LOGOUT,   extract: (d: any) => d.logout },
 *   },
 * });
 *
 * // In your app root:
 * function Root() {
 *   return (
 *     <authClient.Provider>
 *       <ApolloProvider client={authClient.apolloClient}>
 *         <App />
 *       </ApolloProvider>
 *     </authClient.Provider>
 *   );
 * }
 *
 * // In a component:
 * function LoginForm() {
 *   const { login, isLoading } = authClient.useAuth();
 *   return <button onClick={() => login({ login: 'user', password: 'pass' })}>Sign in</button>;
 * }
 * ```
 */
export function createAuthClient<TIdentity extends AuthIdentity>(
  config: AuthClientConfig<TIdentity>,
): AuthClient<TIdentity> {
  const { uri, storage } = config;

  const getAccessToken = () => {
    const token = storage.get(TOKEN_KEYS.ACCESS);
    return token instanceof Promise ? null : token;
  };

  let onRefreshed: ((tokens: AuthTokenPair) => void) | null = null;
  let onRefreshFailed: (() => void) | null = null;

  const refreshLink = createRefreshLink({
    uri,
    getRefreshToken: () => storage.get(TOKEN_KEYS.REFRESH),
    onRefreshed: (tokens) => onRefreshed?.(tokens),
    onRefreshFailed: () => onRefreshFailed?.(),
  });

  const authLink = createAuthLink(getAccessToken);
  const httpLink = new HttpLink({ uri });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([refreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  function HydrationEffect(): null {
    const ctx = useAuthContext<TIdentity>();

    useEffect(() => {
      if (!config.me) return;

      const hydrate = async () => {
        const accessToken = await storage.get(TOKEN_KEYS.ACCESS);
        const refreshToken = await storage.get(TOKEN_KEYS.REFRESH);
        if (!accessToken || !refreshToken) return;

        ctx.setLoading(true);
        try {
          const result = await apolloClient.query({
            query: config.me!.document,
            variables: config.me!.variables?.(),
            fetchPolicy: 'network-only',
          });
          const identity = config.me!.extract(result.data);
          ctx.setAuthenticated(identity, { accessToken, refreshToken });
        } catch {
          // Tokens are invalid/expired — clear them
          await storage.remove(TOKEN_KEYS.ACCESS);
          await storage.remove(TOKEN_KEYS.REFRESH);
          ctx.clearAuth();
        }
      };

      void hydrate();
      // Run only once on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  }

  function Provider({ children }: { children: ReactNode }): ReactElement {
    // Synchronously check if tokens exist (localStorageAdapter returns string | null, not a Promise)
    const tokenCheck = storage.get(TOKEN_KEYS.ACCESS);
    const hasToken = tokenCheck instanceof Promise ? false : Boolean(tokenCheck);
    return (
      <AuthProvider initialIsLoading={hasToken && Boolean(config.me)}>
        {config.me && <HydrationEffect />}
        {children}
      </AuthProvider>
    );
  }

  function useAuth(): UseAuthReturn<TIdentity> {
    const ctx = useAuthContext<TIdentity>();

    onRefreshed = (tokens) => {
      void storage.set(TOKEN_KEYS.ACCESS, tokens.accessToken);
      void storage.set(TOKEN_KEYS.REFRESH, tokens.refreshToken);
      ctx.refreshTokens(tokens);
    };
    onRefreshFailed = () => {
      void storage.remove(TOKEN_KEYS.ACCESS);
      void storage.remove(TOKEN_KEYS.REFRESH);
      ctx.clearAuth();
    };

    const login = async (input: Record<string, unknown>) => {
      const result = await apolloClient.mutate({
        mutation: config.mutations.login.document,
        variables: { input },
      });
      const extracted = config.mutations.login.extract(result.data);
      await storage.set(TOKEN_KEYS.ACCESS, extracted.accessToken);
      await storage.set(TOKEN_KEYS.REFRESH, extracted.refreshToken);
      ctx.setAuthenticated(extracted.identity, extracted);
      return extracted;
    };

    const register = async (input: Record<string, unknown>) => {
      const result = await apolloClient.mutate({
        mutation: config.mutations.register.document,
        variables: { input },
      });
      const extracted = config.mutations.register.extract(result.data);
      await storage.set(TOKEN_KEYS.ACCESS, extracted.accessToken);
      await storage.set(TOKEN_KEYS.REFRESH, extracted.refreshToken);
      ctx.setAuthenticated(extracted.identity, extracted);
      return extracted;
    };

    const logout = async () => {
      if (config.mutations.logout) {
        const refreshToken = await storage.get(TOKEN_KEYS.REFRESH);
        await apolloClient.mutate({
          mutation: config.mutations.logout.document,
          variables: { refreshToken },
        });
      }
      await storage.remove(TOKEN_KEYS.ACCESS);
      await storage.remove(TOKEN_KEYS.REFRESH);
      ctx.clearAuth();
      await apolloClient.clearStore();
    };

    return { ...ctx, login, register, logout };
  }

  return { apolloClient, Provider, useAuth };
}
