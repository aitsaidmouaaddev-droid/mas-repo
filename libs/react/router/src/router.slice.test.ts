import { describe, it, expect } from 'vitest';
import {
  routerReducer,
  push,
  replace,
  pop,
  setMatchedTree,
  setError,
  setIdle,
  selectLocation,
  selectPathname,
  selectMatchedTree,
  selectCurrentMatch,
  selectParams,
  selectRouterStatus,
  selectRouterError,
} from './router.slice';
import type { RouterState, RouteMatch } from './types';

const Noop = () => null;

function makeState(overrides: Partial<RouterState> = {}): RouterState {
  return {
    location: { pathname: '/', search: '', hash: '', state: null, key: 'test' },
    matchedTree: [],
    status: 'idle',
    error: null,
    ...overrides,
  };
}

function wrap(state: RouterState) {
  return { router: state };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

describe('routerReducer', () => {
  it('push updates location and sets status loading', () => {
    const state = routerReducer(makeState(), push({ pathname: '/users' }));
    expect(state.location.pathname).toBe('/users');
    expect(state.status).toBe('loading');
  });

  it('replace updates location without clearing error', () => {
    const state = routerReducer(makeState(), replace({ pathname: '/login', search: '?ref=1' }));
    expect(state.location.pathname).toBe('/login');
    expect(state.location.search).toBe('?ref=1');
    expect(state.status).toBe('loading');
  });

  it('pop syncs location from browser event', () => {
    const state = routerReducer(
      makeState(),
      pop({ pathname: '/back', search: '', hash: '', state: null }),
    );
    expect(state.location.pathname).toBe('/back');
    expect(state.status).toBe('loading');
  });

  it('setMatchedTree stores tree and sets status ready', () => {
    const tree: RouteMatch[] = [
      { route: { path: '/', component: Noop }, params: {}, pathname: '/' },
    ];
    const state = routerReducer(makeState({ status: 'loading' }), setMatchedTree(tree));
    expect(state.matchedTree).toHaveLength(1);
    expect(state.status).toBe('ready');
    expect(state.error).toBeNull();
  });

  it('setError stores message and clears tree', () => {
    const tree: RouteMatch[] = [
      { route: { path: '/', component: Noop }, params: {}, pathname: '/' },
    ];
    const state = routerReducer(makeState({ matchedTree: tree }), setError('Not found'));
    expect(state.status).toBe('error');
    expect(state.error).toBe('Not found');
    expect(state.matchedTree).toHaveLength(0);
  });

  it('setIdle resets status', () => {
    const state = routerReducer(makeState({ status: 'loading' }), setIdle());
    expect(state.status).toBe('idle');
  });

  it('each push generates a unique key', () => {
    const s1 = routerReducer(makeState(), push({ pathname: '/a' }));
    const s2 = routerReducer(makeState(), push({ pathname: '/a' }));
    expect(s1.location.key).not.toBe('test');
    expect(s1.location.key).not.toBe(s2.location.key);
  });
});

// ── Selectors ─────────────────────────────────────────────────────────────────

describe('selectors', () => {
  const tree: RouteMatch[] = [
    { route: { path: '/', component: Noop }, params: {}, pathname: '/' },
    { route: { path: ':id', component: Noop }, params: { id: '42' }, pathname: '/42' },
  ];
  const state = wrap(makeState({ matchedTree: tree, status: 'ready' }));

  it('selectLocation returns current location', () => {
    expect(selectLocation(state).pathname).toBe('/');
  });

  it('selectPathname returns pathname string', () => {
    expect(selectPathname(state)).toBe('/');
  });

  it('selectMatchedTree returns full tree', () => {
    expect(selectMatchedTree(state)).toHaveLength(2);
  });

  it('selectCurrentMatch returns the leaf match', () => {
    expect(selectCurrentMatch(state)!.params).toEqual({ id: '42' });
  });

  it('selectParams merges all ancestor params', () => {
    expect(selectParams(state)).toEqual({ id: '42' });
  });

  it('selectRouterStatus returns status', () => {
    expect(selectRouterStatus(state)).toBe('ready');
  });

  it('selectRouterError returns null when no error', () => {
    expect(selectRouterError(state)).toBeNull();
  });
});
