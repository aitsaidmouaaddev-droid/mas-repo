import { useState, useEffect } from 'react';
import { ENV_CONFIG } from './env';
import type { AppEnv } from './env';

export type HealthStatus = 'checking' | 'connected' | 'disconnected';

async function ping(uri: string): Promise<boolean> {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{__typename}' }),
      signal: AbortSignal.timeout(3000),
    });
    // Any response from the server (even 400) means it's up
    return res.status < 500;
  } catch {
    return false;
  }
}

const POLL_INTERVAL_MS = 15_000;

export function useEnvHealth(): Record<AppEnv, HealthStatus> {
  const [status, setStatus] = useState<Record<AppEnv, HealthStatus>>({
    dev: 'checking',
    prod: 'checking',
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const [devOk, prodOk] = await Promise.all([
        ping(ENV_CONFIG.dev.graphqlUri),
        ping(ENV_CONFIG.prod.graphqlUri),
      ]);
      if (!cancelled) {
        setStatus({
          dev: devOk ? 'connected' : 'disconnected',
          prod: prodOk ? 'connected' : 'disconnected',
        });
      }
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
