import { useEffect, useCallback, useRef } from 'react';
import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { flap, reset, setSize, tick } from '../flappy.slice';
import type { RootState } from './useFlappyGame.types';
import { sfx } from '../sfx';

const FPS = 60;
const FRAME_MS = 1000 / FPS;

export function useFlappyGame(wrapperRef?: React.RefObject<HTMLDivElement>) {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.flappy.status);
  const score = useSelector((s: RootState) => s.flappy.score);
  const bestScore = useSelector((s: RootState) => s.flappy.bestScore);

  const prevScore = useRef(score);
  const prevStatus = useRef(status);
  const prevBest = useRef(bestScore);

  // Sync board size to wrapper element
  useEffect(() => {
    const update = () => {
      const el = wrapperRef?.current;
      const w = el ? el.clientWidth : window.innerWidth * 0.9;
      const h = el ? el.clientHeight : window.innerHeight * 0.9;
      dispatch(setSize({ width: Math.floor(w), height: Math.floor(h) }));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [dispatch, wrapperRef]);

  // Sound: score point
  useEffect(() => {
    if (score > prevScore.current) sfx.score();
    prevScore.current = score;
  }, [score]);

  // Sound: death
  useEffect(() => {
    if (status === 'dead' && prevStatus.current === 'running') {
      if (score > prevBest.current) sfx.newBest();
      else sfx.hit();
    }
    prevStatus.current = status;
  }, [status, score, prevBest]);

  useEffect(() => {
    prevBest.current = bestScore;
  }, [bestScore]);

  // Game loop — fixed 60fps via setInterval
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => dispatch(tick()), FRAME_MS);
    return () => clearInterval(id);
  }, [status, dispatch]);

  // Keyboard: space / tap to flap, enter to restart
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        sfx.flap();
        dispatch(flap());
      }
      if (e.key === 'Enter' && status === 'dead') {
        e.preventDefault();
        dispatch(reset());
      }
    },
    [dispatch, status],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return {
    onFlap: () => {
      sfx.flap();
      dispatch(flap());
    },
    onReset: () => dispatch(reset()),
  };
}
