import { useState, type ReactNode } from 'react';
import { FiBell, FiMapPin, FiCalendar, FiClock, FiAlignLeft } from 'react-icons/fi';
import { Modal, Button } from '@mas/react-ui';
import type { AgendaEvent } from '../../hooks/useAgendaNotifications';

interface Props {
  event: AgendaEvent | null;
  token: string;
  onClose: () => void;
  onNotify: (event: AgendaEvent, token: string) => Promise<void>;
}

function formatRange(start: string, end: string, allDay: boolean): string {
  if (allDay) {
    const s = new Date(start).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return s;
  }
  const s = new Date(start).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const e = new Date(end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${s} – ${e}`;
}

export default function AgendaEventModal({ event, token, onClose, onNotify }: Props) {
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  if (!event) return null;

  const handleNotify = async () => {
    setNotifying(true);
    try {
      await onNotify(event, token);
      setNotified(true);
    } finally {
      setNotifying(false);
    }
  };

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title={event.summary}
      footer={
        notified ? (
          <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
            ✓ Rappel envoyé !
          </span>
        ) : (
          <Button
            variant="primary"
            label={notifying ? 'Envoi…' : 'Me rappeler'}
            startIcon={FiBell}
            onClick={handleNotify}
          />
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Row
          icon={<FiCalendar size={14} />}
          text={formatRange(event.start, event.end, event.allDay)}
        />
        {!event.allDay && (
          <Row icon={<FiClock size={14} />} text={`${durationLabel(event.start, event.end)}`} />
        )}
        {event.location && <Row icon={<FiMapPin size={14} />} text={event.location} />}
        {event.description && (
          <Row icon={<FiAlignLeft size={14} />} text={event.description} multiline />
        )}
      </div>
    </Modal>
  );
}

function Row({ icon, text, multiline }: { icon: ReactNode; text: string; multiline?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: multiline ? 'flex-start' : 'center' }}>
      <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: multiline ? 2 : 0 }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: '0.85rem',
          color: 'var(--color-text)',
          lineHeight: 1.5,
          whiteSpace: multiline ? 'pre-wrap' : undefined,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function durationLabel(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`;
}
