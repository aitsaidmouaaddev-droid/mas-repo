import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  Card,
  CardWithSkeleton,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
  SearchBar,
  Badge,
  Tag,
  TagWithSkeleton,
} from '@mas/react-ui';
import { FiArrowLeft, FiPlay, FiRefreshCw } from 'react-icons/fi';
import {
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiNestjs,
  SiJavascript,
  SiTypescript,
  SiGraphql,
  SiPostgresql,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
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
} from '../../../graphql/documents';
import { useAppToast } from '../../ToastContext';
import styles from './qcm-module-select.module.scss';

// Partial shapes returned by queries (only the fields selected in documents.ts)
type GqlQuestion = FindAllQcmQuestionsQuery['findAllQcmQuestion'][number];

// ─── Technology metadata ───────────────────────────────────────────────────────

interface TechMeta { label: string; icon: IconType; color: string }

const TECH_META: Record<string, TechMeta> = {
  react:      { label: 'React',      icon: SiReact,      color: '#61DAFB' },
  angular:    { label: 'Angular',    icon: SiAngular,    color: '#DD0031' },
  nodejs:     { label: 'Node.js',    icon: SiNodedotjs,  color: '#339933' },
  nestjs:     { label: 'NestJS',     icon: SiNestjs,     color: '#E0234E' },
  javascript: { label: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  typescript: { label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  graphql:    { label: 'GraphQL',    icon: SiGraphql,    color: '#E10098' },
  sql:        { label: 'SQL',        icon: SiPostgresql, color: '#336791' },
};

function getTechMeta(category: string): TechMeta {
  return TECH_META[category.toLowerCase()] ?? { label: category, icon: SiJavascript, color: '#888888' };
}

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
  const [search, setSearch] = useState('');
  const [activeTechs, setActiveTechs] = useState<Set<string>>(new Set());

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

  const filteredModules = useMemo(() => {
    let result = modules;
    if (activeTechs.size > 0) result = result.filter((m) => activeTechs.has(m.category.toLowerCase()));
    if (search.trim()) result = result.filter((m) => m.label.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [modules, activeTechs, search]);

  // key = category string from DB, meta = display info
  const availableTechs = useMemo(() =>
    [...new Set(modules.map((m) => m.category.toLowerCase()))].map((key) => ({
      key,
      ...getTechMeta(key),
    })),
  [modules]);

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

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/')} />
        <Typography variant="title" className={styles.heading}>QCM — Choose a module</Typography>
        <Typography variant="body" className={styles.subtitle}>Pick a module to start a new session.</Typography>

        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search modules…"
          className={styles.search}
        />

        <div className={styles.techFilters}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <TagWithSkeleton key={i} loading label="placeholder" />
              ))
            : availableTechs.map((tech) => {
                const isActive = activeTechs.has(tech.key);
                const TechIcon = tech.icon;
                return (
                  <button
                    key={tech.key}
                    className={`${styles.techFilterBtn} ${isActive ? styles.techFilterBtnActive : ''}`}
                    style={{ '--tech-color': tech.color } as React.CSSProperties}
                    onClick={() => {
                      setActiveTechs((prev) => {
                        const next = new Set(prev);
                        if (next.has(tech.key)) next.delete(tech.key);
                        else next.add(tech.key);
                        return next;
                      });
                    }}
                  >
                    <TechIcon size={13} />
                    {tech.label}
                  </button>
                );
              })
          }
        </div>

        {error && <Alert variant="error">Failed to load modules. Please try again.</Alert>}

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CardWithSkeleton key={i} loading className={styles.moduleCard}><div /></CardWithSkeleton>
              ))
            : filteredModules.map((m, i) => {
                const hasActive = !!activeSessionByModule[m.id];
                const tech = getTechMeta(m.category);
                const TechIcon = tech.icon;
                return (
                  <Card key={m.id} className={styles.moduleCard}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderLeft}>
                          <Typography variant="caption" className={styles.index}>
                            {String(i + 1).padStart(2, '0')}
                          </Typography>
                          {hasActive && <Badge label="In progress" variant="warning" />}
                        </div>
                        <div className={styles.techTag}>
                          <TechIcon size={13} style={{ color: tech.color, flexShrink: 0 }} />
                          <Tag label={tech.label} className={styles.techTagLabel} style={{ color: tech.color, '--tech-color': tech.color } as React.CSSProperties} />
                        </div>
                      </div>

                      <Typography variant="subtitle" className={styles.moduleTitle}>
                        {m.label}
                      </Typography>

                      {m.description && (
                        <Typography variant="body" className={styles.description}>
                          {m.description}
                        </Typography>
                      )}

                      <div className={styles.spacer} />

                      <div className={styles.cardFooter}>
                        <Typography variant="caption" className={styles.count}>
                          {m.questions.length} question{m.questions.length !== 1 ? 's' : ''}
                        </Typography>
                        <Button
                          variant="primary"
                          size="sm"
                          label={hasActive ? 'Continue' : 'Start'}
                          startIcon={hasActive ? FiRefreshCw : FiPlay}
                          disabled={busy || m.questions.length === 0}
                          onClick={() => open(m.id, m.label, m.questions)}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
          }
        </div>
        {!loading && !error && filteredModules.length === 0 && (
          <Stack direction="vertical" gap={12} align="center">
            <Typography variant="body">
              {search.trim() ? `No modules match "${search}"` : 'No modules found.'}
            </Typography>
            {!search.trim() && (
              <Button variant="outline" label="Back" startIcon={FiArrowLeft} onClick={() => navigate('/')} />
            )}
          </Stack>
        )}
      </Container>
    </div>
  );
}
