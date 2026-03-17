import { describe, it, expect } from 'vitest';
import { matchSegment, matchRoute, matchTree, resolvePath } from './matcher';
import type { RouteConfig } from './types';

// ── Stub components ───────────────────────────────────────────────────────────
const Noop = () => null;

// ── matchSegment ──────────────────────────────────────────────────────────────

describe('matchSegment', () => {
  it('matches identical static segments', () => {
    expect(matchSegment('users', 'users')).toEqual({});
  });

  it('returns null for different static segments', () => {
    expect(matchSegment('users', 'posts')).toBeNull();
  });

  it('extracts a named param', () => {
    expect(matchSegment('users/:id', 'users/42')).toEqual({ id: '42' });
  });

  it('extracts multiple named params', () => {
    expect(matchSegment('teams/:teamId/users/:userId', 'teams/5/users/42')).toEqual({
      teamId: '5',
      userId: '42',
    });
  });

  it('returns null when segment count differs', () => {
    expect(matchSegment('users/:id', 'users/42/posts')).toBeNull();
  });

  it('wildcard * matches anything', () => {
    expect(matchSegment('*', 'anything-at-all')).toEqual({});
  });

  it('returns null for mismatched static prefix', () => {
    expect(matchSegment('users/:id', 'posts/42')).toBeNull();
  });
});

// ── matchRoute ────────────────────────────────────────────────────────────────

describe('matchRoute', () => {
  it('matches an exact static route', () => {
    const route: RouteConfig = { path: 'users', component: Noop };
    const result = matchRoute(route, '/users');
    expect(result).not.toBeNull();
    expect(result!.params).toEqual({});
  });

  it('extracts params from a dynamic route', () => {
    const route: RouteConfig = { path: 'users/:id', component: Noop };
    const result = matchRoute(route, '/users/42');
    expect(result!.params).toEqual({ id: '42' });
  });

  it('returns null for non-matching path', () => {
    const route: RouteConfig = { path: 'users', component: Noop };
    expect(matchRoute(route, '/posts')).toBeNull();
  });

  it('respects base path', () => {
    const route: RouteConfig = { path: ':id', component: Noop };
    const result = matchRoute(route, '/users/42', '/users');
    expect(result!.params).toEqual({ id: '42' });
  });
});

// ── matchTree ─────────────────────────────────────────────────────────────────

describe('matchTree', () => {
  const routes: RouteConfig[] = [
    {
      path: '/',
      component: Noop,
      meta: { breadcrumb: { label: 'Home' } },
      children: [
        {
          path: 'users',
          component: Noop,
          meta: { breadcrumb: { label: 'Users' } },
          children: [
            {
              path: ':id',
              component: Noop,
              meta: { breadcrumb: { label: (p) => `User ${p.id}` } },
            },
          ],
        },
        {
          path: 'about',
          component: Noop,
          meta: { breadcrumb: { label: 'About' } },
        },
      ],
    },
  ];

  it('matches the root route', () => {
    const tree = matchTree(routes, '/');
    expect(tree).not.toBeNull();
    expect(tree![0].route.path).toBe('/');
  });

  it('matches a nested route', () => {
    const tree = matchTree(routes, '/about');
    expect(tree).not.toBeNull();
    expect(tree!.length).toBeGreaterThanOrEqual(1);
  });

  it('matches a deeply nested dynamic route', () => {
    const tree = matchTree(routes, '/users/42');
    expect(tree).not.toBeNull();
    const leaf = tree![tree!.length - 1];
    expect(leaf.params).toEqual({ id: '42' });
  });

  it('returns null when no route matches', () => {
    expect(matchTree(routes, '/does-not-exist')).toBeNull();
  });
});

// ── resolvePath ───────────────────────────────────────────────────────────────

describe('resolvePath', () => {
  it('substitutes named params', () => {
    expect(resolvePath('/users/:id/posts/:postId', { id: '42', postId: '7' })).toBe(
      '/users/42/posts/7',
    );
  });

  it('leaves unresolved params as-is', () => {
    expect(resolvePath('/users/:id', {})).toBe('/users/:id');
  });

  it('handles paths without params', () => {
    expect(resolvePath('/about', {})).toBe('/about');
  });
});
