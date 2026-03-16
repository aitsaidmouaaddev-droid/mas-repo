import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import type { NavItem } from '../nav-bar/nav.types';
import scss from './sideBar.module.scss';

/**
 * Describes a grouping of navigation items within the {@link SideBar}.
 *
 * @property title - Optional heading displayed above the group (hidden when collapsed)
 * @property items - Navigation entries rendered in this section
 */
export interface SideBarSection {
  title?: string;
  items: NavItem[];
}

/**
 * Props for the {@link SideBar} component.
 *
 * @property sections - Array of navigation sections to render
 * @property activeItem - The `name` of the currently active navigation item
 * @property onItemClick - Callback fired when a navigation item is clicked
 * @property collapsed - Whether the sidebar is in collapsed (icon-only) mode. @default false
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 */
export interface SideBarProps {
  sections: SideBarSection[];
  activeItem: string;
  onItemClick: (name: string) => void;
  collapsed?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Vertical sidebar navigation with collapsible sections and active-item highlighting.
 *
 * @param props - {@link SideBarProps}
 * @returns The rendered sidebar navigation element
 *
 * @example
 * ```tsx
 * <SideBar
 *   sections={[{ title: 'Main', items: [{ name: 'home', title: 'Home', icon: 'home' }] }]}
 *   activeItem="home"
 *   onItemClick={(name) => navigate(name)}
 * />
 * ```
 */
export default function SideBar({
  sections,
  activeItem,
  onItemClick,
  collapsed = false,
  classOverride,
  styleOverride,
  testId,
}: SideBarProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <aside
      className={clsx(s.className.container, collapsed && s.className.collapsed)}
      style={s.style.container}
      data-testid={testId}
    >
      {sections.map((section, sIdx) => (
        <React.Fragment key={sIdx}>
          {sIdx > 0 && <div className={s.className.divider} style={s.style.divider} />}
          <div className={s.className.section} style={s.style.section}>
            {section.title && !collapsed && (
              <span className={s.className.sectionTitle} style={s.style.sectionTitle}>
                {section.title}
              </span>
            )}
            {section.items.map((item) => {
              const isActive = item.name === activeItem;
              return (
                <button
                  type="button"
                  key={item.name}
                  className={clsx(s.className.item, isActive && s.className.itemActive)}
                  style={{
                    ...s.style.item,
                    ...(isActive ? s.style.itemActive : undefined),
                  }}
                  onClick={() => onItemClick(item.name)}
                  title={collapsed ? item.title : undefined}
                  data-active={isActive || undefined}
                >
                  {item.icon && (
                    <Icon
                      type="vector"
                      icon={item.icon}
                      size={20}
                      color={isActive ? 'var(--color-primary)' : undefined}
                    />
                  )}
                  {!collapsed && (
                    <span className={s.className.itemLabel} style={s.style.itemLabel}>
                      {item.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </aside>
  );
}
