import { Button } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import type { Direction } from '../snake.slice';
import styles from './SnakeControls.module.scss';

interface Props {
  onDirection: (dir: Direction) => void;
}

export function SnakeControls({ onDirection }: Props) {
  const { t } = useT();

  return (
    <div className={styles.dpad} aria-label={t('games.snake.controls')}>
      <div className={styles.row}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowUp}
          label=""
          onClick={() => onDirection('UP')}
        />
      </div>
      <div className={styles.row}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowLeft}
          label=""
          onClick={() => onDirection('LEFT')}
        />
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowDown}
          label=""
          onClick={() => onDirection('DOWN')}
        />
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowRight}
          label=""
          onClick={() => onDirection('RIGHT')}
        />
      </div>
    </div>
  );
}
