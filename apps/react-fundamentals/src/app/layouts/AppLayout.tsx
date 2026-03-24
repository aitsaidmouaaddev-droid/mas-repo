/**
 * Root layout rendered for every route.
 */
import { useState } from 'react';
import { Outlet, useNavigate, useBreadcrumbs, useLocation } from '@mas/react-router';
import { Breadcrumb, Container, FloatingMenuButton, ToastContainer, useToast, useTheme, useIsMobile } from '@mas/react-ui';
import { FiUser, FiBarChart2, FiHome, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { HomePage } from '../pages/HomePage';
import { ToastContext } from '../contexts/ToastContext';
import { DynamicBreadcrumbContext } from '../contexts/DynamicBreadcrumbContext';
import type { DynCrumb } from '../contexts/DynamicBreadcrumbContext';
import { authClient } from '../auth/auth.client';
import styles from './AppLayout.module.scss';

export function AppLayout() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const isHome = pathname === '/'; 
  const { toasts, add, dismiss } = useToast();
  const [dynCrumbs, setDynCrumbs] = useState<DynCrumb[] | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // Wire up auth callbacks so token expiry always triggers logout + redirect
  authClient.useAuth();

  const FAB_ITEMS = [
    { name: 'home', label: 'Home', icon: FiHome },
    { name: 'profile', label: 'Profile', icon: FiUser },
    { name: 'summary', label: 'My Progress', icon: FiBarChart2 },
    { name: 'theme', label: isDark ? 'Light mode' : 'Dark mode', icon: isDark ? FiSun : FiMoon },
  ];

  const handleFabItem = (name: string) => {
    if (name === 'home') navigate('/');
    else if (name === 'profile') navigate('/profile');
    else if (name === 'summary') navigate('/summary');
    else if (name === 'theme') toggleTheme();
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

          <div className={styles.content}>{isHome ? <HomePage /> : <Outlet />}</div>

          <FloatingMenuButton items={FAB_ITEMS} onItemClick={handleFabItem} fabIcon={FiMenu} menuDirection={isMobile ? 'down' : 'up'} fabIconSize={isMobile ? 18 : 24} testId="app-fab" />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </div>
      </DynamicBreadcrumbContext.Provider>
    </ToastContext.Provider>
  );
}
