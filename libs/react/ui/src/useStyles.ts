import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';

/**
 * Partial map of additional CSS class names keyed by the same slots as `S`.
 *
 * @typeParam S - CSS Module class map shape.
 */
export type ClassOverride<S extends Record<string, string>> = Partial<Record<keyof S, string>>;

/**
 * Partial map of inline `CSSProperties` keyed by the same slots as `S`.
 *
 * @typeParam S - CSS Module class map shape.
 */
export type StyleOverride<S extends Record<string, string>> = Partial<
  Record<keyof S, CSSProperties>
>;

/**
 * Return type of {@link useStyles}.
 *
 * @typeParam S - CSS Module class map shape.
 */
export interface UseStylesResult<S extends Record<string, string>> {
  /** Merged class-name map (base + overrides via `clsx`). */
  className: Record<keyof S, string>;
  /** Inline-style map from `styleOverride` (may be `undefined` per key). */
  style: Record<keyof S, CSSProperties | undefined>;
}

/**
 * Merges a CSS Module's class map with optional {@link ClassOverride} and
 * {@link StyleOverride} maps, returning a memoised {@link UseStylesResult}.
 *
 * @typeParam S - CSS Module class map shape.
 * @param base - CSS Module import (e.g. `import styles from './button.module.scss'`).
 * @param classOverride - Partial map of extra class names per slot.
 * @param styleOverride - Partial map of inline `CSSProperties` per slot.
 * @returns `{ className, style }` maps ready to spread onto elements.
 *
 * @example
 * ```tsx
 * import styles from './card.module.scss';
 * const { className, style } = useStyles(styles, { root: 'extra-class' });
 * return <div className={className.root} style={style.root} />;
 * ```
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
