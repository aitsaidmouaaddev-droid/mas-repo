import { useEffect, useCallback, useRef } from 'react';
import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  tick,
  setDirection,
  setBoardSize,
  setSpeedLevel,
  start,
  pause,
  reset,
  type Direction,
  type SpecialFood,
  CELL_SIZE,
  tickInterval,
} from '../snake.slice';
import type { RootState } from './useSnakeGame.types';
import { sfx } from '../sfx';

export function useSnakeGame(wrapperRef?: React.RefObject<HTMLDivElement | null>) {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.snake.status);
  const score = useSelector((s: RootState) => s.snake.score);
  const bestScore = useSelector((s: RootState) => s.snake.bestScore);
  const speedLevel = useSelector((s: RootState) => s.snake.speedLevel);
  const specialFood = useSelector((s: RootState) => s.snake.specialFood);
  const food = useSelector((s: RootState) => s.snake.food);

  const prevScore = useRef(score);
  const prevStatus = useRef(status);
  const prevBest = useRef(bestScore);
  const prevSpecialFood = useRef<SpecialFood | null>(specialFood);
  const prevFood = useRef(food);

  // Sync board dimensions to wrapper element size on mount and resize
  useEffect(() => {
    const update = () => {
      const el = wrapperRef?.current;
      const w = el ? el.clientWidth : window.innerWidth * 0.9;
      const h = el ? el.clientHeight : window.innerHeight * 0.9;
      const cols = Math.floor(w / CELL_SIZE);
      const rows = Math.floor(h / CELL_SIZE);
      dispatch(setBoardSize({ cols, rows }));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [dispatch, wrapperRef]);

  // Sound effects: eat (regular vs special), die, new best
  useEffect(() => {
    if (score > prevScore.current) {
      // Special food was eaten: it was present last tick and is now null
      const wasSpecial = prevSpecialFood.current && !specialFood;
      if (wasSpecial) {
        if (prevSpecialFood.current!.type === 'green') sfx.eatGreen();
        else sfx.eatYellow();
      } else {
        sfx.eat();
      }
    }
    prevScore.current = score;
    prevSpecialFood.current = specialFood;
    prevFood.current = food;
  }, [score, specialFood, food]);

  useEffect(() => {
    if (status === 'dead' && prevStatus.current === 'running') {
      if (score > prevBest.current) sfx.newBest();
      else sfx.die();
    }
    prevStatus.current = status;
  }, [status, score, prevBest]);

  useEffect(() => {
    prevBest.current = bestScore;
  }, [bestScore]);

  // Game loop — restarts when status or speed changes
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => dispatch(tick(Date.now())), tickInterval(speedLevel));
    return () => clearInterval(id);
  }, [status, speedLevel, dispatch]);

  // Speed keys — work regardless of game status
  useEffect(() => {
    const handleSpeedKey = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') dispatch(setSpeedLevel(speedLevel + 1));
      if (e.key === 'd' || e.key === 'D') dispatch(setSpeedLevel(speedLevel - 1));
    };
    window.addEventListener('keydown', handleSpeedKey);
    return () => window.removeEventListener('keydown', handleSpeedKey);
  }, [dispatch, speedLevel]);

  // Keyboard controls
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };
      if (map[e.key]) {
        e.preventDefault();
        if (status === 'idle') {
          sfx.start();
          dispatch(start(Date.now()));
        }
        sfx.direction();
        dispatch(setDirection(map[e.key]));
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (status === 'idle') {
          sfx.start();
          dispatch(start(Date.now()));
        } else dispatch(pause());
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
    onStart: () => {
      sfx.start();
      dispatch(start(Date.now()));
    },
    onPause: () => dispatch(pause()),
    onReset: () => dispatch(reset()),
    onDirection: (dir: Direction) => {
      if (status === 'idle') {
        sfx.start();
        dispatch(start(Date.now()));
      }
      sfx.direction();
      dispatch(setDirection(dir));
    },
    onSpeedUp: () => dispatch(setSpeedLevel(speedLevel + 1)),
    onSpeedDown: () => dispatch(setSpeedLevel(speedLevel - 1)),
  };
}
