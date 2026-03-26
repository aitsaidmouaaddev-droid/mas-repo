/**
 * @module matcher
 * @description Pure route-matching utilities for `@mas/react-router`.
 *
 * No React, no Redux — just string parsing. Fully unit-testable in isolation.
 */
import type { RouteConfig, RouteMatch } from './types';

/**
 * Match a single route pattern against a concrete pathname segment.
 *
 * Supports:
 * - Static segments: `/users` matches `/users`
 * - Named params:    `/users/:id` matches `/users/42` → `{ id: '42' }`
 * - Wildcard:        `*` matches anything
 *
 * @param pattern - Route pattern string (e.g. `'users/:id'`).
 * @param segment - Concrete URL segment to test against.
 * @returns Extracted params on match, or `null` on mismatch.
 *
 * @example
 * ```ts
 * matchSegment('users/:id', 'users/42') // → { id: '42' }
 * matchSegment('users/:id', 'posts/1')  // → null
 * matchSegment('*', 'anything')          // → {}
 * ```
 */
export function matchSegment(pattern: string, segment: string): Record<string, string> | null {
  if (pattern === '*') return {};

  const patternParts = pattern.split('/').filter(Boolean);
  const segmentParts = segment.split('/').filter(Boolean);

  if (patternParts.length !== segmentParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const s = segmentParts[i];
    if (p.startsWith(':')) {
      params[p.slice(1)] = s;
    } else if (p !== s) {
      return null;
    }
  }

  return params;
}

/**
 * Attempt to match a full pathname against a single {@link RouteConfig}.
 *
 * @param route    - Route to test.
 * @param pathname - Full URL pathname (e.g. `'/users/42/posts'`).
 * @param base     - Base path already consumed by ancestor routes. @default `''`
 * @returns {@link RouteMatch} on success, or `null` on mismatch.
 *
 * @example
 * ```ts
 * matchRoute({ path: 'users/:id', component: UserDetail }, '/users/42')
 * // → { route, params: { id: '42' }, pathname: '/users/42' }
 * ```
 */
export function matchRoute(route: RouteConfig, pathname: string, base = ''): RouteMatch | null {
  const fullPattern = `${base}/${route.path}`.replace(/\/+/g, '/');
  const cleanPathname = pathname.replace(/\/+/g, '/') || '/';

  // Exact match
  const params = matchSegment(fullPattern.replace(/^\//, ''), cleanPathname.replace(/^\//, ''));

  if (params !== null) {
    return { route, params, pathname: cleanPathname };
  }

  // Prefix match — allow children to consume the rest
  const patternParts = fullPattern.split('/').filter(Boolean);
  const pathnameParts = cleanPathname.split('/').filter(Boolean);

  if (patternParts.length > pathnameParts.length) return null;

  const prefixParams: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const s = pathnameParts[i];
    if (p === '*') break;
    if (p.startsWith(':')) {
      prefixParams[p.slice(1)] = s;
    } else if (p !== s) {
      return null;
    }
  }

  return {
    route,
    params: prefixParams,
    pathname: '/' + patternParts.join('/'),
  };
}

/**
 * Walk the route tree and return the full ancestor chain (root → leaf)
 * for a given pathname.
 *
 * This is the primary matching function used by {@link RouterProvider}.
 * The result is stored as `matchedTree` in the Redux state and drives both
 * nested {@link Outlet} rendering and {@link useBreadcrumbs}.
 *
 * @param routes   - Top-level route array.
 * @param pathname - Full URL pathname.
 * @param base     - Accumulated base path (used in recursion). @default `''`
 * @returns Ordered array of matches from root to the deepest matched route,
 *          or `null` if no route matched at all.
 *
 * @example
 * ```ts
 * matchTree(routes, '/users/42/posts')
 * // → [
 * //   { route: HomeRoute,    params: {},          pathname: '/' },
 * //   { route: UsersRoute,   params: {},          pathname: '/users' },
 * //   { route: UserRoute,    params: { id:'42' }, pathname: '/users/42' },
 * //   { route: PostsRoute,   params: { id:'42' }, pathname: '/users/42/posts' },
 * // ]
 * ```
 */
export function matchTree(routes: RouteConfig[], pathname: string, base = ''): RouteMatch[] | null {
  for (const route of routes) {
    const match = matchRoute(route, pathname, base);
    if (!match) continue;

    // Exact match — no children needed
    const resolvedPath = match.pathname;
    const remaining = pathname.slice(resolvedPath.length).replace(/^\//, '');

    if (!remaining || route.path === '*') {
      // Check for an index child (path: '') before returning the parent alone
      if (route.children?.length) {
        const indexChild = route.children.find((c) => c.path === '');
        if (indexChild) {
          return [match, { route: indexChild, params: match.params, pathname: match.pathname }];
        }
      }
      return [match];
    }

    // Try children
    if (route.children?.length) {
      const childMatches = matchTree(route.children, pathname, resolvedPath);
      if (childMatches) {
        return [match, ...childMatches];
      }
    }

    // Leaf match (no children) — accept if pathname consumed
    if (pathname === resolvedPath || pathname === resolvedPath + '/') {
      return [match];
    }
  }

  return null;
}

/**
 * Resolve a path with named params substituted from a params map.
 *
 * @example
 * ```ts
 * resolvePath('/users/:id/posts', { id: '42' }) // → '/users/42/posts'
 * ```
 */
export function resolvePath(pattern: string, params: Record<string, string>): string {
  return pattern.replace(/:([^/]+)/g, (_, key) => params[key] ?? `:${key}`);
}
