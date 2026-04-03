import { useState, useEffect } from 'react';

export type IpStatus = 'loading' | 'ok' | 'error';

export interface ExternalIp {
  ip: string | null;
  status: IpStatus;
}

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes — IP changes are rare

async function fetchIp(): Promise<string> {
  const res = await fetch('https://api.ipify.org?format=json', {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error('fetch failed');
  const json = (await res.json()) as { ip: string };
  return json.ip;
}

export function useExternalIp(): ExternalIp {
  const [state, setState] = useState<ExternalIp>({ ip: null, status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const ip = await fetchIp();
        if (!cancelled) setState({ ip, status: 'ok' });
      } catch {
        if (!cancelled) setState((prev) => ({ ip: prev.ip, status: 'error' }));
      }
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return state;
}
