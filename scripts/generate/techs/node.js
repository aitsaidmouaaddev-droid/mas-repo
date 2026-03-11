const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askNode(artifactType) {
  section(`Node.js ${artifactType} options`);

  if (artifactType === 'app') {
    return await prompts(
      [
        {
          type: 'select',
          name: 'framework',
          message: '🚀  Framework',
          choices: [
            { title: 'Express', value: 'express' },
            { title: 'Fastify', value: 'fastify' },
            { title: 'Koa', value: 'koa' },
            { title: 'None (plain Node.js)', value: 'none' },
          ],
          initial: 0,
        },
        {
          type: 'select',
          name: 'bundler',
          message: '📦  Bundler',
          choices: [
            { title: 'esbuild (recommended)', value: 'esbuild' },
            { title: 'webpack', value: 'webpack' },
            { title: 'rollup', value: 'rollup' },
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
          type: 'select',
          name: 'e2eTestRunner',
          message: '🔍  E2E test runner',
          choices: [
            { title: 'Jest', value: 'jest' },
            { title: 'None', value: 'none' },
          ],
          initial: 1,
        },
        {
          type: 'confirm',
          name: 'docker',
          message: '🐳  Generate Dockerfile?',
          initial: false,
        },
        {
          type: 'confirm',
          name: 'js',
          message: '🟨  Use JavaScript instead of TypeScript?',
          initial: false,
        },
      ],
      { onCancel },
    );
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
      {
        type: 'confirm',
        name: 'js',
        message: '🟨  Use JavaScript instead of TypeScript?',
        initial: false,
      },
    ],
    { onCancel },
  );
}

module.exports = { askNode };
