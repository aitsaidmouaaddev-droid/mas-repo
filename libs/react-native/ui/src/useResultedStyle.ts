/**
 * @module useResultedStyle
 * Hook that composes base theme-derived styles with optional partial overrides.
 *
 * ```ts
 * import useResultedStyle from '@mas/rn/ui/useResultedStyle';
 * const styles = useResultedStyle(theme, makeCardStyles, stylesOverride);
 * ```
 */
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp } from 'react-native';
import type { ThemeTokens } from '@mas/shared/types';

/**
 * Utility type that lets a consumer override individual named styles of a
 * component without replacing the entire stylesheet.
 *
 * Defined here (in `@mas/rn/ui`) rather than `@mas/shared/types` because it
 * depends on React Native's `StyleProp` — making it RN-specific.
 *
 * @typeParam S - The shape of the component's stylesheet (e.g. `typeof styles`).
 */
export type StylesOverride<S> = Partial<Record<keyof S, StyleProp<any>>>;

type MakeStylesFn<S> = (theme: ThemeTokens) => S;

/**
 * Builds a "resulted" style object by composing base styles (from `makeStyles(theme)`)
 * with an optional partial override provided by the parent component.
 *
 * Uses `StyleSheet.compose(base[key], override[key])` per key so that overrides
 * patch rather than replace — you only need to supply the keys you want to change.
 *
 * @template S - Style object returned by `makeStyles`.
 * @param theme    - Current theme tokens used to compute the base styles.
 * @param makeStyles - Factory that produces the base styles from the theme.
 * @param override - Optional partial patch applied on top of the base styles.
 * @returns Composed style object with the same shape as `makeStyles`.
 *
 * @example
 * ```tsx
 * const styles = useResultedStyle(theme, makeCardStyles, stylesOverride);
 * ```
 */
function useResultedStyle<S extends Record<string, any>>(
  theme: ThemeTokens,
  makeStyles: MakeStylesFn<S>,
  override?: StylesOverride<S>,
): Record<keyof S, any> {
  return useMemo(() => {
    const base = makeStyles(theme);
    if (!override) return base as any;

    const composed: any = { ...base };
    (Object.keys(override) as (keyof S)[]).forEach((key) => {
      composed[key] = StyleSheet.compose((base as any)[key], override[key]);
    });
    return composed;
  }, [theme, makeStyles, override]);
}

export default useResultedStyle;
