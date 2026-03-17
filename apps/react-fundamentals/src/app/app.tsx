/**
 * Root application component.
 *
 * Acts as a simple mode router — renders `Home`, `CodeView`, `QcmView`,
 * or the TDT challenge flow based on the current `mode` state.
 */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetSession } from '@mas/shared/qcm';
import type { AppDispatch } from '../store';
import type { TdtChallenge } from '../api';
import { Home } from './home/home';
import { QcmView } from './qcm/qcm-view';
import { CodeView } from './code/code-view';
import { TdtCatalogView } from './tdt/tdt-catalog-view';
import { TdtChallengeView } from './tdt/tdt-challenge-view';

type Mode = 'select' | 'code' | 'qcm' | 'tdt';

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<Mode>('select');
  const [activeTdtChallenge, setActiveTdtChallenge] = useState<TdtChallenge | null>(null);

  const openCode = () => setMode('code');

  const openQcm = () => {
    dispatch(resetSession());
    setMode('qcm');
  };

  const openTdt = () => setMode('tdt');

  if (mode === 'code') return <CodeView onBack={() => setMode('select')} />;
  if (mode === 'qcm') return <QcmView onBack={() => setMode('select')} />;

  if (mode === 'tdt') {
    if (activeTdtChallenge) {
      return (
        <TdtChallengeView
          challenge={activeTdtChallenge}
          onBack={() => setActiveTdtChallenge(null)}
        />
      );
    }
    return (
      <TdtCatalogView onBack={() => setMode('select')} onSelect={(c) => setActiveTdtChallenge(c)} />
    );
  }

  return <Home onStartCode={openCode} onStartQcm={openQcm} onStartTdt={openTdt} />;
}

export default App;
