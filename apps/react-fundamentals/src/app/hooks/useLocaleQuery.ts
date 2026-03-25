import type { DocumentNode, OperationVariables, QueryHookOptions, QueryResult } from '@apollo/client';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import type { LazyQueryHookOptions, LazyQueryResultTuple } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

/**
 * Drop-in replacement for Apollo `useQuery` that automatically injects
 * `lang: i18n.language` into the query variables.
 *
 * Use this for any query that fetches translatable QCM/TDT content.
 */
export function useLocaleQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] ?? 'en';
  return useQuery<TData, TVariables>(query, {
    ...options,
    variables: { ...(options?.variables ?? {}), lang } as TVariables,
    fetchPolicy: options?.fetchPolicy ?? 'cache-and-network',
  });
}

/**
 * Drop-in replacement for Apollo `useLazyQuery` that automatically injects
 * `lang: i18n.language` into the query variables at call time.
 */
export function useLocaleLazyQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>,
): LazyQueryResultTuple<TData, TVariables> {
  const { i18n } = useTranslation();
  const [execute, result] = useLazyQuery<TData, TVariables>(query, options);

  const lang = i18n.language?.split('-')[0] ?? 'en';
  const executeWithLang: typeof execute = (callOptions) =>
    execute({
      ...callOptions,
      variables: { ...(callOptions?.variables ?? {}), lang } as TVariables,
    });

  return [executeWithLang, result];
}
