import React, { useState } from 'react';
import {
  Typography,
  Container,
  Stack,
  Card,
  ProgressBar,
  Badge,
  Button,
  Tabs,
} from '@mas/react-ui';
import { useNavigate } from '@mas/react-router';
import {
  FiArrowRight, FiCheckCircle, FiTerminal,
  FiTarget, FiActivity, FiAward, FiClock,
} from 'react-icons/fi';
import {
  SiReact, SiNodedotjs, SiNestjs,
  SiJavascript, SiTypescript, SiGraphql,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import type { TabItem } from '@mas/react-ui';
import styles from './SummaryPage.module.scss';

// ─── Tech metadata ─────────────────────────────────────────────────────────────

interface TechMeta { label: string; icon: IconType; color: string }

const TECH_META: Record<string, TechMeta> = {
  react:      { label: 'React',      icon: SiReact,      color: '#61DAFB' },
  nodejs:     { label: 'Node.js',    icon: SiNodedotjs,  color: '#339933' },
  nestjs:     { label: 'NestJS',     icon: SiNestjs,     color: '#E0234E' },
  javascript: { label: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  typescript: { label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  graphql:    { label: 'GraphQL',    icon: SiGraphql,    color: '#E10098' },
};

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_MODULES = [
  { id: '1', label: 'React Hooks',         category: 'react',      attempts: 5, bestScore: 85,   isCompleted: true  },
  { id: '2', label: 'React Context',       category: 'react',      attempts: 3, bestScore: 72,   isCompleted: true  },
  { id: '3', label: 'Node.js Basics',      category: 'nodejs',     attempts: 2, bestScore: 78,   isCompleted: true  },
  { id: '4', label: 'TypeScript Advanced', category: 'typescript', attempts: 4, bestScore: 61,   isCompleted: false },
  { id: '5', label: 'GraphQL Queries',     category: 'graphql',    attempts: 1, bestScore: 45,   isCompleted: false },
  { id: '6', label: 'NestJS Fundamentals', category: 'nestjs',     attempts: 0, bestScore: null, isCompleted: false },
  { id: '7', label: 'JavaScript ES6',      category: 'javascript', attempts: 2, bestScore: 55,   isCompleted: false },
  { id: '8', label: 'React Performance',   category: 'react',      attempts: 0, bestScore: null, isCompleted: false },
];

const MOCK_SESSIONS = [
  { id: '1', module: 'React Hooks',         date: 'Mar 19', score: 17, total: 20, passed: true,  durationS: 252 },
  { id: '2', module: 'TypeScript Advanced', date: 'Mar 18', score:  9, total: 20, passed: false, durationS: 404 },
  { id: '3', module: 'React Context',       date: 'Mar 17', score: 15, total: 18, passed: true,  durationS: 208 },
  { id: '4', module: 'GraphQL Queries',     date: 'Mar 15', score:  8, total: 15, passed: false, durationS: 301 },
  { id: '5', module: 'Node.js Basics',      date: 'Mar 12', score: 14, total: 18, passed: true,  durationS: 295 },
];

const MOCK_DIFFICULTY = [
  { label: 'Easy',   pct: 88, variant: 'success' as const },
  { label: 'Medium', pct: 65, variant: 'warning' as const },
  { label: 'Hard',   pct: 41, variant: 'error'   as const },
];

const MOCK_BY_TECH = [
  { category: 'react',      pct: 78 },
  { category: 'javascript', pct: 71 },
  { category: 'nodejs',     pct: 64 },
  { category: 'typescript', pct: 55 },
  { category: 'graphql',    pct: 42 },
];

// ─── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  color?: string;
}

function StatCard({ icon, value, label, sub, color }: StatCardProps) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.statIcon} style={{ color: color ?? 'var(--color-primary)' }}>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </Card>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
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
                icon={<FiCheckCircle size={22} />}
                value="3 / 8"
                label="Modules Completed"
                sub="37.5% done"
                color="var(--color-success)"
              />
              <StatCard
                icon={<FiTarget size={22} />}
                value="72%"
                label="Overall Accuracy"
                sub="247 answers"
                color="var(--color-primary)"
              />
              <StatCard
                icon={<FiActivity size={22} />}
                value="14"
                label="Sessions Started"
                sub="9 completed · 2 abandoned"
                color="#a78bfa"
              />
              <StatCard
                icon={<FiAward size={22} />}
                value="95%"
                label="Best Score Ever"
                sub="React Hooks"
                color="#f59e0b"
              />
            </div>

            {/* Accuracy by difficulty + by technology */}
            <div className={styles.twoCol}>
              <Card className={styles.sectionCard}>
                <Typography variant="subtitle" className={styles.sectionTitle}>
                  Accuracy by Difficulty
                </Typography>
                <Stack direction="vertical" gap={16}>
                  {MOCK_DIFFICULTY.map(({ label, pct, variant }) => (
                    <div key={label} className={styles.diffRow}>
                      <div className={styles.diffLabel}>
                        <Badge label={label} variant={variant} />
                        <span className={styles.diffPct}>{pct}%</span>
                      </div>
                      <ProgressBar value={pct / 100} />
                    </div>
                  ))}
                </Stack>
              </Card>

              <Card className={styles.sectionCard}>
                <Typography variant="subtitle" className={styles.sectionTitle}>
                  Accuracy by Technology
                </Typography>
                <Stack direction="vertical" gap={14}>
                  {MOCK_BY_TECH.map(({ category, pct }) => {
                    const tech = TECH_META[category];
                    if (!tech) return null;
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
              </Card>
            </div>

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
                {MOCK_MODULES.map((m) => {
                  const tech = TECH_META[m.category] ?? { label: m.category, icon: SiJavascript, color: '#888' };
                  const TechIcon = tech.icon;
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
                        {m.isCompleted && <FiCheckCircle size={14} className={styles.completedIcon} />}
                      </div>
                      <div className={styles.moduleName}>{m.label}</div>
                      <div className={styles.moduleBottom}>
                        {m.bestScore !== null ? (
                          <>
                            <ProgressBar value={m.bestScore / 100} />
                            <div className={styles.moduleScoreRow}>
                              <span className={styles.moduleScore}>{m.bestScore}% best</span>
                              <span className={styles.moduleAttempts}>
                                {m.attempts} attempt{m.attempts !== 1 ? 's' : ''}
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
            <div>
              <div className={styles.sectionHeader}>
                <Typography variant="subtitle">Last Sessions</Typography>
              </div>
              <Card className={styles.sectionCard}>
                {MOCK_SESSIONS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`${styles.sessionRow} ${i < MOCK_SESSIONS.length - 1 ? styles.sessionRowBorder : ''}`}
                  >
                    <span className={styles.sessionModule}>{s.module}</span>
                    <div className={styles.sessionMeta}>
                      <span className={styles.sessionDate}>{s.date}</span>
                      <span className={styles.sessionScore}>{s.score}/{s.total}</span>
                      <Badge
                        label={s.passed ? 'Passed' : 'Failed'}
                        variant={s.passed ? 'success' : 'error'}
                      />
                      <span className={styles.sessionDuration}>
                        <FiClock size={11} />
                        {formatDuration(s.durationS)}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

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
