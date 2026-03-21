import { Typography, Stack, Icon } from '@mas/react-ui';
import { FiExternalLink } from 'react-icons/fi';
import styles from './TdtDescBar.module.scss';

interface TdtDescBarProps {
  description: string;
  docs?: string;
}

export function TdtDescBar({ description, docs }: TdtDescBarProps) {
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
            Docs
          </a>
        )}
      </Stack>
    </div>
  );
}
