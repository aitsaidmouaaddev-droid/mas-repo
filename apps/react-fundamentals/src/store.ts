/**
 * @module store
 *
 * Redux store for the `react-fundamentals` app.
 *
 * Uses {@link createAppStore} from `@mas/shared/store` so the app never
 * imports `configureStore` directly from Redux Toolkit.
 *
 * Currently registered slices:
 * - `qcm` — QCM session managed by `@mas/shared/qcm`
 */

import { createAppStore } from '@mas/shared/store';
import { qcmReducer } from '@mas/shared/qcm';
import type { QcmSliceState } from '@mas/shared/qcm';
import { routerReducer } from '@mas/react-router';
import type { RouterState } from '@mas/react-router';
import { uiReducer } from '@mas/react-ui';
import type { UiState } from '@mas/react-ui';

export const store = createAppStore({ qcm: qcmReducer, router: routerReducer, ui: uiReducer }, undefined, {
  ignoredPaths: ['router.matchedTree'],
  ignoredActions: ['router/setMatchedTree', 'router/push', 'router/replace', 'router/pop'],
});

export type RootState = { qcm: QcmSliceState; router: RouterState; ui: UiState };
export type AppDispatch = typeof store.dispatch;
