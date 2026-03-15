import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import { FiChevronDown } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './select.module.scss';

export interface SelectOption {
  label: string;
  value: string | number;
  startIcon?: IconType;
  endIcon?: IconType;
}

export interface SelectProps {
  options: SelectOption[];
  value: string | number | Array<string | number>;
  placeholder?: string;
  onSelect: (value: string | number | Array<string | number>) => void;
  multiple?: boolean;
  menuPosition?: 'top' | 'bottom';
  triggerIcon?: IconType;
  testId?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
}

export default function Select({
  options,
  value,
  placeholder = 'Select...',
  onSelect,
  multiple = false,
  menuPosition = 'bottom',
  triggerIcon: TriggerIcon = FiChevronDown,
  testId,
  classOverride,
  styleOverride,
}: SelectProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayText = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      return options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label)
        .join(', ');
    }
    return options.find((o) => o.value === value)?.label || placeholder;
  }, [value, options, multiple, placeholder]);

  const handleSelect = useCallback(
    (optionValue: string | number) => {
      if (multiple) {
        const current = Array.isArray(value) ? [...value] : [];
        const idx = current.indexOf(optionValue);
        if (idx > -1) current.splice(idx, 1);
        else current.push(optionValue);
        onSelect(current);
      } else {
        onSelect(optionValue);
        setIsOpen(false);
      }
    },
    [multiple, value, onSelect],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const isSelected = useCallback(
    (optionValue: string | number) =>
      multiple
        ? Array.isArray(value)
          ? value.includes(optionValue)
          : false
        : value === optionValue,
    [value, multiple],
  );

  return (
    <div className={s.className.container} style={s.style.container} ref={containerRef}>
      <button
        type="button"
        className={clsx(s.className.trigger, isOpen && s.className.triggerActive)}
        style={{ ...s.style.trigger, ...(isOpen ? s.style.triggerActive : undefined) }}
        onClick={() => setIsOpen((o) => !o)}
        data-testid={testId}
      >
        <span className={s.className.triggerLabel} style={s.style.triggerLabel}>
          {displayText}
        </span>
        <Icon type="vector" icon={TriggerIcon} size={20} />
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              className={s.className.overlay}
              style={s.style.overlay}
              onClick={() => setIsOpen(false)}
              data-testid="select-overlay"
            />
          </>,
          document.body,
        )}

      {isOpen && (
        <ul
          className={clsx(s.className.menu, menuPosition === 'top' && s.className.menuTop)}
          style={s.style.menu}
          role="listbox"
          data-testid="select-menu"
        >
          {options.map((opt) => {
            const selected = isSelected(opt.value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                className={clsx(s.className.optionItem, selected && s.className.optionSelected)}
                style={{
                  ...s.style.optionItem,
                  ...(selected ? s.style.optionSelected : undefined),
                }}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.startIcon && <Icon type="vector" icon={opt.startIcon} size={18} />}
                <span
                  className={clsx(
                    s.className.optionText,
                    selected && s.className.optionTextSelected,
                  )}
                  style={{
                    ...s.style.optionText,
                    ...(selected ? s.style.optionTextSelected : undefined),
                  }}
                >
                  {opt.label}
                </span>
                {opt.endIcon && <Icon type="vector" icon={opt.endIcon} size={16} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
