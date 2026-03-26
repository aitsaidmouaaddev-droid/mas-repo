import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { LOCALE_REGISTRY, type LocaleMeta } from '@mas/shared/i18n';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import { FLAG_COMPONENTS } from './flags';
import scss from './localePicker.module.scss';

/**
 * How each locale is displayed in the trigger button and dropdown items.
 *
 * - `'flag'`       — flag icon only
 * - `'label'`      — native label only (e.g. "Français")
 * - `'code'`       — ISO code only (e.g. "FR")
 * - `'flag-label'` — flag + native label
 * - `'flag-code'`  — flag + ISO code
 * - `'full'`       — flag + native label + ISO code
 */
export type LocaleDisplayMode = 'flag' | 'label' | 'code' | 'flag-label' | 'flag-code' | 'full';

/**
 * Where the dropdown opens relative to the trigger, and how items are laid out.
 *
 * - `'bottom'` — below the trigger, items stacked vertically (default)
 * - `'top'`    — above the trigger, items stacked vertically
 * - `'left'`   — left of the trigger, items stacked horizontally
 * - `'right'`  — right of the trigger, items stacked horizontally
 */
export type LocaleMenuPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the {@link LocalePicker} component.
 */
export interface LocalePickerProps {
  /** How to display each locale. @default 'flag-label' */
  display?: LocaleDisplayMode;
  /** Where the dropdown opens and how items stack. @default 'bottom' */
  menuPosition?: LocaleMenuPosition;
  /** When true, renders the trigger without button chrome — just the content is clickable. @default false */
  bare?: boolean;
  /** Flag icon size in pixels. @default 18 */
  flagSize?: number;
  /** CSS-module class overrides. */
  classOverride?: ClassOverride<typeof scss>;
  /** Inline style overrides keyed by slot. */
  styleOverride?: StyleOverride<typeof scss>;
  /** Value for `data-testid`. */
  testId?: string;
  /** Additional CSS class for the root element. */
  className?: string;
}

function LocaleContent({
  code,
  meta,
  display,
  flagSize,
  flagClass,
}: {
  code: string;
  meta: LocaleMeta;
  display: LocaleDisplayMode;
  flagSize: number;
  flagClass?: string;
}) {
  const FlagIcon = FLAG_COMPONENTS[code];
  const showFlag = display !== 'label' && display !== 'code';
  const showLabel = display === 'label' || display === 'flag-label' || display === 'full';
  const showCode = display === 'code' || display === 'flag-code' || display === 'full';

  return (
    <>
      {showFlag && FlagIcon && (
        <span className={flagClass} aria-hidden="true">
          <FlagIcon size={flagSize} />
        </span>
      )}
      {showLabel && <span>{meta.label}</span>}
      {showCode && <span>{code.toUpperCase()}</span>}
    </>
  );
}

/**
 * Dropdown-based locale picker. The trigger button shows the current language;
 * clicking it reveals a dropdown with all supported locales.
 *
 * Reads supported locales from the live i18next instance (set via `initI18n`).
 * Selecting a locale calls `i18next.changeLanguage()` which persists to
 * `localStorage` automatically.
 *
 * @example
 * ```tsx
 * <LocalePicker display="flag" />
 * <LocalePicker display="flag-label" />
 * <LocalePicker display="full" />
 * ```
 */
export default function LocalePicker({
  display = 'flag-label',
  menuPosition = 'bottom',
  bare = false,
  flagSize = 18,
  classOverride,
  styleOverride,
  testId,
  className,
}: LocalePickerProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const supported = ((i18n.options.supportedLngs as string[] | undefined) ?? []).filter(
    (l) => l !== 'cimode',
  );
  const current = i18n.language;
  const currentMeta = LOCALE_REGISTRY[current] ?? {
    code: current,
    flag: '',
    label: current,
    labelEn: current,
  };

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className={clsx(s.className.wrapper, className)} data-testid={testId}>
      <button
        type="button"
        className={clsx(bare ? s.className.triggerBare : s.className.trigger)}
        style={bare ? s.style.triggerBare : s.style.trigger}
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <LocaleContent
          code={current}
          meta={currentMeta}
          display={display}
          flagSize={flagSize}
          flagClass={s.className.flag}
        />
      </button>

      {open && (
        <div
          className={clsx(
            s.className.menu,
            menuPosition === 'top' && s.className.menuTop,
            menuPosition === 'left' && s.className.menuLeft,
            menuPosition === 'right' && s.className.menuRight,
            (menuPosition === 'left' || menuPosition === 'right') && s.className.menuHorizontal,
          )}
          style={s.style.menu}
          role="listbox"
          aria-label="Language"
        >
          {supported.map((code) => {
            const meta = LOCALE_REGISTRY[code] ?? {
              code,
              flag: '',
              label: code,
              labelEn: code,
            };
            const isActive = code === current;

            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                className={clsx(s.className.item, isActive && s.className.active)}
                style={s.style.item}
                onClick={() => {
                  i18n.changeLanguage(code);
                  setOpen(false);
                }}
              >
                <LocaleContent
                  code={code}
                  meta={meta}
                  display={display}
                  flagSize={flagSize}
                  flagClass={s.className.flag}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
