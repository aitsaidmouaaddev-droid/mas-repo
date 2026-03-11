/**
 * @packageDocumentation
 * @module @mas/store
 *
 * Generic Redux store factory for any JavaScript/TypeScript app in the MAS monorepo.
 *
 * Accepts any reducer map and an optional extra argument object that is
 * forwarded to every async thunk via `thunkApi.extra`.
 * This keeps all concrete business logic (slices, services, types) out of
 * the library — each app supplies its own.
 *
 * Works with React, React Native, Angular, Vue, Node.js — any environment
 * that can run Redux Toolkit.
 *
 * ## Usage
 * ```ts
 * import { createAppStore } from '@mas/shared/store';
 * import mediaScanReducer from './store/mediaScanSlice';
 *
 * const store = createAppStore(
 *   { mediaScan: mediaScanReducer },
 *   { mediaService },
 * );
 * ```
 */
import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';

/**
 * Creates a configured Redux store.
 *
 * @param reducers - Map of slice reducers (passed directly to `configureStore`).
 * @param extra    - Optional extra argument forwarded to every thunk as `thunkApi.extra`.
 * @returns The configured Redux store.
 */
export function createAppStore<TReducers extends ReducersMapObject, TExtra = unknown>(
  reducers: TReducers,
  extra?: TExtra,
) {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: extra ?? {} } }),
  });
}

/** Store type returned by {@link createAppStore}. */
export type AppStore<
  TReducers extends ReducersMapObject = ReducersMapObject,
  TExtra = unknown,
> = ReturnType<typeof createAppStore<TReducers, TExtra>>;
