/**
 * @module Link
 * @description Client-side navigation anchor for `@mas/react-router`.
 *
 * Renders a standard `<a>` tag but intercepts clicks to dispatch a
 * {@link push} or {@link replace} action instead of triggering a full page
 * reload. Supports an `activeClassName` applied when the link's `to` path
 * matches the current pathname.
 *
 * @example basic
 * ```tsx
 * <Link to="/users/42">View user</Link>
 * ```
 *
 * @example active styling
 * ```tsx
 * <Link to="/dashboard" activeClassName="nav-active" exact>
 *   Dashboard
 * </Link>
 * ```
 *
 * @example replace instead of push
 * ```tsx
 * <Link to="/login" replace>Go to login</Link>
 * ```
 */
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { push, replace as replaceAction, selectPathname } from './router.slice';
import type { LinkProps, RootWithRouter } from './types';

export function Link({
  to,
  replace: useReplace = false,
  state,
  activeClassName,
  exact = false,
  className,
  onClick,
  children,
  ...rest
}: LinkProps) {
  const dispatch = useDispatch();
  const currentPathname = useSelector((s: RootWithRouter) => selectPathname(s));

  const isActive = exact ? currentPathname === to : currentPathname.startsWith(to);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (ctrl/cmd/shift/meta) open in a new tab as normal
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    onClick?.(e);

    const [pathname, search = ''] = to.split('?');
    const payload = { pathname, search: search ? `?${search}` : '', state };

    if (useReplace) {
      dispatch(replaceAction(payload));
    } else {
      dispatch(push(payload));
    }
  }

  return (
    <a
      href={to}
      className={clsx(className, activeClassName && isActive ? activeClassName : undefined)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
