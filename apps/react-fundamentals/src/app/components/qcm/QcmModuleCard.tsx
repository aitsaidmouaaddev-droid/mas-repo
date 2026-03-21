import React from 'react';
import { CardWithSkeleton, Typography, Badge, Tag, Button } from '@mas/react-ui';
import { FiPlay, FiRefreshCw } from 'react-icons/fi';
import { getTechMeta } from '../../utils';
import styles from './QcmModuleCard.module.scss';

interface QcmModuleCardProps {
  index: number;
  id: string;
  label: string;
  description?: string | null;
  category: string;
  questionCount: number;
  hasActive: boolean;
  busy: boolean;
  loading?: boolean;
  onOpen: () => void;
}

export function QcmModuleCard({ index, label, description, category, questionCount, hasActive, busy, loading, onOpen }: QcmModuleCardProps) {
  const tech = getTechMeta(category);
  const TechIcon = tech.icon;

  return (
    <CardWithSkeleton loading={loading} className={styles.moduleCard}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <Typography variant="caption" className={styles.index}>
              {String(index).padStart(2, '0')}
            </Typography>
            {hasActive && <Badge label="In progress" variant="warning" />}
          </div>
          <div className={styles.techTag}>
            <TechIcon size={13} style={{ color: tech.color, flexShrink: 0 }} />
            <Tag
              label={tech.label}
              className={styles.techTagLabel}
              style={{ color: tech.color, '--tech-color': tech.color } as React.CSSProperties}
            />
          </div>
        </div>

        <Typography variant="subtitle" className={styles.moduleTitle}>{label}</Typography>

        {description && (
          <Typography variant="body" className={styles.description}>{description}</Typography>
        )}

        <div className={styles.spacer} />

        <div className={styles.cardFooter}>
          <Typography variant="caption" className={styles.count}>
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </Typography>
          <Button
            variant="primary"
            size="sm"
            label={hasActive ? 'Continue' : 'Start'}
            startIcon={hasActive ? FiRefreshCw : FiPlay}
            disabled={busy || questionCount === 0}
            onClick={onOpen}
          />
        </div>
      </div>
    </CardWithSkeleton>
  );
}
