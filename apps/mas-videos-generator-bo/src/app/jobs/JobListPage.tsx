import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Table, Button, Badge, Spinner, Alert, Stack, Typography } from '@mas/react-ui';
import type { TableColumn } from '@mas/react-ui';

const LIST_JOBS = gql`
  query ListVideoJobs {
    findAllVideoJob {
      id
      subjectId
      status
      retryCount
      errorMessage
      scheduledDate
      startedAt
      completedAt
      approvedVersionId
      renderedAt
    }
  }
`;

const RETRY_STEP = gql`
  mutation RetryStep($jobId: ID!, $step: String!) {
    retryStep(jobId: $jobId, step: $step) {
      id
      status
    }
  }
`;

interface JobRow {
  id: string;
  subjectId: string;
  status: string;
  retryCount: number;
  errorMessage?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  approvedVersionId?: string;
  renderedAt?: string;
}

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: 'secondary',
  awaiting_trigger_confirmation: 'warning',
  expired: 'error',
  skipped_today: 'secondary',
  draft_generating: 'primary',
  awaiting_review: 'warning',
  revision_requested: 'warning',
  approved: 'primary',
  rendering: 'primary',
  rendered: 'primary',
  uploading: 'primary',
  uploaded_private: 'primary',
  done: 'success',
  failed: 'error',
  cancelled: 'secondary',
};

// Determine which step to retry based on how far the job progressed
function retryStepFor(r: JobRow): 'generate' | 'render' | 'upload' | null {
  if (r.status === 'rendering') return 'render';
  if (r.status === 'uploading') return 'upload';
  if (r.status === 'failed') {
    if (r.renderedAt) return 'upload'; // rendered but upload failed
    if (r.approvedVersionId) return 'render'; // approved but render failed
    return 'generate'; // failed before/during generation
  }
  return null;
}

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function JobListPage() {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [retryError, setRetryError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<{ findAllVideoJob: JobRow[] }>(LIST_JOBS, {
    fetchPolicy: 'network-only',
  });

  const [retryStep] = useMutation(RETRY_STEP);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => refetch(), 5000);
    return () => clearInterval(id);
  }, [autoRefresh, refetch]);

  async function handleRetry(jobId: string, step: string) {
    setRetryError(null);
    setRetryingId(jobId);
    try {
      await retryStep({ variables: { jobId, step } });
      refetch();
    } catch (err) {
      setRetryError((err as Error).message);
    } finally {
      setRetryingId(null);
    }
  }

  const jobs = [...(data?.findAllVideoJob ?? [])].sort(
    (a, b) => new Date(b.scheduledDate ?? 0).getTime() - new Date(a.scheduledDate ?? 0).getTime(),
  );

  const columns: TableColumn<JobRow>[] = [
    {
      key: 'subject',
      header: 'Subject ID',
      render: (r) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#7c6af7' }}>
          {r.subjectId.slice(0, 8)}…
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status] ?? 'secondary'} label={r.status} />,
    },
    { key: 'retryCount', header: 'Retries', render: (r) => String(r.retryCount) },
    { key: 'scheduledDate', header: 'Scheduled', render: (r) => fmtDate(r.scheduledDate) },
    { key: 'startedAt', header: 'Started', render: (r) => fmtDate(r.startedAt) },
    { key: 'completedAt', header: 'Completed', render: (r) => fmtDate(r.completedAt) },
    {
      key: 'error',
      header: 'Error',
      render: (r) =>
        r.errorMessage ? (
          <span style={{ color: '#ef4444', fontSize: 11, wordBreak: 'break-word' }}>
            {r.errorMessage.slice(0, 80)}
            {r.errorMessage.length > 80 ? '…' : ''}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (r) => {
        const step = retryStepFor(r);
        return (
          <Stack direction="horizontal" gap={8}>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/logs?jobId=${r.id}`)}>
              Logs
            </Button>
            {step && (
              <Button
                variant="warning"
                size="sm"
                disabled={retryingId === r.id}
                onClick={() => handleRetry(r.id, step)}
              >
                {retryingId === r.id ? <Spinner size="sm" /> : `↺ Retry ${step}`}
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="title">Jobs</Typography>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: '#9ca3af',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Live (5s)
        </label>
        {loading && <Spinner size="sm" />}
      </div>

      {error && <Alert variant="error">{error.message}</Alert>}
      {retryError && (
        <Alert variant="error" style={{ marginBottom: '1rem' }}>
          Retry failed: {retryError}
        </Alert>
      )}

      {data && <Table columns={columns} data={jobs} rowKey={(r) => r.id} />}
    </div>
  );
}
