/**
 * Module detail — shows list of questions for a module.
 */
import { useMemo } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
import { Typography, TypographyWithSkeleton, Container, Stack, Button, Alert } from '@mas/react-ui';
import { FiArrowLeft, FiPlay } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { resetSession, startSession } from '@mas/shared/qcm';
import type { QcmModule, QcmQuestion } from '@mas/shared/qcm';
import type {
  FindOneQcmModuleQuery,
  FindAllQcmQuestionsQuery,
  FindAllQcmModulesQuery,
} from '@mas/react-fundamentals-sot';
import {
  FIND_ALL_QCM_MODULES,
  FIND_ALL_QCM_QUESTIONS,
  FIND_ONE_QCM_MODULE,
} from '../../../graphql/documents';
import type { AppDispatch } from '../../../store';
import { QcmQuestionRow } from './QcmQuestionRow';
import styles from './QcmModuleDetail.module.scss';

export function QcmModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data: moduleData, loading: moduleLoading } = useQuery<FindOneQcmModuleQuery>(
    FIND_ONE_QCM_MODULE,
    { variables: { id: moduleId }, skip: !moduleId },
  );

  const {
    data: questionsData,
    loading: questionsLoading,
    error: questionsError,
  } = useQuery<FindAllQcmQuestionsQuery>(FIND_ALL_QCM_QUESTIONS);

  const { data: modulesData } = useQuery<FindAllQcmModulesQuery>(FIND_ALL_QCM_MODULES);

  const loading = moduleLoading || questionsLoading;

  const questions = useMemo<FindAllQcmQuestionsQuery['findAllQcmQuestion']>(() => {
    if (!questionsData?.findAllQcmQuestion) return [];
    return questionsData.findAllQcmQuestion
      .filter((q) => q.moduleId === moduleId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [questionsData, moduleId]);

  const module = moduleData?.findOneQcmModule;

  const handleStartQuiz = () => {
    if (!questionsData?.findAllQcmQuestion || !modulesData?.findAllQcmModule) return;
    dispatch(resetSession());

    const allModules: QcmModule[] = modulesData.findAllQcmModule.map((m) => ({
      id: m.id,
      label: m.label,
      questions: questionsData.findAllQcmQuestion
        .filter((q) => q.moduleId === m.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(
          (q) =>
            ({
              id: q.id,
              type: q.type as 'single' | 'multi',
              difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
              tags: q.data.tags,
              question: q.data.question,
              choices: q.data.choices,
              answer: JSON.parse(q.data.answer) as number | number[],
              explanation: q.data.explanation ?? undefined,
              docs: q.data.docs ?? undefined,
            }) satisfies QcmQuestion,
        ),
    }));

    dispatch(
      startSession({
        data: { modules: allModules },
        config: { shuffle: true, showExplanation: true, mode: 'module', module: moduleId! },
      }),
    );
    navigate('/qcm/quiz');
  };

  if (questionsError) {
    return (
      <Container maxWidth="md">
        <Alert variant="error">Failed to load questions.</Alert>
      </Container>
    );
  }

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <div className={styles.topBar}>
          <Button
            variant="ghost"
            label="Back"
            startIcon={FiArrowLeft}
            onClick={() => navigate('/qcm')}
          />
          {questions.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              label="Start quiz"
              startIcon={FiPlay}
              onClick={handleStartQuiz}
            />
          )}
        </div>

        <Stack direction="vertical" gap={4} className={styles.heading}>
          <TypographyWithSkeleton loading={loading} variant="title">
            {module?.label ?? moduleId}
          </TypographyWithSkeleton>
          <TypographyWithSkeleton loading={loading} variant="body" className={styles.subtitle}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </TypographyWithSkeleton>
        </Stack>

        {!loading && questions.length === 0 ? (
          <Typography variant="body">No questions found in this module.</Typography>
        ) : (
          <Stack direction="vertical" gap={8}>
            {questions.map((q, i) => (
              <QcmQuestionRow
                key={q.id}
                index={i + 1}
                question={q.data.question}
                difficulty={q.difficulty}
                type={q.type}
                tags={q.data.tags}
                onClick={() => navigate(`/qcm/${moduleId}/${q.id}`)}
              />
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
