import { useState, useEffect } from 'react';
import { Typography } from '@mas/react-ui';
import { getActiveEnv, setActiveEnv, ENV_CONFIG } from '../../lib/env';
import { useEnvHealth } from '../../lib/useEnvHealth';
import { useExternalIp } from '../../lib/useExternalIp';
import type { AppEnv } from '../../lib/env';
import type { HealthStatus } from '../../lib/useEnvHealth';

// Inject keyframe animation once
function injectGlowStyle() {
  const id = 'env-glow-style';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    @keyframes env-glow {
      0%, 100% { box-shadow: 0 0 4px 2px #22c55e; }
      50%       { box-shadow: 0 0 10px 4px #22c55e; }
    }
    .env-dot-connected {
      animation: env-glow 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

function EnvDot({ status }: { status: HealthStatus }) {
  const color =
    status === 'connected' ? '#22c55e' : status === 'disconnected' ? '#ef4444' : '#6b7280';

  return (
    <span
      className={status === 'connected' ? 'env-dot-connected' : undefined}
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function EnvRow({
  envKey,
  health,
  active,
  onClick,
}: {
  envKey: AppEnv;
  health: HealthStatus;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`Switch to ${ENV_CONFIG[envKey].label}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: active ? 'rgba(124,106,247,0.18)' : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid rgba(124,106,247,0.4)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 7,
        padding: '0.4rem 0.6rem',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <EnvDot status={health} />
      <Typography variant="caption" style={{ color: active ? '#c4b5fd' : '#9ca3af', flex: 1 }}>
        {ENV_CONFIG[envKey].label}
      </Typography>
      {active && (
        <Typography variant="caption" style={{ color: '#7c6af7', fontSize: 10 }}>
          active
        </Typography>
      )}
    </button>
  );
}

export function EnvSwitcher() {
  const [activeEnv, setEnv] = useState<AppEnv>(getActiveEnv);
  const health = useEnvHealth();
  const externalIp = useExternalIp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    injectGlowStyle();
  }, []);

  function copyIp() {
    if (!externalIp.ip) return;
    navigator.clipboard.writeText(externalIp.ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function switchTo(next: AppEnv) {
    if (next === activeEnv) return;
    setActiveEnv(next);
    setEnv(next);
    import('../../lib/apollo').then(({ apolloClient }) => {
      apolloClient.resetStore();
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="caption" style={{ color: '#6b7280', paddingLeft: 2 }}>
        Environments
      </Typography>
      <EnvRow
        envKey="dev"
        health={health.dev}
        active={activeEnv === 'dev'}
        onClick={() => switchTo('dev')}
      />
      <EnvRow
        envKey="prod"
        health={health.prod}
        active={activeEnv === 'prod'}
        onClick={() => switchTo('prod')}
      />

      {/* External IP — shown so the user can copy it into Azure ALLOWED_IPS */}
      <div
        style={{
          marginTop: 6,
          padding: '0.35rem 0.6rem',
          borderRadius: 7,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Typography variant="caption" style={{ color: '#6b7280', flexShrink: 0 }}>
          Your IP
        </Typography>
        <Typography
          variant="caption"
          style={{
            color: externalIp.status === 'error' ? '#ef4444' : '#e5e7eb',
            flex: 1,
            fontFamily: 'monospace',
          }}
        >
          {externalIp.status === 'loading' && '…'}
          {externalIp.status === 'error' && 'unavailable'}
          {externalIp.status === 'ok' && externalIp.ip}
        </Typography>
        {externalIp.ip && (
          <button
            onClick={copyIp}
            title="Copy to clipboard"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: 4,
              color: copied ? '#22c55e' : '#6b7280',
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {copied ? '✓' : '⎘'}
          </button>
        )}
      </div>
    </div>
  );
}
