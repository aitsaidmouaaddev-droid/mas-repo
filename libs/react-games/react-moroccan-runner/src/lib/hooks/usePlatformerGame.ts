import { useEffect, useRef } from 'react';
import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSize, tick, showCharacterSelect, pause, resume } from '../platform.slice';
import type { RootState } from './usePlatformerGame.types';

const TICK_MS = 1000 / 60;

export function usePlatformerGame(wrapperRef: React.RefObject<HTMLDivElement>) {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.platform.status);

  // Live input state — updated by event handlers, read inside the game loop
  const keysRef = useRef({
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    run: false,
  });

  // ── Resize observer ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      dispatch(setSize({ width: Math.floor(width), height: Math.floor(height) }));
    });
    obs.observe(el);
    const { width, height } = el.getBoundingClientRect();
    dispatch(setSize({ width: Math.floor(width), height: Math.floor(height) }));
    return () => obs.disconnect();
  }, [wrapperRef, dispatch]);

  // ── Game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const { left, right, jump, jumpJustPressed, run } = keysRef.current;
      dispatch(tick({ left, right, jumpHeld: jump, jumpJustPressed, run }));
      // Clear the one-shot flag after dispatching
      keysRef.current.jumpJustPressed = false;
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [dispatch]);

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.run = true;
          break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          if (!keysRef.current.jump) {
            keysRef.current.jumpJustPressed = true;
            if (status === 'idle') {
              dispatch(showCharacterSelect());
              return;
            }
          }
          keysRef.current.jump = true;
          break;
        case 'KeyP':
        case 'Escape':
          if (status === 'running') dispatch(pause());
          else if (status === 'paused') dispatch(resume());
          break;
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.run = false;
          break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          keysRef.current.jump = false;
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [dispatch, status]);
}
