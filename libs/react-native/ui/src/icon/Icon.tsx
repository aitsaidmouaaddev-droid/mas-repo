/**
 * @module Icon
 * Universal icon atom supporting Ionicons (vector) and custom SVG components.
 *
 * ```tsx
 * import Icon from '@mas/rn/ui/icon/Icon';
 *
 * // Vector icon (Ionicons by default):
 * <Icon type="vector" name="trash-outline" size={24} color="#F00" />
 *
 * // Custom SVG component:
 * <Icon type="svg" Svg={MyLogoSvg} size={32} />
 * ```
 *
 * @see {@link IconProps} — discriminated union of {@link VectorIconProps} and {@link SvgIconProps}
 * @see {@link makeIconStyles} — style factory in icon.style.ts
 */
import { Ionicons } from '@expo/vector-icons';
import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import type { IconStyles } from './icon.style';
import makeIconStyles from './icon.style';

/**
 * Any React component that accepts `name`, `size`, and `color` props.
 * Defaults to Ionicons; swap for any other icon library.
 */
export type IconRenderer = React.ComponentType<{
  name: any;
  size?: number;
  color?: string;
}>;

/**
 * Any React component that accepts SVG-compatible `width`, `height`, `fill`, and `stroke` props.
 */
export type SvgIconComponent = React.ComponentType<{
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}>;

interface IconBaseProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for vector (Ionicons) icon rendering.
 *
 * @see {@link IconRenderer} — custom renderer override via `as`
 */
export interface VectorIconProps extends IconBaseProps {
  type: 'vector';
  /** Ionicons icon name (e.g. `"trash-outline"`, `"checkmark"`). */
  name: string;
  /** Custom icon renderer component. Defaults to Ionicons. */
  as?: IconRenderer;
}

/**
 * Props for SVG component icon rendering.
 */
export interface SvgIconProps extends IconBaseProps {
  type: 'svg';
  /** SVG React component accepting `width`, `height`, `fill`, `stroke`. */
  Svg: SvgIconComponent;
}

/**
 * Discriminated union of {@link VectorIconProps} and {@link SvgIconProps}.
 * Pass `type: "vector"` for Ionicons or `type: "svg"` for custom SVGs.
 */
export type IconProps = (VectorIconProps | SvgIconProps) & {
  /** Partial style overrides merged on top of base icon styles. */
  stylesOverride?: Partial<IconStyles>;
};

/**
 * Renders either a vector icon (Ionicons by default) or a custom SVG component.
 *
 * Encodes icon metadata in `accessibilityLabel` as JSON for testability.
 *
 * @param props - See {@link IconProps}.
 */
export default function Icon({ stylesOverride, ...props }: IconProps) {
  const { theme } = useTheme();
  const size = props.size ?? 20;
  // Utilise la couleur du thème par défaut si non fournie
  const color = props.color ?? theme.colors.onSurface ?? '#000';

  const styles = useResultedStyle<IconStyles>(theme, makeIconStyles, stylesOverride);

  /**
   * ✅ CRUCIAL POUR TES TESTS :
   * On génère un label de métadonnées que tes tests unitaires (parseIconProps)
   * utilisent pour vérifier la couleur et le nom de l'icône.
   */
  const accessibilityMetadata = JSON.stringify({
    type: props.type,
    name: props.type === 'vector' ? props.name : 'custom-svg',
    size,
    color,
  });

  if (props.type === 'svg') {
    const Svg = props.Svg;
    return (
      <View
        style={[styles.container, props.style]}
        testID={props.testID}
        accessibilityLabel={accessibilityMetadata}
      >
        <Svg width={size} height={size} fill={color} stroke={color} />
      </View>
    );
  }

  // ✅ Cast propre pour le renderer vectoriel
  const Renderer = (props.as as any) ?? Ionicons;

  return (
    <View
      style={[styles.container, props.style]}
      testID={props.testID ?? `icon-${props.name}`}
      accessibilityLabel={accessibilityMetadata}
    >
      <Renderer name={props.name} size={size} color={color} />
    </View>
  );
}
