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
import { useT } from '@mas/shared/i18n';
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

export interface SocialLoginButtonsProps {
  providers?: SocialProvider[];
  onProviderLogin: (provider: SocialProvider) => void;
  disabled?: boolean;
  layout?: 'icons' | 'list';
  dividerLabel?: string;
  hideDivider?: boolean;
}

export function SocialLoginButtons({
  providers = ALL_PROVIDERS,
  onProviderLogin,
  disabled = false,
  layout = 'icons',
  dividerLabel,
  hideDivider = false,
}: SocialLoginButtonsProps) {
  const { t } = useT();
  if (providers.length === 0) return null;

  const divLabel = dividerLabel ?? t('auth.orContinueWith');

  return (
    <div className={styles.wrap}>
      {!hideDivider && <Divider label={divLabel} />}

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
                aria-label={t('auth.continueWith', { provider: label })}
                title={t('auth.continueWith', { provider: label })}
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
                <span className={styles.fullLabel}>{t('auth.continueWith', { provider: label })}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
