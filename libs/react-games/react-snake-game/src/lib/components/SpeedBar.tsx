import { useSelector } from 'react-redux';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { MAX_SPEED, MIN_SPEED } from '../snake.slice';
import type { RootState } from '../hooks/useSnakeGame.types';
import styles from './SpeedBar.module.scss';

interface Props {
  onSpeedUp: () => void;
  onSpeedDown: () => void;
}

export function SpeedBar({ onSpeedUp, onSpeedDown }: Props) {
  const level = useSelector((s: RootState) => s.snake.speedLevel);

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={onSpeedUp}
        disabled={level >= MAX_SPEED}
        aria-label="Increase speed (I)"
      >
        <FiChevronUp size={14} />
      </button>

      <div className={styles.bar}>
        {Array.from({ length: MAX_SPEED }, (_, i) => {
          const segLevel = MAX_SPEED - i; // top = 20, bottom = 1
          return <div key={segLevel} className={styles.segment} data-active={segLevel <= level} />;
        })}
      </div>

      <div className={styles.label}>{level}</div>

      <button
        className={styles.btn}
        onClick={onSpeedDown}
        disabled={level <= MIN_SPEED}
        aria-label="Decrease speed (D)"
      >
        <FiChevronDown size={14} />
      </button>
    </div>
  );
}
