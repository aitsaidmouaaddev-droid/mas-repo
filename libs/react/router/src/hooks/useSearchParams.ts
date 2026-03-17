/**
 * @module useSearchParams
 * @description Read and update URL query string parameters.
 */
import { useSelector, useDispatch } from 'react-redux';
import { selectLocation, push } from '../router.slice';
import type { RootWithRouter } from '../types';

export interface UseSearchParamsResult {
  /** Current parsed query params. */
  params: URLSearchParams;
  /** Set a query param and navigate (pushState). */
  set: (key: string, value: string) => void;
  /** Remove a query param and navigate. */
  delete: (key: string) => void;
  /** Replace all params with a new set. */
  setAll: (params: Record<string, string>) => void;
}

/**
 * Returns the current search params and helpers to update them.
 *
 * Each mutation triggers a `push` navigation so the URL and Redux state
 * stay in sync.
 *
 * @example read
 * ```tsx
 * const { params } = useSearchParams();
 * const sort = params.get('sort'); // 'asc'
 * ```
 *
 * @example write
 * ```tsx
 * const { set, delete: del } = useSearchParams();
 * set('page', '2');  // → ?sort=asc&page=2
 * del('sort');       // → ?page=2
 * ```
 */
export function useSearchParams(): UseSearchParamsResult {
  const dispatch = useDispatch();
  const location = useSelector((state: RootWithRouter) => selectLocation(state));
  const params = new URLSearchParams(location.search);

  function navigate(next: URLSearchParams) {
    const search = next.toString() ? `?${next.toString()}` : '';
    dispatch(push({ pathname: location.pathname, search, hash: location.hash }));
  }

  return {
    params,
    set(key: string, value: string) {
      const next = new URLSearchParams(params);
      next.set(key, value);
      navigate(next);
    },
    delete(key: string) {
      const next = new URLSearchParams(params);
      next.delete(key);
      navigate(next);
    },
    setAll(record: Record<string, string>) {
      navigate(new URLSearchParams(record));
    },
  };
}
