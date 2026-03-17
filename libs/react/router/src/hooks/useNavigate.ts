/**
 * @module useNavigate
 * @description Programmatic navigation hook for `@mas/react-router`.
 */
import { useDispatch } from 'react-redux';
import { push, replace } from '../router.slice';
import type { NavigateOptions } from '../types';

/**
 * Returns a `navigate` function for programmatic navigation, plus
 * `.back()` and `.forward()` wrappers around the browser history API.
 *
 * @example navigate to a path
 * ```ts
 * const navigate = useNavigate();
 * navigate('/users/42');
 * ```
 *
 * @example replace current history entry
 * ```ts
 * navigate('/login', { replace: true });
 * ```
 *
 * @example go back
 * ```ts
 * navigate.back();
 * ```
 */
export function useNavigate() {
  const dispatch = useDispatch();

  function navigate(to: string, options: NavigateOptions = {}) {
    const [pathname, qs = ''] = to.split('?');
    const payload = {
      pathname,
      search: qs ? `?${qs}` : '',
      state: options.state,
    };

    if (options.replace) {
      dispatch(replace(payload));
    } else {
      dispatch(push(payload));
    }
  }

  navigate.back = () => {
    if (typeof window !== 'undefined') window.history.back();
  };

  navigate.forward = () => {
    if (typeof window !== 'undefined') window.history.forward();
  };

  return navigate;
}
