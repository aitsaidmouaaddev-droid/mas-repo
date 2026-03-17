/**
 * Root application component.
 *
 * Acts as a simple mode router — renders `Home`, `CodeView`, or `QcmView`
 * based on the current `mode` state. QCM session initialisation
 * (`startSession`) is triggered here so the store is populated before
 * `QcmView` mounts.
 */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startSession } from '@mas/shared/qcm';
import { qcmRepository } from '../api';
import type { AppDispatch } from '../store';
import { Home } from './home/home';
import { QcmView } from './qcm/qcm-view';
import { CodeView } from './code/code-view';

type Mode = 'select' | 'code' | 'qcm';

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<Mode>('select');

  const openCode = () => setMode('code');

  const openQcm = async () => {
    const modules = await qcmRepository.getAll();
    dispatch(
      startSession({ data: { modules }, config: { shuffle: false, showExplanation: true } }),
    );
    setMode('qcm');
  };

  if (mode === 'code') return <CodeView onBack={() => setMode('select')} />;
  if (mode === 'qcm') return <QcmView onBack={() => setMode('select')} />;

  return <Home onStartCode={openCode} onStartQcm={openQcm} />;
}

export default App;
