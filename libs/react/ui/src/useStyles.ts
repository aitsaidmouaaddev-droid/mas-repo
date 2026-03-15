import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';

/**
 * Represents the override shape for a component's style keys.
 * `classOverride` merges CSS class names via clsx.
 * `styleOverride` merges inline CSSProperties.
 */
export type ClassOverride<S extends Record<string, string>> = Partial<Record<keyof S, string>>;
export type StyleOverride<S extends Record<string, string>> = Partial<
  Record<keyof S, CSSProperties>
>;

export interface UseStylesResult<S extends Record<string, string>> {
  className: Record<keyof S, string>;
  style: Record<keyof S, CSSProperties | undefined>;
}

/**
 * Merges a CSS Module's class map with optional class and style overrides.
 *
 * @param base - CSS Module import (e.g. `import styles from './button.module.scss'`)
 * @param classOverride - Partial map of extra class names per key
 * @param styleOverride - Partial map of inline CSSProperties per key
 * @returns `{ className, style }` maps ready to spread onto elements
 */
export default function useStyles<S extends Record<string, string>>(
  base: S,
  classOverride?: ClassOverride<S>,
  styleOverride?: StyleOverride<S>,
): UseStylesResult<S> {
  return useMemo(() => {
    const className = {} as Record<keyof S, string>;
    const style = {} as Record<keyof S, CSSProperties | undefined>;

    const allKeys = new Set([
      ...Object.keys(base),
      ...(classOverride ? Object.keys(classOverride) : []),
      ...(styleOverride ? Object.keys(styleOverride) : []),
    ]) as Set<keyof S>;

    for (const key of allKeys) {
      className[key] = clsx(base[key as keyof S], classOverride?.[key]);
      style[key] = styleOverride?.[key];
    }

    return { className, style };
  }, [base, classOverride, styleOverride]);
}
