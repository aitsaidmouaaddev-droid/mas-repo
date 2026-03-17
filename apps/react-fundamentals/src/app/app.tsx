/**
 * Root application component.
 *
 * Acts as a simple mode router — renders `Home`, `CodeView`, or `QcmView`
 * based on the current `mode` state. Session initialisation is deferred to
 * `QcmModuleSelect` (rendered inside `QcmView` when the store is idle) so the
 * user can pick a module before the session starts.
 */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetSession } from '@mas/shared/qcm';
import type { AppDispatch } from '../store';
import { Home } from './home/home';
import { QcmView } from './qcm/qcm-view';
import { CodeView } from './code/code-view';

type Mode = 'select' | 'code' | 'qcm';

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<Mode>('select');

  const openCode = () => setMode('code');

  const openQcm = () => {
    dispatch(resetSession());
    setMode('qcm');
  };

  if (mode === 'code') return <CodeView onBack={() => setMode('select')} />;
  if (mode === 'qcm') return <QcmView onBack={() => setMode('select')} />;

  return <Home onStartCode={openCode} onStartQcm={openQcm} />;
}

export default App;
