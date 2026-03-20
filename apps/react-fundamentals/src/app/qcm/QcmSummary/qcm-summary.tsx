/**
 * QCM session summary screen.
 *
 * Shows two tables built with the `@mas/react-ui` Table component:
 * 1. **Module breakdown** — score, max score and % per module.
 * 2. **Question detail** — per-question result (correct / wrong / skipped),
 *    difficulty badge, and points earned.
 *
 * All data is read directly from the Redux store — no props needed beyond
 * the `onBack` callback.
 */
import { useSelector } from 'react-redux';
import { selectQcm, selectResult, selectModules } from '@mas/shared/qcm';
import type { Difficulty, QcmAnswer, FlatQuestion } from '@mas/shared/qcm';
import { Button, Typography, Badge, Container, Stack, ProgressBar } from '@mas/react-ui';
import type { TableColumn } from '@mas/react-ui';
import { Table } from '@mas/react-ui';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import type { RootState } from '../../../store';
import styles from './qcm-summary.module.scss';

// ── Row types ────────────────────────────────────────────────────────────────

interface ModuleRow {
  id: string;
  label: string;
  total: number;
  correct: number;
  score: number;
  maxScore: number;
  percentage: number;
}

interface QuestionRow {
  key: string;
  index: number;
  question: string;
  difficulty: Difficulty;
  moduleLabel: string;
  result: 'correct' | 'wrong' | 'skipped';
  score: number;
  maxScore: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const diffVariant: Record<Difficulty, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const resultVariant: Record<QuestionRow['result'], 'success' | 'error' | 'secondary'> = {
  correct: 'success',
  wrong: 'error',
  skipped: 'secondary',
};

function maxWeightFor(d: Difficulty): number {
  return d === 'easy' ? 1 : d === 'medium' ? 2 : 3;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function QcmSummary() {
  const navigate = useNavigate();
  const onBack = () => navigate('/qcm/quiz');
  const qcm = useSelector((s: RootState) => selectQcm(s));
  const result = useSelector((s: RootState) => selectResult(s));
  const modules = useSelector((s: RootState) => selectModules(s));

  if (!result) return null;

  const moduleLabelMap = Object.fromEntries(modules.map((m) => [m.id, m.label]));

  // ── Module rows ─────────────────────────────────────────────────────────────
  const moduleRows: ModuleRow[] = Object.entries(result.byModule).map(([id, ms]) => ({
    id,
    label: moduleLabelMap[id] ?? id,
    total: ms.total,
    correct: qcm.answers.filter(
      (a) => qcm.questions.find((q) => q.id === a.questionId)?.moduleId === id && a.correct,
    ).length,
    score: ms.score,
    maxScore: ms.maxScore,
    percentage: ms.percentage,
  }));

  // ── Question rows ────────────────────────────────────────────────────────────
  const answerMap = new Map<string, QcmAnswer>(qcm.answers.map((a) => [a.questionId, a]));

  const questionRows: QuestionRow[] = qcm.questions.map((q: FlatQuestion, i: number) => {
    const ans = answerMap.get(q.id);
    const result: QuestionRow['result'] =
      !ans || ans.skipped ? 'skipped' : ans.correct ? 'correct' : 'wrong';
    return {
      key: q.id,
      index: i + 1,
      question: q.question,
      difficulty: q.difficulty,
      moduleLabel: moduleLabelMap[q.moduleId] ?? q.moduleId,
      result,
      score: ans?.score ?? 0,
      maxScore: maxWeightFor(q.difficulty),
    };
  });

  // ── Table column definitions ──────────────────────────────────────────────

  const moduleColumns: TableColumn<ModuleRow>[] = [
    { key: 'label', header: 'Module', sortable: true },
    { key: 'total', header: 'Questions', sortable: true },
    {
      key: 'correct',
      header: 'Correct',
      sortable: true,
      render: (row) => `${row.correct} / ${row.total}`,
    },
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
          <span className={styles.scoreCell}>{row.percentage}%</span>
        </div>
      ),
    },
  ];

  const questionColumns: TableColumn<QuestionRow>[] = [
    { key: 'index', header: '#', sortable: true },
    { key: 'moduleLabel', header: 'Module', sortable: true },
    {
      key: 'question',
      header: 'Question',
      render: (row) => (
        <span className={styles.questionText} title={row.question}>
          {row.question}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      sortable: true,
      render: (row) => <Badge label={row.difficulty} variant={diffVariant[row.difficulty]} />,
    },
    {
      key: 'result',
      header: 'Result',
      sortable: true,
      render: (row) => <Badge label={row.result} variant={resultVariant[row.result]} />,
    },
    {
      key: 'score',
      header: 'Points',
      sortable: true,
      render: (row) => (
        <span className={styles.scoreCell}>
          {row.score} / {row.maxScore}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Container maxWidth="xl">
        <Button variant="ghost" label="Back to results" startIcon={FiArrowLeft} onClick={onBack} />

        <Stack direction="vertical" gap={4} className={styles.heading}>
          <Typography variant="title">Session Summary</Typography>
          <Typography variant="body" className={styles.subtitle}>
            {result.total} questions · {result.score}/{result.maxScore} pts · {result.percentage}% ·
            streak {result.streak}
          </Typography>
        </Stack>

        {/* ── Module breakdown ── */}
        <div className={styles.section}>
          <Typography variant="subtitle" className={styles.sectionTitle}>
            By module
          </Typography>
          <div className={styles.tableWrapper}>
            <Table<ModuleRow>
              columns={moduleColumns}
              data={moduleRows}
              rowKey={(row) => row.id}
              emptyText="No module data"
            />
          </div>
        </div>

        {/* ── Per-question detail ── */}
        <div className={styles.section}>
          <Typography variant="subtitle" className={styles.sectionTitle}>
            All questions
          </Typography>
          <div className={styles.tableWrapper}>
            <Table<QuestionRow>
              columns={questionColumns}
              data={questionRows}
              rowKey={(row) => row.key}
              emptyText="No questions"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
