import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Typography, Stack, useIsMobile } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { useNavigate } from '@mas/react-router';
import { FiArrowLeft, FiRefreshCw, FiPause, FiPlay } from 'react-icons/fi';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useGameScore } from './hooks/useGameScore';
import { SnakeBoardCanvas } from './components/SnakeBoardCanvas';
import { SnakeHud } from './components/SnakeHud';
import { SnakeControls } from './components/SnakeControls';
import { SpeedBar } from './components/SpeedBar';
import type { RootState } from './hooks/useSnakeGame.types';
import { CELL_SIZE } from './snake.slice';
import styles from './SnakeGame.module.scss';

export function SnakeGame() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { onStart, onPause, onReset, onDirection, onSpeedUp, onSpeedDown } =
    useSnakeGame(wrapperRef);
  useGameScore();
  const navigate = useNavigate();
  const status = useSelector((s: RootState) => s.snake.status);
  const score = useSelector((s: RootState) => s.snake.score);
  const bestScore = useSelector((s: RootState) => s.snake.bestScore);
  const snake = useSelector((s: RootState) => s.snake.snake);
  const food = useSelector((s: RootState) => s.snake.food);
  const boardCols = useSelector((s: RootState) => s.snake.boardCols);
  const boardRows = useSelector((s: RootState) => s.snake.boardRows);
  const isMobile = useIsMobile();
  const { t } = useT();

  const isRunning = status === 'running';

  // Floating buttons are ~48px tall at bottom:24px center.
  // Convert to grid zone: bottom ~4 rows, center ~6 cols wide.
  const btnZoneXMin = Math.floor(boardCols / 2) - 3;
  const btnZoneXMax = Math.floor(boardCols / 2) + 3;
  const btnZoneYMin = boardRows - Math.ceil(80 / CELL_SIZE);
  const isUnderButtons = (cell: { x: number; y: number }) =>
    cell.x >= btnZoneXMin && cell.x <= btnZoneXMax && cell.y >= btnZoneYMin;
  const buttonsObscured = snake.some(isUnderButtons) || isUnderButtons(food);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Full-screen board */}
      <SnakeBoardCanvas />

      {/* HUD overlay — top center */}
      <div className={styles.hud}>
        <SnakeHud />
      </div>

      {/* Back button — top left */}
      <div className={styles.backBtn}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowLeft}
          onClick={() => navigate('/games')}
        />
      </div>

      {/* Floating action buttons — hide while running or obscured by snake/food */}
      <div
        className={`${styles.floatingActions} ${isRunning || buttonsObscured ? styles.hidden : ''}`}
      >
        {status === 'idle' && (
          <Button
            variant="primary"
            label={t('games.snake.start')}
            startIcon={FiPlay}
            onClick={onStart}
          />
        )}
        {status === 'paused' && (
          <Button
            variant="primary"
            label={t('games.snake.resume')}
            startIcon={FiPlay}
            onClick={onPause}
          />
        )}
        {status !== 'idle' && status !== 'dead' && (
          <Button variant="ghost" size="sm" startIcon={FiPause} onClick={onPause} />
        )}
        {status !== 'idle' && (
          <Button variant="ghost" size="sm" startIcon={FiRefreshCw} onClick={onReset} />
        )}
      </div>

      {/* Speed bar — right side */}
      <div className={styles.speedBar}>
        <SpeedBar onSpeedUp={onSpeedUp} onSpeedDown={onSpeedDown} />
      </div>

      {/* Mobile d-pad */}
      {isMobile && (status === 'running' || status === 'paused') && (
        <div className={styles.dpad}>
          <SnakeControls onDirection={onDirection} />
        </div>
      )}

      {/* Game over modal */}
      <Modal open={status === 'dead'} onClose={onReset} title={t('games.snake.gameOver')}>
        <Stack direction="vertical" gap={12} align="center">
          <Typography variant="body">{t('games.snake.finalScore', { score })}</Typography>
          {score >= bestScore && score > 0 && (
            <Typography variant="body">{t('games.snake.newBest')}</Typography>
          )}
          <Button variant="primary" label={t('games.snake.playAgain')} onClick={onReset} />
        </Stack>
      </Modal>
    </div>
  );
}
