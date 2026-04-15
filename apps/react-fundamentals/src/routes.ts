import type { RouteConfig } from '@mas/react-router';

import { LandingPage } from './app/pages/LandingPage';
import { HomePage } from './app/pages/HomePage';
import { ProfilePage } from './app/pages/ProfilePage';
import { ProgressPage } from './app/pages/ProgressPage';
import { AuthPage } from './app/pages/AuthPage';
import { QcmModuleSelectPage } from './app/pages/QcmModuleSelectPage';
import { QcmSessionPage } from './app/pages/QcmSessionPage';
import { TdtListPage } from './app/pages/TdtListPage';
import { GamesPage } from './app/pages/GamesPage';
import { SnakePage } from './app/pages/SnakePage';
import { FlappyPage } from './app/pages/FlappyPage';
import { MoroccanRunnerPage } from './app/pages/MoroccanRunnerPage';
import { AppLayout } from './app/layouts/AppLayout';
import { QcmLayout } from './app/layouts/QcmLayout';
import { TdtLayout } from './app/layouts/TdtLayout';
import { QcmSessionRoute } from './app/routes/QcmSessionRoute';
import { TdtChallengeRoute } from './app/routes/TdtChallengeRoute';
import { RequireAuth } from './app/guards/RequireAuth';
import { RassTangPage } from './app/pages/RassTangPage';
import { AboutPage } from './app/pages/AboutPage';

// ── Routes ────────────────────────────────────────────────────────────────────

export const routes: RouteConfig[] = [
  // Public — landing / CV
  { path: '/', component: LandingPage, meta: { title: 'Aitsa — Full-Stack Developer' } },
  { path: '/about', component: AboutPage, meta: { title: 'About — Mouaad AIT SAID' } },
  { path: '/rass-tang', component: RassTangPage, meta: { title: 'Agenda — Privé' } },

  // Public — auth flow
  { path: '/auth', component: AuthPage },
  { path: '/auth/register', component: AuthPage },
  { path: '/auth/forgot', component: AuthPage },
  { path: '/auth/reset', component: AuthPage },

  // Protected — requires login (RequireAuth handles redirect)
  {
    path: '/',
    component: RequireAuth,
    children: [
      {
        path: '',
        component: AppLayout,
        children: [
          { path: 'learn', component: HomePage, meta: { breadcrumb: { label: 'Home' } } },

          {
            path: 'summary',
            component: ProgressPage,
            meta: { breadcrumb: { label: 'My Progress' } },
          },

          { path: 'profile', component: ProfilePage, meta: { breadcrumb: { label: 'Profile' } } },

          { path: 'games', component: GamesPage, meta: { breadcrumb: { label: 'Games' } } },
          { path: 'games/snake', component: SnakePage, meta: { breadcrumb: { label: 'Snake' } } },
          {
            path: 'games/flappy-bird',
            component: FlappyPage,
            meta: { breadcrumb: { label: 'Flappy Bird' } },
          },
          {
            path: 'games/moroccan-runner',
            component: MoroccanRunnerPage,
            meta: { breadcrumb: { label: 'Moroccan Runner' } },
          },

          // QCM
          {
            path: 'qcm',
            component: QcmLayout,
            meta: { breadcrumb: { label: 'QCM' } },
            children: [
              {
                path: '',
                component: QcmModuleSelectPage,
                meta: { breadcrumb: { label: 'Modules' } },
              },
              { path: ':sessionId', component: QcmSessionRoute },
              { path: ':sessionId/:moduleId', component: QcmSessionPage },
            ],
          },

          // TDT
          {
            path: 'tdt',
            component: TdtLayout,
            meta: { breadcrumb: { label: 'TDT' } },
            children: [
              { path: '', component: TdtListPage, meta: { breadcrumb: { label: 'Challenges' } } },
              { path: ':sessionId/:challengeId', component: TdtChallengeRoute },
            ],
          },
        ],
      },
    ],
  },
];
