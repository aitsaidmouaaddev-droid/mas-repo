import { useState, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './topBar.module.scss';

/**
 * Props for the {@link TopBar} component.
 *
 * @property left - Content rendered on the left side.
 * @property center - Content rendered in the center.
 * @property right - Content rendered on the right side.
 * @property shrinkOnScroll - When true, the bar starts tall and shrinks on scroll. @default false
 * @property expandedHeight - Height in px when expanded (scroll at top). @default 80
 * @property compactHeight - Height in px when compact (scrolled down). @default 56
 * @property scrollThreshold - Scroll distance in px to trigger compact mode. @default 40
 * @property className - Additional CSS class applied to the root element.
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value for `data-testid`.
 */
export interface TopBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  shrinkOnScroll?: boolean;
  expandedHeight?: number;
  compactHeight?: number;
  scrollThreshold?: number;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A fixed top navigation bar with left / center / right slots.
 *
 * When `shrinkOnScroll` is enabled the bar starts at {@link TopBarProps.expandedHeight}
 * and smoothly transitions to {@link TopBarProps.compactHeight} once the user scrolls
 * past {@link TopBarProps.scrollThreshold} pixels. A CSS custom property `--topbar-progress`
 * (0 → 1) is set on the element so children can react to the transition (e.g. scale text).
 *
 * A spacer `<div>` is rendered beneath the bar to prevent content from hiding behind it.
 *
 * @example
 * ```tsx
 * <TopBar
 *   left={<span>Logo</span>}
 *   right={<Button label="Sign in" />}
 *   shrinkOnScroll
 * />
 * ```
 */
export default function TopBar({
  left,
  center,
  right,
  shrinkOnScroll = false,
  expandedHeight = 80,
  compactHeight = 56,
  scrollThreshold = 40,
  className,
  classOverride,
  styleOverride,
  testId,
}: TopBarProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [compact, setCompact] = useState(false);

  const handleScroll = useCallback(() => {
    setCompact(window.scrollY > scrollThreshold);
  }, [scrollThreshold]);

  useEffect(() => {
    if (!shrinkOnScroll) return;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shrinkOnScroll, handleScroll]);

  const isCompact = shrinkOnScroll ? compact : false;
  const height = isCompact ? compactHeight : expandedHeight;

  // 0 = fully expanded, 1 = fully compact
  const progress = isCompact ? 1 : 0;

  const barVars: CSSProperties = {
    '--topbar-height-expanded': `${expandedHeight}px`,
    '--topbar-height-compact': `${compactHeight}px`,
    '--topbar-progress': progress,
  } as CSSProperties;

  return (
    <>
      <nav
        className={clsx(
          s.className.bar,
          isCompact ? s.className.barCompact : s.className.barExpanded,
          className,
        )}
        style={{ ...s.style.bar, ...barVars }}
        data-testid={testId}
        data-compact={isCompact || undefined}
      >
        {left && (
          <div className={s.className.left} style={s.style.left}>
            {left}
          </div>
        )}
        {center && (
          <div className={s.className.center} style={s.style.center}>
            {center}
          </div>
        )}
        {right && (
          <div className={s.className.right} style={s.style.right}>
            {right}
          </div>
        )}
      </nav>
      <div
        className={s.className.spacer}
        style={{ ...s.style.spacer, height }}
        aria-hidden
      />
    </>
  );
}
