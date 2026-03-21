/**
 * QCM view — orchestrates session state and renders QcmQuestionCard,
 * QcmFeedback and QcmResultCard.
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@mas/react-router';
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
  Card,
  Container,
  Stack,
} from '@mas/react-ui';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronsRight,
} from 'react-icons/fi';
import type { AppDispatch, RootState } from '../../../store';
import { QcmResultCard } from './QcmResultCard';
import type { ModuleScoreRow } from './QcmResultCard';
import { QcmQuestionCard } from './QcmQuestionCard';
import { QcmFeedback } from './QcmFeedback';
import styles from './QcmView.module.scss';

export function QcmView() {
  const navigate = useNavigate();
  const onBack = () => navigate('/');
  const dispatch = useDispatch<AppDispatch>();

  const status = useSelector((s: RootState) => selectQcmStatus(s));
  const currentEntry = useSelector((s: RootState) => selectCurrentQuestion(s));
  const progress = useSelector((s: RootState) => selectProgress(s));
  const storeFeedback = useSelector((s: RootState) => selectLastFeedback(s));
  const result = useSelector((s: RootState) => selectResult(s));
  const modules = useSelector((s: RootState) => selectModules(s));

  const [singleVal, setSingleVal] = useState<string>('');
  const [multiValues, setMultiValues] = useState<string[]>([]);

  const [pendingQuestion, setPendingQuestion] = useState<FlatQuestion | null>(null);
  const [localFeedback, setLocalFeedback] = useState<AnswerFeedback | null>(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [wasLast, setWasLast] = useState(false);
  const [progressAtSubmit, setProgressAtSubmit] = useState(0);

  useEffect(() => {
    if (storeFeedback !== null) setLocalFeedback(storeFeedback);
  }, [storeFeedback]);

  const resetSelection = () => {
    setSingleVal('');
    setMultiValues([]);
  };

  // ── Finished ──────────────────────────────────────────────────────────────
  if (status === 'finished' && result && !isShowingFeedback) {
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
      <QcmResultCard
        result={result}
        moduleRows={moduleRows}
        onRetry={() => { resetSelection(); dispatch(retrySession()); }}
        onHome={onBack}
      />
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
  const displayedQuestionNum = isShowingFeedback ? progressAtSubmit + 1 : progress.current + 1;
  const progressValue = (isShowingFeedback ? progressAtSubmit + 1 : progress.current + 1) / progress.total;

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
              <QcmQuestionCard
                question={question}
                isShowingFeedback={isShowingFeedback}
                singleVal={singleVal}
                multiValues={multiValues}
                onSingleChange={setSingleVal}
                onMultiChange={setMultiValues}
              />
            </Stack>
          </Card>

          {/* ── Feedback ── */}
          {isShowingFeedback && localFeedback && (
            <QcmFeedback
              feedback={localFeedback}
              isCorrect={isCorrect}
              docs={question.docs}
            />
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
