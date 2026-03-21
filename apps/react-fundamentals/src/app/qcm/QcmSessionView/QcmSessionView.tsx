import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Typography,
  Container,
  Stack,
  Card,
  Badge,
  Tag,
  Button,
  Alert,
  Spinner,
  RadioGroup,
  CheckboxGroup,
  Icon,
} from '@mas/react-ui';
import { FiArrowLeft, FiArrowRight, FiCheck, FiExternalLink, FiXCircle } from 'react-icons/fi';
import { difficultyVariant, getTechMeta } from '../../utils';
import { QcmResults } from '../../components/qcm/QcmResults';
import {
  selectQcmStatus,
  answerQuestion,
  skipQuestion,
  resetSession,
  retrySession,
} from '@mas/shared/qcm';
import type { FlatQuestion } from '@mas/shared/qcm';
import {
  CREATE_QCM_ANSWER,
  UPDATE_QCM_ANSWER,
  UPDATE_QCM_SESSION,
  FIND_SESSION_ANSWERS,
  FIND_ONE_QCM_MODULE,
} from '../../../graphql/documents';
import type { QcmAnswer } from '@mas/react-fundamentals-sot';
import type { RootState, AppDispatch } from '../../../store';
import { useDynamicBreadcrumb } from '../../DynamicBreadcrumbContext';
import { useAppToast } from '../../ToastContext';
import styles from '../QcmQuestionPage/QcmQuestionPage.module.scss';

// Partial shape returned by FIND_SESSION_ANSWERS
type GqlAnswer = Pick<QcmAnswer, 'id' | 'questionId' | 'selectedOption' | 'isCorrect'>;

interface ReviewData {
  isCorrect: boolean;
  correctIndices: number[];
  choices: string[];
  explanation?: string;
  docs?: string;
  selectedIndices: number[];
}



// ─── Component ────────────────────────────────────────────────────────────────

