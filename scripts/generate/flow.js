/**
 * flow.js — shared interactive flow used by both index.js and test.js.
 *
 * Directory is computed automatically:
 *   app  → apps/{name}
 *   lib  → libs/shared/{name}      (if shared)
 *         libs/{tech}/{name}       (otherwise)
 */

const prompts = require('prompts');

const { section, summaryBox, onCancel, buildFlagsString } = require('./utils');

const { askAngular } = require('./techs/angular');
const { askNext } = require('./techs/next');
const { askReact } = require('./techs/react');
const { askReactNative } = require('./techs/react-native');
const { askVue } = require('./techs/vue');
const { askNest } = require('./techs/nest');
const { askNode } = require('./techs/node');
const { askTypeScript } = require('./techs/typescript');

// ─── Technology registry ──────────────────────────────────────────────────────
const TECHS = {
  angular: {
    label: '🅰️   Angular',
    supportsLib: true,
    generators: { app: '@nx/angular:app', lib: '@nx/angular:lib' },
    ask: askAngular,
    env: { NX_IGNORE_UNSUPPORTED_TS_SETUP: 'true' },
  },
  next: {
    label: '▲   Next.js',
    supportsLib: true,
    generators: { app: '@nx/next:app', lib: '@nx/next:lib' },
    ask: askNext,
  },
  react: {
    label: '⚛️   React',
    supportsLib: true,
    generators: { app: '@nx/react:app', lib: '@nx/react:lib' },
    ask: askReact,
  },
  'react-native': {
    label: '📱  React Native / Expo',
    supportsLib: false,
    generators: { app: '@nx/expo:app' },
    ask: () => askReactNative(),
  },
  vue: {
    label: '💚  Vue.js',
    supportsLib: true,
    generators: { app: '@nx/vue:app', lib: '@nx/vue:lib' },
    ask: askVue,
  },
  nest: {
    label: '🐈  NestJS',
    supportsLib: true,
    generators: { app: '@nx/nest:app', lib: '@nx/nest:lib' },
    ask: askNest,
  },
  node: {
    label: '🟩  Node.js',
    supportsLib: true,
    generators: { app: '@nx/node:app', lib: '@nx/js:lib' },
    ask: askNode,
  },
  typescript: {
    label: '📘  TypeScript',
    supportsLib: true,
    generators: { app: '@nx/node:app', lib: '@nx/js:lib' },
    ask: askTypeScript,
  },
};

function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  );
}

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// ─── Nx plugin installer ──────────────────────────────────────────────────────

// Which @nx/* package each tech needs (only the non-trivially-installed ones)
const TECH_PLUGINS = {
  angular: '@nx/angular',
  next: '@nx/next',
  react: '@nx/react',
  'react-native': '@nx/expo', // already installed but listed for completeness
  vue: '@nx/vue',
  nest: '@nx/nest',
  node: '@nx/node', // app only; lib uses @nx/js (already installed)
  typescript: '@nx/node',
};

function getNxVersion() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'node_modules/nx/package.json'), 'utf8'),
    ).version;
  } catch {
    return 'latest';
  }
}

