const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askTypeScript(artifactType) {
  section(`TypeScript ${artifactType} options`);

  if (artifactType === 'app') {
    return {
      framework: 'none',
      bundler: 'esbuild',
      linter: 'eslint',
      unitTestRunner: 'jest',
      e2eTestRunner: 'none',
      docker: false,
      js: false,
    };
  }

  // ── lib ──────────────────────────────────────────────────────────────────
  return await prompts(
    [
      {
        type: 'select',
        name: 'bundler',
        message: '📦  Bundler',
        choices: [
          { title: 'tsc (recommended)', value: 'tsc' },
          { title: 'esbuild', value: 'esbuild' },
          { title: 'rollup', value: 'rollup' },
          { title: 'swc', value: 'swc' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'unitTestRunner',
        message: '🧪  Unit test runner',
        choices: [
          { title: 'Jest', value: 'jest' },
          { title: 'Vitest', value: 'vitest' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'confirm',
        name: 'buildable',
        message: '🔨  Buildable?',
        initial: false,
      },
      {
        type: 'confirm',
        name: 'publishable',
        message: '📤  Publishable (npm)?',
        initial: false,
      },
      {
        type: (_, values) => (values.publishable ? 'text' : null),
        name: 'importPath',
        message: '📦  Import path (e.g. @my-org/my-lib)',
      },
    ],
    { onCancel },
  );
}

module.exports = { askTypeScript };
