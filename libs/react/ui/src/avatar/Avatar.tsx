

import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './avatar.module.scss';
import { withSkeleton } from '../skeletons/withSkeleton';
import AvatarSkeleton from '../skeletons/AvatarSkeleton';

export type AvatarSize = 'sm' | 'md' | 'lg';

/**
 * Props for the {@link Avatar} component.
 *
 * @property src - URL of the avatar image; falls back to initials when omitted
 * @property alt - Alt text for the image @default ''
 * @property initials - Letters displayed when no `src` is provided
 * @property size - Predefined size of the avatar @default 'md'
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 * @property className - Additional CSS class for the root element
 */
export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}



/**
 * Renders a circular avatar showing an image or fallback initials.
 *
 * @param props - {@link AvatarProps}
 * @returns The rendered avatar element
 *
 * @example
 * ```tsx
 * <Avatar src="/photo.jpg" alt="Jane Doe" size="lg" />
 * ```
 */
export default function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  classOverride,
  styleOverride,
  testId,
  className,
}: AvatarProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div
      className={clsx(s.className.base, s.className[size], className)}
      style={{ ...s.style.base, ...s.style[size] }}
      data-testid={testId}
    >
      {src ? (
        <img src={src} alt={alt} className={s.className.image} style={s.style.image} />
      ) : (
        (initials ?? '?')
      )}
    </div>
  );
}

// Export the HOC at the end for clarity
export const AvatarWithSkeleton = withSkeleton(Avatar, AvatarSkeleton);