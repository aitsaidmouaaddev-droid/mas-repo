import { useState, useEffect, useCallback } from 'react';
import { FiCalendar, FiLock, FiLogOut } from 'react-icons/fi';
import { Button } from '@mas/react-ui';
import AgendaCalendar from '../components/agenda/AgendaCalendar';
import AgendaEventModal from '../components/agenda/AgendaEventModal';
import { useAgendaNotifications } from '../hooks/useAgendaNotifications';
import type { AgendaEvent } from '../hooks/useAgendaNotifications';
import styles from './RassTangPage.module.scss';

const BASE = '/agenda';
const TOKEN_KEY = 'rass-tang-token';

type Step = 'password' | 'otp' | 'dashboard';

function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function RassTangPage() {
  const [step, setStep] = useState<Step>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);

  const { notify, requestBrowserPermission } = useAgendaNotifications();

  // Restore session on mount
  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setToken(stored);
      setStep('dashboard');
    }
  }, []);

  // Load events when dashboard is shown
  useEffect(() => {
    if (step !== 'dashboard' || !token) return;
    void loadEvents(token);
    void requestBrowserPermission();
  }, [step, token, requestBrowserPermission]);

  const loadEvents = useCallback(async (tok: string) => {
    setEventsLoading(true);
    try {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const to = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();

      const res = await fetch(
        `${BASE}/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        {
          headers: { Authorization: `Bearer ${tok}` },
        },
      );

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = (await res.json()) as { events: AgendaEvent[] };
      setEvents(data.events);
    } catch {
      setError('Impossible de charger les événements.');
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? 'Mot de passe incorrect.');
        return;
      }
      setStep('otp');
      setPassword('');
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? 'Code invalide ou expiré.');
        return;
      }
      const data = (await res.json()) as { token: string };
      storeToken(data.token);
      setToken(data.token);
      setStep('dashboard');
      setOtp('');
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setToken('');
    setEvents([]);
    setStep('password');
    setError('');
  };

  const handleNotify = async (event: AgendaEvent, tok: string) => {
    await notify(event, tok);
  };

  // ── Password step ────────────────────────────────────────────
  if (step === 'password') {
    return (
      <div className={styles.page}>
        <div className={styles.authCard}>
          <div className={styles.authIcon}>
            <FiLock />
          </div>
          <h1 className={styles.authTitle}>Agenda privé</h1>
          <p className={styles.authSubtitle}>Entrez le mot de passe pour continuer.</p>
          <form onSubmit={handlePasswordSubmit} className={styles.formGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
            />
            {error && <div className={styles.errorMsg}>{error}</div>}
            <Button
              type="submit"
              variant="primary"
              label={loading ? 'Envoi…' : 'Continuer'}
              startIcon={FiLock}
            />
          </form>
        </div>
      </div>
    );
  }

  // ── OTP step ─────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className={styles.page}>
        <div className={styles.authCard}>
          <div className={styles.authIcon}>📱</div>
          <h1 className={styles.authTitle}>Code de vérification</h1>
          <p className={styles.authSubtitle}>
            Un code à 6 chiffres a été envoyé à votre adresse e-mail. Il expire dans 10 minutes.
          </p>
          <form onSubmit={handleOtpSubmit} className={styles.formGroup}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className={`${styles.input} ${styles.otpInput}`}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
              autoComplete="one-time-code"
              required
            />
            {error && <div className={styles.errorMsg}>{error}</div>}
            <Button type="submit" variant="primary" label={loading ? 'Vérification…' : 'Valider'} />
          </form>
          <div className={styles.backLink}>
            <button
              type="button"
              onClick={() => {
                setStep('password');
                setError('');
              }}
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard step ───────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.dashHeader}>
        <h1 className={styles.dashTitle}>
          <FiCalendar style={{ marginRight: 10, verticalAlign: 'middle' }} />
          Mon Agenda
        </h1>
        <Button variant="ghost" label="Déconnexion" startIcon={FiLogOut} onClick={handleLogout} />
      </div>

      <div className={styles.calendarWrap}>
        {eventsLoading ? (
          <p className={styles.loadingMsg}>Chargement des événements…</p>
        ) : (
          <>
            {error && (
              <div className={styles.errorMsg} style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}
            <AgendaCalendar events={events} onEventClick={(ev) => setSelectedEvent(ev)} />
          </>
        )}
      </div>

      <AgendaEventModal
        event={selectedEvent}
        token={token}
        onClose={() => setSelectedEvent(null)}
        onNotify={handleNotify}
      />
    </div>
  );
}
