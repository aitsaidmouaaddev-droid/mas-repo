/**
 * @module useMatch
 * @description Test an arbitrary pattern against the current pathname.
 */
import { useSelector } from 'react-redux';
import { selectPathname } from '../router.slice';
import { matchSegment } from '../matcher';
import type { RootWithRouter } from '../types';

/**
 * Returns extracted params if the given pattern matches the current pathname,
 * or `null` if it does not.
 *
 * Useful for conditional rendering based on the active route without
 * needing a full route config entry.
 *
 * @param pattern - Route pattern to test, e.g. `'/users/:id'`.
 *
 * @example
 * ```tsx
 * const match = useMatch('/users/:id');
 * if (match) {
 *   console.log(match.id); // '42'
 * }
 * ```
 */
export function useMatch(pattern: string): Record<string, string> | null {
  const pathname = useSelector((state: RootWithRouter) => selectPathname(state));
  return matchSegment(pattern.replace(/^\//, ''), pathname.replace(/^\//, ''));
}
