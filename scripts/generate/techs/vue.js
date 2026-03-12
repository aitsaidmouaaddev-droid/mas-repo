const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askVue(artifactType) {
  section(`Vue ${artifactType} options`);

  if (artifactType === 'app') {
    return await prompts(
      [
        {
          type: 'select',
          name: 'style',
          message: '🎨  Style format',
          choices: [
            { title: 'CSS', value: 'css' },
            { title: 'SCSS', value: 'scss' },
            { title: 'SASS', value: 'sass' },
            { title: 'LESS', value: 'less' },
            { title: 'None', value: 'none' },
          ],
          initial: 0,
        },
        {
          type: 'confirm',
          name: 'routing',
          message: '🗺️   Add Vue Router?',
          initial: true,
        },
        {
          type: 'select',
          name: 'bundler',
          message: '📦  Bundler',
          choices: [
            { title: 'Vite (recommended)', value: 'vite' },
            { title: 'webpack', value: 'webpack' },
          ],
          initial: 0,
        },
        {
          type: 'select',
          name: 'unitTestRunner',
          message: '🧪  Unit test runner',
          choices: [
            { title: 'Vitest (recommended)', value: 'vitest' },
            { title: 'Jest', value: 'jest' },
            { title: 'None', value: 'none' },
          ],
          initial: 0,
        },
        {
          type: 'select',
          name: 'e2eTestRunner',
          message: '🔍  E2E test runner',
          choices: [
            { title: 'Cypress', value: 'cypress' },
            { title: 'Playwright', value: 'playwright' },
            { title: 'None', value: 'none' },
          ],
          initial: 2,
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
        name: 'style',
        message: '🎨  Style format',
        choices: [
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'SASS', value: 'sass' },
          { title: 'LESS', value: 'less' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'unitTestRunner',
        message: '🧪  Unit test runner',
        choices: [
          { title: 'Vitest (recommended)', value: 'vitest' },
          { title: 'Jest', value: 'jest' },
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

module.exports = { askVue };
