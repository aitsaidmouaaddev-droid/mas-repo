import { useCallback, useRef } from 'react';

export interface AgendaEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  colorId?: string;
  allDay: boolean;
}

const BASE = '/agenda';

/**
 * Manage agenda event reminders: browser notification + chime sound + email POST.
 * Call `notify(event, token)` when the user clicks the bell icon on an event.
 */
export function useAgendaNotifications() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(() => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // AudioContext not available (e.g. server-side)
    }
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const showBrowserNotification = useCallback((event: AgendaEvent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const start = event.allDay
        ? event.start
        : new Date(event.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      new Notification(`📅 ${event.summary}`, {
        body: `${start}${event.location ? ` · ${event.location}` : ''}`,
        icon: '/assets/appicon.png',
      });
    }
  }, []);

  const sendEmailReminder = useCallback(async (event: AgendaEvent, token: string) => {
    await fetch(`${BASE}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventTitle: event.summary, eventStart: event.start }),
    });
  }, []);

  const notify = useCallback(
    async (event: AgendaEvent, token: string) => {
      playChime();
      showBrowserNotification(event);
      await sendEmailReminder(event, token);
    },
    [playChime, showBrowserNotification, sendEmailReminder],
  );

  return { notify, requestBrowserPermission };
}
