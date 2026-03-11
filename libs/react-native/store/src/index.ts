/**
 * @packageDocumentation
 * @module @mas/rn-store
 *
 * Generic Redux store factory for React Native / Expo apps.
 *
 * This library is **business-logic-agnostic**: it provides only the store
 * construction utility. Reducers, state types, selectors, and thunks are
 * defined at the app level and injected via {@link createAppStore}.
 *
 * ## Usage
 * ```ts
 * import { createAppStore } from '@mas/rn/store';
 *
 * const store = createAppStore(
 *   { mediaScan: mediaScanReducer },
 *   { mediaService },          // forwarded to thunks as thunkApi.extra
 * );
 * ```
 */
export { createAppStore } from './store';
export type { AppStore } from './store';
