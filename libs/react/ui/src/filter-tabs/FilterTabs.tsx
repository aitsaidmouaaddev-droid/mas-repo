import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './filterTabs.module.scss';

/**
 * Describes a single tab in a {@link FilterTabs} component.
 *
 * @property key - Unique identifier for the tab.
 * @property label - Display text.
 */
export interface FilterTab {
  key: string;
  label: string;
}

/**
 * Props for the {@link FilterTabs} component.
 *
 * @property tabs - Array of tab descriptors to render.
 * @property activeKey - The `key` of the currently active tab.
 * @property onTabChange - Callback invoked with the new tab's `key` when clicked.
 * @property className - Additional CSS class for the root element.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface FilterTabsProps {
  tabs: FilterTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Horizontal filter buttons rendered as pill-shaped tabs.
 *
 * Useful for filtering lists or toggling between categories
 * (e.g. "All | App | Web | Card").
 *
 * @param props - {@link FilterTabsProps}
 * @returns The rendered filter tabs element.
 *
 * @example
 * ```tsx
 * <FilterTabs
 *   tabs={[{ key: 'all', label: 'All' }, { key: 'web', label: 'Web' }]}
 *   activeKey="all"
 *   onTabChange={setActiveKey}
 * />
 * ```
 */
export default function FilterTabs({
  tabs,
  activeKey,
  onTabChange,
  className,
  classOverride,
  styleOverride,
  testId,
}: FilterTabsProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div
      className={clsx(s.className.container, className)}
      style={s.style.container}
      data-testid={testId}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={clsx(s.className.tab, tab.key === activeKey && s.className.tabActive)}
          style={{ ...s.style.tab, ...(tab.key === activeKey ? s.style.tabActive : undefined) }}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
