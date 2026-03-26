import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RouterProvider } from './RouterProvider';
import { Outlet } from './Outlet';
import { routerReducer } from './router.slice';
import type { RouteConfig, RouterState } from './types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeStore(pathname = '/') {
  const preloadedState: { router: RouterState } = {
    router: {
      location: { pathname, search: '', hash: '', state: null, key: 'test' },
      matchedTree: [],
      status: 'idle',
      error: null,
    },
  };
  return configureStore({ reducer: { router: routerReducer }, preloadedState });
}

function Home() {
  return <div>Home</div>;
}
function AuthPage() {
  return <div>Auth</div>;
}
function Layout() {
  return (
    <div>
      <span>Layout</span>
      <Outlet />
    </div>
  );
}

function wrap(store: ReturnType<typeof makeStore>, routes: RouteConfig[]) {
  return render(
    <Provider store={store}>
      <RouterProvider routes={routes} store={store as never}>
        <Outlet />
      </RouterProvider>
    </Provider>,
  );
}

async function settled(store: ReturnType<typeof makeStore>) {
  await act(async () => {
    await new Promise<void>((res) => setTimeout(res, 20));
  });
  await waitFor(() => expect(store.getState().router.status).not.toBe('idle'));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RouterProvider', () => {
  beforeEach(() => {
    vi.spyOn(window.history, 'pushState').mockImplementation(() => undefined);
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => undefined);
  });

  it('renders a matched route with no guard', async () => {
    const store = makeStore('/auth');
    const routes: RouteConfig[] = [{ path: '/auth', component: AuthPage }];

    wrap(store, routes);
    await settled(store);

    expect(store.getState().router.status).toBe('ready');
    expect(store.getState().router.matchedTree[0]?.route?.component).toBe(AuthPage);
    expect(screen.getByText('Auth')).toBeTruthy();
  });

  it('redirects and renders the redirect target immediately when a guard denies access', async () => {
    const store = makeStore('/');
    const routes: RouteConfig[] = [
      { path: '/auth', component: AuthPage },
      {
        path: '/',
        component: Home,
        guard: { canActivate: () => false, redirectTo: '/auth' },
      },
    ];

    wrap(store, routes);
    await settled(store);

    // Core invariant: guard redirect resolves to /auth without needing a page refresh
    expect(store.getState().router.status).toBe('ready');
    expect(store.getState().router.location.pathname).toBe('/auth');
    expect(store.getState().router.matchedTree[0]?.route?.component).toBe(AuthPage);
    expect(screen.getByText('Auth')).toBeTruthy();
    expect(screen.queryByText('Home')).toBeNull();
  });

  it('renders the guarded route when the guard allows access', async () => {
    const store = makeStore('/');
    const routes: RouteConfig[] = [
      { path: '/auth', component: AuthPage },
      {
        path: '/',
        component: Home,
        guard: { canActivate: () => true, redirectTo: '/auth' },
      },
    ];

    wrap(store, routes);
    await settled(store);

    expect(store.getState().router.status).toBe('ready');
    expect(store.getState().router.matchedTree[0]?.route?.component).toBe(Home);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.queryByText('Auth')).toBeNull();
  });

  it('renders nested routes via Outlet', async () => {
    const store = makeStore('/dashboard');
    const routes: RouteConfig[] = [
      {
        path: '/dashboard',
        component: Layout,
        children: [{ path: '', component: Home }],
      },
    ];

    wrap(store, routes);
    await settled(store);

    expect(store.getState().router.status).toBe('ready');
    expect(screen.getByText('Layout')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renders nothing while a guard is pending (loading state)', () => {
    const store = makeStore('/');
    const routes: RouteConfig[] = [
      {
        path: '/',
        component: Home,
        guard: { canActivate: () => new Promise(() => undefined), redirectTo: '/auth' },
      },
    ];

    const { container } = wrap(store, routes);

    // Router hasn't resolved yet — nothing should be rendered
    expect(container.firstChild).toBeNull();
  });
});
