import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Spinner, Alert, Typography } from '@mas/react-ui';

const LIST_LOGS = gql`
  query ListJobLogs {
    findAllJobLog {
      id
      jobId
      level
      step
      message
      createdAt
    }
  }
`;

interface LogRow {
  id: string;
  jobId?: string;
  level: string;
  step: string;
  message: string;
  createdAt: string;
}

const LEVEL_COLOR: Record<string, string> = {
  info: '#6b7280',
  warn: '#f59e0b',
  error: '#ef4444',
  critical: '#dc2626',
};

const LEVEL_BG: Record<string, string> = {
  info: 'transparent',
  warn: 'rgba(245,158,11,0.06)',
  error: 'rgba(239,68,68,0.08)',
  critical: 'rgba(220,38,38,0.12)',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function JobLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobFilter, setJobFilter] = useState(searchParams.get('jobId') ?? '');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, refetch } = useQuery<{ findAllJobLog: LogRow[] }>(LIST_LOGS, {
    fetchPolicy: 'network-only',
  });

  // Auto-refresh every 3s when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => refetch(), 3000);
    return () => clearInterval(id);
  }, [autoRefresh, refetch]);

  const logs = [...(data?.findAllJobLog ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 300);

  const filtered = jobFilter.trim()
    ? logs.filter((l) => l.jobId?.toLowerCase().includes(jobFilter.toLowerCase()))
    : logs;

  return (
    <div
      style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Typography variant="title">Logs</Typography>
        <input
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value);
            setSearchParams(e.target.value ? { jobId: e.target.value } : {}, { replace: true });
          }}
          placeholder="Filter by job ID…"
          style={{
            flex: 1,
            minWidth: 200,
            maxWidth: 340,
            padding: '6px 10px',
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e5e7eb',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: '#9ca3af',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Live (3s)
        </label>
        {loading && <Spinner size="sm" />}
        <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 'auto' }}>
          {filtered.length} entries
        </span>
      </div>

      {error && <Alert variant="error">{error.message}</Alert>}

      {/* Log list */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        {filtered.length === 0 && !loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No logs yet.</div>
        )}
        {filtered.map((log) => (
          <div
            key={log.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 56px 120px 1fr',
              gap: '0 12px',
              alignItems: 'baseline',
              padding: '5px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: LEVEL_BG[log.level] ?? 'transparent',
            }}
          >
            <span style={{ color: '#4b5563', whiteSpace: 'nowrap' }}>{fmt(log.createdAt)}</span>
            <span
              style={{
                color: LEVEL_COLOR[log.level] ?? '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: 11,
              }}
            >
              {log.level}
            </span>
            <span
              style={{
                color: '#7c6af7',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {log.step}
            </span>
            <span style={{ color: '#d1d5db', wordBreak: 'break-word' }}>
              {log.jobId && (
                <span style={{ color: '#4b5563', marginRight: 6 }}>[{log.jobId.slice(0, 8)}…]</span>
              )}
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
