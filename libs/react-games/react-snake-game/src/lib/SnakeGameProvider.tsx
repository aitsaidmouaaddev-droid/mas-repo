import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { createAppStore } from '@mas/shared/store';
import { uiReducer } from '@mas/react-ui';
import { snakeSlice } from './snake.slice';
import { SnakeGame } from './SnakeGame';

export function SnakeGameProvider() {
  const store = useMemo(() => createAppStore({ snake: snakeSlice.reducer, ui: uiReducer }), []);

  return (
    <Provider store={store}>
      <SnakeGame />
    </Provider>
  );
}