async function ensureNxPlugin(tech, artifactType) {
  // node/typescript lib uses @nx/js which is already installed
  if ((tech === 'node' || tech === 'typescript') && artifactType === 'lib') return;

  const plugin = TECH_PLUGINS[tech];
  if (!plugin) return;

  const pluginPath = path.join(process.cwd(), 'node_modules', plugin);
  if (fs.existsSync(pluginPath)) return;

  const nxVersion = getNxVersion();
  const pkg = `${plugin}@${nxVersion}`;

  console.log('');
  console.log(chalk.bold.yellow(`📦  ${plugin} is not installed.`));
  console.log(chalk.dim(`    Required for @nx/${tech} generation.\n`));

  const { install } = await require('prompts')({
    type: 'confirm',
    name: 'install',
    message: chalk.bold(`Install ${pkg} now?`),
    initial: true,
  });

  if (!install) {
    console.log(chalk.red('\n❌  Cannot generate without the plugin. Exiting.'));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n🔧  Installing ${pkg}...\n`));
  try {
    execSync(`npm install --save-dev ${pkg} --legacy-peer-deps`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log(chalk.bold.green(`\n✅  ${plugin} installed successfully.\n`));
  } catch {
    console.log(
      chalk.bold.red(
        `\n❌  Installation failed. Run manually:\n    npm install --save-dev ${pkg} --legacy-peer-deps`,
      ),
    );
    process.exit(1);
  }
}

// ─── Git safety guard ─────────────────────────────────────────────────────────

function assertCleanWorkingTree() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status) {
      console.log('');
      console.log(chalk.bold.red('╔══════════════════════════════════════════════╗'));
      console.log(
        chalk.bold.red('║') +
          chalk.bold.white('   🚫  Uncommitted changes detected           ') +
          chalk.bold.red('║'),
      );
      console.log(chalk.bold.red('╚══════════════════════════════════════════════╝'));
      console.log('');
      console.log(chalk.yellow('  You have uncommitted changes in your working tree:'));
      console.log('');
      status.split('\n').forEach((line) => {
        console.log('  ' + chalk.dim(line));
      });
      console.log('');
      console.log(
        chalk.bold('  Please commit or stash your changes before generating a new project.'),
      );
      console.log(chalk.dim('  This ensures the git-based undo can work cleanly.'));
      console.log('');
      process.exit(1);
    }
  } catch {
    // Not a git repo or git not available — allow through
  }
}

// ─── Full interactive flow ────────────────────────────────────────────────────
// opts.nameDefault — pre-filled default for the name prompt (e.g. "test-")
async function runFlow(opts = {}) {
  assertCleanWorkingTree();
  // 1. Artifact type
  section('What do you want to generate?');
  const { artifactType } = await prompts(
    {
      type: 'select',
      name: 'artifactType',
      message: '📦  Artifact type',
      choices: [
        { title: '🖥️   Application (app)', value: 'app' },
        { title: '📚  Library (lib)', value: 'lib' },
      ],
      initial: 0,
    },
    { onCancel },
  );

  // 2. Technology
  section('Choose a technology');
  const techChoices = Object.entries(TECHS)
    .filter(([, meta]) => artifactType === 'app' || meta.supportsLib)
    .map(([key, meta]) => ({ title: meta.label, value: key }));

  const { tech } = await prompts(
    {
      type: 'select',
      name: 'tech',
      message: '🛠️   Technology',
      choices: techChoices,
      initial: 0,
    },
    { onCancel },
  );

  const techMeta = TECHS[tech];

  // Check & install the required @nx/* plugin if missing
  await ensureNxPlugin(tech, artifactType);

  // 3. Project name
  section('Project details');
  const { name } = await prompts(
    {
      type: 'text',
      name: 'name',
      message: '✏️   Project name (kebab-case)',
      initial: opts.nameDefault || '',
      validate: (v) =>
        /^[a-z][a-z0-9-]*$/.test(v) ? true : 'Use lowercase letters, numbers and dashes only',
    },
    { onCancel },
  );

  // 4. Shared library? (libs only)
  // --directory in Nx 22 is the FULL path (including the lib name)
  let directory;
  if (artifactType === 'lib') {
    const { shared } = await prompts(
      {
        type: 'confirm',
        name: 'shared',
        message: '🌍  Shared library? (goes to libs/shared, not libs/' + tech + ')',
        initial: false,
      },
      { onCancel },
    );
    directory = shared ? `libs/shared/${name}` : `libs/${tech}/${name}`;
  } else {
    directory = `apps/${name}`;
  }

  // 5. Tags (optional)
  const { tags } = await prompts(
    {
      type: 'text',
      name: 'tags',
      message: '🏷️   Tags (comma-separated, e.g. scope:shared,type:ui)',
      initial: '',
    },
    { onCancel },
  );

  // 6. Tech-specific flags
  const techFlags = await techMeta.ask(artifactType);

  // 7. Build command
  // Nx 22: name is --name flag (no positional args), --directory is parent folder
  const generator = techMeta.generators[artifactType];
  // Normalize tags: accept spaces or commas as separators, always output comma-joined
  const normalizedTags = tags
    ? tags
        .split(/[\s,]+/)
        .filter(Boolean)
        .join(',')
    : undefined;
  const allFlags = clean({ name, directory, tags: normalizedTags, ...techFlags });
  const flagsStr = buildFlagsString(allFlags);
  const cmd = `npx nx g ${generator} ${flagsStr}`;
  const extraEnv = techMeta.env || {};

  // 8. Summary box
  const summaryEntries = [
    ['Artifact', artifactType],
    ['Technology', tech],
    ['Name', name],
    ['Directory', directory],
    ...(normalizedTags ? [['Tags', normalizedTags]] : []),
    ...Object.entries(clean(techFlags)).map(([k, v]) => [k, String(v)]),
  ];
  summaryBox('Generation Summary', summaryEntries);

  return {
    cmd,
    extraEnv,
    meta: { artifactType, tech, name, directory, tags: normalizedTags, techFlags },
  };
}

module.exports = { runFlow, TECHS };
