/**
 * Module selection screen shown before a QCM session starts.
 *
 * Fetches the full module list from the API, then lets the user pick
 * a single module or play all modules at once. Dispatches `startSession`
 * directly so `QcmView` transitions out of `idle` as soon as a module
 * is chosen.
 *
 * If a previous session exists in the store, a collapsible summary accordion
 * is shown above the module grid with the last session's score by module.
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startSession, selectResult, selectModules } from '@mas/shared/qcm';
import type { QcmModule } from '@mas/shared/qcm';
import {
  Button,
  Typography,
  Card,
  Container,
  Stack,
  Icon,
  CardSkeleton,
  Alert,
  ProgressBar,
  Accordion,
} from '@mas/react-ui';
import type { AccordionItem, TableColumn } from '@mas/react-ui';
import { Table } from '@mas/react-ui';
import { FiArrowLeft, FiLayers, FiBook } from 'react-icons/fi';
import { qcmRepository } from '../../api';
import type { AppDispatch, RootState } from '../../store';
import styles from './qcm-module-select.module.scss';

interface QcmModuleSelectProps {
  onBack: () => void;
}

interface ModuleScoreRow {
  id: string;
  label: string;
  total: number;
  score: number;
  maxScore: number;
  percentage: number;
}

const moduleScoreColumns: TableColumn<ModuleScoreRow>[] = [
  { key: 'label', header: 'Module', sortable: true },
  { key: 'total', header: 'Questions', sortable: true },
  {
    key: 'score',
    header: 'Score',
    sortable: true,
    render: (row) => `${row.score} / ${row.maxScore} pts`,
  },
  {
    key: 'percentage',
    header: '%',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
        <ProgressBar value={row.percentage / 100} style={{ flex: 1 }} />
        <span>{row.percentage}%</span>
      </div>
    ),
  },
];

export function QcmModuleSelect({ onBack }: QcmModuleSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [modules, setModules] = useState<QcmModule[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lastResult = useSelector((s: RootState) => selectResult(s));
  const lastModules = useSelector((s: RootState) => selectModules(s));

  useEffect(() => {
    qcmRepository
      .getAll()
      .then(setModules)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const start = (moduleId: string | null) => {
    if (!modules) return;
    dispatch(
      startSession({
        data: { modules },
        config: {
          shuffle: false,
          showExplanation: true,
          ...(moduleId ? { mode: 'module', module: moduleId } : { mode: 'all' }),
        },
      }),
    );
  };

  const totalQuestions = modules?.reduce((sum, m) => sum + m.questions.length, 0) ?? 0;

  // Build last-session summary accordion if a result exists in the store
  const summaryItems: AccordionItem[] = [];
  if (lastResult) {
    const moduleLabelMap = Object.fromEntries(lastModules.map((m) => [m.id, m.label]));
    const moduleRows: ModuleScoreRow[] = Object.entries(lastResult.byModule).map(([id, ms]) => ({
      id,
      label: moduleLabelMap[id] ?? id,
      total: ms.total,
      score: ms.score,
      maxScore: ms.maxScore,
      percentage: ms.percentage,
    }));

    summaryItems.push({
      key: 'last-session',
      title: `Last session — ${lastResult.percentage}%  (${lastResult.score}/${lastResult.maxScore} pts · ${lastResult.total} questions)`,
      content: (
        <Table<ModuleScoreRow>
          columns={moduleScoreColumns}
          data={moduleRows}
          rowKey={(row) => row.id}
          emptyText="No module data"
        />
      ),
    });
  }

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />

        <Typography variant="title" className={styles.heading}>
          QCM — Choose a module
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Play a single module or tackle all questions at once.
        </Typography>

        {summaryItems.length > 0 && (
          <div className={styles.summary}>
            <Accordion items={summaryItems} />
          </div>
        )}

        {error && <Alert variant="error">Failed to load modules. Please try again.</Alert>}

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : modules && modules.length > 0 ? (
          <div className={styles.grid}>
            {/* All modules */}
            <Card className={styles.moduleCard}>
              <div className={styles.moduleCardContent}>
                <Icon type="vector" icon={FiLayers} size={32} className={styles.moduleIcon} />
                <Typography variant="subtitle">All modules</Typography>
                <Typography variant="caption" className={styles.moduleCount}>
                  {totalQuestions} questions
                </Typography>
                <Button variant="primary" size="sm" label="Start" onClick={() => start(null)} />
              </div>
            </Card>

            {/* Individual modules */}
            {modules.map((m) => (
              <Card key={m.id} className={styles.moduleCard}>
                <div className={styles.moduleCardContent}>
                  <Icon type="vector" icon={FiBook} size={28} className={styles.moduleIcon} />
                  <Typography variant="subtitle">{m.label}</Typography>
                  <Typography variant="caption" className={styles.moduleCount}>
                    {m.questions.length} questions
                  </Typography>
                  <Button variant="outline" size="sm" label="Start" onClick={() => start(m.id)} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !error && (
            <Stack direction="vertical" gap={12} align="center">
              <Typography variant="body">No modules found.</Typography>
              <Button variant="outline" label="Back" startIcon={FiArrowLeft} onClick={onBack} />
            </Stack>
          )
        )}
      </Container>
    </div>
  );
}
