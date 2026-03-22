import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Typography,
  Container,
  CardWithSkeleton,
  ProgressBar,
  Badge,
  Button,
  Tabs,
  Stack,
} from '@mas/react-ui';
import { useNavigate } from '@mas/react-router';
import {
  FiArrowRight,
  FiTarget,
  FiActivity,
  FiAward,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import type { TabItem } from '@mas/react-ui';
import {
  FIND_ALL_QCM_MODULES,
  FIND_MODULE_PROGRESS,
  FIND_ALL_QCM_SESSIONS,
  FIND_ALL_QCM_QUESTIONS,
  FIND_ALL_TDT_CHALLENGES,
  FIND_ALL_TDT_PROGRESS,
  FIND_TDT_SESSIONS,
} from '../../graphql/documents';
import type { TdtChallenge } from '@mas/react-fundamentals-sot';
import {
  getTechMeta,
  formatDate,
  formatDurationSec,
  TDT_CATEGORY_META,
  difficultyVariant,
} from '../utils';
import type { TdtCategory, TdtDifficulty } from '../utils';
import styles from './ProgressPage.module.scss';

interface GqlModule {
  id: string;
  label: string;
  category: string;
}

interface GqlProgress {
  id: string;
  moduleId: string;
  attemptsCount: number;
  bestScore: number | null;
  isCompleted: boolean;
  lastAttemptAt: string | null;
}

interface GqlSession {
  id: string;
  moduleId: string;
  status: string;
  score: number | null;
  totalQuestions: number;
  startedAt: string;
  completedAt: string | null;
  duration: number;
}

interface GqlTdtProgress {
  id: string;
  challengeId: string;
  isSolved: boolean;
  totalAttempts: number;
  firstSolvedAt: string | null;
  lastAttemptAt: string | null;
}

interface GqlTdtSession {
  id: string;
  challengeId: string;
  status: string;
  attemptsCount: number;
  startedAt: string;
  solvedAt: string | null;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  color?: string;
  loading?: boolean;
}

function StatCard({ icon, value, label, sub, color, loading }: StatCardProps) {
  return (
    <CardWithSkeleton loading={loading} className={styles.statCard}>
      <div className={styles.statIcon} style={{ color: color ?? 'var(--color-primary)' }}>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </CardWithSkeleton>
  );
}

const TABS: TabItem[] = [
  { key: 'qcm', label: 'QCM' },
  { key: 'tdt', label: 'TDT' },
];

export function ProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('qcm');

  const { data: modulesData, loading: modulesLoading } = useQuery<{
    findAllQcmModule: GqlModule[];
  }>(FIND_ALL_QCM_MODULES);

  const { data: questionsData, loading: questionsLoading } = useQuery<{
    findAllQcmQuestion: { id: string; moduleId: string }[];
  }>(FIND_ALL_QCM_QUESTIONS);

  const { data: progressData, loading: progressLoading } = useQuery<{
    findByQcmProgress: GqlProgress[];
  }>(FIND_MODULE_PROGRESS, {
    variables: { filter: JSON.stringify({}) },
  });

  const { data: sessionsData, loading: sessionsLoading } = useQuery<{
    findByQcmSession: GqlSession[];
  }>(FIND_ALL_QCM_SESSIONS, {
    variables: { filter: JSON.stringify({}) },
    fetchPolicy: 'network-only',
  });

  // TDT queries
  const { data: tdtChallengesData, loading: tdtChallengesLoading } = useQuery<{
    findAllTdtChallenge: TdtChallenge[];
  }>(FIND_ALL_TDT_CHALLENGES);

  const { data: tdtProgressData, loading: tdtProgressLoading } = useQuery<{
    findAllTdtProgress: GqlTdtProgress[];
  }>(FIND_ALL_TDT_PROGRESS, { fetchPolicy: 'network-only' });

  const { data: tdtSessionsData, loading: tdtSessionsLoading } = useQuery<{
    findByTdtSession: GqlTdtSession[];
  }>(FIND_TDT_SESSIONS, {
    variables: { filter: JSON.stringify({}) },
    fetchPolicy: 'network-only',
  });

  const loading = modulesLoading || questionsLoading || progressLoading || sessionsLoading;
  const tdtLoading = tdtChallengesLoading || tdtProgressLoading || tdtSessionsLoading;

  const modules = useMemo(() => modulesData?.findAllQcmModule ?? [], [modulesData]);
  const progress = useMemo(() => progressData?.findByQcmProgress ?? [], [progressData]);
  const sessions = useMemo(() => sessionsData?.findByQcmSession ?? [], [sessionsData]);

  // ── TDT derived data ──────────────────────────────────────────────────────
  const tdtChallenges = useMemo(
    () => tdtChallengesData?.findAllTdtChallenge ?? [],
    [tdtChallengesData],
  );
  const tdtProgress = useMemo(() => tdtProgressData?.findAllTdtProgress ?? [], [tdtProgressData]);
  const tdtSessions = useMemo(() => tdtSessionsData?.findByTdtSession ?? [], [tdtSessionsData]);

  const tdtChallengeMap = useMemo(
    () => new Map(tdtChallenges.map((c) => [c.id, c])),
    [tdtChallenges],
  );
  const tdtProgressMap = useMemo(
    () => new Map(tdtProgress.map((p) => [p.challengeId, p])),
    [tdtProgress],
  );

  const tdtSolvedIds = useMemo(
    () => new Set(tdtSessions.filter((s) => s.status === 'Solved').map((s) => s.challengeId)),
    [tdtSessions],
  );
  const tdtSolvedCount = tdtSolvedIds.size;
  const tdtTotalCount = tdtChallenges.length;
  const tdtAttemptCount = useMemo(() => tdtSessions.length, [tdtSessions]);

  const tdtByCategory = useMemo(() => {
    const groups: Record<string, { total: number; solved: number }> = {};
    for (const c of tdtChallenges) {
      const cat = c.category;
      if (!groups[cat]) groups[cat] = { total: 0, solved: 0 };
      groups[cat].total++;
      if (tdtSolvedIds.has(c.id)) groups[cat].solved++;
    }
    return groups;
  }, [tdtChallenges, tdtSolvedIds]);

  const tdtByDifficulty = useMemo(() => {
    const groups: Record<string, { total: number; solved: number }> = {};
    for (const c of tdtChallenges) {
      const d = c.difficulty;
      if (!groups[d]) groups[d] = { total: 0, solved: 0 };
      groups[d].total++;
      if (tdtSolvedIds.has(c.id)) groups[d].solved++;
    }
    return groups;
  }, [tdtChallenges, tdtSolvedIds]);

  const tdtLastSessions = useMemo(
    () =>
      [...tdtSessions]
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 5),
    [tdtSessions],
  );

  const moduleMap = useMemo(() => new Map(modules.map((m) => [m.id, m])), [modules]);

  /** Map moduleId → total question count from server */
  const moduleQuestionCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questionsData?.findAllQcmQuestion ?? []) {
      map.set(q.moduleId, (map.get(q.moduleId) ?? 0) + 1);
    }
    return map;
  }, [questionsData]);

  /** Best score % per module, derived from completed sessions (never from stored bestScore) */
  const bestPctByModule = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (s.status !== 'Completed' || s.score == null) continue;
      const total = moduleQuestionCount.get(s.moduleId);
      if (!total) continue;
      const pct = Math.round((s.score / total) * 100);
      map.set(s.moduleId, Math.max(map.get(s.moduleId) ?? 0, pct));
    }
    return map;
  }, [sessions, moduleQuestionCount]);

  const completedCount = useMemo(() => progress.filter((p) => p.isCompleted).length, [progress]);
  const totalModules = modules.length;

  const overallAccuracy = useMemo(() => {
    const vals = [...bestPctByModule.values()];
    return vals.length > 0 ? Math.round(vals.reduce((s, n) => s + n, 0) / vals.length) : null;
  }, [bestPctByModule]);

  const totalSessions = sessions.length;
  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === 'Completed').length,
    [sessions],
  );
  const abandonedSessions = useMemo(
    () => sessions.filter((s) => s.status === 'Abandoned').length,
    [sessions],
  );

  const bestScoreEntry = useMemo(() => {
    let best: { moduleId: string; pct: number } | null = null;
    for (const [moduleId, pct] of bestPctByModule) {
      if (!best || pct > best.pct) best = { moduleId, pct };
    }
    return best;
  }, [bestPctByModule]);

  const bestScore = bestScoreEntry?.pct ?? null;
  const bestScoreLabel = bestScoreEntry
    ? (moduleMap.get(bestScoreEntry.moduleId)?.label ?? '—')
    : '—';

  const lastSessions = useMemo(
    () =>
      [...sessions]
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 5),
    [sessions],
  );

  const accuracyByTech = useMemo(() => {
    const groups: Record<string, number[]> = {};
    for (const [moduleId, pct] of bestPctByModule) {
      const mod = moduleMap.get(moduleId);
      if (!mod) continue;
      const key = mod.category?.toLowerCase() ?? 'unknown';
      (groups[key] ??= []).push(pct);
    }
    return Object.entries(groups)
      .map(([cat, scores]) => ({
        category: cat,
        pct: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [bestPctByModule, moduleMap]);

  const moduleProgressList = useMemo(
    () =>
      modules.map((m) => ({
        ...m,
        prog: progress.find((p) => p.moduleId === m.id) ?? null,
      })),
    [modules, progress],
  );

  // ── Tech tabs for module progress ─────────────────────────────────────────
  const techTabs = useMemo<TabItem[]>(() => {
    const cats = [...new Set(modules.map((m) => m.category.toLowerCase()))];
    return [
      { key: 'all', label: 'All' },
      ...cats.map((cat) => ({ key: cat, label: getTechMeta(cat).label })),
    ];
  }, [modules]);

  const [activeTechTab, setActiveTechTab] = useState('all');

  const filteredModuleList = useMemo(
    () =>
      activeTechTab === 'all'
        ? moduleProgressList
        : moduleProgressList.filter((m) => m.category.toLowerCase() === activeTechTab),
    [moduleProgressList, activeTechTab],
  );

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <div className={styles.pageHeader}>
          <Typography variant="title">My Progress</Typography>
          <Typography variant="body" className={styles.subtitle}>
            Track your learning across all modules and challenges.
          </Typography>
        </div>

        <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} className={styles.tabs} />

        {activeTab === 'qcm' && (
          <div className={styles.tabContent}>
            <div className={styles.kpiGrid}>
              <StatCard
                loading={loading}
                icon={<FiCheckCircle size={22} />}
                value={`${completedCount} / ${totalModules}`}
                label="Modules Completed"
                sub={
                  totalModules > 0
                    ? `${Math.round((completedCount / totalModules) * 100)}% done`
                    : undefined
                }
                color="var(--color-success)"
              />
              <StatCard
                loading={loading}
                icon={<FiTarget size={22} />}
                value={overallAccuracy != null ? `${overallAccuracy}%` : '—'}
                label="Avg Best Score"
                sub={`${bestPctByModule.size} module${bestPctByModule.size !== 1 ? 's' : ''} attempted`}
                color="var(--color-primary)"
              />
              <StatCard
                loading={loading}
                icon={<FiActivity size={22} />}
                value={String(totalSessions)}
                label="Sessions Started"
                sub={`${completedSessions} completed · ${abandonedSessions} abandoned`}
                color="#a78bfa"
              />
              <StatCard
                loading={loading}
                icon={<FiAward size={22} />}
                value={bestScore != null ? `${bestScore}%` : '—'}
                label="Best Score Ever"
                sub={bestScoreLabel}
                color="#f59e0b"
              />
            </div>

            {(loading || accuracyByTech.length > 0) && (
              <CardWithSkeleton loading={loading} className={styles.sectionCard}>
                <Typography variant="subtitle" className={styles.sectionTitle}>
                  Best Score by Technology
                </Typography>
                <Stack direction="vertical" gap={14}>
                  {accuracyByTech.map(({ category, pct }) => {
                    const tech = getTechMeta(category);
                    const TechIcon = tech.icon;
                    return (
                      <div key={category} className={styles.techAccRow}>
                        <div className={styles.techAccLabel}>
                          <TechIcon size={13} color={tech.color} />
                          <span className={styles.techAccName}>{tech.label}</span>
                          <span className={styles.techAccPct}>{pct}%</span>
                        </div>
                        <ProgressBar value={pct / 100} />
                      </div>
                    );
                  })}
                </Stack>
              </CardWithSkeleton>
            )}

            <div>
              <div className={styles.sectionHeader}>
                <Typography variant="subtitle">Module Progress</Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  label="Go to QCM"
                  endIcon={FiArrowRight}
                  onClick={() => navigate('/qcm')}
                />
              </div>

              <Tabs
                tabs={loading ? [{ key: 'all', label: 'All' }] : techTabs}
                activeKey={activeTechTab}
                onChange={setActiveTechTab}
                className={styles.techTabs}
              />
              <div className={styles.moduleGrid}>
                {(loading
                  ? Array.from({ length: 6 }, (_, i) => `sk-${i}`)
                  : filteredModuleList
                ).map((item, idx) => {
                  const isSkeleton = typeof item === 'string';
                  if (isSkeleton) {
                    return (
                      <CardWithSkeleton key={item} loading className={styles.moduleCard}>
                        <div />
                      </CardWithSkeleton>
                    );
                  }
                  const m = item as (typeof filteredModuleList)[number];
                  const tech = getTechMeta(m.category);
                  const TechIcon = tech.icon;
                  const { prog } = m;
                  const bestPct = bestPctByModule.get(m.id) ?? null;
                  return (
                    <CardWithSkeleton key={m.id} loading={false} className={styles.moduleCard}>
                      <div className={styles.moduleCardHeader}>
                        <span
                          className={styles.techPill}
                          style={{ '--tech-color': tech.color } as React.CSSProperties}
                        >
                          <TechIcon size={11} color={tech.color} />
                          <span>{tech.label}</span>
                        </span>
                        {prog?.isCompleted && (
                          <FiCheckCircle size={14} className={styles.completedIcon} />
                        )}
                      </div>
                      <div className={styles.moduleName}>{m.label}</div>
                      <div className={styles.moduleBottom}>
                        {bestPct != null ? (
                          <>
                            <ProgressBar value={bestPct / 100} />
                            <div className={styles.moduleScoreRow}>
                              <span className={styles.moduleScore}>{bestPct}% best</span>
                              <span className={styles.moduleAttempts}>
                                {prog?.attemptsCount ?? 1} attempt
                                {(prog?.attemptsCount ?? 1) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className={styles.notStarted}>Not started</span>
                        )}
                      </div>
                    </CardWithSkeleton>
                  );
                })}
              </div>
            </div>

            {(loading || lastSessions.length > 0) && (
              <div>
                <div className={styles.sectionHeader}>
                  <Typography variant="subtitle">Last Sessions</Typography>
                </div>
                <CardWithSkeleton loading={loading} className={styles.sectionCard}>
                  {lastSessions.map((s, i) => {
                    const modLabel = moduleMap.get(s.moduleId)?.label ?? s.moduleId;
                    const passed =
                      s.status === 'Completed' && s.score != null && s.totalQuestions > 0
                        ? s.score / s.totalQuestions >= 0.6
                        : false;
                    return (
                      <div
                        key={s.id}
                        className={`${styles.sessionRow} ${i < lastSessions.length - 1 ? styles.sessionRowBorder : ''}`}
                      >
                        <span className={styles.sessionModule}>{modLabel}</span>
                        <div className={styles.sessionMeta}>
                          <span className={styles.sessionDate}>{formatDate(s.startedAt)}</span>
                          {s.score != null && (
                            <span className={styles.sessionScore}>
                              {s.score}/{s.totalQuestions}
                            </span>
                          )}
                          <Badge
                            label={s.status}
                            variant={
                              s.status === 'Completed'
                                ? passed
                                  ? 'success'
                                  : 'error'
                                : s.status === 'Abandoned'
                                  ? 'warning'
                                  : 'secondary'
                            }
                          />
                          <span className={styles.sessionDuration}>
                            <FiClock size={11} />
                            {formatDurationSec(s.duration)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </CardWithSkeleton>
              </div>
            )}

            {!loading && sessions.length === 0 && modules.length > 0 && (
              <Card className={styles.sectionCard}>
                <Stack direction="vertical" gap={8} align="center">
                  <Typography variant="body">No sessions yet — start your first QCM!</Typography>
                  <Button
                    variant="primary"
                    size="sm"
                    label="Start a session"
                    endIcon={FiArrowRight}
                    onClick={() => navigate('/qcm')}
                  />
                </Stack>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'tdt' && (
          <div className={styles.tabContent}>
            {/* KPI row */}
            <div className={styles.kpiGrid}>
              <StatCard
                loading={tdtLoading}
                icon={<FiCheckCircle size={22} />}
                value={`${tdtSolvedCount} / ${tdtTotalCount}`}
                label="Challenges Solved"
                sub={
                  tdtTotalCount > 0
                    ? `${Math.round((tdtSolvedCount / tdtTotalCount) * 100)}% done`
                    : undefined
                }
                color="var(--color-success)"
              />
              <StatCard
                loading={tdtLoading}
                icon={<FiActivity size={22} />}
                value={String(tdtAttemptCount)}
                label="Total Attempts"
                color="#a78bfa"
              />
              <StatCard
                loading={tdtLoading}
                icon={<FiTarget size={22} />}
                value={
                  tdtTotalCount > 0 ? `${Math.round((tdtSolvedCount / tdtTotalCount) * 100)}%` : '—'
                }
                label="Completion Rate"
                color="var(--color-primary)"
              />
            </div>

            {/* Progress by category */}
            {(tdtLoading || Object.keys(tdtByCategory).length > 0) && (
              <div>
                <div className={styles.sectionHeader}>
                  <Typography variant="subtitle">Progress by Category</Typography>
                </div>
                <CardWithSkeleton loading={tdtLoading} className={styles.sectionCard}>
                  {Object.entries(tdtByCategory).map(([cat, { total, solved }]) => {
                    const meta = TDT_CATEGORY_META[cat as TdtCategory];
                    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                    return (
                      <div key={cat} className={styles.techAccRow}>
                        <div className={styles.techAccLabel}>
                          {meta && (
                            <meta.icon
                              size={13}
                              style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                            />
                          )}
                          <span>{meta?.label ?? cat}</span>
                          <span className={styles.techAccPct}>{pct}%</span>
                        </div>
                        <ProgressBar value={pct / 100} />
                        <Typography variant="caption" className={styles.techAccSub}>
                          {solved}/{total} solved
                        </Typography>
                      </div>
                    );
                  })}
                </CardWithSkeleton>
              </div>
            )}

            {/* Progress by difficulty */}
            {(tdtLoading || Object.keys(tdtByDifficulty).length > 0) && (
              <div>
                <div className={styles.sectionHeader}>
                  <Typography variant="subtitle">Progress by Difficulty</Typography>
                </div>
                <CardWithSkeleton loading={tdtLoading} className={styles.sectionCard}>
                  {['easy', 'medium', 'hard']
                    .filter((d) => tdtByDifficulty[d])
                    .map((d) => {
                      const { total, solved } = tdtByDifficulty[d];
                      const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                      const variant = difficultyVariant[d as TdtDifficulty] ?? 'primary';
                      return (
                        <div key={d} className={styles.techAccRow}>
                          <div className={styles.techAccLabel}>
                            <Badge label={d} variant={variant} />
                            <span className={styles.techAccPct}>{pct}%</span>
                          </div>
                          <ProgressBar value={pct / 100} />
                          <Typography variant="caption" className={styles.techAccSub}>
                            {solved}/{total} solved
                          </Typography>
                        </div>
                      );
                    })}
                </CardWithSkeleton>
              </div>
            )}

            {/* Challenges grid */}
            <div>
              <div className={styles.sectionHeader}>
                <Typography variant="subtitle">All Challenges</Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  label="Go to TDT"
                  endIcon={FiArrowRight}
                  onClick={() => navigate('/tdt')}
                />
              </div>
              <div className={styles.moduleGrid}>
                {(tdtLoading ? Array.from({ length: 6 }, (_, i) => `sk-${i}`) : tdtChallenges).map(
                  (item, idx) => {
                    const isSkeleton = typeof item === 'string';
                    if (isSkeleton) {
                      return (
                        <CardWithSkeleton key={item} loading className={styles.moduleCard}>
                          <div />
                        </CardWithSkeleton>
                      );
                    }
                    const c = item as TdtChallenge;
                    const prog = tdtProgressMap.get(c.id);
                    const isSolved = tdtSolvedIds.has(c.id);
                    const variant = difficultyVariant[c.difficulty as TdtDifficulty] ?? 'primary';
                    return (
                      <CardWithSkeleton key={c.id} loading={false} className={styles.moduleCard}>
                        <div className={styles.moduleCardHeader}>
                          <Badge label={c.difficulty} variant={variant} />
                          {isSolved && <FiCheckCircle size={14} className={styles.completedIcon} />}
                        </div>
                        <div className={styles.moduleName}>{c.title}</div>
                        <div className={styles.moduleBottom}>
                          {prog ? (
                            <span className={styles.moduleScore}>
                              {prog.totalAttempts} attempt{prog.totalAttempts !== 1 ? 's' : ''}
                              {isSolved ? ' · ✓ Solved' : ''}
                            </span>
                          ) : (
                            <span className={styles.notStarted}>Not started</span>
                          )}
                        </div>
                      </CardWithSkeleton>
                    );
                  },
                )}
              </div>
            </div>

            {/* Recent sessions */}
            {(tdtLoading || tdtLastSessions.length > 0) && (
              <div>
                <div className={styles.sectionHeader}>
                  <Typography variant="subtitle">Recent Sessions</Typography>
                </div>
                <CardWithSkeleton loading={tdtLoading} className={styles.sectionCard}>
                  {tdtLastSessions.map((s, i) => {
                    const challenge = tdtChallengeMap.get(s.challengeId);
                    return (
                      <div
                        key={s.id}
                        className={`${styles.sessionRow} ${i < tdtLastSessions.length - 1 ? styles.sessionRowBorder : ''}`}
                      >
                        <span className={styles.sessionModule}>
                          {challenge?.title ?? s.challengeId}
                        </span>
                        <div className={styles.sessionMeta}>
                          <span className={styles.sessionDate}>{formatDate(s.startedAt)}</span>
                          <Badge
                            label={s.status}
                            variant={
                              s.status === 'Completed'
                                ? 'success'
                                : s.status === 'Abandoned'
                                  ? 'warning'
                                  : 'secondary'
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardWithSkeleton>
              </div>
            )}

            {!tdtLoading && tdtTotalCount === 0 && (
              <CardWithSkeleton loading={false} className={styles.sectionCard}>
                <Stack direction="vertical" gap={8} align="center">
                  <Typography variant="body">No TDT challenges yet.</Typography>
                  <Button
                    variant="primary"
                    size="sm"
                    label="Browse Challenges"
                    endIcon={FiArrowRight}
                    onClick={() => navigate('/tdt')}
                  />
                </Stack>
              </CardWithSkeleton>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
