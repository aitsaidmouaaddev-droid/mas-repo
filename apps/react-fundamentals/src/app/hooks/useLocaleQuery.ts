import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { useT } from '@mas/shared/i18n';

/**
 * Drop-in replacement for Apollo `useQuery` that automatically injects
 * `lang: i18n.language` into the query variables.
 *
 * Use this for any query that fetches translatable QCM/TDT content.
 */
export function useLocaleQuery<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(query: DocumentNode, options?: useQuery.Options<TData, TVariables>) {
  const { i18n } = useT();
  const lang = i18n.language?.split('-')[0] ?? 'en';
  return useQuery<TData, TVariables>(query, {
    ...options,
    variables: { ...(options?.variables ?? {}), lang } as unknown as TVariables,
    fetchPolicy: options?.fetchPolicy ?? 'cache-and-network',
  });
}

/**
 * Drop-in replacement for Apollo `useLazyQuery` that automatically injects
 * `lang: i18n.language` into the query variables at call time.
 */
export function useLocaleLazyQuery<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(query: DocumentNode, options?: useLazyQuery.Options<TData, TVariables>) {
  const { i18n } = useT();
  const lang = i18n.language?.split('-')[0] ?? 'en';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [execute, result] = useLazyQuery<TData, TVariables>(query, options) as [any, any];

  const wrappedExecute = (callOptions?: Record<string, unknown>) =>
    execute({
      ...callOptions,
      variables: { ...(callOptions?.variables ?? {}), lang } as unknown as TVariables,
    });

  return [wrappedExecute, result] as useLazyQuery.ResultTuple<TData, TVariables>;
}
