import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import { FiPlus } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './floatingMenuButton.module.scss';

export interface FloatingMenuItem {
  name: string;
  label?: string;
  icon: IconType;
}

export interface FloatingMenuButtonProps {
  items: FloatingMenuItem[];
  onItemClick: (name: string) => void;
  fabIcon?: IconType;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

export default function FloatingMenuButton({
  items,
  onItemClick,
  fabIcon: FabIcon = FiPlus,
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

  return (
    <div className={s.className.wrapper} style={s.style.wrapper} data-testid={testId}>
      {isOpen &&
        createPortal(
          <div
            className={s.className.overlay}
            style={s.style.overlay}
            onClick={() => setIsOpen(false)}
            data-testid="fab-overlay"
          />,
          document.body,
        )}

      {isOpen && (
        <div className={s.className.menu} style={s.style.menu} data-testid="fab-menu">
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
        <Icon type="vector" icon={FabIcon} size={24} color="#fff" />
      </button>
    </div>
  );
}
