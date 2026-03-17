/**
 * @module useLocation
 * @description Access the current router location.
 */
import { useSelector } from 'react-redux';
import { selectLocation } from '../router.slice';
import type { RouterLocation, RootWithRouter } from '../types';

/**
 * Returns the current {@link RouterLocation}.
 *
 * Re-renders the component on every navigation event.
 *
 * @example
 * ```tsx
 * const { pathname, search, hash } = useLocation();
 * ```
 */
export function useLocation(): RouterLocation {
  return useSelector((state: RootWithRouter) => selectLocation(state));
}
