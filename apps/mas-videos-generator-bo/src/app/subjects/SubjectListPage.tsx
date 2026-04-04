import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Table, Button, Badge, Spinner, Alert, Stack, Typography } from '@mas/react-ui';
import type { TableColumn } from '@mas/react-ui';
import { SubjectFormModal } from './SubjectFormModal';
import type { SubjectFormData } from './SubjectFormModal';

const LIST_SUBJECTS = gql`
  query ListSubjects {
    findAllSubject {
      id
      topic
      status
      priority
      voiceLanguage
      generateShorts
      targetPlatforms
      isActive
      scheduledFor
      targetDuration
    }
  }
`;

const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

const TRIGGER_SUBJECT = gql`
  mutation TriggerSubject($subjectId: ID!) {
    triggerSubject(subjectId: $subjectId) {
      id
      status
    }
  }
`;

interface SubjectRow {
  id: string;
  topic: string;
  status: string;
  priority: number;
  voiceLanguage: string;
  generateShorts: boolean;
  targetPlatforms: string[];
  isActive: boolean;
  scheduledFor?: string;
  targetDuration?: number;
}

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: 'secondary',
  awaiting_trigger_confirmation: 'warning',
  skipped_today: 'secondary',
  in_progress: 'primary',
  done: 'success',
  archived: 'error',
};

export function SubjectListPage() {
  const { data, loading, error, refetch } = useQuery<{ findAllSubject: SubjectRow[] }>(
    LIST_SUBJECTS,
    { fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    const id = setInterval(() => refetch(), 5000);
    return () => clearInterval(id);
  }, [refetch]);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);
  const [triggerSubject] = useMutation(TRIGGER_SUBJECT);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectFormData | null>(null);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  async function handleTrigger(id: string) {
    setTriggerError(null);
    setTriggeringId(id);
    try {
      await triggerSubject({ variables: { subjectId: id } });
      refetch();
    } catch (err) {
      setTriggerError((err as Error).message);
    } finally {
      setTriggeringId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this subject?')) return;
    await deleteSubject({ variables: { id } });
    refetch();
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row: SubjectRow) {
    setEditing({
      id: row.id,
      topic: row.topic,
      targetDuration: row.targetDuration,
      targetPlatforms: row.targetPlatforms,
      generateShorts: row.generateShorts,
      voiceLanguage: row.voiceLanguage,
      priority: row.priority,
      scheduledFor: row.scheduledFor,
      isActive: row.isActive,
    });
    setModalOpen(true);
  }

  const columns: TableColumn<SubjectRow>[] = [
    { key: 'topic', header: 'Topic', render: (r) => r.topic },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status] ?? 'secondary'} label={r.status} />,
    },
    { key: 'priority', header: 'Priority', render: (r) => String(r.priority) },
    {
      key: 'scheduledFor',
      header: 'Scheduled',
      render: (r) =>
        r.scheduledFor
          ? new Date(r.scheduledFor).toLocaleDateString(undefined, { dateStyle: 'medium' })
          : '—',
    },
    { key: 'voiceLanguage', header: 'Lang', render: (r) => r.voiceLanguage },
    {
      key: 'isActive',
      header: 'Active',
      render: (r) => (
        <Badge variant={r.isActive ? 'success' : 'secondary'} label={r.isActive ? 'Yes' : 'No'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <Stack direction="horizontal" gap={8}>
          {r.status === 'pending' && r.isActive && (
            <Button
              variant="primary"
              size="sm"
              disabled={triggeringId === r.id}
              onClick={() => handleTrigger(r.id)}
            >
              {triggeringId === r.id ? <Spinner size="sm" /> : '▶ Trigger'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(r.id)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
        <Typography variant="title">Subjects</Typography>
        <Button variant="primary" onClick={openCreate}>
          + New Subject
        </Button>
      </div>

      {loading && <Spinner />}
      {error && <Alert variant="error">{error.message}</Alert>}
      {triggerError && (
        <Alert variant="error" style={{ marginBottom: '1rem' }}>
          Trigger failed: {triggerError}
        </Alert>
      )}
      {data && <Table columns={columns} data={data.findAllSubject} rowKey={(r) => r.id} />}

      <SubjectFormModal
        open={modalOpen}
        subject={editing}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
