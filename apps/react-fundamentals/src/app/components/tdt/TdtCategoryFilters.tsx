import React from 'react';
import { Skeleton, Icon } from '@mas/react-ui';
import { TDT_CATEGORY_META, TDT_CATEGORIES } from '../../utils';
import type { TdtCategory } from '../../utils';
import styles from './TdtCategoryFilters.module.scss';

interface TdtCategoryFiltersProps {
  loading: boolean;
  activeCategories: Set<TdtCategory>;
  onToggle: (cat: TdtCategory) => void;
}

export function TdtCategoryFilters({
  loading,
  activeCategories,
  onToggle,
}: TdtCategoryFiltersProps) {
  return (
    <div className={styles.filters}>
      {loading
        ? Array.from({ length: TDT_CATEGORIES.length }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={120}
              height={30}
              style={{ borderRadius: 999 }}
            />
          ))
        : TDT_CATEGORIES.map((cat) => {
            const meta = TDT_CATEGORY_META[cat];
            const isActive = activeCategories.has(cat);
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                style={{ '--cat-color': meta.color } as React.CSSProperties}
                onClick={() => onToggle(cat)}
              >
                <Icon type="vector" icon={meta.icon} size={13} />
                {meta.label}
              </button>
            );
          })}
    </div>
  );
}
