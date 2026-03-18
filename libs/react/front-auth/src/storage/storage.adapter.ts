/**
 * Platform-agnostic storage contract used by {@link createAuthClient} to persist tokens.
 *
 * Implement this interface to target any storage backend — the built-in
 * {@link localStorageAdapter} covers browser environments while React Native
 * apps can supply an AsyncStorage-backed adapter.
 *
 * @example Custom AsyncStorage adapter (React Native)
 * ```ts
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import type { IStorageAdapter } from '@mas/front-auth';
 *
 * export const asyncStorageAdapter: IStorageAdapter = {
 *   get: (key) => AsyncStorage.getItem(key),
 *   set: (key, value) => AsyncStorage.setItem(key, value),
 *   remove: (key) => AsyncStorage.removeItem(key),
 * };
 * ```
 */
export interface IStorageAdapter {
  /**
   * Reads a value from storage.
   *
   * @param key - Storage key to look up.
   * @returns The stored string, `null` if absent, or a Promise resolving to either.
   */
  get(key: string): string | null | Promise<string | null>;
  /**
   * Writes a string value to storage.
   *
   * @param key - Storage key to write.
   * @param value - Value to persist.
   */
  set(key: string, value: string): void | Promise<void>;
  /**
   * Removes a key from storage. No-op if the key does not exist.
   *
   * @param key - Storage key to delete.
   */
  remove(key: string): void | Promise<void>;
}

/**
 * Browser `localStorage`-backed implementation of {@link IStorageAdapter}.
 *
 * Suitable for standard web apps. Do **not** use in server-side rendering
 * environments where `localStorage` is unavailable.
 */
export const localStorageAdapter: IStorageAdapter = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key),
};

/**
 * Storage keys used by `@mas/front-auth` to persist the token pair.
 *
 * Both keys are namespaced under `auth.*` to avoid collisions with other
 * localStorage entries in the same application.
 */
export const TOKEN_KEYS = {
  /** Storage key for the short-lived access token. */
  ACCESS: 'auth.accessToken',
  /** Storage key for the long-lived refresh token. */
  REFRESH: 'auth.refreshToken',
} as const;