export function QcmSessionView() {
  const { sessionId, moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const addToast = useAppToast();

  // ── Redux state ────────────────────────────────────────────────────────────

  const status = useSelector(selectQcmStatus);

  const currentQuestion = useSelector((state: RootState): FlatQuestion | null => {
    const { questions, currentIndex } = state.qcm;
    return questions[currentIndex] ?? null;
  });

  const { currentIndex, total } = useSelector((state: RootState) => ({
    currentIndex: state.qcm.currentIndex,
    total: state.qcm.questions.length,
  }));

  const moduleLabel = useSelector((state: RootState) =>
    state.qcm.data?.modules[0]?.label ?? null,
  );

  // ── Apollo ─────────────────────────────────────────────────────────────────

  const { data: moduleData } = useQuery<{ findOneQcmModule: { category: string } }>(
    FIND_ONE_QCM_MODULE,
    { variables: { id: moduleId }, skip: !moduleId },
  );

  const moduleCategory = moduleData?.findOneQcmModule?.category ?? null;

  const { data: answersData } = useQuery<{ findByQcmAnswer: GqlAnswer[] }>(
    FIND_SESSION_ANSWERS,
    { variables: { filter: JSON.stringify({ sessionId }) }, skip: !sessionId, fetchPolicy: 'network-only' },
  );

  const skippedAnswerMap = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    (answersData?.findByQcmAnswer ?? [])
      .filter((a) => a.selectedOption === 'skipped')
      .forEach((a) => map.set(a.questionId, a.id));
    return map;
  }, [answersData]);

  const [createAnswer] = useMutation(CREATE_QCM_ANSWER);
  const [updateAnswer] = useMutation(UPDATE_QCM_ANSWER);
  const [updateSession] = useMutation(UPDATE_QCM_SESSION);

  // ── Local UI state ─────────────────────────────────────────────────────────

  const [singleVal, setSingleVal] = useState('');
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [phase, setPhase] = useState<'answering' | 'reviewing'>('answering');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [abandonPending, setAbandonPending] = useState(false);

  // Count Redux-tracked skipped answers
  const skippedCount = useSelector((state: RootState) =>
    state.qcm.answers.filter((a) => a.skipped).length,
  );

  // Reset when question advances
  useEffect(() => {
    setSingleVal('');
    setMultiValues([]);
    setPhase('answering');
    setReviewData(null);
  }, [currentIndex]);

  // ── Guard: idle means page was refreshed (Redux reset) ─────────────────────

  useEffect(() => {
    if (status === 'idle' && !showResults) {
      addToast({ variant: 'info', message: 'Session expired — please start again.' });
      navigate('/qcm', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, showResults]);

  // ── Show results when session finishes (only if no skipped questions remain) ──

  useEffect(() => {
    if (status === 'finished' && skippedCount === 0) {
      setShowResults(true);
    }
  }, [status, skippedCount]);

  // ── Breadcrumbs ────────────────────────────────────────────────────────────

  const setBreadcrumbs = useDynamicBreadcrumb();
  useEffect(() => {
    if (showResults && moduleLabel) {
      setBreadcrumbs([
        { label: 'QCM', path: '/qcm' },
        { label: moduleLabel, path: '/qcm' },
        { label: 'Results' },
      ]);
      return () => setBreadcrumbs(null);
    }
    if (!currentQuestion || !moduleLabel) return;
    const text  = currentQuestion.question;
    const label = text.length > 60 ? text.slice(0, 60) + '…' : text;
    setBreadcrumbs([
      { label: 'QCM', path: '/qcm' },
      { label: moduleLabel, path: '/qcm' },
      { label },
    ]);
    return () => setBreadcrumbs(null);
  }, [currentQuestion, moduleLabel, showResults, setBreadcrumbs]);

  // ── Abandon ────────────────────────────────────────────────────────────────

  const handleAbandon = async () => {
    if (!sessionId) return;
    await updateSession({
      variables: { input: { id: sessionId, status: 'Abandoned' } },
    });
    dispatch(resetSession());
    navigate('/qcm');
  };

  // ── Results screen ─────────────────────────────────────────────────────────

  if (showResults && sessionId && moduleId) {
    return (
      <QcmResults
        sessionId={sessionId}
        moduleId={moduleId}
        onBack={() => {
          dispatch(resetSession());
          navigate('/qcm');
        }}
      />
    );
  }

  // ── Skipped questions gate ─────────────────────────────────────────────────

  if (status === 'finished' && skippedCount > 0) {
    return (
      <div className={styles.centered}>
        <Card className={styles.questionCard}>
          <Stack direction="vertical" gap={16} align="center">
            <Typography variant="title">You have {skippedCount} unanswered question{skippedCount > 1 ? 's' : ''}</Typography>
            <Typography variant="body">
              You skipped {skippedCount} question{skippedCount > 1 ? 's' : ''}. Answer them before finishing to get a complete score.
            </Typography>
            <Button
              variant="primary"
              label={`Answer skipped (${skippedCount})`}
              onClick={() => dispatch(retrySession())}
            />
          </Stack>
        </Card>
      </div>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  if (status === 'idle' || !currentQuestion) {
    return <div className={styles.centered}><Spinner size="lg" /></div>;
  }

  const q           = currentQuestion;
  const isSingle    = q.type === 'single';
  const isSkipped   = skippedAnswerMap.has(q.id);
  const isLast      = currentIndex === total - 1;
  const questionNum = currentIndex + 1;
  const remaining   = total - questionNum;
  const isResumed   = (answersData?.findByQcmAnswer?.length ?? 0) > 0;

  const selectedIndices = isSingle
    ? (singleVal !== '' ? [Number(singleVal)] : [])
    : multiValues.map(Number);

  const canSubmit = isSingle ? singleVal !== '' : multiValues.length > 0;

  const options = q.choices.map((c, i) => ({
    value: String(i),
    label: c,
    disabled: phase === 'reviewing',
  }));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const correctIndices = Array.isArray(q.answer) ? q.answer as number[] : [q.answer as number];
    const isCorrect = (
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every((i) => correctIndices.includes(i))
    );
    setReviewData({
      isCorrect,
      correctIndices,
      choices: q.choices,
      explanation: q.explanation,
      docs: q.docs,
      selectedIndices,
    });
    setPhase('reviewing');
  };

  const handleNext = async () => {
    if (!reviewData || !sessionId) return;
    const { isCorrect, selectedIndices: idx } = reviewData;
    const selectedOption = JSON.stringify(idx);
    const payload        = isSingle ? idx[0] : idx;

    // Persist answer (fire-and-forget)
    if (isSkipped) {
      const existingId = skippedAnswerMap.get(q.id)!;
      updateAnswer({
        variables: { input: { id: existingId, selectedOption, isCorrect } },
      }).catch((e) => { console.error('Failed to update answer', e); });
    } else {
      createAnswer({
        variables: { input: { sessionId, questionId: q.id, selectedOption, isCorrect } },
      }).catch((e) => { console.error('Failed to save answer', e); });
    }

    dispatch(answerQuestion(payload));
  };

  const handleSkip = async () => {
    if (!sessionId) return;

    if (!isSkipped) {
      createAnswer({
        variables: { input: { sessionId, questionId: q.id, selectedOption: 'skipped', isCorrect: false } },
      }).catch((e) => { console.error('Failed to save skipped answer', e); });
    }

    dispatch(skipQuestion());
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <Container maxWidth="md">

        <div className={styles.pageHeader}>
          <Button variant="ghost" label="Back to modules" startIcon={FiArrowLeft} onClick={() => navigate('/qcm')} />
          <Stack direction="horizontal" gap={8} align="center">
            {isResumed && <Badge label="Resumed" variant="warning" />}
            <Typography variant="caption" className={styles.questionCounter}>
              Question {questionNum} / {total} · {remaining} remaining
            </Typography>
            {abandonPending ? (
              <div className={styles.abandonConfirmRow}>
                <Typography variant="caption" className={styles.abandonConfirm}>Abandon session?</Typography>
                <Button variant="danger" size="sm" label="Yes, abandon" onClick={handleAbandon} />
                <Button variant="ghost" size="sm" label="Cancel" onClick={() => setAbandonPending(false)} />
              </div>
            ) : (
              <Button
                variant="danger"
                size="sm"
                label="Abandon"
                startIcon={FiXCircle}
                onClick={() => setAbandonPending(true)}
              />
            )}
          </Stack>
        </div>

        <Card className={styles.questionCard}>
          <Stack direction="vertical" gap={16}>

            {/* Tags row */}
            <Stack direction="horizontal" gap={8} align="center" wrap>
              <Badge
                label={q.difficulty}
                variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
              />
              <Badge label={isSingle ? 'Single choice' : 'Multiple choice'} variant="secondary" />
              {isSkipped && <Badge label="Previously skipped" variant="warning" />}
              {moduleCategory && (() => {
                const tech = getTechMeta(moduleCategory);
                const TechIcon = tech.icon;
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <TechIcon size={12} color={tech.color} />
                    <Tag
                      label={tech.label}
                      style={{
                        '--tech-color': tech.color,
                        background: `color-mix(in srgb, ${tech.color} 15%, transparent)`,
                        color: tech.color,
                      } as React.CSSProperties}
                    />
                  </span>
                );
              })()}
              {q.tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
            </Stack>

            <Typography variant="subtitle">{q.question}</Typography>

            {/* Choices */}
            <div className={styles.choices}>
              {isSingle ? (
                <RadioGroup
                  name="qcm-choice"
                  options={options}
                  value={singleVal}
                  onChange={(v) => phase === 'answering' && setSingleVal(v)}
                />
              ) : (
                <CheckboxGroup
                  options={options}
                  value={multiValues}
                  onChange={(v) => phase === 'answering' && setMultiValues(v)}
                />
              )}
            </div>

            {/* Feedback */}
            {phase === 'reviewing' && reviewData && (
              <Alert variant={reviewData.isCorrect ? 'success' : 'error'}>
                <Stack direction="vertical" gap={6}>
                  <strong>{reviewData.isCorrect ? 'Correct!' : 'Wrong'}</strong>
                  {!reviewData.isCorrect && (
                    <Typography variant="body">
                      Correct answer: {reviewData.correctIndices.map((i) => reviewData.choices[i]).join(', ')}
                    </Typography>
                  )}
                  {reviewData.explanation && (
                    <Typography variant="body">{reviewData.explanation}</Typography>
                  )}
                  {reviewData.docs && (
                    <a href={reviewData.docs} target="_blank" rel="noopener noreferrer" className={styles.docsLink}>
                      <Icon type="vector" icon={FiExternalLink} size={12} />
                      Read the docs
                    </a>
                  )}
                </Stack>
              </Alert>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              {phase === 'answering' ? (
                <>
                  <Button
                    variant="ghost"
                    label={isSkipped ? 'Skip again' : 'Skip'}
                    endIcon={FiArrowRight}
                    onClick={handleSkip}
                  />
                  <Button
                    variant="primary"
                    label="Submit"
                    endIcon={FiCheck}
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  />
                </>
              ) : (
                <Button
                  variant="primary"
                  label={isLast ? 'Finish' : 'Next'}
                  endIcon={FiArrowRight}
                  onClick={handleNext}
                />
              )}
            </div>

          </Stack>
        </Card>

      </Container>
    </div>
  );
}
