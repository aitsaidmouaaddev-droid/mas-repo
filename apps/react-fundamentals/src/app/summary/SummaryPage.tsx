import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Typography,
  Container,
  Card,
  ProgressBar,
  Badge,
  Button,
  Tabs,
  Stack,
  Skeleton,
} from '@mas/react-ui';
import { useNavigate } from '@mas/react-router';
import {
  FiArrowRight, FiTerminal,
  FiTarget, FiActivity, FiAward, FiClock, FiCheckCircle,
} from 'react-icons/fi';
import {
  SiReact, SiAngular, SiNodedotjs, SiNestjs,
  SiJavascript, SiTypescript, SiGraphql, SiPostgresql,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import type { TabItem } from '@mas/react-ui';
import {
  FIND_ALL_QCM_MODULES,
  FIND_MODULE_PROGRESS,
  FIND_ALL_QCM_SESSIONS,
} from '../../graphql/documents';
import styles from './SummaryPage.module.scss';

// ─── Tech metadata ─────────────────────────────────────────────────────────────

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
  return TECH_META[category?.toLowerCase()] ?? { label: category, icon: SiJavascript, color: '#888' };
}

// ─── GQL types ─────────────────────────────────────────────────────────────────

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

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

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
    <Card className={styles.statCard}>
      <div className={styles.statIcon} style={{ color: color ?? 'var(--color-primary)' }}>
        {icon}
      </div>
      {loading ? (
        <>
          <Skeleton width={60} height={28} style={{ borderRadius: 4, marginBottom: 4 }} />
          <Skeleton width={100} height={14} style={{ borderRadius: 4 }} />
        </>
      ) : (
        <>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
          {sub && <div className={styles.statSub}>{sub}</div>}
        </>
      )}
    </Card>
  );
}

// ─── Tabs config ───────────────────────────────────────────────────────────────

const TABS: TabItem[] = [
  { key: 'qcm', label: 'QCM' },
  { key: 'tdt', label: 'TDT' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SummaryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('qcm');

  const { data: modulesData, loading: modulesLoading } = useQuery<{
    findAllQcmModule: GqlModule[];
  }>(FIND_ALL_QCM_MODULES);

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

  const loading = modulesLoading || progressLoading || sessionsLoading;

  // ── Derived stats ───────────────────────────────────────────────────────────

  const modules   = useMemo(() => modulesData?.findAllQcmModule ?? [], [modulesData]);
  const progress  = useMemo(() => progressData?.findByQcmProgress ?? [], [progressData]);
  const sessions  = useMemo(() => sessionsData?.findByQcmSession ?? [], [sessionsData]);

  const moduleMap = useMemo(() => new Map(modules.map((m) => [m.id, m])), [modules]);

  const completedCount   = useMemo(() => progress.filter((p) => p.isCompleted).length, [progress]);
  const totalModules     = modules.length;

  const scoresWithValue  = useMemo(() => progress.filter((p) => p.bestScore != null), [progress]);
  const overallAccuracy  = useMemo(() =>
    scoresWithValue.length > 0
      ? Math.round(scoresWithValue.reduce((s, p) => s + p.bestScore!, 0) / scoresWithValue.length)
      : null,
    [scoresWithValue],
  );

  const totalSessions     = sessions.length;
  const completedSessions = useMemo(() => sessions.filter((s) => s.status === 'Completed').length, [sessions]);
  const abandonedSessions = useMemo(() => sessions.filter((s) => s.status === 'Abandoned').length, [sessions]);

  const bestProgressEntry = useMemo(() =>
    scoresWithValue.length > 0
      ? scoresWithValue.reduce((best, p) => (p.bestScore! > best.bestScore! ? p : best))
      : null,
    [scoresWithValue],
  );
  const bestScore      = bestProgressEntry?.bestScore ?? null;
  const bestScoreLabel = bestProgressEntry ? (moduleMap.get(bestProgressEntry.moduleId)?.label ?? '—') : '—';

  const lastSessions = useMemo(() =>
    [...sessions]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, 5),
    [sessions],
  );

  const accuracyByTech = useMemo(() => {
    const groups: Record<string, number[]> = {};
    for (const p of scoresWithValue) {
      const mod = moduleMap.get(p.moduleId);
      if (!mod) continue;
      const key = mod.category?.toLowerCase() ?? 'unknown';
      (groups[key] ??= []).push(p.bestScore!);
    }
    return Object.entries(groups)
      .map(([cat, scores]) => ({
        category: cat,
        pct: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [scoresWithValue, moduleMap]);

  const moduleProgressList = useMemo(() =>
    modules.map((m) => ({
      ...m,
      prog: progress.find((p) => p.moduleId === m.id) ?? null,
    })),
    [modules, progress],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

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

        {/* ── QCM Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'qcm' && (
          <div className={styles.tabContent}>

            {/* KPI row */}
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
                sub={`${scoresWithValue.length} module${scoresWithValue.length !== 1 ? 's' : ''} attempted`}
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

            {/* Accuracy by technology */}
            {(loading || accuracyByTech.length > 0) && (
              <Card className={styles.sectionCard}>
                <Typography variant="subtitle" className={styles.sectionTitle}>
                  Best Score by Technology
                </Typography>
                {loading ? (
                  <Stack direction="vertical" gap={14}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={styles.techAccRow}>
                        <Skeleton width={120} height={14} style={{ borderRadius: 4 }} />
                        <Skeleton height={8} style={{ borderRadius: 4 }} />
                      </div>
                    ))}
                  </Stack>
                ) : (
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
                )}
              </Card>
            )}

            {/* Module progress grid */}
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
              <div className={styles.moduleGrid}>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className={styles.moduleCard}>
                        <Skeleton width={70} height={20} style={{ borderRadius: 999 }} />
                        <Skeleton width="80%" height={14} style={{ borderRadius: 4, marginTop: 8 }} />
                        <Skeleton height={8} style={{ borderRadius: 4, marginTop: 16 }} />
                      </Card>
                    ))
                  : moduleProgressList.map((m) => {
                      const tech = getTechMeta(m.category);
                      const TechIcon = tech.icon;
                      const { prog } = m;
                      return (
                        <Card key={m.id} className={styles.moduleCard}>
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
                            {prog?.bestScore != null ? (
                              <>
                                <ProgressBar value={prog.bestScore / 100} />
                                <div className={styles.moduleScoreRow}>
                                  <span className={styles.moduleScore}>{prog.bestScore}% best</span>
                                  <span className={styles.moduleAttempts}>
                                    {prog.attemptsCount} attempt{prog.attemptsCount !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className={styles.notStarted}>Not started</span>
                            )}
                          </div>
                        </Card>
                      );
                    })}
              </div>
            </div>

            {/* Last sessions */}
            {(loading || lastSessions.length > 0) && (
              <div>
                <div className={styles.sectionHeader}>
                  <Typography variant="subtitle">Last Sessions</Typography>
                </div>
                <Card className={styles.sectionCard}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`${styles.sessionRow} ${i < 2 ? styles.sessionRowBorder : ''}`}>
                          <Skeleton width={160} height={14} style={{ borderRadius: 4 }} />
                          <Skeleton width={120} height={14} style={{ borderRadius: 4 }} />
                        </div>
                      ))
                    : lastSessions.map((s, i) => {
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
                                {formatDuration(s.duration)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                </Card>
              </div>
            )}

            {/* Empty state */}
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

        {/* ── TDT Tab ─────────────────────────────────────────────────────── */}
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
