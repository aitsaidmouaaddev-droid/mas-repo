import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import type { NavItem } from './nav.types';
import scss from './navBar.module.scss';
import NavBarSkeleton from '../skeletons/NavBarSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

export type NavIconPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the {@link NavBar} component.
 *
 * @property items - Array of navigation items to render.
 * @property activeItem - The `name` of the currently active item.
 * @property onItemClick - Callback fired when a nav item is clicked, receiving the item `name`.
 * @property showLabels - Whether to display text labels for each item. @default true
 * @property showIcons - Whether to display icons for each item. @default true
 * @property iconPosition - Position of the icon relative to the label. @default 'left'
 * @property iconSize - Size of item icons in pixels. @default 20
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 */
export interface NavBarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (name: string) => void;
  showLabels?: boolean;
  showIcons?: boolean;
  iconPosition?: NavIconPosition;
  iconSize?: number;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

function getFlexDirection(pos: NavIconPosition) {
  if (pos === 'left') return 'row' as const;
  if (pos === 'right') return 'row-reverse' as const;
  if (pos === 'bottom') return 'column-reverse' as const;
  return 'column' as const;
}

/**
 * Horizontal navigation bar that renders a list of items with optional icons and labels.
 *
 * @param props - {@link NavBarProps}
 * @returns A `<nav>` element containing clickable navigation items.
 *
 * @example
 * ```tsx
 * <NavBar
 *   items={[{ name: 'home', title: 'Home', icon: FiHome }]}
 *   activeItem="home"
 *   onItemClick={(name) => navigate(name)}
 * />
 * ```
 */
export default function NavBar({
  items,
  activeItem,
  onItemClick,
  showLabels = true,
  showIcons = true,
  iconPosition = 'left',
  iconSize = 20,
  classOverride,
  styleOverride,
  testId,
}: NavBarProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const direction = getFlexDirection(iconPosition);

  return (
    <nav className={s.className.container} style={s.style.container} data-testid={testId}>
      {items.map((item) => {
        const isActive = item.name === activeItem;
        return (
          <button
            type="button"
            key={item.name}
            className={s.className.item}
            style={s.style.item}
            onClick={() => onItemClick(item.name)}
          >
            <span
              className={s.className.itemContent}
              style={{ ...s.style.itemContent, flexDirection: direction }}
              data-testid={`nav-item-content-${item.name}`}
            >
              {showIcons && item.icon && (
                <Icon
                  type="vector"
                  icon={item.icon}
                  size={iconSize}
                  color={isActive ? 'var(--color-primary)' : 'var(--color-muted-text)'}
                />
              )}
              {showLabels && (
                <span
                  className={clsx(s.className.label, isActive && s.className.labelActive)}
                  style={{
                    ...s.style.label,
                    ...(isActive ? s.style.labelActive : undefined),
                  }}
                  data-active={isActive || undefined}
                >
                  {item.title}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export const NavBarWithSkeleton = withSkeleton(NavBar, NavBarSkeleton);
