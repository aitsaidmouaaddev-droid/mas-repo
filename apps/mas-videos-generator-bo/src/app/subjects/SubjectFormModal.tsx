import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Modal, InputField, Button, Switch, Stack, Typography } from '@mas/react-ui';

const CREATE_SUBJECT = gql`
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      topic
      status
      priority
      isActive
    }
  }
`;

const UPDATE_SUBJECT = gql`
  mutation UpdateSubject($input: UpdateSubjectInput!) {
    updateSubject(input: $input) {
      id
      topic
      status
      priority
      isActive
    }
  }
`;

export interface SubjectFormData {
  id?: string;
  topic: string;
  targetDuration?: number;
  targetPlatforms: string[];
  generateShorts: boolean;
  voiceLanguage: string;
  priority: number;
  scheduledFor?: string;
  isActive: boolean;
}

interface SubjectFormModalProps {
  open: boolean;
  subject?: SubjectFormData | null;
  onClose: () => void;
  onSuccess: () => void;
}

// ISO timestamp → "YYYY-MM-DD" for <input type="date">
function toDateInput(iso?: string | null): string {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

// "YYYY-MM-DD" from <input type="date"> → full ISO timestamp for GraphQL DateTime
function toIso(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  return new Date(dateStr + 'T00:00:00.000Z').toISOString();
}

const EMPTY: SubjectFormData = {
  topic: '',
  targetPlatforms: ['youtube'],
  generateShorts: false,
  voiceLanguage: 'en',
  priority: 0,
  isActive: true,
};

export function SubjectFormModal({ open, subject, onClose, onSuccess }: SubjectFormModalProps) {
  const [form, setForm] = useState<SubjectFormData>(EMPTY);
  const [createSubject, { loading: creating }] = useMutation(CREATE_SUBJECT);
  const [updateSubject, { loading: updating }] = useMutation(UPDATE_SUBJECT);

  const isEdit = !!subject?.id;
  const loading = creating || updating;

  useEffect(() => {
    if (!subject) {
      setForm(EMPTY);
      return;
    }
    setForm({ ...subject, scheduledFor: toDateInput(subject.scheduledFor) });
  }, [subject, open]);

  function set<K extends keyof SubjectFormData>(key: K, value: SubjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const input = {
      topic: form.topic,
      targetDuration: form.targetDuration || undefined,
      targetPlatforms: form.targetPlatforms,
      generateShorts: form.generateShorts,
      voiceLanguage: form.voiceLanguage,
      priority: form.priority,
      scheduledFor: toIso(form.scheduledFor),
      isActive: form.isActive,
    };

    if (isEdit) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await updateSubject({ variables: { input: { ...input, id: subject!.id } } });
    } else {
      await createSubject({ variables: { input } });
    }
    onSuccess();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Subject' : 'New Subject'}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading || !form.topic.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      }
    >
      <Stack direction="vertical" gap={16}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Typography variant="body">Topic</Typography>
          <textarea
            value={form.topic}
            onChange={(e) => set('topic', e.target.value)}
            placeholder="e.g. React 19 new features"
            rows={4}
            style={{
              width: '100%',
              resize: 'vertical',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e5e7eb',
              fontSize: 14,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7c6af7')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
          />
        </div>
        <InputField
          label="Target duration (seconds)"
          type="number"
          value={form.targetDuration ?? ''}
          onChange={(e) =>
            set('targetDuration', e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="e.g. 300"
        />
        <InputField
          label="Voice language"
          value={form.voiceLanguage}
          onChange={(e) => set('voiceLanguage', e.target.value)}
          placeholder="en"
        />
        <InputField
          label="Priority"
          type="number"
          value={form.priority}
          onChange={(e) => set('priority', Number(e.target.value))}
        />
        <InputField
          label="Scheduled for"
          type="date"
          value={form.scheduledFor ?? ''}
          onChange={(e) => set('scheduledFor', e.target.value || undefined)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Typography variant="body">Generate shorts</Typography>
          <Switch on={form.generateShorts} onChange={(on) => set('generateShorts', on)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Typography variant="body">Active</Typography>
          <Switch on={form.isActive} onChange={(on) => set('isActive', on)} />
        </div>
      </Stack>
    </Modal>
  );
}
