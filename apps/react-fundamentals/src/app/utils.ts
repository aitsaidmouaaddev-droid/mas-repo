import {
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiNestjs,
  SiJavascript,
  SiTypescript,
  SiGraphql,
  SiPostgresql,
} from 'react-icons/si';
import { FiCode, FiBox, FiTerminal } from 'react-icons/fi';
import type { IconType } from '@mas/react-ui';
import type { FlatQuestion } from '@mas/shared/qcm';
import type { QcmQuestion } from '@mas/react-fundamentals-sot';

export interface TechMeta {
  label: string;
  icon: IconType;
  color: string;
}

export const TECH_META: Record<string, TechMeta> = {
  react: { label: 'React', icon: SiReact, color: '#61DAFB' },
  angular: { label: 'Angular', icon: SiAngular, color: '#DD0031' },
  nodejs: { label: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  nestjs: { label: 'NestJS', icon: SiNestjs, color: '#E0234E' },
  javascript: { label: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  typescript: { label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  graphql: { label: 'GraphQL', icon: SiGraphql, color: '#E10098' },
  sql: { label: 'SQL', icon: SiPostgresql, color: '#336791' },
};

export function getTechMeta(category: string): TechMeta {
  return (
    TECH_META[category.toLowerCase()] ?? { label: category, icon: SiJavascript, color: '#888888' }
  );
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

export const DIFF_ORDER = ['easy', 'medium', 'hard'] as const;

export const difficultyVariant: Record<string, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

export type TdtCategory = 'react-hooks' | 'architecture' | 'typescript';
export type TdtDifficulty = 'easy' | 'medium' | 'hard';

export const TDT_CATEGORY_META: Record<TdtCategory, { label: string; icon: IconType }> = {
  'react-hooks': { label: 'React & Hooks', icon: FiCode },
  architecture: { label: 'Architecture', icon: FiBox },
  typescript: { label: 'TypeScript', icon: FiTerminal },
};

export const TDT_CATEGORIES: TdtCategory[] = ['react-hooks', 'architecture', 'typescript'];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDurationSec(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
}

export function toFlatQuestion(q: Pick<QcmQuestion, 'id' | 'moduleId' | 'type' | 'difficulty' | 'data'>): FlatQuestion {
  return {
    id: q.id,
    moduleId: q.moduleId,
    type: q.type as FlatQuestion['type'],
    difficulty: q.difficulty as FlatQuestion['difficulty'],
    tags: q.data.tags,
    question: q.data.question,
    choices: q.data.choices,
    answer: JSON.parse(q.data.answer) as number | number[],
    explanation: q.data.explanation ?? undefined,
    docs: q.data.docs ?? undefined,
  };
}
