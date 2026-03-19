import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  Accordion,
  AccordionSkeleton,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
} from '@mas/react-ui';
import type { AccordionItem } from '@mas/react-ui';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { startSession } from '@mas/shared/qcm';
import type { FlatQuestion } from '@mas/shared/qcm';
import { QcmSessionStatus } from '@mas/react-fundamentals-sot';
import type {
  QcmSession,
  QcmAnswer,
  FindAllQcmModulesQuery,
  FindAllQcmQuestionsQuery,
  FindActiveQcmSessionsQuery,
  FindActiveQcmSessionsQueryVariables,
  FindSessionAnswersQuery,
  CreateQcmSessionMutation,
} from '@mas/react-fundamentals-sot';
import {
  FIND_ALL_QCM_MODULES,
  FIND_ALL_QCM_QUESTIONS,
  CREATE_QCM_SESSION,
  FIND_ACTIVE_QCM_SESSIONS,
  FIND_SESSION_ANSWERS,
} from '../../graphql/documents';
import { useAppToast } from '../ToastContext';
import styles from './qcm-module-select.module.scss';

// Partial shapes returned by queries (only the fields selected in documents.ts)
type GqlQuestion = FindAllQcmQuestionsQuery['findAllQcmQuestion'][number];

// ─── Transform ────────────────────────────────────────────────────────────────

function toFlatQuestion(q: GqlQuestion): FlatQuestion {
  return {
    id:          q.id,
    moduleId:    q.moduleId,
    type:        q.type as FlatQuestion['type'],
    difficulty:  q.difficulty as FlatQuestion['difficulty'],
    tags:        q.data.tags,
    question:    q.data.question,
    choices:     q.data.choices,
    answer:      JSON.parse(q.data.answer) as number | number[],
    explanation: q.data.explanation ?? undefined,
    docs:        q.data.docs ?? undefined,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QcmModuleSelect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addToast = useAppToast();

  const { data: modulesData,   loading: modulesLoading,   error: modulesError }   = useQuery<FindAllQcmModulesQuery>(FIND_ALL_QCM_MODULES);
  const { data: questionsData, loading: questionsLoading, error: questionsError } = useQuery<FindAllQcmQuestionsQuery>(FIND_ALL_QCM_QUESTIONS);
  const { data: sessionsData,  loading: sessionsLoading }                          = useQuery<FindActiveQcmSessionsQuery, FindActiveQcmSessionsQueryVariables>(
    FIND_ACTIVE_QCM_SESSIONS,
    { variables: { filter: JSON.stringify({ status: QcmSessionStatus.InProgress }) }, fetchPolicy: 'network-only' },
  );

  const [createSession, { loading: creating }] = useMutation<CreateQcmSessionMutation>(CREATE_QCM_SESSION);
  const [fetchSessions, { loading: checkingSession }] = useLazyQuery<FindActiveQcmSessionsQuery>(FIND_ACTIVE_QCM_SESSIONS, { fetchPolicy: 'network-only' });
  const [fetchAnswers,  { loading: resuming }] = useLazyQuery<FindSessionAnswersQuery>(FIND_SESSION_ANSWERS);

  const loading = modulesLoading || questionsLoading || sessionsLoading;
  const error   = !!(modulesError || questionsError);
  const busy    = creating || checkingSession || resuming;

  const activeSessionByModule = useMemo<Record<string, Pick<QcmSession, 'id' | 'moduleId' | 'totalQuestions'>>>(() =>
    Object.fromEntries((sessionsData?.findByQcmSession ?? []).map((s) => [s.moduleId, s])),
  [sessionsData]);

  const modules = useMemo(() => {
    if (!modulesData?.findAllQcmModule || !questionsData?.findAllQcmQuestion) return [];
    return [...modulesData.findAllQcmModule]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => {
        const questions = questionsData.findAllQcmQuestion
          .filter((q) => q.moduleId === m.id)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...m, questions };
      });
  }, [modulesData, questionsData]);

  // ── Open: create or resume session, then dispatch startSession ────────────

  const open = async (moduleId: string, moduleLabel: string, gqlQuestions: GqlQuestion[]) => {
    try {
      // Fresh server check: is there an InProgress session for this module?
      const { data: sessData } = await fetchSessions({
        variables: { filter: JSON.stringify({ status: QcmSessionStatus.InProgress, moduleId }) },
      });
      const activeSession = sessData?.findByQcmSession?.[0] ?? null;

      let sessionId: string;
      let questionsToLoad: GqlQuestion[];

      if (!activeSession) {
        // New session — all questions
        const { data } = await createSession({
          variables: { input: { moduleId, totalQuestions: gqlQuestions.length } },
        });
        sessionId       = data!.createQcmSession.id;
        questionsToLoad = gqlQuestions;
      } else {
        // Resume — only skipped + unanswered questions (in original order)
        sessionId = activeSession.id;
        const { data } = await fetchAnswers({
          variables: { filter: JSON.stringify({ sessionId }) },
        });
        const answers     = (data?.findByQcmAnswer ?? []) as Pick<QcmAnswer, 'questionId' | 'selectedOption'>[];
        const skippedIds  = new Set(answers.filter((a) => a.selectedOption === 'skipped').map((a) => a.questionId));
        const answeredIds = new Set(answers.filter((a) => a.selectedOption !== 'skipped').map((a) => a.questionId));
        questionsToLoad   = gqlQuestions.filter((q) => skippedIds.has(q.id) || !answeredIds.has(q.id));

        if (questionsToLoad.length === 0) {
          addToast({ variant: 'info', message: 'All questions answered — session complete.' });
          return;
        }
      }

      dispatch(startSession({
        data: { modules: [{ id: moduleId, label: moduleLabel, questions: questionsToLoad.map(toFlatQuestion) }] },
      }));

      navigate(`/qcm/${sessionId}/${moduleId}`);
    } catch {
      addToast({ variant: 'error', message: 'Failed to open module' });
    }
  };

  // ── Accordion items ────────────────────────────────────────────────────────

  const accordionItems: AccordionItem[] = modules.map((m, i) => ({
    key: m.id,
    title: `${String(i + 1).padStart(2, '0')} — ${m.label}`,
    content: (
      <div className={styles.accordionContent}>
        {m.description && (
          <Typography variant="body" className={styles.description}>
            {m.description}
          </Typography>
        )}
        <div className={styles.footer}>
          <Typography variant="caption" className={styles.count}>
            {m.questions.length} questions
          </Typography>
          <Button
            variant="primary"
            size="sm"
            label={activeSessionByModule[m.id] ? 'Continue' : 'Start'}
            disabled={busy || m.questions.length === 0}
            onClick={() => open(m.id, m.label, m.questions)}
          />
        </div>
      </div>
    ),
  }));

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/')} />
        <Typography variant="title" className={styles.heading}>QCM — Choose a module</Typography>
        <Typography variant="body" className={styles.subtitle}>Pick a module to start a new session.</Typography>

        {error && <Alert variant="error">Failed to load modules. Please try again.</Alert>}

        {loading ? (
          <AccordionSkeleton />
        ) : modules.length > 0 ? (
          <Accordion items={accordionItems} />
        ) : (
          !error && (
            <Stack direction="vertical" gap={12} align="center">
              <Typography variant="body">No modules found.</Typography>
              <Button variant="outline" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/')} />
            </Stack>
          )
        )}
      </Container>
    </div>
  );
}
