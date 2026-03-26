import path from 'path';
import { existsSync } from 'fs';

function findMonorepoRoot(from) {
  let dir = from;
  while (!existsSync(path.join(dir, 'nx.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) return from;
    dir = parent;
  }
  return dir;
}

const root = findMonorepoRoot(process.cwd());

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  framework: '@storybook/react-vite',
  typescript: { reactDocgen: false },
  viteFinal(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mas/shared/theme': path.join(root, 'libs/shared/theme/src/index.ts'),
      '@mas/shared/types': path.join(root, 'libs/shared/types/src/index.ts'),
    };
    return config;
  },
};

export default config;
