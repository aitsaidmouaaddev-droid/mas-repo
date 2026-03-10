const prompts = require('prompts');
const { onCancel, section } = require('../utils');

async function askAngular(artifactType) {
  section(`Angular ${artifactType} options`);

  if (artifactType === 'app') {
    return await prompts([
      {
        type:    'select',
        name:    'style',
        message: '🎨  Style format',
        choices: [
          { title: 'SCSS (recommended)', value: 'scss' },
          { title: 'CSS',                value: 'css'  },
          { title: 'SASS',               value: 'sass' },
          { title: 'LESS',               value: 'less' },
        ],
        initial: 0,
      },
      {
        type:    'confirm',
        name:    'routing',
        message: '🗺️   Add routing module?',
        initial: true,
      },
      {
        type:    'confirm',
        name:    'standalone',
        message: '🧩  Use standalone components?',
        initial: true,
      },
      {
        type:    'select',
        name:    'changeDetection',
        message: '🔄  Change detection strategy',
        choices: [
          { title: 'Default',                           value: 'Default' },
          { title: 'OnPush (better performance)',       value: 'OnPush'  },
        ],
        initial: 0,
      },
      {
        type:    'select',
        name:    'viewEncapsulation',
        message: '🔒  View encapsulation',
        choices: [
          { title: 'Emulated (default)', value: 'Emulated'  },
          { title: 'None',               value: 'None'      },
          { title: 'ShadowDom',          value: 'ShadowDom' },
        ],
        initial: 0,
      },
      {
        type:    'confirm',
        name:    'inlineTemplate',
        message: '📄  Inline template?',
        initial: false,
      },
      {
        type:    'confirm',
        name:    'inlineStyle',
        message: '💅  Inline styles?',
        initial: false,
      },
      {
        type:    'text',
        name:    'prefix',
        message: '🏷️   Component selector prefix',
        initial: 'app',
      },
      {
        type:    'select',
        name:    'bundler',
        message: '📦  Bundler',
        choices: [
          { title: 'esbuild (fast, recommended)', value: 'esbuild'  },
          { title: 'webpack',                     value: 'webpack'  },
          { title: 'rspack',                      value: 'rspack'   },
        ],
        initial: 0,
      },
      {
        type:    'select',
        name:    'unitTestRunner',
        message: '🧪  Unit test runner',
        choices: [
          { title: 'Jest', value: 'jest' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type:    'select',
        name:    'e2eTestRunner',
        message: '🔍  E2E test runner',
        choices: [
          { title: 'Cypress',    value: 'cypress'    },
          { title: 'Playwright', value: 'playwright' },
          { title: 'None',       value: 'none'       },
        ],
        initial: 2,
      },
      {
        type:    'text',
        name:    'backendProject',
        message: '🔗  Backend project for proxy config (leave blank to skip)',
        initial: '',
      },
    ], { onCancel });
  }

  // ── lib ──────────────────────────────────────────────────────────────────
  const answers = await prompts([
    {
      type:    'select',
      name:    'style',
      message: '🎨  Style format',
      choices: [
        { title: 'SCSS (recommended)', value: 'scss' },
        { title: 'CSS',                value: 'css'  },
        { title: 'SASS',               value: 'sass' },
        { title: 'LESS',               value: 'less' },
        { title: 'None',               value: 'none' },
      ],
      initial: 0,
    },
    {
      type:    'confirm',
      name:    'standalone',
      message: '🧩  Use standalone components?',
      initial: true,
    },
    {
      type:    'select',
      name:    'changeDetection',
      message: '🔄  Change detection strategy',
      choices: [
        { title: 'Default', value: 'Default' },
        { title: 'OnPush',  value: 'OnPush'  },
      ],
      initial: 0,
    },
    {
      type:    'select',
      name:    'viewEncapsulation',
      message: '🔒  View encapsulation',
      choices: [
        { title: 'Emulated (default)', value: 'Emulated'  },
        { title: 'None',               value: 'None'      },
        { title: 'ShadowDom',          value: 'ShadowDom' },
      ],
      initial: 0,
    },
    {
      type:    'text',
      name:    'prefix',
      message: '🏷️   Component selector prefix',
      initial: 'lib',
    },
    {
      type:    'confirm',
      name:    'buildable',
      message: '🔨  Buildable?',
      initial: false,
    },
    {
      type:    'confirm',
      name:    'publishable',
      message: '📤  Publishable (npm)?',
      initial: false,
    },
    {
      type:    (_, values) => values.publishable ? 'text' : null,
      name:    'importPath',
      message: '📦  Import path (e.g. @my-org/my-lib)',
    },
    {
      type:    'select',
      name:    'unitTestRunner',
      message: '🧪  Unit test runner',
      choices: [
        { title: 'Jest', value: 'jest' },
        { title: 'None', value: 'none' },
      ],
      initial: 0,
    },
  ], { onCancel });

  return answers;
}

module.exports = { askAngular };
