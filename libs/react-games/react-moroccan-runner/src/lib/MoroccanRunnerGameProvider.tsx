import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { createAppStore } from '@mas/shared/store';
import { uiReducer } from '@mas/react-ui';
import { platformSlice } from './platform.slice';
import { MoroccanRunnerGame } from './MoroccanRunnerGame';

export function MoroccanRunnerGameProvider() {
  const store = useMemo(
    () => createAppStore({ platform: platformSlice.reducer, ui: uiReducer }),
    [],
  );

  return (
    <Provider store={store}>
      <MoroccanRunnerGame />
    </Provider>
  );
}
