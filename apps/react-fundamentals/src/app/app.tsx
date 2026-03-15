import { useEffect, useState } from 'react';
import { fetchModes, fetchQcm } from './api';
import type { QcmQuestion } from './api';
import { CodeView } from './code-view';
import { QcmView } from './qcm-view';

type Mode = 'select' | 'code' | 'qcm';

export function App() {
  const [mode, setMode] = useState<Mode>('select');
  const [modes, setModes] = useState<string[]>([]);
  const [qcmData, setQcmData] = useState<QcmQuestion[]>([]);

  useEffect(() => {
    fetchModes()
      .then(setModes)
      .catch(() => setModes(['code', 'qcm']));
  }, []);

  const openCode = () => setMode('code');
  const openQcm = () => {
    fetchQcm().then((q) => {
      setQcmData(q);
      setMode('qcm');
    });
  };
  const goHome = () => setMode('select');

  if (mode === 'code') return <CodeView onBack={goHome} />;
  if (mode === 'qcm') return <QcmView questions={qcmData} onBack={goHome} />;

  return (
    <div className="panel home">
      <h1>React Fundamentals</h1>
      <p>Choose a mode to start learning.</p>
      <div className="mode-buttons">
        {modes.includes('code') && (
          <button className="mode-btn" onClick={openCode}>
            💻 Code Mode
          </button>
        )}
        {modes.includes('qcm') && (
          <button className="mode-btn" onClick={openQcm}>
            📝 QCM Mode
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
