import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import { Typography, Container, Stack, Button, Alert } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { startSession } from '@mas/shared/qcm';
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
import { useLocaleQuery } from '../hooks/useLocaleQuery';
import { useAppToast } from '../contexts/ToastContext';
import { getTechMeta, toFlatQuestion } from '../utils';
import { QcmTechFilters } from '../components/qcm/QcmTechFilters';
import { QcmModuleCard } from '../components/qcm/QcmModuleCard';
import styles from './QcmModuleSelectPage.module.scss';
import { SearchBar } from '@mas/react-ui';

export function QcmModuleSelectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addToast = useAppToast();
  const { t } = useT();
  const [search, setSearch] = useState('');
  const [activeTechs, setActiveTechs] = useState<Set<string>>(new Set());

  const {
    data: modulesData,
    loading: modulesLoading,
    error: modulesError,
  } = useLocaleQuery<FindAllQcmModulesQuery>(FIND_ALL_QCM_MODULES);
  const {
    data: questionsData,
    loading: questionsLoading,
    error: questionsError,
  } = useLocaleQuery<FindAllQcmQuestionsQuery>(FIND_ALL_QCM_QUESTIONS);
  const { data: sessionsData, loading: sessionsLoading } = useQuery<
    FindActiveQcmSessionsQuery,
    FindActiveQcmSessionsQueryVariables
  >(FIND_ACTIVE_QCM_SESSIONS, {
    variables: { filter: JSON.stringify({ status: QcmSessionStatus.InProgress }) },
    fetchPolicy: 'network-only',
  });

  const [createSession, { loading: creating }] =
    useMutation<CreateQcmSessionMutation>(CREATE_QCM_SESSION);
  const [fetchSessions, { loading: checkingSession }] = useLazyQuery<FindActiveQcmSessionsQuery>(
    FIND_ACTIVE_QCM_SESSIONS,
    { fetchPolicy: 'network-only' },
  );
  const [fetchAnswers, { loading: resuming }] =
    useLazyQuery<FindSessionAnswersQuery>(FIND_SESSION_ANSWERS);

  const loading = modulesLoading || questionsLoading || sessionsLoading;
  const error = !!(modulesError || questionsError);
  const busy = creating || checkingSession || resuming;

  const activeSessionByModule = useMemo<
    Record<string, Pick<QcmSession, 'id' | 'moduleId' | 'totalQuestions'>>
  >(
    () => Object.fromEntries((sessionsData?.findByQcmSession ?? []).map((s) => [s.moduleId, s])),
    [sessionsData],
  );

  const modules = useMemo(() => {
    if (!modulesData?.findAllQcmModule || !questionsData?.findAllQcmQuestion) return [];
    return [...modulesData.findAllQcmModule]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({
        ...m,
        questions: questionsData.findAllQcmQuestion
          .filter((q) => q.moduleId === m.id)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }, [modulesData, questionsData]);

  const availableTechs = useMemo(
    () =>
      [...new Set(modules.map((m) => m.category.toLowerCase()))].map((key) => ({
        key,
        ...getTechMeta(key),
      })),
    [modules],
  );

  const filteredModules = useMemo(() => {
    let result = modules;
    if (activeTechs.size > 0)
      result = result.filter((m) => activeTechs.has(m.category.toLowerCase()));
    if (search.trim())
      result = result.filter((m) => m.label.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [modules, activeTechs, search]);

  const open = async (moduleId: string, moduleLabel: string, gqlQuestions: FindAllQcmQuestionsQuery['findAllQcmQuestion']) => {
    try {
      const { data: sessData } = await fetchSessions({
        variables: { filter: JSON.stringify({ status: QcmSessionStatus.InProgress, moduleId }) },
      });
      const activeSession = sessData?.findByQcmSession?.[0] ?? null;
      let sessionId: string;
      let questionsToLoad: typeof gqlQuestions;

      if (!activeSession) {
        const { data } = await createSession({
          variables: { input: { moduleId, totalQuestions: gqlQuestions.length } },
        });
        sessionId = data!.createQcmSession.id;
        questionsToLoad = gqlQuestions;
      } else {
        sessionId = activeSession.id;
        const { data } = await fetchAnswers({
          variables: { filter: JSON.stringify({ sessionId }) },
        });
        const answers = (data?.findByQcmAnswer ?? []) as Pick<
          QcmAnswer,
          'questionId' | 'selectedOption'
        >[];
        const skippedIds = new Set(
          answers.filter((a) => a.selectedOption === 'skipped').map((a) => a.questionId),
        );
        const answeredIds = new Set(
          answers.filter((a) => a.selectedOption !== 'skipped').map((a) => a.questionId),
        );
        questionsToLoad = gqlQuestions.filter(
          (q) => skippedIds.has(q.id) || !answeredIds.has(q.id),
        );
        if (questionsToLoad.length === 0) {
          addToast({ variant: 'info', message: t('qcm.allAnswered') });
          return;
        }
      }

      dispatch(
        startSession({
          data: {
            modules: [
              { id: moduleId, label: moduleLabel, questions: questionsToLoad.map(toFlatQuestion) },
            ],
          },
        }),
      );
      navigate(`/qcm/${sessionId}/${moduleId}`);
    } catch {
      addToast({ variant: 'error', message: t('qcm.openModule') });
    }
  };

  const handleToggleTech = (key: string) => {
    setActiveTechs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Button
          variant="ghost"
          label={t('nav.back')}
          startIcon={FiArrowLeft}
          onClick={() => navigate('/learn')}
        />
        <Typography variant="title" className={styles.heading}>
          {t('qcm.chooseModule')}
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          {t('qcm.pickModule')}
        </Typography>

        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('qcm.searchModules')}
          className={styles.search}
        />

        <QcmTechFilters
          loading={loading}
          availableTechs={availableTechs}
          activeTechs={activeTechs}
          onToggle={handleToggleTech}
        />

        {error && <Alert variant="error">{t('qcm.loadError')}</Alert>}

        {!loading && !error && filteredModules.length === 0 ? (
          <Stack direction="vertical" gap={12} align="center">
            <Typography variant="body">
              {search.trim() ? t('qcm.noMatch', { search }) : t('qcm.noModules')}
            </Typography>
            {!search.trim() && (
              <Button
                variant="outline"
                label={t('nav.back')}
                startIcon={FiArrowLeft}
                onClick={() => navigate('/learn')}
              />
            )}
          </Stack>
        ) : (
          <div className={styles.grid}>
            {(loading ? Array.from({ length: 6 }, (_, i) => `sk-${i}`) : filteredModules).map(
              (item, i) => {
                const isSkeleton = typeof item === 'string';
                const m = isSkeleton ? null : (item as (typeof filteredModules)[number]);
                return (
                  <QcmModuleCard
                    key={isSkeleton ? item : m!.id}
                    index={i + 1}
                    id={isSkeleton ? '' : m!.id}
                    label={isSkeleton ? '' : m!.label}
                    description={isSkeleton ? null : m!.description}
                    category={isSkeleton ? 'javascript' : m!.category}
                    questionCount={isSkeleton ? 0 : m!.questions.length}
                    hasActive={isSkeleton ? false : !!activeSessionByModule[m!.id]}
                    busy={busy}
                    loading={loading}
                    onOpen={() => !isSkeleton && open(m!.id, m!.label, m!.questions)}
                  />
                );
              },
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
