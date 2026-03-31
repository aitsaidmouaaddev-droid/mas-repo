import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { createAppStore } from '@mas/shared/store';
import { uiReducer } from '@mas/react-ui';
import { flappySlice } from './flappy.slice';
import { FlappyGame } from './FlappyGame';

export function FlappyGameProvider() {
  const store = useMemo(() => createAppStore({ flappy: flappySlice.reducer, ui: uiReducer }), []);

  return (
    <Provider store={store}>
      <FlappyGame />
    </Provider>
  );
}
