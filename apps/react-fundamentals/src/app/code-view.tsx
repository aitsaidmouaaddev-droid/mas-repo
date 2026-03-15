import { useEffect, useState } from 'react';
import type { ModuleEntry, RunResult } from './api';
import { fetchCatalog, runTest } from './api';

interface CodeViewProps {
  onBack: () => void;
}

export function CodeView({ onBack }: CodeViewProps) {
  const [modules, setModules] = useState<ModuleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, RunResult>>({});

  useEffect(() => {
    fetchCatalog()
      .then(setModules)
      .finally(() => setLoading(false));
  }, []);

  const handleRun = async (selector: string) => {
    setRunning(selector);
    try {
      const result = await runTest(selector);
      setResults((prev) => ({ ...prev, [selector]: result }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [selector]: {
          passed: 0,
          failed: 1,
          tests: [],
          logs: String(err),
        },
      }));
    } finally {
      setRunning(null);
    }
  };

  if (loading) return <div className="panel">Loading catalog...</div>;

  if (modules.length === 0) {
    return (
      <div className="panel">
        <button onClick={onBack}>&larr; Back</button>
        <p>No exercises found in <code>src/coding/</code>.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <button onClick={onBack}>&larr; Back</button>
      <h2>Code Exercises</h2>

      {modules.map((mod) => (
        <div key={mod.moduleIndex} className="module-block">
          <h3>
            {mod.moduleIndex}. {mod.moduleName}
          </h3>

          {mod.files.map((file) => (
            <div key={file.selector} className="file-block">
              <div className="file-header">
                <span className="file-name">{file.fileName.replace(/\.test\.tsx?$/, '')}</span>
                <button
                  className="run-btn"
                  disabled={running !== null}
                  onClick={() => handleRun(file.selector)}
                >
                  {running === file.selector ? '...' : '▶ Run all'}
                </button>
              </div>

              <ul className="test-list">
                {file.tests.map((test) => {
                  const res = results[test.selector];
                  const fileRes = results[file.selector];
                  const match =
                    res ||
                    (fileRes
                      ? {
                          ...fileRes,
                          tests: fileRes.tests.filter((t) =>
                            t.title.includes(test.title),
                          ),
                        }
                      : null);

                  const status = match?.tests?.[0]?.status;

                  return (
                    <li key={test.selector} className="test-row">
                      <StatusDot status={status} />
                      <span className="test-title">{test.title}</span>
                      <button
                        className="run-btn small"
                        disabled={running !== null}
                        onClick={() => handleRun(test.selector)}
                      >
                        {running === test.selector ? '...' : '▶'}
                      </button>

                      {res && (
                        <TestResultBlock result={res} />
                      )}
                    </li>
                  );
                })}
              </ul>

              {results[file.selector] && (
                <TestResultBlock result={results[file.selector]} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status?: string }) {
  if (!status) return <span className="dot dot-pending">○</span>;
  if (status === 'passed') return <span className="dot dot-pass">●</span>;
  return <span className="dot dot-fail">●</span>;
}

function TestResultBlock({ result }: { result: RunResult }) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className={`result-block ${result.failed > 0 ? 'result-fail' : 'result-pass'}`}>
      <div className="result-summary">
        <span role="img" aria-label="passed">✅</span> {result.passed} passed &nbsp;
        <span role="img" aria-label="failed">❌</span> {result.failed} failed
        {result.logs && (
          <button className="toggle-logs" onClick={() => setShowLogs((v) => !v)}>
            {showLogs ? 'hide logs' : 'show logs'}
          </button>
        )}
      </div>

      {result.failed > 0 &&
        result.tests
          .filter((t) => t.status === 'failed')
          .map((t, i) => (
            <pre key={i} className="failure-msg">
              {t.failureMessages.join('\n')}
            </pre>
          ))}

      {showLogs && <pre className="log-output">{result.logs}</pre>}
    </div>
  );
}
