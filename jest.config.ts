import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

const STATIC_EXCLUDES = [
  'ts-fundamentals'
];

function parseEnvList(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectToText(project: unknown): string {
  // Nx can return string paths or project config objects.
  if (typeof project === 'string') return project;
  if (project && typeof project === 'object') {
    const p = project as { displayName?: string; rootDir?: string };
    return [p.displayName, p.rootDir].filter(Boolean).join(' ');
  }
  return '';
}

export default async (): Promise<Config> => {
  const projects = await getJestProjectsAsync();

  const envExcludes = parseEnvList(process.env.JEST_EXCLUDE_PROJECTS);
  const allExcludes = new Set([...STATIC_EXCLUDES, ...envExcludes]);

  return {
    projects: projects.filter((project) => {
      const text = projectToText(project);
      return ![...allExcludes].some((name) => text.includes(name));
    }),
  };
};