import React from 'react';
import { Skeleton, Icon } from '@mas/react-ui';
import { getTechMeta } from '../../utils';
import styles from './QcmTechFilters.module.scss';

interface QcmTechFiltersProps {
  loading: boolean;
  availableTechs: { key: string; label: string; color: string }[];
  activeTechs: Set<string>;
  onToggle: (key: string) => void;
}

export function QcmTechFilters({ loading, availableTechs, activeTechs, onToggle }: QcmTechFiltersProps) {
  return (
    <div className={styles.techFilters}>
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={90} height={30} style={{ borderRadius: 999 }} />
          ))
        : availableTechs.map((tech) => {
            const isActive = activeTechs.has(tech.key);
            const meta = getTechMeta(tech.key);
            return (
              <button
                key={tech.key}
                className={`${styles.techFilterBtn} ${isActive ? styles.techFilterBtnActive : ''}`}
                style={{ '--tech-color': tech.color } as React.CSSProperties}
                onClick={() => onToggle(tech.key)}
              >
                <Icon type="vector" icon={meta.icon} size={13} />
                {tech.label}
              </button>
            );
          })
      }
    </div>
  );
}
