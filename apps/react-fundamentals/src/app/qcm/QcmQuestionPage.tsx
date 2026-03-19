import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
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
import { FiArrowLeft, FiArrowRight, FiCheck, FiExternalLink } from 'react-icons/fi';
import {
  FIND_ONE_QCM_QUESTION,
  FIND_ALL_QCM_QUESTIONS,
  FIND_ALL_QCM_MODULES,
  CREATE_QCM_ANSWER,
  UPDATE_QCM_ANSWER,
  UPDATE_QCM_SESSION,
  FIND_SESSION_ANSWERS,
} from '../../graphql/documents';
import { useDynamicBreadcrumb } from '../DynamicBreadcrumbContext';
import styles from './QcmQuestionPage.module.scss';

// ─── GQL shape ────────────────────────────────────────────────────────────────

interface GqlQuestion {
  id: string;
  moduleId: string;
  type: string;
  difficulty: string;
  data: { question: string; choices: string[]; answer: string; tags: string[]; explanation?: string | null; docs?: string | null };
}

interface GqlAnswer {
  id: string;
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'error' } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function QcmQuestionPage() {
  const { sessionId, moduleId, questionId } = useParams();
  const navigate = useNavigate();

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: questionData, loading: questionLoading, error: questionError } = useQuery<{
    findOneQcmQuestion: GqlQuestion | null;
  }>(FIND_ONE_QCM_QUESTION, { variables: { id: questionId }, skip: !questionId });

  const { data: allQuestionsData } = useQuery<{
    findAllQcmQuestion: { id: string; moduleId: string; sortOrder: number }[];
  }>(FIND_ALL_QCM_QUESTIONS, { skip: !moduleId });

  const { data: modulesData } = useQuery<{
    findAllQcmModule: { id: string; label: string }[];
  }>(FIND_ALL_QCM_MODULES, { skip: !moduleId });

  const { data: sessionAnswersData, loading: answersLoading } = useQuery<{
    findByQcmAnswer: GqlAnswer[];
  }>(FIND_SESSION_ANSWERS, {
    variables: { filter: JSON.stringify({ sessionId }) },
    skip: !sessionId,
    fetchPolicy: 'network-only',
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  const refetchAnswers = {
    refetchQueries: [{ query: FIND_SESSION_ANSWERS, variables: { filter: JSON.stringify({ sessionId }) } }],
    awaitRefetchQueries: true,
  };

  const [createAnswer] = useMutation(CREATE_QCM_ANSWER, refetchAnswers);
  const [updateAnswer] = useMutation(UPDATE_QCM_ANSWER, refetchAnswers);
  const [updateSession] = useMutation(UPDATE_QCM_SESSION);
  const [fetchAnswers] = useLazyQuery<{ findByQcmAnswer: GqlAnswer[] }>(FIND_SESSION_ANSWERS);

  // ── Local UI state ─────────────────────────────────────────────────────────

  const [singleVal, setSingleVal] = useState('');
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Reset selection when question changes
  useEffect(() => {
    setSingleVal('');
    setMultiValues([]);
    setSubmitted(false);
  }, [questionId]);

  // ── Derived data ───────────────────────────────────────────────────────────

  const moduleLabel = modulesData?.findAllQcmModule.find((m) => m.id === moduleId)?.label ?? null;

  const moduleQuestions = (allQuestionsData?.findAllQcmQuestion ?? [])
    .filter((q) => q.moduleId === moduleId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const existingAnswers = sessionAnswersData?.findByQcmAnswer ?? [];
  const skippedIds  = new Set(existingAnswers.filter((a) => a.selectedOption === 'skipped').map((a) => a.questionId));
  const answeredIds = new Set(existingAnswers.filter((a) => a.selectedOption !== 'skipped').map((a) => a.questionId));

  const currentAnswer    = existingAnswers.find((a) => a.questionId === questionId) ?? null;
  const isAlreadySkipped = currentAnswer?.selectedOption === 'skipped';
  const isAlreadyAnswered = !!currentAnswer && !isAlreadySkipped;

  const currentIndex = moduleQuestions.findIndex((q) => q.id === questionId);

  // Next skipped-or-unanswered question from a given index
  const findNext = (fromIndex: number) =>
    moduleQuestions.slice(fromIndex + 1).find((q) => skippedIds.has(q.id) || !answeredIds.has(q.id)) ?? null;

  const nextTarget = findNext(currentIndex);
  const isLast     = !nextTarget;

  // ── Breadcrumbs ────────────────────────────────────────────────────────────

  const setBreadcrumbs = useDynamicBreadcrumb();
  useEffect(() => {
    if (!questionData?.findOneQcmQuestion || !moduleLabel) return;
    const text = questionData.findOneQcmQuestion.data.question;
    const label = text.length > 60 ? text.slice(0, 60) + '…' : text;
    setBreadcrumbs([
      { label: 'QCM', path: '/qcm' },
      { label: moduleLabel, path: '/qcm' },
      { label },
    ]);
    return () => setBreadcrumbs(null);
  }, [questionData, moduleLabel, setBreadcrumbs]);

  // ── Auto-redirect if question already answered ─────────────────────────────

  useEffect(() => {
    if (answersLoading || !sessionAnswersData) return;
    if (!isAlreadyAnswered) return;
    const next = findNext(currentIndex);
    if (next) {
      navigate(`/qcm/${sessionId}/${moduleId}/${next.id}`, { replace: true });
    } else {
      navigate('/qcm', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersLoading, sessionAnswersData, isAlreadyAnswered]);

  // ── Session finish ─────────────────────────────────────────────────────────

  const finishSession = async () => {
    if (!sessionId) return;
    const { data } = await fetchAnswers({ variables: { filter: JSON.stringify({ sessionId }) } });
    const answers  = data?.findByQcmAnswer ?? [];
    const score    = answers.filter((a) => a.isCorrect).length;
    await updateSession({
      variables: { input: { id: sessionId, status: 'Completed', score, completedAt: new Date().toISOString() } },
    });
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const goNext = async () => {
    if (isLast) { await finishSession(); navigate('/qcm'); }
    else navigate(`/qcm/${sessionId}/${moduleId}/${nextTarget!.id}`);
  };

  const handleSkip = async () => {
    if (isAlreadySkipped) {
      // Question already marked skipped — just move on, no mutation
      await goNext();
      return;
    }
    if (!sessionId || !questionId) return;
    await createAnswer({
      variables: { input: { sessionId, questionId, selectedOption: 'skipped', isCorrect: false } },
    });
    await goNext();
  };

  const handleSubmit = async (correct: boolean, selectedOption: string) => {
    setSubmitted(true);
    if (!sessionId || !questionId) return;
    if (isAlreadySkipped && currentAnswer) {
      // Update existing skipped record
      await updateAnswer({
        variables: { input: { id: currentAnswer.id, selectedOption, isCorrect: correct } },
      });
    } else {
      await createAnswer({
        variables: { input: { sessionId, questionId, selectedOption, isCorrect: correct } },
      });
    }
  };

  // ── Render guards ──────────────────────────────────────────────────────────

  if (questionLoading || answersLoading || isAlreadyAnswered) {
    return <div className={styles.centered}><Spinner size="lg" /></div>;
  }

  if (questionError || !questionData?.findOneQcmQuestion) {
    return (
      <Container maxWidth="sm">
        <Alert variant="error">Question not found.</Alert>
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/qcm')} />
      </Container>
    );
  }

  // ── Question render ────────────────────────────────────────────────────────

  const q = questionData.findOneQcmQuestion;
  const isSingle      = q.type === 'single';
  const answer        = JSON.parse(q.data.answer) as number | number[];
  const correctIndices: number[] = Array.isArray(answer) ? answer : [answer];

  const selectedIndices = isSingle
    ? (singleVal !== '' ? [Number(singleVal)] : [])
    : multiValues.map(Number);

  const isCorrect = submitted && (
    selectedIndices.length === correctIndices.length &&
    selectedIndices.every((i) => correctIndices.includes(i))
  );

  const options = q.data.choices.map((c, i) => ({
    value: String(i),
    label: c,
    disabled: submitted,
  }));

  const canSubmit     = isSingle ? singleVal !== '' : multiValues.length > 0;
  const questionNumber = currentIndex >= 0 ? currentIndex + 1 : null;

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <div className={styles.pageHeader}>
          <Button variant="ghost" label="Back to module" startIcon={FiArrowLeft} onClick={() => navigate('/qcm')} />
          {questionNumber && moduleQuestions.length > 0 && (
            <Typography variant="caption" className={styles.questionCounter}>
              Question {questionNumber} / {moduleQuestions.length}
            </Typography>
          )}
        </div>

        <Card className={styles.questionCard}>
          <Stack direction="vertical" gap={16}>

            {/* Header tags */}
            <Stack direction="horizontal" gap={8} align="center" wrap>
              <Badge
                label={q.difficulty}
                variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
              />
              <Badge label={isSingle ? 'Single choice' : 'Multiple choice'} variant="secondary" />
              {isAlreadySkipped && <Badge label="Previously skipped" variant="warning" />}
              {q.data.tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
            </Stack>

            <Typography variant="subtitle">{q.data.question}</Typography>

            {/* Choices */}
            <div className={styles.choices}>
              {isSingle ? (
                <RadioGroup
                  name="practice-choice"
                  options={options}
                  value={singleVal}
                  onChange={(v) => !submitted && setSingleVal(v)}
                />
              ) : (
                <CheckboxGroup
                  options={options}
                  value={multiValues}
                  onChange={(v) => !submitted && setMultiValues(v)}
                />
              )}
            </div>

            {/* Feedback */}
            {submitted && (
              <Alert variant={isCorrect ? 'success' : 'error'}>
                <Stack direction="vertical" gap={6}>
                  <strong>{isCorrect ? 'Correct!' : 'Wrong'}</strong>
                  {!isCorrect && (
                    <Typography variant="body">
                      Correct answer: {correctIndices.map((i) => q.data.choices[i]).join(', ')}
                    </Typography>
                  )}
                  {q.data.explanation && <Typography variant="body">{q.data.explanation}</Typography>}
                  {q.data.docs && (
                    <a href={q.data.docs} target="_blank" rel="noopener noreferrer" className={styles.docsLink}>
                      <Icon type="vector" icon={FiExternalLink} size={12} />
                      Read the docs
                    </a>
                  )}
                </Stack>
              </Alert>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              {!submitted ? (
                <>
                  <Button
                    variant="ghost"
                    label={isAlreadySkipped ? 'Skip again' : 'Skip'}
                    endIcon={FiArrowRight}
                    onClick={handleSkip}
                  />
                  <Button
                    variant="primary"
                    label="Submit"
                    endIcon={FiCheck}
                    disabled={!canSubmit}
                    onClick={() => {
                      const correct =
                        selectedIndices.length === correctIndices.length &&
                        selectedIndices.every((i) => correctIndices.includes(i));
                      handleSubmit(correct, JSON.stringify(selectedIndices));
                    }}
                  />
                </>
              ) : (
                <Button
                  variant="primary"
                  label={isLast ? 'Finish' : 'Next'}
                  endIcon={FiArrowRight}
                  onClick={goNext}
                />
              )}
            </div>

          </Stack>
        </Card>
      </Container>
    </div>
  );
}
