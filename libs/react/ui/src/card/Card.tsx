import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './card.module.scss';
import CardSkeleton from '../skeletons/CardSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

/**
 * Props for the {@link Card} component.
 *
 * @property children - Primary card content
 * @property renderOverlay - Render function returning overlay content displayed above the card body
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property className - Additional CSS class for the root element
 * @property testId - Value for `data-testid`
 */
export interface CardProps {
  children: React.ReactNode;
  renderOverlay?: () => React.ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  className?: string;
  testId?: string;
}

/**
 * A surface container for grouping related content, with optional overlay support.
 *
 * @param props - {@link CardProps}
 * @returns The rendered card element
 *
 * @example
 * ```tsx
 * <Card renderOverlay={() => <span>Featured</span>}>
 *   <h3>Title</h3>
 *   <p>Card body content.</p>
 * </Card>
 * ```
 */

function Card({
  children,
  renderOverlay,
  classOverride,
  styleOverride,
  className,
  testId,
}: CardProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      <div className={s.className.content} style={s.style.content}>
        {children}
      </div>
      {renderOverlay && (
        <div className={s.className.overlayLayer} style={s.style.overlayLayer}>
          {renderOverlay()}
        </div>
      )}
    </div>
  );
}

export const CardWithSkeleton = withSkeleton(Card, CardSkeleton);
export default Card;
