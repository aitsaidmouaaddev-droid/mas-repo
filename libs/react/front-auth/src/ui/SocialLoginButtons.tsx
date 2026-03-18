import type { CSSProperties } from 'react';
import {
  FaGoogle,
  FaGithub,
  FaFacebook,
  FaLinkedin,
  FaApple,
  FaMicrosoft,
  FaXTwitter,
} from 'react-icons/fa6';
import { Divider } from '@mas/react-ui';
import styles from './social-buttons.module.scss';

/** Supported OAuth provider identifiers. */
export type SocialProvider =
  | 'google'
  | 'github'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'apple'
  | 'microsoft';

const ALL_PROVIDERS: SocialProvider[] = [
  'google',
  'github',
  'facebook',
  'linkedin',
  'twitter',
  'apple',
  'microsoft',
];

interface ProviderMeta {
  label: string;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
}

const PROVIDER_META: Record<SocialProvider, ProviderMeta> = {
  google: { label: 'Google', color: '#EA4335', Icon: FaGoogle },
  github: { label: 'GitHub', color: '#24292F', Icon: FaGithub },
  facebook: { label: 'Facebook', color: '#1877F2', Icon: FaFacebook },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', Icon: FaLinkedin },
  twitter: { label: 'X / Twitter', color: '#000000', Icon: FaXTwitter },
  apple: { label: 'Apple', color: '#555555', Icon: FaApple },
  microsoft: { label: 'Microsoft', color: '#0078D4', Icon: FaMicrosoft },
};

/**
 * Props for {@link SocialLoginButtons}.
 */
export interface SocialLoginButtonsProps {
  /**
   * Which providers to render. Defaults to all providers.
   * Pass an empty array to render nothing.
   */
  providers?: SocialProvider[];
  /** Called when the user clicks a provider button. */
  onProviderLogin: (provider: SocialProvider) => void;
  /** Disables all buttons — use while an OAuth flow is in progress. */
  disabled?: boolean;
  /**
   * `'icons'` — compact row of square icon-only buttons (default).
   * `'list'`  — full-width buttons with icon + label, stacked vertically.
   */
  layout?: 'icons' | 'list';
  /** Label for the divider shown above the buttons. @default 'or continue with' */
  dividerLabel?: string;
  /** Hide the divider entirely. */
  hideDivider?: boolean;
}

/**
 * OAuth provider buttons for login / registration flows.
 *
 * Toggle providers on/off via the `providers` prop — only listed providers render.
 * The component is UI-only: clicking a button calls `onProviderLogin(provider)`;
 * the caller is responsible for redirecting to the OAuth endpoint.
 *
 * @example
 * ```tsx
 * <SocialLoginButtons
 *   providers={['google', 'github']}
 *   onProviderLogin={(p) => window.location.href = `/auth/oauth/${p}`}
 * />
 * ```
 */
export function SocialLoginButtons({
  providers = ALL_PROVIDERS,
  onProviderLogin,
  disabled = false,
  layout = 'icons',
  dividerLabel = 'or continue with',
  hideDivider = false,
}: SocialLoginButtonsProps) {
  if (providers.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {!hideDivider && <Divider label={dividerLabel} />}

      {layout === 'icons' ? (
        <div className={styles.row}>
          {providers.map((p) => {
            const { label, color, Icon } = PROVIDER_META[p];
            return (
              <button
                key={p}
                type="button"
                className={styles.iconBtn}
                style={{ '--provider-color': color } as CSSProperties}
                onClick={() => onProviderLogin(p)}
                disabled={disabled}
                aria-label={`Continue with ${label}`}
                title={`Continue with ${label}`}
              >
                <Icon size={18} color={color} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.wrap}>
          {providers.map((p) => {
            const { label, color, Icon } = PROVIDER_META[p];
            return (
              <button
                key={p}
                type="button"
                className={styles.fullBtn}
                style={{ '--provider-color': color } as CSSProperties}
                onClick={() => onProviderLogin(p)}
                disabled={disabled}
              >
                <Icon size={18} color={color} />
                <span className={styles.fullLabel}>Continue with {label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
