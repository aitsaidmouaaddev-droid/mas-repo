import { forwardRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './searchBar.module.scss';

/**
 * Props for the {@link SearchBar} component.
 *
 * @property value - Current search text.
 * @property onChange - Callback fired on every input change with the new text.
 * @property placeholder - Placeholder text shown when the input is empty. @default 'Search...'
 * @property onClear - Optional callback invoked after the clear button resets the value.
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 * @property className - Additional CSS class applied to the root wrapper.
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Text input with a search icon and an optional clear button, forwarding a ref to the inner `<input>`.
 *
 * @param props - {@link SearchBarProps}
 * @returns A search input wrapper with icon adornments.
 *
 * @example
 * ```tsx
 * <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
 * ```
 */
const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    onChange,
    placeholder = 'Search...',
    onClear,
    classOverride,
    styleOverride,
    testId,
    className,
  },
  ref,
) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      <span className={s.className.icon} style={s.style.icon}>
        <FiSearch size={16} />
      </span>
      <input
        ref={ref}
        className={s.className.input}
        style={s.style.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
      />
      {value && (
        <button
          type="button"
          className={s.className.clear}
          style={s.style.clear}
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="Clear search"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
