import React from 'react';
import { useSelector } from 'react-redux';
import { CELL_SIZE } from '../snake.slice';
import type { RootState } from '../hooks/useSnakeGame.types';
import styles from './SnakeBoard.module.scss';

export function SnakeBoard() {
  const snake = useSelector((s: RootState) => s.snake.snake);
  const food = useSelector((s: RootState) => s.snake.food);
  const specialFood = useSelector((s: RootState) => s.snake.specialFood);
  const status = useSelector((s: RootState) => s.snake.status);
  const boardCols = useSelector((s: RootState) => s.snake.boardCols);
  const boardRows = useSelector((s: RootState) => s.snake.boardRows);

  const snakeSet = new Set(snake.map((c) => `${c.x},${c.y}`));
  const headKey = `${snake[0]?.x},${snake[0]?.y}`;
  const foodKey = `${food.x},${food.y}`;
  const specialKey = specialFood ? `${specialFood.x},${specialFood.y}` : null;

  return (
    <div
      className={styles.board}
      style={
        {
          '--cols': boardCols,
          '--rows': boardRows,
          '--cell': `${CELL_SIZE}px`,
        } as React.CSSProperties
      }
      data-status={status}
    >
      {Array.from({ length: boardCols * boardRows }, (_, i) => {
        const x = i % boardCols;
        const y = Math.floor(i / boardCols);
        const key = `${x},${y}`;
        const isHead = key === headKey;
        const isSnake = snakeSet.has(key);
        const isFood = key === foodKey;
        const isSpecial = key === specialKey;
        const specialType = isSpecial ? specialFood!.type : undefined;

        return (
          <div
            key={key}
            className={styles.cell}
            data-type={
              isHead
                ? 'head'
                : isSnake
                  ? 'snake'
                  : isFood
                    ? 'food'
                    : isSpecial
                      ? `special-${specialType}`
                      : undefined
            }
          />
        );
      })}
    </div>
  );
}
