/**
 * Module browse page — `/qcm/:moduleId`.
 *
 * Shows all questions in a module as a navigable list. Each row links to
 * `/qcm/:moduleId/:questionId` for the individual question view.
 *
 * This is a read-only browse mode separate from the Redux-managed quiz session.
 */
import { useMemo } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
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
} from '@mas/react-ui';
import { FiArrowLeft, FiArrowRight, FiPlay } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { resetSession, startSession } from '@mas/shared/qcm';
import type { QcmModule, QcmQuestion } from '@mas/shared/qcm';
import { FIND_ALL_QCM_MODULES, FIND_ALL_QCM_QUESTIONS, FIND_ONE_QCM_MODULE } from '../../../graphql/documents';
import type { AppDispatch } from '../../../store';
import styles from './QcmModulePage.module.scss';

// ─── GQL shapes ────────────────────────────────────────────────────────────────

interface GqlModule { id: string; label: string; sortOrder: number }
interface GqlQuestion {
  id: string;
  moduleId: string;
  type: string;
  difficulty: string;
  sortOrder: number;
  data: { question: string; choices: string[]; answer: string; tags: string[]; explanation?: string | null; docs?: string | null };
}

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'error' } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function QcmModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data: moduleData, loading: moduleLoading } = useQuery<{
    findOneQcmModule: GqlModule | null;
  }>(FIND_ONE_QCM_MODULE, { variables: { id: moduleId }, skip: !moduleId });

  const { data: questionsData, loading: questionsLoading, error: questionsError } = useQuery<{
    findAllQcmQuestion: GqlQuestion[];
  }>(FIND_ALL_QCM_QUESTIONS);

  const { data: modulesData } = useQuery<{
    findAllQcmModule: GqlModule[];
  }>(FIND_ALL_QCM_MODULES);

  const loading = moduleLoading || questionsLoading;

  const questions = useMemo<GqlQuestion[]>(() => {
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
        .map((q) => ({
          id: q.id,
          type: q.type as 'single' | 'multi',
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          tags: q.data.tags,
          question: q.data.question,
          choices: q.data.choices,
          answer: JSON.parse(q.data.answer) as number | number[],
          explanation: q.data.explanation ?? undefined,
          docs: q.data.docs ?? undefined,
        } satisfies QcmQuestion)),
    }));

    dispatch(startSession({
      data: { modules: allModules },
      config: { shuffle: false, showExplanation: true, mode: 'module', module: moduleId! },
    }));
    navigate('/qcm/quiz');
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <Spinner size="lg" />
      </div>
    );
  }

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
          <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/qcm')} />
          {questions.length > 0 && (
            <Button variant="primary" size="sm" label="Start quiz" startIcon={FiPlay} onClick={handleStartQuiz} />
          )}
        </div>

        <Stack direction="vertical" gap={4} className={styles.heading}>
          <Typography variant="title">{module?.label ?? moduleId}</Typography>
          <Typography variant="body" className={styles.subtitle}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </Typography>
        </Stack>

        {questions.length === 0 ? (
          <Typography variant="body">No questions found in this module.</Typography>
        ) : (
          <Stack direction="vertical" gap={8}>
            {questions.map((q, i) => (
              <Card
                key={q.id}
                className={styles.questionCard}
                onClick={() => navigate(`/qcm/${moduleId}/${q.id}`)}
              >
                <Stack direction="horizontal" gap={12} align="center">
                  <Typography variant="caption" className={styles.index}>{i + 1}</Typography>
                  <Typography variant="body" className={styles.questionText}>{q.data.question}</Typography>
                  <Stack direction="horizontal" gap={6} className={styles.badges}>
                    <Badge
                      label={q.difficulty}
                      variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
                    />
                    <Badge label={q.type === 'multi' ? 'Multi' : 'Single'} variant="secondary" />
                    {q.data.tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
                  </Stack>
                  <FiArrowRight size={16} className={styles.chevron} />
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
