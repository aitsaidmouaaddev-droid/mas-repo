import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Tag from '../tag/Tag';
import scss from './breadcrumb.module.scss';
import { withSkeleton } from '../skeletons/withSkeleton';
import BreadcrumbSkeleton from '../skeletons/BreadcrumbSkeleton';

/**
 * Represents a single crumb within a {@link Breadcrumb} trail.
 *
 * @property label - Visible text for the crumb
 * @property href - Navigation URL; omit for non-link items
 * @property onClick - Click handler for programmatic navigation
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * Props for the {@link Breadcrumb} component.
 *
 * @property items - Ordered array of {@link BreadcrumbItem} entries
 * @property separator - Character or string used between crumbs @default '/'
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 * @property className - Additional CSS class for the root element
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A navigational breadcrumb trail showing the user's current location within a hierarchy.
 *
 * @param props - {@link BreadcrumbProps}
 * @returns A `<nav>` element wrapping an ordered list of breadcrumb links
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Widget' },
 *   ]}
 *   separator=">"
 * />
 * ```
 */
export default function Breadcrumb({
  items,
  separator = '/',
  classOverride,
  styleOverride,
  testId,
  className,
}: BreadcrumbProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <nav aria-label="Breadcrumb" data-testid={testId}>
      <ol className={clsx(s.className.base, className)} style={s.style.base}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={i}>
              <li>
                {isLast ? (
                  <Tag
                    label={item.label}
                    variant="info"
                    aria-current="page"
                    className={s.className.current}
                  />
                ) : (
                  <a
                    href={item.href ?? '#'}
                    className={s.className.link}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                  >
                    <Tag label={item.label} className={s.className.item} />
                  </a>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className={s.className.separator}>
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export const BreadcrumbWithSkeleton = withSkeleton(Breadcrumb, BreadcrumbSkeleton);
