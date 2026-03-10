/**
 * Detects the UI framework of a library.
 * Strategy:
 *   1. package.json deps/peerDeps (most explicit)
 *   2. lib path segments (reliable fallback for lean monorepo libs)
 *
 * Add new entries here when you introduce a new framework to the monorepo.
 *
 * @param {Record<string, unknown>} pkgJson
 * @param {string} [libPath] - absolute path to the lib root
 * @returns {'react-native' | 'react' | 'angular' | 'vue' | 'svelte' | 'unknown'}
 */
export function detectFramework(pkgJson, libPath = '') {
  const deps = {
    ...pkgJson.dependencies,
    ...pkgJson.peerDependencies,
  };

  // 1. Explicit deps
  if (deps['react-native'] || deps['expo']) return 'react-native';
  if (deps['@angular/core']) return 'angular';
  if (deps['vue']) return 'vue';
  if (deps['svelte']) return 'svelte';
  if (deps['react']) return 'react';

  // 2. Path-based fallback — works for lean monorepo libs with no deps listed
  const normalizedPath = libPath.replace(/\\/g, '/');
  if (/\/react-native\//.test(normalizedPath)) return 'react-native';
  if (/\/angular\//.test(normalizedPath)) return 'angular';
  if (/\/vue\//.test(normalizedPath)) return 'vue';
  if (/\/svelte\//.test(normalizedPath)) return 'svelte';
  if (/\/react\//.test(normalizedPath)) return 'react';

  // 3. App name prefix fallback
  const name = pkgJson.name ?? '';
  if (/rn-|react-native/.test(name)) return 'react-native';
  if (/angular/.test(name)) return 'angular';
  if (/vue/.test(name)) return 'vue';

  return 'unknown';
}
