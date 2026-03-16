import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './tabs.module.scss';

/**
 * Describes a single tab within the {@link Tabs} component.
 *
 * @property key - Unique identifier for the tab
 * @property label - Display text on the tab button
 * @property disabled - Whether the tab is non-interactive
 * @property content - Optional panel content rendered when the tab is active
 */
export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  content?: React.ReactNode;
}

/**
 * Props for the {@link Tabs} component.
 *
 * @property tabs - Array of tab definitions
 * @property activeKey - Key of the currently selected tab
 * @property onChange - Callback fired with the new key when a tab is selected
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Accessible tabbed interface with optional panel content per tab.
 *
 * @param props - {@link TabsProps}
 * @returns A `role="tablist"` container with tab buttons and an optional active panel
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { key: 'general', label: 'General', content: <GeneralSettings /> },
 *     { key: 'advanced', label: 'Advanced', content: <AdvancedSettings /> },
 *   ]}
 *   activeKey={activeTab}
 *   onChange={setActiveTab}
 * />
 * ```
 */
export default function Tabs({
  tabs,
  activeKey,
  onChange,
  classOverride,
  styleOverride,
  testId,
  className,
}: TabsProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div data-testid={testId}>
      <div className={clsx(s.className.base, className)} style={s.style.base} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === activeKey}
            className={clsx(
              s.className.tab,
              tab.key === activeKey && s.className.active,
              tab.disabled && s.className.disabled,
            )}
            style={{
              ...s.style.tab,
              ...(tab.key === activeKey ? s.style.active : undefined),
            }}
            onClick={() => {
              if (!tab.disabled) onChange(tab.key);
            }}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content && (
        <div className={s.className.panel} style={s.style.panel} role="tabpanel">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
