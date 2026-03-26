/**
 * @module useParams
 * @description Access dynamic route parameters.
 */
import { useSelector } from 'react-redux';
import { selectParams } from '../router.slice';
import type { RootWithRouter } from '../types';

/**
 * Returns the merged params from all ancestor route matches.
 *
 * Params from deeper routes shadow shallower ones with the same key.
 *
 * @example
 * ```tsx
 * // Route: /teams/:teamId/users/:userId
 * // URL:   /teams/5/users/42
 * const { teamId, userId } = useParams();
 * // → { teamId: '5', userId: '42' }
 * ```
 */
export function useParams(): Record<string, string> {
  return useSelector((state: RootWithRouter) => selectParams(state));
}
