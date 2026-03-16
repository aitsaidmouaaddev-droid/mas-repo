import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './table.module.scss';

/**
 * Column definition for the {@link Table} component.
 *
 * @property key - Data property key used to read cell values from each row
 * @property header - Column header text
 * @property render - Custom cell renderer; receives the full row object
 * @property sortable - Whether this column supports click-to-sort
 */
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

/**
 * Props for the {@link Table} component.
 *
 * @property columns - Column definitions describing headers and cell rendering
 * @property data - Array of row objects to display
 * @property rowKey - Function that returns a unique key for each row
 * @property emptyText - Message shown when `data` is empty. @default 'No data'
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Data table with optional column sorting and custom cell rendering.
 *
 * @param props - {@link TableProps}
 * @returns A `<table>` element with sortable headers and rendered rows
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'age', header: 'Age' },
 *   ]}
 *   data={users}
 *   rowKey={(row) => row.id}
 * />
 * ```
 */
export default function Table<T = Record<string, unknown>>({
  columns,
  data,
  rowKey,
  emptyText = 'No data',
  classOverride,
  styleOverride,
  testId,
  className,
}: TableProps<T>) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey] as string | number;
      const bVal = (b as Record<string, unknown>)[sortKey] as string | number;
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  return (
    <table className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={clsx(s.className.header, col.sortable && s.className.sortable)}
              style={s.style.header}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
              aria-sort={
                col.sortable && sortKey === col.key
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {col.header}
              {col.sortable &&
                sortKey === col.key &&
                (sortDir === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={s.className.empty}>
              {emptyText}
            </td>
          </tr>
        ) : (
          sorted.map((row) => (
            <tr key={rowKey(row)} className={s.className.row}>
              {columns.map((col) => (
                <td key={col.key} className={s.className.cell} style={s.style.cell}>
                  {col.render
                    ? col.render(row)
                    : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
