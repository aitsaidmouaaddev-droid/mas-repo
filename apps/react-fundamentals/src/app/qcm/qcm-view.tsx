/**
 * QCM (multiple-choice quiz) view.
 *
 * Reads session state from the Redux store via `@mas/shared/qcm` selectors
 * and dispatches `answerQuestion`, `skipQuestion`, and `retrySession` actions.
 *
 * ### Pending-question review pattern
 * `answerQuestion` auto-advances the store index immediately. To keep the
 * answered question visible while feedback is shown, the component captures
 * `pendingQuestion` + `localFeedback` in local state on submit and clears
 * them on "Next" — without dispatching `nextQuestion` (which would
 * double-advance the index).
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { FlatQuestion, AnswerFeedback } from '@mas/shared/qcm';
import {
  answerQuestion,
  skipQuestion,
  retrySession,
  selectCurrentQuestion,
  selectProgress,
  selectResult,
  selectLastFeedback,
  selectQcmStatus,
  selectModules,
} from '@mas/shared/qcm';
import {
  Button,
  Typography,
  ProgressBar,
  Badge,
  Tag,
  Alert,
  Card,
  Container,
  Stack,
  Icon,
  RadioGroup,
  CheckboxGroup,
  CodeEditor,
} from '@mas/react-ui';
import { Table } from '@mas/react-ui';
import type { TableColumn } from '@mas/react-ui';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronsRight,
  FiHome,
  FiRefreshCw,
  FiCheckCircle,
  FiBook,
  FiList,
} from 'react-icons/fi';
import type { AppDispatch, RootState } from '../../store';
import { QcmSummary } from './qcm-summary';
import { QcmModuleSelect } from './qcm-module-select';
import styles from './qcm-view.module.scss';

interface QcmViewProps {
  onBack: () => void;
}

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

interface ModuleScoreRow {
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

export function QcmView({ onBack }: QcmViewProps) {
  const dispatch = useDispatch<AppDispatch>();

  const status = useSelector((s: RootState) => selectQcmStatus(s));
  const currentEntry = useSelector((s: RootState) => selectCurrentQuestion(s));
  const progress = useSelector((s: RootState) => selectProgress(s));
  const storeFeedback = useSelector((s: RootState) => selectLastFeedback(s));
  const result = useSelector((s: RootState) => selectResult(s));
  const modules = useSelector((s: RootState) => selectModules(s));

  const [singleVal, setSingleVal] = useState<string>('');
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Review-phase state: keep answered question visible while feedback is shown
  const [pendingQuestion, setPendingQuestion] = useState<FlatQuestion | null>(null);
  const [localFeedback, setLocalFeedback] = useState<AnswerFeedback | null>(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [wasLast, setWasLast] = useState(false);
  const [progressAtSubmit, setProgressAtSubmit] = useState(0);

  // Capture feedback after answerQuestion auto-advances the store index
  useEffect(() => {
    if (storeFeedback !== null) setLocalFeedback(storeFeedback);
  }, [storeFeedback]);

  const resetSelection = () => {
    setSingleVal('');
    setMultiValues([]);
  };

  // ── Module selection (idle) ────────────────────────────────────────────────
  if (status === 'idle') {
    return <QcmModuleSelect onBack={onBack} />;
  }

  // ── Summary screen ────────────────────────────────────────────────────────
  if (showSummary) {
    return <QcmSummary onBack={() => setShowSummary(false)} />;
  }

  // ── Finished (only once user dismisses the last answer's feedback) ────────
  if (status === 'finished' && result && !isShowingFeedback) {
    const passed = result.passed;

    const moduleLabelMap = Object.fromEntries(modules.map((m) => [m.id, m.label]));
    const moduleRows: ModuleScoreRow[] = Object.entries(result.byModule).map(([id, ms]) => ({
      id,
      label: moduleLabelMap[id] ?? id,
      total: ms.total,
      score: ms.score,
      maxScore: ms.maxScore,
      percentage: ms.percentage,
    }));

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
                    variant="ghost"
                    label="Summary"
                    startIcon={FiList}
                    onClick={() => setShowSummary(true)}
                  />
                  <Button
                    variant="outline"
                    label="Retry wrong"
                    startIcon={FiRefreshCw}
                    onClick={() => {
                      resetSelection();
                      dispatch(retrySession());
                    }}
                  />
                  <Button variant="primary" label="Home" startIcon={FiHome} onClick={onBack} />
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

  // ── Determine displayed question ──────────────────────────────────────────
  const question = isShowingFeedback ? pendingQuestion : (currentEntry?.question ?? null);

  if (!question || !progress) {
    return (
      <div className={styles.centered}>
        <Typography variant="body">No questions available.</Typography>
        <Button variant="outline" label="Back" startIcon={FiArrowLeft} onClick={onBack} />
      </div>
    );
  }

  const isSingle = question.type === 'single';
  const isCorrect = localFeedback?.correct ?? false;

  const radioOptions = question.choices.map((c: string, i: number) => ({
    value: String(i),
    label: c,
    disabled: isShowingFeedback,
  }));

  const displayedQuestionNum = isShowingFeedback ? progressAtSubmit + 1 : progress.current + 1;
  const progressValue =
    (isShowingFeedback ? progressAtSubmit + 1 : progress.current + 1) / progress.total;

  const handleSubmit = () => {
    if (!currentEntry) return;
    if (isSingle && !singleVal) return;
    if (!isSingle && !multiValues.length) return;

    const selected = isSingle ? Number(singleVal) : multiValues.map(Number);

    setPendingQuestion(currentEntry.question);
    setProgressAtSubmit(progress.current);
    setWasLast(progress.current === progress.total - 1);
    setIsShowingFeedback(true);

    dispatch(answerQuestion(selected));
  };

  const handleNext = () => {
    resetSelection();
    setPendingQuestion(null);
    setLocalFeedback(null);
    setIsShowingFeedback(false);
  };

  const handleSkip = () => {
    resetSelection();
    dispatch(skipQuestion());
  };

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <div className={styles.topBar}>
          <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />
          <Button
            variant="outline"
            size="sm"
            label="Summary"
            startIcon={FiList}
            onClick={() => setShowSummary(true)}
          />
        </div>

        <Stack direction="vertical" gap={16}>
          {/* ── Progress ── */}
          <Stack direction="vertical" gap={8}>
            <div className={styles.progressLabels}>
              <Typography variant="caption">
                Question {displayedQuestionNum} / {progress.total}
              </Typography>
              <Typography variant="caption">
                {progress.answered} answered · {progress.skipped} skipped
              </Typography>
            </div>
            <ProgressBar value={progressValue} />
          </Stack>

          {/* ── Question card ── */}
          <Card>
            <Stack direction="vertical" gap={16}>
              {/* Header: difficulty + type + tags */}
              <div className={styles.questionHeader}>
                <Badge
                  label={question.difficulty}
                  variant={difficultyVariant[question.difficulty as keyof typeof difficultyVariant]}
                />
                <Badge
                  label={question.type === 'multi' ? 'Multiple choice' : 'Single choice'}
                  variant="secondary"
                />
                {question.tags.map((tag: string) => (
                  <Tag key={tag} label={tag} variant="info" />
                ))}
              </div>

              {/* Question text */}
              <Typography variant="subtitle">{question.question}</Typography>

              {/* Optional code snippet */}
              {question.code && (
                <div className={styles.codeSnippet}>
                  <CodeEditor
                    code={question.code}
                    language="tsx"
                    mode="view"
                    filename="snippet.tsx"
                  />
                </div>
              )}

              {/* Choices */}
              <div className={styles.choices}>
                {isSingle ? (
                  <RadioGroup
                    name="qcm-choice"
                    options={radioOptions}
                    value={singleVal}
                    onChange={(v) => !isShowingFeedback && setSingleVal(v)}
                  />
                ) : (
                  <CheckboxGroup
                    options={radioOptions}
                    value={multiValues}
                    onChange={(v) => !isShowingFeedback && setMultiValues(v)}
                  />
                )}
              </div>
            </Stack>
          </Card>

          {/* ── Feedback ── */}
          {isShowingFeedback && localFeedback && (
            <Alert variant={isCorrect ? 'success' : 'error'}>
              <Stack direction="vertical" gap={4}>
                <strong>{isCorrect ? 'Correct!' : 'Wrong'}</strong>
                {localFeedback.explanation && (
                  <Typography variant="body">{localFeedback.explanation}</Typography>
                )}
              </Stack>
            </Alert>
          )}

          {/* ── Actions ── */}
          <div className={styles.actions}>
            {!isShowingFeedback && (
              <>
                <Button
                  variant="ghost"
                  label="Skip"
                  endIcon={FiChevronsRight}
                  onClick={handleSkip}
                />
                <Button
                  variant="primary"
                  label="Submit"
                  endIcon={FiCheck}
                  disabled={isSingle ? !singleVal : !multiValues.length}
                  onClick={handleSubmit}
                />
              </>
            )}
            {isShowingFeedback && (
              <Button
                variant="primary"
                label={wasLast ? 'See results' : 'Next'}
                endIcon={FiArrowRight}
                onClick={handleNext}
              />
            )}
          </div>
        </Stack>
      </Container>
    </div>
  );
}
