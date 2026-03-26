/**
 * @module Redirect
 * @description Declarative redirect component for `@mas/react-router`.
 *
 * Renders nothing — dispatches a {@link replace} action on mount, which
 * triggers the router to navigate to `to` without adding a history entry.
 *
 * @example inside a guard-less route
 * ```tsx
 * { path: '/old-path', component: () => <Redirect to="/new-path" /> }
 * ```
 *
 * @example conditional redirect
 * ```tsx
 * function ProtectedPage() {
 *   const isLoggedIn = useSelector(selectIsLoggedIn);
 *   if (!isLoggedIn) return <Redirect to="/login" />;
 *   return <Dashboard />;
 * }
 * ```
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { replace } from './router.slice';

interface RedirectProps {
  /** Target path to redirect to. */
  to: string;
  /** Optional state forwarded to the new location. */
  state?: unknown;
}

export function Redirect({ to, state }: RedirectProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const [pathname, search = ''] = to.split('?');
    dispatch(replace({ pathname, search: search ? `?${search}` : '', state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return null;
}
