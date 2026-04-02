import { useRef } from 'react';
import type React from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Typography, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { useNavigate } from '@mas/react-router';
import { FiArrowLeft } from 'react-icons/fi';
import { useFlappyGame } from './hooks/useFlappyGame';
import { useGameScore } from './hooks/useGameScore';
import { FlappyBoardCanvas } from './components/FlappyBoardCanvas';
import { FlappyHud } from './components/FlappyHud';
import type { RootState } from './hooks/useFlappyGame.types';
import styles from './FlappyGame.module.scss';

export function FlappyGame() {
  const wrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const { onFlap, onReset } = useFlappyGame(wrapperRef);
  useGameScore();
  const navigate = useNavigate();
  const status = useSelector((s: RootState) => s.flappy.status);
  const score = useSelector((s: RootState) => s.flappy.score);
  const bestScore = useSelector((s: RootState) => s.flappy.bestScore);
  const { t } = useT();

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onClick={status !== 'dead' ? onFlap : undefined}
    >
      {/* Full-screen canvas board */}
      <FlappyBoardCanvas />

      {/* HUD overlay — top center */}
      <div className={styles.hud}>
        <FlappyHud />
      </div>

      {/* Back button — top left */}
      <div className={styles.backBtn}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowLeft}
          onClick={(e) => {
            e.stopPropagation();
            navigate('/games');
          }}
        />
      </div>

      {/* Tap-to-start hint — idle only */}
      {status === 'idle' && (
        <div className={styles.startOverlay}>
          <div className={styles.startHint}>
            <Typography variant="body">{t('games.flappyBird.tap')}</Typography>
          </div>
        </div>
      )}

      {/* Game over modal */}
      <Modal open={status === 'dead'} onClose={onReset} title={t('games.flappyBird.gameOver')}>
        <Stack direction="vertical" gap={12} align="center">
          <Typography variant="body">{t('games.flappyBird.finalScore', { score })}</Typography>
          {score >= bestScore && score > 0 && (
            <Typography variant="body">{t('games.flappyBird.newBest')}</Typography>
          )}
          <Button variant="primary" label={t('games.flappyBird.playAgain')} onClick={onReset} />
        </Stack>
      </Modal>
    </div>
  );
}
