import React from 'react';
import type { IconType } from 'react-icons';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './icon.module.scss';

interface VectorIconProps {
  type: 'vector';
  icon: IconType;
}

interface SvgIconProps {
  type: 'svg';
  svg: React.ReactNode;
}

type IconVariant = VectorIconProps | SvgIconProps;

export type IconProps = IconVariant & {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
};

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
