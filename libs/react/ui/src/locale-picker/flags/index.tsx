import React from 'react';

interface FlagProps {
  size?: number;
  className?: string;
}

const s = (size = 20) => ({
  width: size * 1.33,
  height: size,
  display: 'inline-block' as const,
  borderRadius: 2,
  overflow: 'hidden' as const,
  verticalAlign: 'middle' as const,
  flexShrink: 0,
});

export function FlagGB({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" style={s(size)} className={className}>
      <clipPath id="gb"><path d="M0 0v30h60V0z" /></clipPath>
      <g clipPath="url(#gb)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb)" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagFR({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  );
}

export function FlagES({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </svg>
  );
}

export function FlagDE({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 5 3" style={s(size)} className={className}>
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#D00" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  );
}

export function FlagIT({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  );
}

export function FlagPT({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#FF0000" />
      <rect width="1.2" height="2" fill="#006600" />
      <circle cx="1.2" cy="1" r="0.35" fill="#FF0" />
    </svg>
  );
}

export function FlagBR({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 20 14" style={s(size)} className={className}>
      <rect width="20" height="14" fill="#009c3b" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3" fill="#002776" />
    </svg>
  );
}

export function FlagSA({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#006C35" />
      <text x="1.5" y="1.15" textAnchor="middle" fill="#fff" fontSize="0.7" fontFamily="serif">لا</text>
    </svg>
  );
}

export function FlagJP({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
    </svg>
  );
}

export function FlagCN({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#DE2910" />
      <g fill="#FFDE00" transform="translate(0.35,0.35) scale(0.12)">
        <polygon points="5,0 6.5,4 10.5,4 7,6.5 8.3,10.5 5,8 1.7,10.5 3,6.5 -0.5,4 3.5,4" />
      </g>
    </svg>
  );
}

export function FlagKR({ size = 20, className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" style={s(size)} className={className}>
      <rect width="3" height="2" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.5" fill="#C60C30" />
      <path d="M1.5 0.5a0.5 0.5 0 0 1 0 1" fill="#003478" />
    </svg>
  );
}

export type FlagComponent = React.FC<FlagProps>;

/** Map from locale code to its flag SVG component. */
export const FLAG_COMPONENTS: Record<string, FlagComponent> = {
  en: FlagGB,
  fr: FlagFR,
  es: FlagES,
  de: FlagDE,
  it: FlagIT,
  pt: FlagBR,
  ar: FlagSA,
  ja: FlagJP,
  zh: FlagCN,
  ko: FlagKR,
};

export function getFlag(code: string): FlagComponent | undefined {
  return FLAG_COMPONENTS[code];
}
