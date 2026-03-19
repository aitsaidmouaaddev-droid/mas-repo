import type { RouteConfig, RouteGuard } from '@mas/react-router';
import { TOKEN_KEYS } from '@mas/front-auth';
import { AppLayout } from './app/AppLayout';
import { AuthRoute } from './app/auth/AuthRoute';
import { QcmLayout } from './app/qcm/QcmLayout';
import { TdtLayout } from './app/tdt/TdtLayout';
import { TdtChallengeRoute } from './app/tdt/TdtChallengeRoute';
import { QcmModuleSelect } from './app/qcm/qcm-module-select';
import { QcmModulePage } from './app/qcm/QcmModulePage';
import { QcmQuestionPage } from './app/qcm/QcmQuestionPage';
import { QcmView } from './app/qcm/qcm-view';
import { TdtCatalogView } from './app/tdt/tdt-catalog-view';
import { Home } from './app/home/home';
import { ProfilePage } from './app/profile/ProfilePage';
import { SummaryPage } from './app/summary/SummaryPage';

// ── Auth guard ────────────────────────────────────────────────────────────────

const authGuard: RouteGuard = {
  canActivate: () => !!localStorage.getItem(TOKEN_KEYS.ACCESS),
  redirectTo: '/auth',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatId(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

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
          { path: '',
            component: QcmModuleSelect },

          { path: 'quiz',
            component: QcmView },

          { path: ':moduleId',
            component: QcmModulePage,
            meta: { breadcrumb: { label: (p) => p['moduleId'] } },
            children: [
              { path: ':questionId',
                component: QcmQuestionPage,
                meta: { breadcrumb: { label: (p) => p['questionId'] } } },
            ],
          },
        ],
      },

      // TDT
      {
        path: 'tdt',
        component: TdtLayout,
        meta: { breadcrumb: { label: 'TDT' } },
        children: [
          { path: '',
            component: TdtCatalogView },

          { path: ':id',
            component: TdtChallengeRoute,
            meta: { breadcrumb: { label: (p) => formatId(p['id'] ?? '') } } },
        ],
      },

    ],
  },
];
