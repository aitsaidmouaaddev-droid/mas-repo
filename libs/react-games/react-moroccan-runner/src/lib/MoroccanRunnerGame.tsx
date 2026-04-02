import { useRef } from 'react';
import type React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Typography, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { useNavigate } from '@mas/react-router';
import { FiArrowLeft, FiPause, FiPlay } from 'react-icons/fi';
import { usePlatformerGame } from './hooks/usePlatformerGame';
import { useGameProgress } from './hooks/useGameProgress';
import { MoroccanBoardCanvas } from './components/MoroccanBoardCanvas';
import { PlatformerHud } from './components/PlatformerHud';
import { CharacterSelect } from './components/CharacterSelect';
import { pause, resume, reset, resetToWorld0, showCharacterSelect } from './platform.slice';
import type { RootState } from './hooks/usePlatformerGame.types';
import styles from './MoroccanRunnerGame.module.scss';

export function MoroccanRunnerGame() {
  const wrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  usePlatformerGame(wrapperRef);
  useGameProgress();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useT();

  const status = useSelector((s: RootState) => s.platform.status);
  const score = useSelector((s: RootState) => s.platform.score);
  const bestScore = useSelector((s: RootState) => s.platform.bestScore);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <MoroccanBoardCanvas />

      {status === 'character-select' && <CharacterSelect />}

      <div className={styles.hud}>
        <PlatformerHud />
      </div>

      {/* Back */}
      <div className={styles.backBtn}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={FiArrowLeft}
          onClick={() => navigate('/games')}
        />
      </div>

      {/* Pause / resume */}
      {(status === 'running' || status === 'paused') && (
        <div className={styles.pauseBtn}>
          <Button
            variant="ghost"
            size="sm"
            startIcon={status === 'running' ? FiPause : FiPlay}
            onClick={() => dispatch(status === 'running' ? pause() : resume())}
          />
        </div>
      )}

      {/* Tap-to-start hint */}
      {status === 'idle' && (
        <div className={styles.startOverlay}>
          <div className={styles.startHint}>
            <Typography variant="body">{t('games.moroccanRunner.tap')}</Typography>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {status === 'running' && (
        <div className={styles.controlsHint}>
          <Typography variant="caption">{t('games.moroccanRunner.controls')}</Typography>
        </div>
      )}

      {/* Game over modal */}
      <Modal
        open={status === 'dead'}
        onClose={() => dispatch(reset())}
        title={t('games.moroccanRunner.gameOver')}
      >
        <Stack direction="vertical" gap={12} align="center">
          <Typography variant="body">{t('games.moroccanRunner.finalScore', { score })}</Typography>
          {score >= bestScore && score > 0 && (
            <Typography variant="body">{t('games.moroccanRunner.newBest')}</Typography>
          )}
          <Stack direction="horizontal" gap={12}>
            <Button
              variant="primary"
              label={t('games.moroccanRunner.playAgain')}
              onClick={() => dispatch(reset())}
            />
            <Button
              variant="secondary"
              label={t('games.moroccanRunner.changeCharacter')}
              onClick={() => {
                dispatch(reset());
                dispatch(showCharacterSelect());
              }}
            />
          </Stack>
        </Stack>
      </Modal>

      {/* Game complete modal */}
      <Modal
        open={status === 'game-complete'}
        onClose={() => dispatch(resetToWorld0())}
        title={t('games.moroccanRunner.gameComplete')}
      >
        <Stack direction="vertical" gap={12} align="center">
          <Typography variant="body">{t('games.moroccanRunner.finalScore', { score })}</Typography>
          <Typography variant="body">{t('games.moroccanRunner.congratulations')}</Typography>
          <Button
            variant="primary"
            label={t('games.moroccanRunner.playAgain')}
            onClick={() => dispatch(resetToWorld0())}
          />
        </Stack>
      </Modal>
    </div>
  );
}
