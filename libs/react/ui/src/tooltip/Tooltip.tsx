import React, { useState } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './tooltip.module.scss';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the {@link Tooltip} component.
 *
 * @property text - Tooltip content string
 * @property position - Placement relative to the trigger element. @default 'top'
 * @property children - Trigger element the tooltip wraps
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 */
export interface TooltipProps {
  text: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Hover/focus-triggered tooltip that wraps its children with a positioned text bubble.
 *
 * @param props - {@link TooltipProps}
 * @returns A wrapper span containing the children and a `role="tooltip"` bubble
 *
 * @example
 * ```tsx
 * <Tooltip text="Copy to clipboard" position="bottom">
 *   <Button>Copy</Button>
 * </Tooltip>
 * ```
 */
export default function Tooltip({
  text,
  position = 'top',
  children,
  classOverride,
  styleOverride,
  testId,
}: TooltipProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [show, setShow] = useState(false);

  return (
    <span
      className={s.className.wrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      data-testid={testId}
    >
      {children}
      <span
        className={clsx(s.className.bubble, s.className[position], show && s.className.visible)}
        style={{ ...s.style.bubble, ...s.style[position] }}
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
