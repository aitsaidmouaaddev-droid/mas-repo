/**
 * Root layout rendered for every protected route.
 */
import { useState } from 'react';
import { Outlet, useNavigate, useBreadcrumbs } from '@mas/react-router';
import { Breadcrumb, Container, FloatingMenuButton, ToastContainer, useToast, useTheme, useIsMobile, LocalePicker } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiUser, FiBarChart2, FiHome, FiMenu, FiSun, FiMoon, FiBookOpen, FiLogOut } from 'react-icons/fi';
import { ToastContext } from '../contexts/ToastContext';
import { DynamicBreadcrumbContext } from '../contexts/DynamicBreadcrumbContext';
import type { DynCrumb } from '../contexts/DynamicBreadcrumbContext';
import { authClient } from '../auth/auth.client';
import styles from './AppLayout.module.scss';

export function AppLayout() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { toasts, add, dismiss } = useToast();
  const [dynCrumbs, setDynCrumbs] = useState<DynCrumb[] | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const { t } = useT();
  const auth = authClient.useAuth();

  const FAB_ITEMS = [
    { name: 'landing', label: t('nav.home'), icon: FiHome },
    { name: 'learn', label: t('nav.learn'), icon: FiBookOpen },
    { name: 'summary', label: t('nav.progress'), icon: FiBarChart2 },
    { name: 'profile', label: t('nav.profile'), icon: FiUser },
    { name: 'theme', label: isDark ? t('nav.lightMode') : t('nav.darkMode'), icon: isDark ? FiSun : FiMoon },
    { name: 'logout', label: t('auth.signOut'), icon: FiLogOut },
  ];

  const handleFabItem = (name: string) => {
    if (name === 'landing') navigate('/');
    else if (name === 'learn') navigate('/learn');
    else if (name === 'profile') navigate('/profile');
    else if (name === 'summary') navigate('/summary');
    else if (name === 'theme') toggleTheme();
    else if (name === 'logout') {
      auth.logout();
      navigate('/');
    }
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
          <title>Mouaad Ait Said — Learn</title>
          {displayCrumbs.length > 1 && (
            <div className={styles.breadcrumbBar}>
              <Container maxWidth="lg">
                <Breadcrumb items={displayCrumbs} />
              </Container>
            </div>
          )}

          <div className={styles.content}>
            <Outlet />
          </div>

          <FloatingMenuButton items={FAB_ITEMS} onItemClick={handleFabItem} fabIcon={FiMenu} menuDirection={isMobile ? 'down' : 'up'} fabIconSize={isMobile ? 18 : 24} testId="app-fab" extraContent={<LocalePicker display="flag-label" menuPosition={isMobile ? 'bottom' : 'left'} flagSize={18} styleOverride={{ trigger: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: 'var(--radius-pill)', border: 'none', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.12))', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', fontSize: '14px', color: 'var(--color-text)', width: '100%' } }} />} />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </div>
      </DynamicBreadcrumbContext.Provider>
    </ToastContext.Provider>
  );
}
