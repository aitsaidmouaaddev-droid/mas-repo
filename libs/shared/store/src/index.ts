/**
 * @packageDocumentation
 * @module @mas/store
 *
 * Generic Redux store factory — framework-agnostic.
 *
 * This library is **business-logic-agnostic**: it provides only the store
 * construction utility. Reducers, state types, selectors, and thunks are
 * defined at the app level and injected via {@link createAppStore}.
 *
 * Works with React, React Native, Angular, Vue, Node.js.
 *
 * ## Usage
 * ```ts
 * import { createAppStore } from '@mas/shared/store';
 *
 * const store = createAppStore(
 *   { mediaScan: mediaScanReducer },
 *   { mediaService },          // forwarded to thunks as thunkApi.extra
 * );
 * ```
 */
export { createAppStore } from './store';
export type { AppStore, AppStoreOptions } from './store';

// Re-export slice primitives so consumers don't depend on @reduxjs/toolkit directly
export { createSlice } from '@reduxjs/toolkit';
export type { PayloadAction } from '@reduxjs/toolkit';
