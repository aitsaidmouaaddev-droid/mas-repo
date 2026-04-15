import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './accordion.module.scss';
import AccordionSkeleton from '../skeletons/AccordionSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

/**
 * Represents a single item within an {@link Accordion}.
 *
 * @property key - Unique identifier for the item
 * @property title - Text displayed in the clickable header
 * @property content - Body content revealed when the item is expanded
 */
export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/**
 * Props for the {@link Accordion} component.
 *
 * @property items - Array of {@link AccordionItem} entries to render
 * @property multiple - Whether multiple panels can be open simultaneously @default false
 * @property defaultOpen - Keys of items that should be open on mount @default []
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 * @property className - Additional CSS class for the root element
 */
export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A collapsible accordion that expands one or many panels at a time.
 *
 * @param props - {@link AccordionProps}
 * @returns The rendered accordion element
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { key: 'a', title: 'Section A', content: <p>Content A</p> },
 *     { key: 'b', title: 'Section B', content: <p>Content B</p> },
 *   ]}
 *   multiple
 *   defaultOpen={['a']}
 * />
 * ```
 */
function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  classOverride,
  styleOverride,
  testId,
  className,
}: AccordionProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (!multiple) next.clear();
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      {items.map((item) => {
        const isOpen = openKeys.has(item.key);
        return (
          <div key={item.key} className={clsx(s.className.item, isOpen && s.className.open)}>
            <button
              className={s.className.header}
              style={s.style.header}
              onClick={() => toggle(item.key)}
              aria-expanded={isOpen}
            >
              {item.title}
              <FiChevronDown className={s.className.chevron} size={18} />
            </button>
            {isOpen && (
              <div className={s.className.content} style={s.style.content}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const AccordionWithSkeleton = withSkeleton(Accordion, AccordionSkeleton);
export default Accordion;
