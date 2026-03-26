import React from 'react';
import type { IconType } from 'react-icons';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './icon.module.scss';

/** Props for a vector icon variant using `react-icons`. */
interface VectorIconProps {
  type: 'vector';
  icon: IconType;
}

/** Props for an inline SVG icon variant. */
interface SvgIconProps {
  type: 'svg';
  svg: React.ReactNode;
}

type IconVariant = VectorIconProps | SvgIconProps;

/**
 * Props for the {@link Icon} component.
 *
 * Discriminated union of `VectorIconProps` and `SvgIconProps`, plus shared styling props.
 *
 * @property size - Icon size in pixels. @default 20
 * @property color - Icon colour (CSS colour value).
 * @property className - Additional CSS class applied to the wrapper `<span>`.
 * @property style - Inline styles merged onto the wrapper `<span>`.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export type IconProps = IconVariant & {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
};

/**
 * Renders a vector (`react-icons`) or inline SVG icon with consistent sizing and styling.
 *
 * @param props - {@link IconProps}
 * @returns A `<span>` wrapping the icon element.
 *
 * @example
 * ```tsx
 * import { FiSearch } from 'react-icons/fi';
 *
 * <Icon type="vector" icon={FiSearch} size={24} color="#333" />
 * ```
 */
export default function Icon(props: IconProps) {
  const { size = 20, color, className, style, classOverride, styleOverride, testId } = props;
  const s = useStyles(scss, classOverride, styleOverride);

  const iconStyle: CSSProperties = { ...style, fontSize: size, color };

  if (props.type === 'svg') {
    return (
      <span
        className={clsx(s.className.container, className)}
        style={{ ...s.style.container, ...iconStyle }}
        data-testid={testId}
      >
        {props.svg}
      </span>
    );
  }

  const IconComponent = props.icon;
  return (
    <span
      className={clsx(s.className.container, className)}
      style={{ ...s.style.container, ...iconStyle }}
      data-testid={testId}
    >
      <IconComponent size={size} color={color} />
    </span>
  );
}
