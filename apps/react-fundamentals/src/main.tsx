import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mas/react-ui';
import { RouterProvider } from '@mas/react-router';
import type { RouteConfig } from '@mas/react-router';
import { store } from './store';
import type { RouterProviderProps } from '@mas/react-router';
import App from './app/app';
import { AppLayout } from './app/AppLayout';
import { QcmLayout } from './app/qcm/QcmLayout';
import { QcmView } from './app/qcm/qcm-view';
import { QcmSummary } from './app/qcm/qcm-summary';
import { TdtLayout } from './app/tdt/TdtLayout';
import { TdtChallengeRoute } from './app/tdt/TdtChallengeRoute';

function formatId(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: AppLayout,
    meta: { breadcrumb: { label: 'Home' } },
    children: [
      {
        path: 'qcm',
        component: QcmLayout,
        meta: { breadcrumb: { label: 'QCM' } },
        children: [
          {
            path: 'quiz',
            component: QcmView,
            meta: { breadcrumb: { label: 'Quiz' } },
          },
          {
            path: 'summary',
            component: QcmSummary,
            meta: { breadcrumb: { label: 'Summary' } },
          },
        ],
      },
      {
        path: 'tdt',
        component: TdtLayout,
        meta: { breadcrumb: { label: 'TDT Challenges' } },
        children: [
          {
            path: ':id',
            component: TdtChallengeRoute,
            meta: { breadcrumb: { label: (p) => formatId(p['id'] ?? '') } },
          },
        ],
      },
    ],
  },
];

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider initialMode="dark" initialFont="robotocondensed">
        <RouterProvider routes={routes} store={store as unknown as RouterProviderProps['store']}>
          <App />
        </RouterProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
