/**
 * @packageDocumentation
 * @module @mas/shared-types
 *
 * Platform-agnostic type definitions shared across all MAS monorepo projects.
 *
 * ## Exports
 * - {@link ThemeTokens} — design-token contract every theme must implement
 * - {@link StylesOverride} — utility type for per-component style customisation
 *
 * ## Usage
 * ```ts
 * import type { ThemeTokens, StylesOverride } from '@mas/shared-types';
 * ```
 *
 * This package has **no runtime code** — it is types-only.
 * It is safe to import from any platform (React Native, Angular, Node, etc.).
 */
export * from './theme';
