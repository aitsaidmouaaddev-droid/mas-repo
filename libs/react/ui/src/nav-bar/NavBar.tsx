import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import type { NavItem } from './nav.types';
import scss from './navBar.module.scss';

export type NavIconPosition = 'top' | 'bottom' | 'left' | 'right';

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
