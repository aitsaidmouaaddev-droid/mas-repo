import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './dropdownMenu.module.scss';

/**
 * Describes a single entry in a {@link DropdownMenu}.
 *
 * @property key - Unique identifier for the menu item.
 * @property label - Display text shown for the item.
 * @property disabled - If `true`, the item is visible but non-interactive.
 * @property separator - If `true`, renders a visual divider instead of a button.
 * @property onClick - Callback fired when the item is selected.
 */
export interface DropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

/**
 * Props for the {@link DropdownMenu} component.
 *
 * @property trigger - React node that toggles the menu on click.
 * @property items - Array of menu items and optional separators.
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the wrapper element.
 */
export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A toggle-triggered dropdown menu with keyboard & click-outside dismissal.
 *
 * Clicking the `trigger` element opens a list of selectable items. The menu
 * closes on outside click, Escape key, or item selection.
 *
 * @param props - {@link DropdownMenuProps}
 * @returns The rendered dropdown menu element.
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   trigger={<button>Actions</button>}
 *   items={[
 *     { key: 'edit', label: 'Edit', onClick: handleEdit },
 *     { key: 'delete', label: 'Delete', onClick: handleDelete },
 *   ]}
 * />
 * ```
 */
export default function DropdownMenu({
  trigger,
  items,
  classOverride,
  styleOverride,
  testId,
  className,
}: DropdownMenuProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={clsx(s.className.wrapper, className)} data-testid={testId}>
      <span onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
        {trigger}
      </span>
      {open && (
        <div className={s.className.menu} style={s.style.menu} role="menu">
          {items.map((item) =>
            item.separator ? (
              <div key={item.key} className={s.className.separator} />
            ) : (
              <button
                key={item.key}
                role="menuitem"
                className={clsx(s.className.item, item.disabled && s.className.disabled)}
                style={s.style.item}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setOpen(false);
                  }
                }}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
