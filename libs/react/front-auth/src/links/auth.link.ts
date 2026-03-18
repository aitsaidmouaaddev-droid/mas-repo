import { ApolloLink } from '@apollo/client';

/**
 * Creates an Apollo Link that injects an `Authorization: Bearer <token>` header
 * into every outgoing GraphQL request.
 *
 * The `getToken` callback is invoked on every request so the link always reads
 * the latest token value from storage — there is no stale closure issue.
 *
 * When `getToken` returns `null` (unauthenticated), the request proceeds without
 * an `Authorization` header, allowing public queries/mutations to work normally.
 *
 * @param getToken - Synchronous function that returns the current access token
 *   or `null` if the user is not authenticated.
 * @returns An {@link ApolloLink} that can be composed in an `ApolloLink.from` chain.
 *
 * @example
 * ```ts
 * const authLink = createAuthLink(() => storage.getItem('auth.accessToken'));
 * const client = new ApolloClient({
 *   link: ApolloLink.from([authLink, httpLink]),
 *   cache: new InMemoryCache(),
 * });
 * ```
 */
export function createAuthLink(getToken: () => string | null): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const token = getToken();
    if (token) {
      operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
        headers: { ...headers, authorization: `Bearer ${token}` },
      }));
    }
    return forward(operation);
  });
}
