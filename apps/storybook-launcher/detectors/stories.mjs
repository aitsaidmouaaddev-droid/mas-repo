import fs from 'fs';
import path from 'path';
import { detectFramework } from './framework.mjs';

const STORY_PATTERN = /\.stories\.(tsx?|jsx?|mdx)$/;
const SEARCH_DIRS = ['libs', 'apps'];
const IGNORE_DIRS = new Set([
  'node_modules',
  '.expo',
  'dist',
  'android',
  'ios',
  '__mocks__',
  'storybook-native', // avoid self-reference
  'storybook-launcher',
]);

function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else if (STORY_PATTERN.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Walk up from a story file until we find the nearest package.json.
 * That directory is treated as the lib root.
 */
function findLibRoot(storyPath, monorepoRoot) {
  let dir = path.dirname(storyPath);
  while (dir !== monorepoRoot && dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

/**
 * Scans the monorepo and returns all libs/apps that contain at least one story,
 * grouped and annotated with framework info.
 *
 * @param {string} monorepoRoot
 * @returns {Array<{name: string, root: string, framework: string, storyCount: number, hasPreview: boolean}>}
 */
export async function detectStories(monorepoRoot) {
  const allStories = [];

  for (const searchDir of SEARCH_DIRS) {
    const dir = path.join(monorepoRoot, searchDir);
    walkDir(dir, allStories);
  }

  const libMap = new Map();

  for (const storyPath of allStories) {
    const libRoot = findLibRoot(storyPath, monorepoRoot);
    if (!libRoot) continue;

    if (!libMap.has(libRoot)) {
      const pkgPath = path.join(libRoot, 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const framework = detectFramework(pkgJson, libRoot);

      const hasPreview =
        fs.existsSync(path.join(libRoot, '.storybook', 'preview.tsx')) ||
        fs.existsSync(path.join(libRoot, '.storybook', 'preview.ts'));

      libMap.set(libRoot, {
        name: pkgJson.name ?? path.basename(libRoot),
        root: libRoot,
        framework,
        stories: [],
        hasPreview,
      });
    }

    libMap.get(libRoot).stories.push(storyPath);
  }

  return [...libMap.values()].map((lib) => ({
    ...lib,
    storyCount: lib.stories.length,
  }));
}
