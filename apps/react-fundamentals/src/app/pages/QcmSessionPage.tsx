import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client/react';
import { Container, Card, Spinner } from '@mas/react-ui';
import { selectQcmStatus, answerQuestion, skipQuestion, resetSession } from '@mas/shared/qcm';
import type { FlatQuestion } from '@mas/shared/qcm';
import {
  CREATE_QCM_ANSWER,
  UPDATE_QCM_ANSWER,
  UPDATE_QCM_SESSION,
  FIND_SESSION_ANSWERS,
  FIND_ONE_QCM_MODULE,
} from '../../graphql/documents';
import type { FindOneQcmModuleQuery, FindSessionAnswersQuery } from '@mas/react-fundamentals-sot';
import type { RootState, AppDispatch } from '../../store';
import { useDynamicBreadcrumb } from '../contexts/DynamicBreadcrumbContext';
import { useAppToast } from '../contexts/ToastContext';
import { QcmResults } from '../components/qcm/QcmResults';
import { QcmSessionHeader } from '../components/qcm/QcmSessionHeader';
import { QcmSessionCard } from '../components/qcm/QcmSessionCard';
import styles from './QcmSessionPage.module.scss';

interface ReviewData {
  isCorrect: boolean;
  correctIndices: number[];
  choices: string[];
  explanation?: string;
  docs?: string;
  selectedIndices: number[];
}

export function QcmSessionPage() {
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

  const moduleLabel = useSelector((state: RootState) => state.qcm.data?.modules[0]?.label ?? null);

  // ── Apollo ─────────────────────────────────────────────────────────────────

  const { data: moduleData } = useQuery<FindOneQcmModuleQuery>(FIND_ONE_QCM_MODULE, {
    variables: { id: moduleId },
    skip: !moduleId,
  });

  const moduleCategory = moduleData?.findOneQcmModule?.category ?? null;

  const { data: answersData } = useQuery<FindSessionAnswersQuery>(FIND_SESSION_ANSWERS, {
    variables: { filter: JSON.stringify({ sessionId }) },
    skip: !sessionId,
    fetchPolicy: 'network-only',
  });

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

  useEffect(() => {
    setSingleVal('');
    setMultiValues([]);
    setPhase('answering');
    setReviewData(null);
  }, [currentIndex]);

  useEffect(() => {
    if (status === 'idle' && !showResults) {
      addToast({ variant: 'info', message: 'Session expired — please start again.' });
      navigate('/qcm', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, showResults]);

  useEffect(() => {
    if (status === 'finished') setShowResults(true);
  }, [status]);

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
    const text = currentQuestion.question;
    const label = text.length > 60 ? text.slice(0, 60) + '…' : text;
    setBreadcrumbs([
      { label: 'QCM', path: '/qcm' },
      { label: moduleLabel, path: '/qcm' },
      { label },
    ]);
    return () => setBreadcrumbs(null);
  }, [currentQuestion, moduleLabel, showResults, setBreadcrumbs]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAbandon = async () => {
    if (!sessionId) return;
    await updateSession({ variables: { input: { id: sessionId, status: 'Abandoned' } } });
    dispatch(resetSession());
    navigate('/qcm');
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    const q = currentQuestion;
    const selectedIndices = isSingle ? [Number(singleVal)] : multiValues.map(Number);
    const correctIndices = Array.isArray(q.answer) ? (q.answer as number[]) : [q.answer as number];
    const isCorrect =
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every((i) => correctIndices.includes(i));
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
    if (!reviewData || !sessionId || !currentQuestion) return;
    const { isCorrect, selectedIndices: idx } = reviewData;
    const selectedOption = JSON.stringify(idx);
    const payload = isSingle ? idx[0] : idx;
    const isSkipped = skippedAnswerMap.has(currentQuestion.id);

    if (isSkipped) {
      const existingId = skippedAnswerMap.get(currentQuestion.id)!;
      updateAnswer({ variables: { input: { id: existingId, selectedOption, isCorrect } } }).catch(
        () => {},
      );
    } else {
      createAnswer({
        variables: {
          input: { sessionId, questionId: currentQuestion.id, selectedOption, isCorrect },
        },
      }).catch(() => {});
    }
    dispatch(answerQuestion(payload));
  };

  const handleSkip = async () => {
    if (!sessionId || !currentQuestion) return;
    if (!skippedAnswerMap.has(currentQuestion.id)) {
      createAnswer({
        variables: {
          input: {
            sessionId,
            questionId: currentQuestion.id,
            selectedOption: 'skipped',
            isCorrect: false,
          },
        },
      }).catch(() => {});
    }
    dispatch(skipQuestion());
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

  if (status === 'idle' || !currentQuestion) {
    return (
      <div className={styles.centered}>
        <Spinner size="lg" />
      </div>
    );
  }

  const q = currentQuestion;
  const isSingle = q.type === 'single';
  const isSkipped = skippedAnswerMap.has(q.id);
  const isLast = currentIndex === total - 1;
  const questionNum = currentIndex + 1;
  const remaining = total - questionNum;
  const isResumed = (answersData?.findByQcmAnswer?.length ?? 0) > 0;
  const canSubmit = isSingle ? singleVal !== '' : multiValues.length > 0;

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <QcmSessionHeader
          questionNum={questionNum}
          total={total}
          remaining={remaining}
          isResumed={isResumed}
          abandonPending={abandonPending}
          onBack={() => navigate('/qcm')}
          onAbandon={() => setAbandonPending(true)}
          onAbandonCancel={() => setAbandonPending(false)}
          onAbandonConfirm={handleAbandon}
        />

        <Card className={styles.questionCard}>
          <QcmSessionCard
            question={q}
            moduleCategory={moduleCategory}
            isSkipped={isSkipped}
            isLast={isLast}
            phase={phase}
            reviewData={reviewData}
            singleVal={singleVal}
            multiValues={multiValues}
            canSubmit={canSubmit}
            onSingleChange={setSingleVal}
            onMultiChange={setMultiValues}
            onSubmit={handleSubmit}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        </Card>
      </Container>
    </div>
  );
}
