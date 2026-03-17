/**
 * Code-exercises view.
 *
 * Loads all exercise modules from the catalog API, then lets the user run
 * individual test files or single test cases. Results are stored in local
 * state keyed by selector and rendered via {@link ResultBlock}.
 */
import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Card,
  Container,
  Stack,
  Badge,
  Alert,
  Spinner,
  GridSkeleton,
} from '@mas/react-ui';
import { FiArrowLeft, FiPlay } from 'react-icons/fi';
import { catalogRepository } from '../../api';
import type { ModuleEntry, RunResult } from '../../api';
import { ResultBlock } from './result-block';
import styles from './code-view.module.scss';

interface CodeViewProps {
  onBack: () => void;
}

type TestStatus = 'pending' | 'passed' | 'failed';

const statusVariant: Record<TestStatus, 'primary' | 'success' | 'error'> = {
  pending: 'primary',
  passed: 'success',
  failed: 'error',
};

function resolveTestStatus(
  testTitle: string,
  fileSelector: string,
  results: Record<string, RunResult>,
): TestStatus {
  const fileRes = results[fileSelector];
  if (!fileRes) return 'pending';
  const match = fileRes.tests.find((t) => t.title === testTitle);
  if (!match) return 'pending';
  return match.status === 'passed' ? 'passed' : 'failed';
}

export function CodeView({ onBack }: CodeViewProps) {
  const [modules, setModules] = useState<ModuleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, RunResult>>({});

  useEffect(() => {
    catalogRepository
      .getAll()
      .then(setModules)
      .finally(() => setLoading(false));
  }, []);

  const handleRun = async (selector: string) => {
    setRunning(selector);
    try {
      const result = await catalogRepository.runTest(selector);
      setResults((prev) => ({ ...prev, [selector]: result }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [selector]: { passed: 0, failed: 1, tests: [], logs: String(err) },
      }));
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />
        <Typography variant="title" className={styles.heading}>
          Code Exercises
        </Typography>

        {loading ? (
          <GridSkeleton />
        ) : modules.length === 0 ? (
          <Alert variant="info">
            No exercises found in <code>src/coding/</code>.
          </Alert>
        ) : (
          <Stack direction="vertical" gap={24}>
            {modules.map((mod: ModuleEntry) => (
              <Card key={mod.moduleIndex}>
                <Stack direction="vertical" gap={16}>
                  <Typography variant="subtitle">
                    {mod.moduleIndex}. {mod.moduleName}
                  </Typography>

                  {mod.files.map((file) => (
                    <div key={file.selector} className={styles.fileBlock}>
                      <div className={styles.fileHeader}>
                        <Typography variant="body">
                          {file.fileName.replace(/\.test\.tsx?$/, '')}
                        </Typography>
                        <div className={styles.runBtn}>
                          {running === file.selector ? (
                            <Spinner size="sm" />
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              label="Run all"
                              startIcon={FiPlay}
                              disabled={running !== null}
                              onClick={() => handleRun(file.selector)}
                            />
                          )}
                        </div>
                      </div>

                      <Stack direction="vertical" gap={4}>
                        {file.tests.map((test) => {
                          const status = resolveTestStatus(test.title, file.selector, results);
                          return (
                            <div key={test.selector} className={styles.testRow}>
                              <Badge variant={statusVariant[status]} label={status} />
                              <Typography variant="caption" className={styles.testTitle}>
                                {test.title}
                              </Typography>
                              <Button
                                variant="ghost"
                                size="sm"
                                startIcon={FiPlay}
                                disabled={running !== null}
                                onClick={() => handleRun(test.selector)}
                              />
                            </div>
                          );
                        })}
                      </Stack>

                      {results[file.selector] && (
                        <div className={styles.failureDetails}>
                          <ResultBlock result={results[file.selector] as RunResult} />
                        </div>
                      )}
                    </div>
                  ))}
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
