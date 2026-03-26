import { useState, useEffect, useCallback } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './scrollSpyNav.module.scss';

/**
 * A single navigation item for the {@link ScrollSpyNav} component.
 *
 * @property id - DOM id of the target section element.
 * @property label - Accessible label shown as a tooltip.
 * @property icon - A `react-icons` icon component.
 */
export interface ScrollSpyItem {
  id: string;
  label: string;
  icon: IconType;
}

/**
 * Props for the {@link ScrollSpyNav} component.
 *
 * @property items - Array of navigation items linking to page sections.
 * @property className - Additional CSS class applied to the nav wrapper.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface ScrollSpyNavProps {
  items: ScrollSpyItem[];
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Fixed vertical sidebar with round icon buttons that highlights the active
 * section based on scroll position using `IntersectionObserver`.
 *
 * Clicking an item smooth-scrolls to the corresponding section. Hidden on
 * mobile viewports (max-width 768px via CSS).
 *
 * @param props - {@link ScrollSpyNavProps}
 * @returns A `<nav>` element fixed to the left side of the viewport.
 *
 * @example
 * ```tsx
 * import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
 *
 * <ScrollSpyNav items={[
 *   { id: 'hero', label: 'Home', icon: FiHome },
 *   { id: 'about', label: 'About', icon: FiUser },
 *   { id: 'settings', label: 'Settings', icon: FiSettings },
 * ]} />
 * ```
 */
export default function ScrollSpyNav(props: ScrollSpyNavProps) {
  const { items, className, classOverride, styleOverride, testId } = props;
  const s = useStyles(scss, classOverride, styleOverride);

  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;

    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratioMap) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      { threshold: 0.3 },
    );

    const elements: Element[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [items]);

  const handleClick = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav
      className={clsx(s.className.nav, className)}
      style={s.style.nav}
      data-testid={testId}
      aria-label="Section navigation"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={clsx(
            s.className.item,
            activeId === item.id && s.className.itemActive,
          )}
          style={{
            ...s.style.item,
            ...(activeId === item.id ? s.style.itemActive : undefined),
          }}
          onClick={() => handleClick(item.id)}
          title={item.label}
          aria-label={item.label}
          aria-current={activeId === item.id ? 'true' : undefined}
        >
          <Icon type="vector" icon={item.icon} size={20} />
        </button>
      ))}
    </nav>
  );
}
