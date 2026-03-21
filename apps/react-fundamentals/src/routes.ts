import type { RouteConfig, RouteGuard } from '@mas/react-router';
import { TOKEN_KEYS } from '@mas/front-auth';

import { QcmSessionView } from './app/qcm/QcmSessionView/QcmSessionView';
import { TdtCatalogView } from './app/tdt/tdt-catalog-view';
import { HomePage } from './app/pages/HomePage';
import { ProfilePage } from './app/pages/ProfilePage';
import { ProgressPage } from './app/pages/ProgressPage';
import { AuthPage } from './app/pages/AuthPage';
import { AppLayout } from './app/layouts/AppLayout';
import { QcmLayout } from './app/layouts/QcmLayout';
import { TdtLayout } from './app/layouts/TdtLayout';
import { QcmModuleSelect } from './app/qcm/QcmModuleSelect/qcm-module-select';
import { QcmSessionRoute } from './app/routes/QcmSessionRoute';
import { TdtChallengeRoute } from './app/routes/TdtChallengeRoute';

// ── Auth guard ────────────────────────────────────────────────────────────────

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? Date.now() / 1000 < payload.exp : true;
  } catch {
    return false;
  }
}

const authGuard: RouteGuard = {
  canActivate: () => isTokenValid(localStorage.getItem(TOKEN_KEYS.ACCESS)),
  redirectTo: '/auth',
};

// ── Routes ────────────────────────────────────────────────────────────────────

export const routes: RouteConfig[] = [

  // Public — auth flow
  { path: '/auth',          component: AuthPage },
  { path: '/auth/register', component: AuthPage },
  { path: '/auth/forgot',   component: AuthPage },
  { path: '/auth/reset',    component: AuthPage },

  // Protected — requires login
  {
    path: '/',
    component: AppLayout,
    guard: authGuard,
    children: [

      { path: 'home',
        component: HomePage,
        meta: { breadcrumb: { label: 'Home' } } },

      { path: 'summary',
        component: ProgressPage,
        meta: { breadcrumb: { label: 'My Progress' } } },

      { path: 'profile',
        component: ProfilePage,
        meta: { breadcrumb: { label: 'Profile' } } },

      // QCM
      {
        path: 'qcm',
        component: QcmLayout,
        meta: { breadcrumb: { label: 'QCM' } },
        children: [
          { path: '', component: QcmModuleSelect, meta: { breadcrumb: { label: 'Modules' } } },
          { path: ':sessionId', component: QcmSessionRoute },
          { path: ':sessionId/:moduleId', component: QcmSessionView },
        ],
      },

      // TDT
      {
        path: 'tdt',
        component: TdtLayout,
        meta: { breadcrumb: { label: 'TDT' } },
        children: [
          { path: '', component: TdtCatalogView, meta: { breadcrumb: { label: 'Challenges' } } },
          { path: ':sessionId/:challengeId', component: TdtChallengeRoute },
        ],
      },

    ],
  },
];
