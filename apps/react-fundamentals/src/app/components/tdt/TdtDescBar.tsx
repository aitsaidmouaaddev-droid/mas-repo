import { Typography, Stack, Icon } from '@mas/react-ui';
import { FiExternalLink } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
import styles from './TdtDescBar.module.scss';

interface TdtDescBarProps {
  description: string;
  docs?: string;
}

export function TdtDescBar({ description, docs }: TdtDescBarProps) {
  const { t } = useT();

  return (
    <div className={styles.descBar}>
      <Stack direction="horizontal" gap={12} align="center">
        <Typography variant="caption" className={styles.desc}>
          {description}
        </Typography>
        {docs && (
          <a
            href={docs}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            <Icon type="vector" icon={FiExternalLink} size={12} />
            {t('tdt.docsLink')}
          </a>
        )}
      </Stack>
    </div>
  );
}
