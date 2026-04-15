import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  Typography,
  Container,
  Stack,
  Button,
  Alert,
  Icon,
  SearchBar,
  AccordionWithSkeleton,
} from '@mas/react-ui';
import type { AccordionItem } from '@mas/react-ui';
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
          .filter((q: { moduleId: string }) => q.moduleId === m.id)
          .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder),
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

  const groupedModules = useMemo(() => {
    if (loading) return [];
    const map = new Map<string, typeof filteredModules>();
    for (const m of filteredModules) {
      const key = m.category.toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      meta: getTechMeta(key),
      items,
      totalQuestions: items.reduce((sum, m) => sum + m.questions.length, 0),
      activeCount: items.filter((m) => !!activeSessionByModule[m.id]).length,
    }));
  }, [filteredModules, loading, activeSessionByModule]);

  const open = async (
    moduleId: string,
    moduleLabel: string,
    gqlQuestions: FindAllQcmQuestionsQuery['findAllQcmQuestion'],
  ) => {
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

  const accordionItems: AccordionItem[] = groupedModules.map(
    ({ key, meta, items, totalQuestions, activeCount }) => ({
      key,
      title: (
        <span className={styles.groupHeader}>
          <Icon type="vector" icon={meta.icon} size={16} style={{ color: meta.color }} />
          <span className={styles.groupLabel}>{meta.label}</span>
          <span className={styles.groupStats}>
            {t('qcm.modules', { count: items.length })}
            {' · '}
            {t('qcm.questions', { count: totalQuestions })}
            {activeCount > 0 && ` · ${t('qcm.activeInGroup', { count: activeCount })}`}
          </span>
        </span>
      ),
      content: (
        <div className={styles.grid}>
          {items.map((m, i) => (
            <QcmModuleCard
              key={m.id}
              index={i + 1}
              id={m.id}
              label={m.label}
              description={m.description}
              category={m.category}
              questionCount={m.questions.length}
              hasActive={!!activeSessionByModule[m.id]}
              busy={busy}
              loading={false}
              onOpen={() => open(m.id, m.label, m.questions)}
            />
          ))}
        </div>
      ),
    }),
  );

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

        {!error && (
          <>
            {!loading && groupedModules.length === 0 ? (
              <Stack direction="vertical" gap={12} align="center">
                <Typography variant="body">
                  {search.trim() ? t('qcm.noMatch', { search }) : t('qcm.noModules')}
                </Typography>
                {!search.trim() && !activeTechs.size && (
                  <Button
                    variant="outline"
                    label={t('nav.back')}
                    startIcon={FiArrowLeft}
                    onClick={() => navigate('/learn')}
                  />
                )}
              </Stack>
            ) : (
              <AccordionWithSkeleton
                loading={loading}
                multiple
                items={accordionItems}
                className={styles.accordion}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
}
