const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askNest(artifactType) {
  section(`NestJS ${artifactType} options`);

  if (artifactType === 'app') {
    return await prompts(
      [
        {
          type: 'select',
          name: 'unitTestRunner',
          message: '🧪  Unit test runner',
          choices: [
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
            { title: 'Jest', value: 'jest' },
            { title: 'None', value: 'none' },
          ],
          initial: 0,
        },
        {
          type: 'confirm',
          name: 'strict',
          message: '🔒  Enable TypeScript strict mode?',
          initial: true,
        },
        {
          type: 'text',
          name: 'frontendProject',
          message: '🔗  Frontend project for proxy config (leave blank to skip)',
          initial: '',
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
        name: 'unitTestRunner',
        message: '🧪  Unit test runner',
        choices: [
          { title: 'Jest', value: 'jest' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'confirm',
        name: 'controller',
        message: '🎮  Generate a controller?',
        initial: false,
      },
      {
        type: 'confirm',
        name: 'service',
        message: '⚙️   Generate a service?',
        initial: false,
      },
      {
        type: 'confirm',
        name: 'global',
        message: '🌍  Mark as global module?',
        initial: false,
      },
      {
        type: 'confirm',
        name: 'strict',
        message: '🔒  Enable TypeScript strict mode?',
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
    ],
    { onCancel },
  );
}

module.exports = { askNest };
