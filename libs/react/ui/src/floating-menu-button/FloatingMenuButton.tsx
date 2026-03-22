import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import { FiPlus } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './floatingMenuButton.module.scss';

/**
 * Describes an action item displayed inside the {@link FloatingMenuButton} menu.
 *
 * @property name - Unique identifier passed to the `onItemClick` callback.
 * @property label - Optional text label shown next to the icon.
 * @property icon - React-icon component rendered for this item.
 */
export interface FloatingMenuItem {
  name: string;
  label?: string;
  icon: IconType;
}

/**
 * Props for the {@link FloatingMenuButton} component.
 *
 * @property items - Action items revealed when the FAB is activated.
 * @property onItemClick - Callback receiving the selected item's `name`.
 * @property fabIcon - Icon shown on the floating action button. @default FiPlus
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 */
export interface FloatingMenuButtonProps {
  items: FloatingMenuItem[];
  onItemClick: (name: string) => void;
  fabIcon?: IconType;
  /** Direction the menu opens. @default 'up' */
  menuDirection?: 'up' | 'down';
  /** Icon size in the FAB button. @default 24 */
  fabIconSize?: number;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A floating action button (FAB) that expands to reveal a radial menu of actions.
 *
 * Uses a portal-based overlay to capture outside clicks and renders icon-based
 * menu items above the FAB when open.
 *
 * @param props - {@link FloatingMenuButtonProps}
 * @returns The rendered floating menu button element.
 *
 * @example
 * ```tsx
 * <FloatingMenuButton
 *   items={[{ name: 'camera', icon: FiCamera, label: 'Photo' }]}
 *   onItemClick={(name) => console.log(name)}
 * />
 * ```
 */
export default function FloatingMenuButton({
  items,
  onItemClick,
  fabIcon: FabIcon = FiPlus,
  menuDirection = 'up',
  fabIconSize = 24,
  classOverride,
  styleOverride,
  testId,
}: FloatingMenuButtonProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  const handleItemClick = useCallback(
    (name: string) => {
      onItemClick(name);
      setIsOpen(false);
    },
    [onItemClick],
  );

  const menuStyle = menuDirection === 'down'
    ? { top: 'calc(100% + 12px)', bottom: 'auto' }
    : undefined;

  return createPortal(
    <div className={s.className.wrapper} style={s.style.wrapper} data-testid={testId}>
      {isOpen && (
        <div
          className={s.className.overlay}
          style={s.style.overlay}
          onClick={() => setIsOpen(false)}
          data-testid="fab-overlay"
        />
      )}

      {isOpen && (
        <div
          className={s.className.menu}
          style={{ ...s.style.menu, ...menuStyle }}
          data-testid="fab-menu"
        >
          {items.map((item) => (
            <button
              type="button"
              key={item.name}
              className={s.className.menuItem}
              style={s.style.menuItem}
              onClick={() => handleItemClick(item.name)}
            >
              <Icon type="vector" icon={item.icon} size={18} />
              {item.label && (
                <span className={s.className.menuItemLabel} style={s.style.menuItemLabel}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className={clsx(s.className.fab, isOpen && s.className.fabOpen)}
        style={{ ...s.style.fab, ...(isOpen ? s.style.fabOpen : undefined) }}
        onClick={toggle}
        data-testid={testId ? `${testId}-fab` : 'fab-button'}
        data-open={isOpen || undefined}
      >
        <Icon type="vector" icon={FabIcon} size={fabIconSize} color="#fff" />
      </button>
    </div>,
    document.body,
  );
}
