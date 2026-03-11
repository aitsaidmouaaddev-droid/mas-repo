const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askReact(artifactType) {
  section(`React ${artifactType} options`);

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
            { title: 'styled-components', value: 'styled-components' },
            { title: '@emotion/styled', value: '@emotion/styled' },
            { title: 'Tailwind CSS', value: 'tailwind' },
            { title: 'None', value: 'none' },
          ],
          initial: 0,
        },
        {
          type: 'confirm',
          name: 'routing',
          message: '🗺️   Add routing?',
          initial: true,
        },
        {
          type: 'select',
          name: 'bundler',
          message: '📦  Bundler',
          choices: [
            { title: 'Vite (recommended)', value: 'vite' },
            { title: 'webpack', value: 'webpack' },
            { title: 'rspack', value: 'rspack' },
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
            { title: 'Cypress', value: 'cypress' },
            { title: 'Playwright', value: 'playwright' },
            { title: 'None', value: 'none' },
          ],
          initial: 2,
        },
        {
          type: 'confirm',
          name: 'globalCss',
          message: '🌍  Use global CSS (vs CSS modules)?',
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
        name: 'style',
        message: '🎨  Style format',
        choices: [
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'SASS', value: 'sass' },
          { title: 'LESS', value: 'less' },
          { title: 'styled-components', value: 'styled-components' },
          { title: '@emotion/styled', value: '@emotion/styled' },
          { title: 'Tailwind CSS', value: 'tailwind' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'bundler',
        message: '📦  Bundler',
        choices: [
          { title: 'Vite (recommended)', value: 'vite' },
          { title: 'Rollup', value: 'rollup' },
          { title: 'None (tsc only)', value: 'none' },
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
        name: 'component',
        message: '🧩  Generate initial component?',
        initial: true,
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

module.exports = { askReact };
