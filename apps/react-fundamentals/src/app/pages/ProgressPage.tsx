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
  FiArrowRight, FiTerminal,
  FiTarget, FiActivity, FiAward, FiClock, FiCheckCircle,
} from 'react-icons/fi';
import type { TabItem } from '@mas/react-ui';
import {
  FIND_ALL_QCM_MODULES,
  FIND_MODULE_PROGRESS,
  FIND_ALL_QCM_SESSIONS,
  FIND_ALL_QCM_QUESTIONS,
} from '../../graphql/documents';
import { getTechMeta, formatDate, formatDurationSec } from '../utils';
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

  const loading = modulesLoading || questionsLoading || progressLoading || sessionsLoading;

  const modules   = useMemo(() => modulesData?.findAllQcmModule ?? [], [modulesData]);
  const progress  = useMemo(() => progressData?.findByQcmProgress ?? [], [progressData]);
  const sessions  = useMemo(() => sessionsData?.findByQcmSession ?? [], [sessionsData]);

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

  const completedCount   = useMemo(() => progress.filter((p) => p.isCompleted).length, [progress]);
  const totalModules     = modules.length;

  const overallAccuracy  = useMemo(() => {
    const vals = [...bestPctByModule.values()];
    return vals.length > 0 ? Math.round(vals.reduce((s, n) => s + n, 0) / vals.length) : null;
  }, [bestPctByModule]);

  const totalSessions     = sessions.length;
  const completedSessions = useMemo(() => sessions.filter((s) => s.status === 'Completed').length, [sessions]);
  const abandonedSessions = useMemo(() => sessions.filter((s) => s.status === 'Abandoned').length, [sessions]);

  const bestScoreEntry = useMemo(() => {
    let best: { moduleId: string; pct: number } | null = null;
    for (const [moduleId, pct] of bestPctByModule) {
      if (!best || pct > best.pct) best = { moduleId, pct };
    }
    return best;
  }, [bestPctByModule]);

  const bestScore      = bestScoreEntry?.pct ?? null;
  const bestScoreLabel = bestScoreEntry ? (moduleMap.get(bestScoreEntry.moduleId)?.label ?? '—') : '—';

  const lastSessions = useMemo(() =>
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

  const moduleProgressList = useMemo(() =>
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

  const filteredModuleList = useMemo(() =>
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
                sub={totalModules > 0 ? `${Math.round((completedCount / totalModules) * 100)}% done` : undefined}
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
                    return <CardWithSkeleton key={item} loading className={styles.moduleCard}><div /></CardWithSkeleton>;
                  }
                  const m = item as typeof filteredModuleList[number];
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
                        {prog?.isCompleted && <FiCheckCircle size={14} className={styles.completedIcon} />}
                      </div>
                      <div className={styles.moduleName}>{m.label}</div>
                      <div className={styles.moduleBottom}>
                        {bestPct != null ? (
                          <>
                            <ProgressBar value={bestPct / 100} />
                            <div className={styles.moduleScoreRow}>
                              <span className={styles.moduleScore}>{bestPct}% best</span>
                              <span className={styles.moduleAttempts}>
                                {prog?.attemptsCount ?? 1} attempt{(prog?.attemptsCount ?? 1) !== 1 ? 's' : ''}
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
                        const passed = s.status === 'Completed' && s.score != null && s.totalQuestions > 0
                          ? (s.score / s.totalQuestions) >= 0.6
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
                                <span className={styles.sessionScore}>{s.score}/{s.totalQuestions}</span>
                              )}
                              <Badge
                                label={s.status}
                                variant={
                                  s.status === 'Completed' ? (passed ? 'success' : 'error')
                                  : s.status === 'Abandoned' ? 'warning'
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
                  <Button variant="primary" size="sm" label="Start a session" endIcon={FiArrowRight} onClick={() => navigate('/qcm')} />
                </Stack>
              </Card>
            )}

          </div>
        )}

        {activeTab === 'tdt' && (
          <div className={styles.tabContent}>
            <div className={styles.emptyTab}>
              <FiTerminal size={40} className={styles.emptyIcon} />
              <Typography variant="subtitle">TDT Dashboard</Typography>
              <Typography variant="body" className={styles.emptyText}>
                Coming soon — statistics for Test-Driven Tasks.
              </Typography>
              <Button
                variant="primary"
                size="sm"
                label="Browse TDT Challenges"
                endIcon={FiArrowRight}
                onClick={() => navigate('/tdt')}
              />
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
