/**
 * Root layout rendered for every route.
 *
 * - Shows a breadcrumb nav bar on any page deeper than Home.
 * - Renders {@link Home} directly at `/` (no nested outlet needed).
 * - Renders `<Outlet />` for all other routes so children can paint themselves.
 */
import { useState } from 'react';
import { Outlet, useNavigate, useBreadcrumbs, useLocation } from '@mas/react-router';
import { Breadcrumb, Container, FloatingMenuButton, ToastContainer, useToast } from '@mas/react-ui';
import { FiUser, FiBarChart2, FiHome, FiMenu } from 'react-icons/fi';
import { Home } from './home/home';
import { ToastContext } from './ToastContext';
import { DynamicBreadcrumbContext } from './DynamicBreadcrumbContext';
import type { DynCrumb } from './DynamicBreadcrumbContext';
import styles from './AppLayout.module.scss';

const FAB_ITEMS = [
  { name: 'home', label: 'Home', icon: FiHome },
  { name: 'profile', label: 'Profile', icon: FiUser },
  { name: 'summary', label: 'My Progress', icon: FiBarChart2 },
];

export function AppLayout() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { toasts, add, dismiss } = useToast();
  const [dynCrumbs, setDynCrumbs] = useState<DynCrumb[] | null>(null);

  const handleFabItem = (name: string) => {
    if (name === 'home') navigate('/');
    else if (name === 'profile') navigate('/profile');
    else if (name === 'summary') navigate('/summary');
  };

  const displayCrumbs = dynCrumbs
    ? dynCrumbs.map((c, i, arr) => ({
        label: c.label,
        href: c.path && i < arr.length - 1 ? c.path : undefined,
        onClick: c.path && i < arr.length - 1 ? () => navigate(c.path!) : undefined,
      }))
    : crumbs.map((c) => ({
        label: c.label,
        href: c.active ? undefined : c.path,
        onClick: c.active ? undefined : () => navigate(c.path),
      }));

  return (
    <ToastContext.Provider value={add}>
      <DynamicBreadcrumbContext.Provider value={setDynCrumbs}>
        <div className={styles.layout}>
          {!isHome && displayCrumbs.length > 1 && (
            <div className={styles.breadcrumbBar}>
              <Container maxWidth="lg">
                <Breadcrumb items={displayCrumbs} />
              </Container>
            </div>
          )}

          <div className={styles.content}>{isHome ? <Home /> : <Outlet />}</div>

          <FloatingMenuButton items={FAB_ITEMS} onItemClick={handleFabItem} fabIcon={FiMenu} testId="app-fab" />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </div>
      </DynamicBreadcrumbContext.Provider>
    </ToastContext.Provider>
  );
}
