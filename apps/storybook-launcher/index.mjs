#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { detectStories } from './detectors/stories.mjs';
import { runReactNative } from './runners/react-native.mjs';
import { runWeb } from './runners/web.mjs';

const MONOREPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const FRAMEWORK_LABEL = {
  'react-native': 'React Native',
  react: 'React',
  angular: 'Angular',
  vue: 'Vue 3',
  svelte: 'Svelte',
  unknown: 'Unknown',
};

async function main() {
  console.log('\n  MAS Storybook Launcher\n');

  const targets = await detectStories(MONOREPO_ROOT);

  if (targets.length === 0) {
    console.log('No stories found in any library or app.');
    process.exit(0);
  }

  const { target } = await prompts({
    type: 'select',
    name: 'target',
    message: 'Which storybook do you want to run?',
    choices: targets.map((t) => {
      const fw = FRAMEWORK_LABEL[t.framework] ?? t.framework;
      const count = `${t.storyCount} ${t.storyCount === 1 ? 'story' : 'stories'}`;
      const preview = t.hasPreview ? '' : '  ⚠ no preview';
      return {
        title: `${t.name.padEnd(35)} ${fw.padEnd(14)} (${count})${preview}`,
        value: t,
      };
    }),
  });

  if (!target) {
    console.log('Cancelled.');
    process.exit(0);
  }

  if (target.framework === 'react-native') {
    await runReactNative(target, MONOREPO_ROOT);
  } else if (['react', 'angular', 'vue', 'svelte'].includes(target.framework)) {
    await runWeb(target, MONOREPO_ROOT);
  } else {
    console.error(`Unsupported framework: ${target.framework}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
