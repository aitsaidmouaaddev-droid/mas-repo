import {
  Button,
  Typography,
  ProgressBar,
  Card,
  Container,
  Stack,
  Icon,
} from '@mas/react-ui';
import { Table } from '@mas/react-ui';
import type { TableColumn } from '@mas/react-ui';
import { FiCheckCircle, FiBook, FiRefreshCw, FiHome } from 'react-icons/fi';
import type { QcmResult } from '@mas/shared/qcm';
import styles from './QcmResultCard.module.scss';

export interface ModuleScoreRow {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  total: number;
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

interface QcmResultCardProps {
  result: QcmResult;
  moduleRows: ModuleScoreRow[];
  onRetry: () => void;
  onHome: () => void;
}

export function QcmResultCard({ result, moduleRows, onRetry, onHome }: QcmResultCardProps) {
  const passed = result.passed;

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <div className={styles.resultContainer}>
          <Card>
            <div className={styles.resultContent}>
              <Icon
                type="vector"
                icon={passed ? FiCheckCircle : FiBook}
                size={48}
                className={`${styles.resultIcon} ${passed ? styles.pass : styles.fail}`}
              />
              <Typography variant="title">
                {passed ? 'Well done!' : 'Keep practicing!'}
              </Typography>
              <Typography variant="subtitle" className={styles.resultStats}>
                {result.percentage}% — {result.score}/{result.maxScore} pts
              </Typography>

              <ProgressBar value={result.percentage / 100} />

              <Typography variant="caption" className={styles.resultStats}>
                {result.total} questions · streak {result.streak} ·{' '}
                {Math.round(result.duration / 1000)}s
              </Typography>

              <Stack direction="horizontal" gap={12} className={styles.resultActions}>
                <Button
                  variant="outline"
                  label="Retry wrong"
                  startIcon={FiRefreshCw}
                  onClick={onRetry}
                />
                <Button variant="primary" label="Home" startIcon={FiHome} onClick={onHome} />
              </Stack>
            </div>
          </Card>

          {moduleRows.length > 1 && (
            <div className={styles.moduleTable}>
              <Typography variant="subtitle" className={styles.moduleTableTitle}>
                Score by module
              </Typography>
              <Table<ModuleScoreRow>
                columns={moduleScoreColumns}
                data={moduleRows}
                rowKey={(row) => row.id}
                emptyText="No module data"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
