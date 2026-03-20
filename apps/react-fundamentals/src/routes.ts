import type { RouteConfig, RouteGuard } from '@mas/react-router';
import { TOKEN_KEYS } from '@mas/front-auth';
import { AppLayout } from './app/AppLayout';
import { AuthRoute } from './app/auth/AuthRoute';
import { QcmLayout } from './app/qcm/QcmLayout/QcmLayout';
import { TdtLayout } from './app/tdt/TdtLayout';
import { TdtChallengeRoute } from './app/tdt/TdtChallengeRoute';
import { QcmModuleSelect } from './app/qcm/QcmModuleSelect/qcm-module-select';
import { QcmSessionRoute } from './app/qcm/QcmSessionRoute/QcmSessionRoute';
import { QcmSessionView } from './app/qcm/QcmSessionView/QcmSessionView';
import { TdtCatalogView } from './app/tdt/tdt-catalog-view';
import { Home } from './app/home/home';
import { ProfilePage } from './app/profile/ProfilePage';
import { SummaryPage } from './app/summary/SummaryPage';

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

  // Public — auth flow (AuthRoute handles all modes internally via state)
  { path: '/auth',          component: AuthRoute },
  { path: '/auth/register', component: AuthRoute },
  { path: '/auth/forgot',   component: AuthRoute },
  { path: '/auth/reset',    component: AuthRoute },

  // Protected — requires login
  {
    path: '/',
    component: AppLayout,
    guard: authGuard,
    children: [

      { path: 'home',
        component: Home,
        meta: { breadcrumb: { label: 'Home' } } },

      { path: 'summary',
        component: SummaryPage,
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
