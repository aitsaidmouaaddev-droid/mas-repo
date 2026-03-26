import { type ApolloLink, Observable } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import type { AuthTokenPair } from '../interfaces';

/**
 * Configuration for {@link createRefreshLink}.
 */
export interface RefreshLinkConfig {
  /** GraphQL endpoint URL — used to call the refresh mutation via fetch. */
  uri: string;
  /** Returns the current refresh token from storage. */
  getRefreshToken: () => string | null | Promise<string | null>;
  /** Called with new tokens on successful refresh — update storage + auth state here. */
  onRefreshed: (tokens: AuthTokenPair) => void;
  /** Called when refresh fails (expired / revoked) — log the user out here. */
  onRefreshFailed: () => void;
}

/**
 * Inline `refreshToken` GraphQL mutation sent directly via `fetch` to avoid
 * circular link-chain issues during the refresh attempt.
 */
const REFRESH_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

/**
 * Executes the refresh token mutation against the backend and returns a new
 * {@link AuthTokenPair}.
 *
 * @param config - Link configuration providing the endpoint URI and token getter.
 * @throws When no refresh token is available, the network request fails, or
 *   the server returns errors.
 */
async function fetchNewTokens(config: RefreshLinkConfig): Promise<AuthTokenPair> {
  const refreshToken = await config.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(config.uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: REFRESH_MUTATION,
      variables: { token: refreshToken },
    }),
  });

  const json = (await res.json()) as {
    data?: { refreshToken: AuthTokenPair };
    errors?: unknown[];
  };
  if (json.errors || !json.data?.refreshToken) throw new Error('Refresh failed');
  return json.data.refreshToken;
}

/**
 * Creates an Apollo Link that transparently refreshes an expired access token
 * and retries the failing operation — with no user interaction required.
 *
 * ### Refresh strategy
 * 1. The link wraps an {@link ErrorLink} that inspects every GraphQL error.
 * 2. When an `UNAUTHENTICATED` extension code is detected, it calls
 *    {@link fetchNewTokens} using the stored refresh token.
 * 3. On success it calls `onRefreshed` (so the caller can persist the new pair
 *    and update React state), injects the fresh token into the retried request,
 *    and re-subscribes `forward(operation)`.
 * 4. On failure it calls `onRefreshFailed` (so the caller can clear state and
 *    redirect to login).
 *
 * Place this link **before** the auth link in the chain so that the retried
 * request already carries the updated token when the auth link runs:
 * ```
 * ApolloLink.from([refreshLink, authLink, httpLink])
 * ```
 *
 * @param config - {@link RefreshLinkConfig} with endpoint URI and callbacks.
 * @returns An {@link ApolloLink} to include at the front of the link chain.
 */
export function createRefreshLink(config: RefreshLinkConfig): ApolloLink {
  return new ErrorLink(({ error, operation, forward }) => {
    const isUnauthenticated =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some((e) => e.extensions?.['code'] === 'UNAUTHENTICATED');

    if (!isUnauthenticated) return;

    return new Observable((observer) => {
      fetchNewTokens(config)
        .then((tokens) => {
          config.onRefreshed(tokens);
          operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
            headers: { ...headers, authorization: `Bearer ${tokens.accessToken}` },
          }));
          forward(operation).subscribe(observer);
        })
        .catch((err: unknown) => {
          config.onRefreshFailed();
          observer.error(err);
        });
    });
  });
}
