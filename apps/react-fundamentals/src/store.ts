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

export const store = createAppStore({ qcm: qcmReducer, router: routerReducer }, undefined, {
  // RouteMatch objects store React component functions — intentionally non-serializable
  ignoredPaths: ['router.matchedTree'],
  ignoredActions: ['router/setMatchedTree', 'router/push', 'router/replace', 'router/pop'],
});

/**
 * Explicit state shape so selectors resolve correctly despite
 * `createAppStore` returning a loosely typed state.
 */
export type RootState = { qcm: QcmSliceState; router: RouterState };

/** Inferred dispatch type bound to this store instance. */
export type AppDispatch = typeof store.dispatch;
