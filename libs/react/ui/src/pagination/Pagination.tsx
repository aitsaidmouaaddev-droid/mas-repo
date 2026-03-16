import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './pagination.module.scss';

/**
 * Props for the {@link Pagination} component.
 *
 * @property page - The current active page (1-indexed).
 * @property total - Total number of pages.
 * @property siblingCount - Number of page buttons shown on each side of the current page. @default 1
 * @property onChange - Callback fired when a page is selected, receiving the new page number.
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 * @property className - Additional CSS class applied to the root `<ul>`.
 */
export interface PaginationProps {
  page: number;
  total: number;
  siblingCount?: number;
  onChange: (page: number) => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

function range(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

function getPages(page: number, total: number, siblings: number) {
  const totalNumbers = siblings * 2 + 5; // first + last + current + 2 siblings + 2 ellipsis
  if (total <= totalNumbers) return range(1, total);

  const leftSibling = Math.max(page - siblings, 2);
  const rightSibling = Math.min(page + siblings, total - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const items: (number | 'ellipsis-left' | 'ellipsis-right')[] = [1];

  if (showLeftEllipsis) items.push('ellipsis-left');
  items.push(...range(leftSibling, rightSibling));
  if (showRightEllipsis) items.push('ellipsis-right');

  items.push(total);
  return items;
}

/**
 * Page navigation control with previous/next arrows, numbered buttons, and ellipsis indicators.
 *
 * @param props - {@link PaginationProps}
 * @returns A `<nav>` element containing the pagination controls.
 *
 * @example
 * ```tsx
 * <Pagination page={3} total={10} onChange={(p) => setPage(p)} />
 * ```
 */
export default function Pagination({
  page,
  total,
  siblingCount = 1,
  onChange,
  classOverride,
  styleOverride,
  testId,
  className,
}: PaginationProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const pages = getPages(page, total, siblingCount);

  return (
    <nav aria-label="Pagination" data-testid={testId}>
      <ul className={clsx(s.className.base, className)} style={s.style.base}>
        <li>
          <button
            className={clsx(s.className.page, page === 1 && s.className.disabled)}
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </button>
        </li>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <li key={p}>
              <span className={s.className.ellipsis}>…</span>
            </li>
          ) : (
            <li key={p}>
              <button
                className={clsx(s.className.page, p === page && s.className.active)}
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            className={clsx(s.className.page, page === total && s.className.disabled)}
            disabled={page === total}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
