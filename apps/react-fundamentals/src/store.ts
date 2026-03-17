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

export const store = createAppStore({ qcm: qcmReducer });

/**
 * Explicit state shape so selectors (which expect `{ qcm: QcmSliceState }`)
 * resolve correctly despite `createAppStore` returning a loosely typed state.
 */
export type RootState = { qcm: QcmSliceState };

/** Inferred dispatch type bound to this store instance. */
export type AppDispatch = typeof store.dispatch;
