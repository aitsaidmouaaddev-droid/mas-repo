/**
 * post-process.js — run after `nx g` to align generated projects with monorepo conventions.
 *
 * What this fixes when Jest is chosen:
 *   1. Converts jest.config.ts (ESM export default) → jest.config.js (CommonJS module.exports).
 *      Nx generates TypeScript jest configs that require ts-node to load; we use plain .js.
 *   2. Removes "type": "module" from the generated package.json.
 *      Nx sets this for ts/esm libs, but it conflicts with our CommonJS jest setup.
 *   3. Creates/updates project.json with our standard nx:run-commands test target.
 *      Nx's inferred target uses plain `jest` from the project dir — fails on CI due to
 *      relative binary resolution. We always run from the workspace root.
 *   4. Deletes .spec.swcrc — generated alongside @swc/jest transform, unused in our setup.
 *
 * What this does for every new app (regardless of test runner):
 *   5. Ensures package.json exists with a version field (required for CD version gate).
 *   6. Generates .github/workflows/{name}-ci.yml — per-app CI (lint + test + typecheck).
 *   7. Generates .github/workflows/{name}-cd.yml — per-app CD (version gate + deploy).
 *   8. Optionally adds the project to root Jest exclusions (supports multiple excludes).
 *
 * When Vitest is chosen: steps 1-4 are skipped; steps 5-7 still run for apps.
 * When unitTestRunner is "none": same as Vitest.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');

async function ask(message, initial = true) {
  const { yes } = await prompts({ type: 'confirm', name: 'yes', message, initial });
  return yes === true;
}

// ─── Jest config templates ─────────────────────────────────────────────────────

/**
 * Returns the jest transform block for the given tech.
 *
 * - react / vue / angular: babel-jest with the appropriate Nx preset (handles JSX/TSX).
 * - everything else (node, nest, plain ts): ts-jest in CommonJS mode.
 */
function buildTransform(tech) {
  if (tech === 'react' || tech === 'vue') {
    return `{
    '^.+\\\\.[jt]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  }`;
  }
  if (tech === 'angular') {
    return `{
    '^.+\\\\.[jt]s$': ['ts-jest', { diagnostics: false, tsconfig: { module: 'CommonJS', moduleResolution: 'node', skipLibCheck: true } }],
  }`;
  }
  // NestJS requires decorator metadata support
  if (tech === 'nest') {
    return `{
    '^.+\\\\.ts$': ['ts-jest', { diagnostics: false, tsconfig: { module: 'CommonJS', moduleResolution: 'node', strict: true, skipLibCheck: true, emitDecoratorMetadata: true, experimentalDecorators: true } }],
  }`;
  }
  // node, @nx/js — plain TypeScript, no JSX
  return `{
    '^.+\\\\.ts$': ['ts-jest', { diagnostics: false, tsconfig: { module: 'CommonJS', moduleResolution: 'node', strict: true, skipLibCheck: true } }],
  }`;
}

function buildTestEnvironment(tech) {
  // Browser-like environment for React/Vue/Angular apps and libs
  return tech === 'react' || tech === 'vue' || tech === 'angular' ? 'jsdom' : 'node';
}

function buildModuleFileExtensions(tech) {
  return tech === 'react' || tech === 'vue' || tech === 'angular'
    ? `['ts', 'tsx', 'js', 'jsx']`
    : `['ts', 'js']`;
}

function buildJestConfig({ name, tech, directory, rootDir }) {
  const transform = buildTransform(tech);
  const testEnvironment = buildTestEnvironment(tech);
  const moduleFileExtensions = buildModuleFileExtensions(tech);

  return `module.exports = {
  displayName: '${name}',
  testEnvironment: '${testEnvironment}',
  rootDir: '${rootDir}',
  roots: ['<rootDir>/${directory}'],
  moduleFileExtensions: ${moduleFileExtensions},
  // Nx generates ESM sources with explicit .js import extensions (e.g. import from './foo.js').
  // Strip the extension so Jest resolves to the .ts source file in CommonJS mode.
  moduleNameMapper: {
    '^(\\\\.{1,2}/.*)\\\\.js$': '$1',
  },
  transform: ${transform},
  coverageDirectory: '<rootDir>/coverage/${directory}',
};
`;
}

// ─── project.json test target template ───────────────────────────────────────

function buildTestTarget({ directory, tech }) {
  const srcGlobs =
    ['ts', 'tsx', 'js', 'jsx'].includes('tsx') && buildModuleFileExtensions(tech).includes('tsx')
      ? ['{projectRoot}/src/**/*.ts', '{projectRoot}/src/**/*.tsx']
      : ['{projectRoot}/src/**/*.ts'];

  // Use tsx inputs for React/Vue/Angular
  const hasTsx = tech === 'react' || tech === 'vue' || tech === 'angular';
  const inputs = hasTsx
    ? [
        '{projectRoot}/src/**/*.ts',
        '{projectRoot}/src/**/*.tsx',
        '{projectRoot}/jest.config.js',
        '{workspaceRoot}/tsconfig.base.json',
      ]
    : [
        '{projectRoot}/src/**/*.ts',
        '{projectRoot}/jest.config.js',
        '{workspaceRoot}/tsconfig.base.json',
      ];

  return {
    executor: 'nx:run-commands',
    options: {
      command: `node node_modules/jest-cli/bin/jest.js --config ${directory}/jest.config.js --runInBand`,
      cwd: '.',
    },
    cache: true,
    inputs,
  };
}

// ─── Compute rootDir relative path from project directory depth ───────────────

function computeRootDir(directory) {
  // 'libs/shared/foo' has depth 3 → '../../../'
  // 'apps/foo'        has depth 2 → '../../'
  const depth = directory.split('/').filter(Boolean).length;
  return '../'.repeat(depth);
}

// ─── Ensure project.json exists ───────────────────────────────────────────────

/**
 * Guarantees a project.json exists for the generated project.
 *
 * Some Nx generators (e.g. @nx/node:app when no test runner is chosen) skip
 * project.json entirely and embed targets inside package.json under an "nx"
 * key. This function detects that case, migrates the targets into a proper
 * project.json, and removes the "nx" block from package.json.
 *
 * When project.json already exists (e.g. Angular, React with jest) this is a
 * no-op so the jest post-processing step can safely read and extend it.
 */
function ensureProjectJson(projectDir, name, directory) {
  const projectJsonPath = path.join(projectDir, 'project.json');
  if (fs.existsSync(projectJsonPath)) return; // already there — nothing to do

  const rootPrefix = computeRootDir(directory);
  const proj = {
    $schema: `${rootPrefix}node_modules/nx/schemas/project-schema.json`,
    name,
    sourceRoot: `${directory}/src`,
    projectType: 'application',
    targets: {},
  };

  // Migrate nx.targets from package.json if the generator put them there
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (pkg.nx) {
      if (pkg.nx.name) proj.name = pkg.nx.name;
      if (pkg.nx.targets) proj.targets = pkg.nx.targets;
      delete pkg.nx;
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    }
  }

  fs.writeFileSync(projectJsonPath, JSON.stringify(proj, null, 2) + '\n', 'utf8');
  console.log(chalk.green('  ✓ project.json created (targets migrated from package.json)'));
}

// ─── CI / CD workflow templates ───────────────────────────────────────────────

/**
 * Per-app CI workflow.
 * Always includes workflow_call: so monorepo-cd.yml can call it as a reusable workflow.
 * Also triggers directly on push/PR when files in the app's directory change.
 */
function buildCiWorkflow({ name, directory, projectName }) {
  const nxProject = projectName || name;
  return `name: "CI — ${name}"

on:
  workflow_call: # Called by monorepo-cd.yml when this app is affected
  push:
    branches: [dev, main]
    paths:
      - '${directory}/**'
      - 'package.json'
      - 'package-lock.json'
      - 'tsconfig.base.json'
      - '.github/workflows/${name}-ci.yml'
  pull_request:
    branches: [dev, main]
    paths:
      - '${directory}/**'
      - 'package.json'
      - 'package-lock.json'
      - 'tsconfig.base.json'
      - '.github/workflows/${name}-ci.yml'

concurrency:
  group: ci-${name}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    name: Lint · Typecheck · Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Lint + Test + Typecheck
        run: npx nx run-many --projects=${nxProject} --target=lint,test,typecheck
`;
}

// ─── Ensure app has a versioned package.json ──────────────────────────────────

/**
 * Apps need a package.json with a version field for the CD version gate.
 * Creates one if missing; adds version "0.1.0" if the field is absent.
 */
function ensureVersionedPackageJson(projectDir, name) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify({ name, version: '0.1.0' }, null, 2) + '\n', 'utf8');
    return { created: true, projectName: name };
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg.version) {
    pkg.version = '0.1.0';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  }
  // Nx project name: prefer nx.name (explicit override), then pkg.name, then dir name
  const projectName = (pkg.nx && pkg.nx.name) || pkg.name || name;
  return { created: false, projectName };
}

// ─── README scaffold ──────────────────────────────────────────────────────────

const TECH_LABEL = {
  angular: 'Angular',
  next: 'Next.js',
  react: 'React',
  'react-native': 'React Native / Expo',
  vue: 'Vue.js',
  nest: 'NestJS',
  node: 'Node.js',
  typescript: 'TypeScript',
};

function buildAppReadme({ name, tech }) {
  const label = TECH_LABEL[tech] || tech;
  return `# ${name}

> ${label} application in the MAS monorepo.

TODO: describe what this app does.

---

## Stack

| Technology | Version |
| ---------- | ------- |
| ${label}   | —       |

---

## Commands

\`\`\`bash
# Lint
npx nx run ${name}:lint

# Typecheck
npx nx run ${name}:typecheck

# Test
npx nx run ${name}:test

# Build
npx nx run ${name}:build
\`\`\`

---

## Roadmap

- ⏳ TODO
`;
}

function buildLibReadme({ name, tech }) {
  const label = TECH_LABEL[tech] || tech;
  // Derive import path: libs/react-native/ui → @mas/rn-ui (best-effort kebab)
  const importPath = `@mas/${name}`;
  return `# ${name}

> ${label} library in the MAS monorepo.

TODO: describe what this library provides.

---

## Exports

| Symbol | Description |
| ------ | ----------- |
| —      | TODO        |

---

## Usage

\`\`\`ts
import { } from '${importPath}';
\`\`\`

---

## Testing

\`\`\`bash
npx nx run ${name}:test
\`\`\`
`;
}

function generateReadme({ artifactType, tech, name, directory }, projectDir) {
  const readmePath = path.join(projectDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    console.log(chalk.dim('  – README.md already exists, skipped'));
    return;
  }
  const content =
    artifactType === 'app'
      ? buildAppReadme({ name, tech, directory })
      : buildLibReadme({ name, tech, directory });
  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(chalk.green('  ✓ README.md created'));
}

// ─── Write workflow files + inject into monorepo-cd.yml ──────────────────────

/**
 * Returns the Nx project name for an app by reading its project.json or package.json.
 * Falls back to the generator name.
 */
function readNxProjectName(projectDir, name) {
  const projectJsonPath = path.join(projectDir, 'project.json');
  if (fs.existsSync(projectJsonPath)) {
    const p = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
    if (p.name) return p.name;
  }
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const p = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (p.nx && p.nx.name) return p.nx.name;
    if (p.name) return p.name;
  }
  return name;
}

/**
 * Injects a new app into monorepo-cd.yml using marker comments.
 *
 * Markers (must already exist in the file):
 *   # __INJECT_DETECT_OUTPUTS__  — add outputs line for the new app
 *   # __INJECT_DETECT_STEPS__    — add jq echo line for the new app
 *   # __INJECT_APP_JOBS__        — add CI + placeholder deploy jobs
 */
function injectIntoMonorepoCd({ name, directory, nxProjectName }) {
  const cdPath = path.join(process.cwd(), '.github', 'workflows', 'monorepo-cd.yml');
  if (!fs.existsSync(cdPath)) {
    console.log(chalk.yellow('  ⚠ monorepo-cd.yml not found — skipping injection'));
    return;
  }

  let content = fs.readFileSync(cdPath, 'utf8');

  // Sanitize key: strip @ and / from project name for use as output key
  const outputKey = name.replace(/[@/]/g, '-').replace(/^-+/, '');

  // Check if already registered
  if (content.includes(`${outputKey}:`) && content.includes(`ci-${name}:`)) {
    console.log(chalk.dim(`  – ${name} already registered in monorepo-cd.yml`));
    return;
  }

  // 1. Inject detect output
  const outputLine = `      ${outputKey}: \${{ steps.check.outputs.${outputKey} }}`;
  content = content.replace(
    '      # __INJECT_DETECT_OUTPUTS__',
    `${outputLine}\n      # __INJECT_DETECT_OUTPUTS__`,
  );

  // 2. Inject detect step jq echo
  const jqContains = nxProjectName !== name ? `["${nxProjectName}"]` : `["${nxProjectName}"]`;
  const stepLine = `          echo "${outputKey}=$(echo "$AFFECTED" | jq 'contains(${jqContains})')" >> $GITHUB_OUTPUT`;
  content = content.replace(
    '          # __INJECT_DETECT_STEPS__',
    `${stepLine}\n          # __INJECT_DETECT_STEPS__`,
  );

  // 3. Inject CI + deploy jobs
  const jobBlock = `
  # ─── ${name} ${'─'.repeat(Math.max(0, 76 - name.length))}
  ci-${name}:
    name: "CI — ${name}"
    needs: detect
    if: needs.detect.outputs.${outputKey} == 'true'
    uses: ./.github/workflows/${name}-ci.yml

  deploy-${name}:
    name: "Deploy — ${name}"
    needs: [detect, ci-${name}]
    if: needs.detect.outputs.${outputKey} == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy placeholder
        run: echo "TODO — add ${name} deploy steps"
`;
  content = content.replace('  # __INJECT_APP_JOBS__', `${jobBlock}\n  # __INJECT_APP_JOBS__`);

  fs.writeFileSync(cdPath, content, 'utf8');
  console.log(chalk.green(`  ✓ monorepo-cd.yml — ${name} registered (detect + CI + deploy)`));
}

function generateWorkflows({ name, tech, directory, projectName }) {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  fs.mkdirSync(workflowsDir, { recursive: true });

  const ciPath = path.join(workflowsDir, `${name}-ci.yml`);

  if (!fs.existsSync(ciPath)) {
    fs.writeFileSync(ciPath, buildCiWorkflow({ name, directory, projectName }), 'utf8');
    console.log(chalk.green(`  ✓ .github/workflows/${name}-ci.yml created`));
  } else {
    console.log(chalk.dim(`  – .github/workflows/${name}-ci.yml already exists, skipped`));
  }
}

async function generateWorkflowsWithPipelineRegistration({
  name,
  tech,
  directory,
  projectDir,
  projectName,
}) {
  generateWorkflows({ name, tech, directory, projectName });

  if (
    await ask(chalk.bold('🚀  Register this app in the monorepo CD pipeline? (monorepo-cd.yml)'))
  ) {
    const nxProjectName = readNxProjectName(projectDir, projectName || name);
    injectIntoMonorepoCd({ name, directory, nxProjectName });
  }
}

// ─── Root Jest exclusions ─────────────────────────────────────────────────────

function parseQuotedList(listText) {
  const out = [];
  const re = /['\"]([^'\"]+)['\"]/g;
  let m;
  while ((m = re.exec(listText)) !== null) out.push(m[1]);
  return out;
}

function buildRootJestConfigTs(excludes) {
  const unique = Array.from(new Set(excludes)).sort();
  const excludeLines = unique.length
    ? unique.map((x) => `  '${x}',`).join('\n')
    : "  // 'ts-fundamentals',";

  return `import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

const STATIC_EXCLUDES = [
${excludeLines}
];

function parseEnvList(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectToText(project: unknown): string {
  if (typeof project === 'string') return project;
  if (project && typeof project === 'object') {
    const p = project as { displayName?: string; rootDir?: string };
    return [p.displayName, p.rootDir].filter(Boolean).join(' ');
  }
  return '';
}

export default async (): Promise<Config> => {
  const projects = await getJestProjectsAsync();
  const envExcludes = parseEnvList(process.env.JEST_EXCLUDE_PROJECTS);
  const allExcludes = new Set([...STATIC_EXCLUDES, ...envExcludes]);

  return {
    projects: projects.filter((project) => {
      const text = projectToText(project);
      return ![...allExcludes].some((name) => text.includes(name));
    }),
  };
};
`;
}

function upsertRootJestExclude(projectName) {
  const rootJestPath = path.join(process.cwd(), 'jest.config.ts');

  let existingExcludes = [];
  let hasManagedFormat = false;

  if (fs.existsSync(rootJestPath)) {
    const current = fs.readFileSync(rootJestPath, 'utf8');
    const match = current.match(/const\s+STATIC_EXCLUDES\s*=\s*\[([\s\S]*?)\];/);
    if (match) {
      existingExcludes = parseQuotedList(match[1]);
      hasManagedFormat = true;
    }
  }
  const pureProjectName = projectName.replace('@mas-repo/', '');

  if (!existingExcludes.includes(pureProjectName)) existingExcludes.push(pureProjectName);

  const next = buildRootJestConfigTs(existingExcludes);
  fs.writeFileSync(rootJestPath, next, 'utf8');

  if (hasManagedFormat) {
    console.log(chalk.green(`  ✓ root jest exclusions updated (added: ${pureProjectName})`));
  } else {
    console.log(chalk.green('  ✓ root jest.config.ts upgraded for multi-project exclusions'));
    console.log(
      chalk.dim('    Use JEST_EXCLUDE_PROJECTS for temporary excludes (comma-separated).'),
    );
  }
}

// ─── tsconfig.base.json path registration ────────────────────────────────────

/**
 * Derives the default `@mas/...` import alias from the project directory.
 *
 * Conventions that match the existing tsconfig.base.json entries:
 *   libs/shared/*        → @mas/shared/*   (e.g. @mas/shared/qcm)
 *   libs/react-native/*  → @mas/rn/*       (e.g. @mas/rn/ui)
 *   libs/react/*         → @mas/react-*    (e.g. @mas/react-ui)
 *   libs/<other>/*       → @mas/*          (e.g. @mas/db-contracts)
 */
function deriveAlias(directory) {
  const parts = directory.replace(/\\/g, '/').split('/').filter(Boolean);
  // parts: ['libs', category, ...names]
  if (parts.length < 3) return `@mas/${parts[parts.length - 1]}`;

  const category = parts[1];
  const rest = parts.slice(2).join('/');

  switch (category) {
    case 'shared':
      return `@mas/shared/${rest}`;
    case 'react-native':
      return `@mas/rn/${rest}`;
    case 'react':
      return `@mas/react-${rest.replace(/\//g, '-')}`;
    default:
      return `@mas/${rest}`;
  }
}

/**
 * Registers the library's barrel entry point in `tsconfig.base.json` paths.
 *
 * Prompts the user to confirm or override the derived alias, then writes
 * the path entry.  Re-running is a no-op if the alias already exists.
 *
 * @param {string} directory - Project directory (e.g. `libs/nest/db-contracts`).
 */
async function upsertTsConfigBasePath(directory) {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.base.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log(chalk.yellow('  ⚠ tsconfig.base.json not found — skipping'));
    return;
  }

  const indexTs = path.join(process.cwd(), directory, 'src', 'index.ts');
  if (!fs.existsSync(indexTs)) {
    console.log(chalk.dim('  – no src/index.ts found, skipping tsconfig.base.json path'));
    return;
  }

  const defaultAlias = deriveAlias(directory);

  const { alias } = await prompts({
    type: 'text',
    name: 'alias',
    message: chalk.bold(`📌  Import alias for tsconfig.base.json paths`),
    initial: defaultAlias,
    validate: (v) => (v.startsWith('@') ? true : 'Alias must start with @'),
  });

  if (!alias) return;

  const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (!config.compilerOptions) config.compilerOptions = {};
  if (!config.compilerOptions.paths) config.compilerOptions.paths = {};

  if (config.compilerOptions.paths[alias]) {
    console.log(chalk.dim(`  – tsconfig.base.json already has path for ${alias}`));
    return;
  }

  config.compilerOptions.paths[alias] = [`${directory}/src/index.ts`];
  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(
    chalk.green(`  ✓ tsconfig.base.json — added path: ${alias} → ${directory}/src/index.ts`),
  );
}

// ─── TypeDoc helpers ──────────────────────────────────────────────────────────

function upsertTypedocEntryPoint(directory) {
  const typedocPath = path.join(process.cwd(), 'typedoc.json');
  if (!fs.existsSync(typedocPath)) {
    console.log(chalk.yellow('  ⚠ typedoc.json not found — skipping'));
    return;
  }
  const config = JSON.parse(fs.readFileSync(typedocPath, 'utf8'));
  if (!config.entryPoints) config.entryPoints = [];

  // Use directory/src if it exists, otherwise directory itself
  const srcDir = path.join(process.cwd(), directory, 'src');
  const entryPoint = fs.existsSync(srcDir) ? `${directory}/src` : directory;

  if (config.entryPoints.includes(entryPoint)) {
    console.log(chalk.dim(`  – typedoc.json already contains ${entryPoint}`));
    return;
  }
  config.entryPoints.push(entryPoint);
  fs.writeFileSync(typedocPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(chalk.green(`  ✓ typedoc.json — added entryPoint: ${entryPoint}`));
}

function upsertTypedocTsconfig(directory, artifactType) {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.typedoc.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log(chalk.yellow('  ⚠ tsconfig.typedoc.json not found — skipping'));
    return;
  }
  const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (!config.include) config.include = [];

  const srcDir = path.join(process.cwd(), directory, 'src');
  const base = fs.existsSync(srcDir) ? `${directory}/src` : directory;

  const globs = [`${base}/**/*.ts`, `${base}/**/*.tsx`, `${base}/**/*.js`, `${base}/**/*.mjs`];

  let added = 0;
  for (const g of globs) {
    if (!config.include.includes(g)) {
      config.include.push(g);
      added++;
    }
  }

  // For libs, add a path alias if an index.ts barrel exists
  if (artifactType === 'lib') {
    const indexTs = path.join(process.cwd(), directory, 'src', 'index.ts');
    if (fs.existsSync(indexTs)) {
      if (!config.compilerOptions) config.compilerOptions = {};
      if (!config.compilerOptions.paths) config.compilerOptions.paths = {};
      // Derive alias from directory: libs/shared/qcm → @mas/qcm, libs/react-native/ui → @mas/rn/ui
      const parts = directory.replace(/\\/g, '/').split('/');
      // parts: ['libs', 'shared'|'react-native', name] or ['libs', category, name]
      let alias;
      if (parts[1] === 'shared') {
        alias = `@mas/${parts.slice(2).join('/')}`;
      } else if (parts[1] === 'react-native') {
        alias = `@mas/rn/${parts.slice(2).join('/')}`;
      } else {
        alias = `@mas/${parts.slice(1).join('/')}`;
      }
      if (!config.compilerOptions.paths[alias]) {
        config.compilerOptions.paths[alias] = [`${directory}/src/index.ts`];
        console.log(chalk.green(`  ✓ tsconfig.typedoc.json — added path alias: ${alias}`));
      }
    }
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  if (added > 0) {
    console.log(
      chalk.green(`  ✓ tsconfig.typedoc.json — added ${added} include globs for ${base}`),
    );
  } else {
    console.log(chalk.dim(`  – tsconfig.typedoc.json already has includes for ${base}`));
  }
}

// ─── Main post-processor ──────────────────────────────────────────────────────

async function postProcess({ artifactType, tech, name, directory, techFlags }) {
  const unitTestRunner = techFlags && techFlags.unitTestRunner;

  console.log('\n' + chalk.bold.cyan('▸ Post-processing — answer each step:'));
  console.log(chalk.dim('─'.repeat(50)));

  const projectDir = path.join(process.cwd(), directory);

  // ── Step 1: project.json ──────────────────────────────────────────────────
  if (
    await ask(chalk.bold('📄  Ensure project.json? (migrate targets from package.json if needed)'))
  ) {
    ensureProjectJson(projectDir, name, directory);
  }

  // ── Step 2: README ────────────────────────────────────────────────────────
  if (await ask(chalk.bold('📖  Generate README.md scaffold?'))) {
    generateReadme({ artifactType, tech, name, directory }, projectDir);
  }

  // ── Step 3: Jest fixes (only offered when unit test runner is jest) ────────
  if (unitTestRunner === 'jest') {
    if (
      await ask(
        chalk.bold(
          '🧪  Fix Jest config? (jest.config.ts→js, clean package.json, update test target, remove .spec.swcrc)',
        ),
      )
    ) {
      const rootDir = computeRootDir(directory);

      const jestConfigTs = path.join(projectDir, 'jest.config.ts');
      const jestConfigJs = path.join(projectDir, 'jest.config.js');
      if (fs.existsSync(jestConfigTs)) {
        const content = buildJestConfig({ name, tech, directory, rootDir });
        fs.writeFileSync(jestConfigJs, content, 'utf8');
        fs.unlinkSync(jestConfigTs);
        console.log(chalk.green('  ✓ jest.config.ts → jest.config.js'));
      } else if (!fs.existsSync(jestConfigJs)) {
        const content = buildJestConfig({ name, tech, directory, rootDir });
        fs.writeFileSync(jestConfigJs, content, 'utf8');
        console.log(chalk.green('  ✓ jest.config.js created'));
      }

      const packageJsonPath = path.join(projectDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.type === 'module') {
          delete pkg.type;
          fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
          console.log(chalk.green('  ✓ Removed "type": "module" from package.json'));
        }
      }

      const projectJsonPath = path.join(projectDir, 'project.json');
      let proj = {};
      if (fs.existsSync(projectJsonPath)) {
        proj = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
      }
      if (!proj.targets) proj.targets = {};
      proj.targets.test = buildTestTarget({ directory, tech });
      fs.writeFileSync(projectJsonPath, JSON.stringify(proj, null, 2) + '\n', 'utf8');
      console.log(chalk.green('  ✓ project.json — test target updated'));

      const swcrc = path.join(projectDir, '.spec.swcrc');
      if (fs.existsSync(swcrc)) {
        fs.unlinkSync(swcrc);
        console.log(chalk.green('  ✓ .spec.swcrc removed'));
      }
    }
  }

  // ── Step 4: tsconfig.base.json path (libs only) ───────────────────────────
  if (artifactType === 'lib') {
    if (
      await ask(
        chalk.bold('📌  Register import alias in tsconfig.base.json? (needed for @mas/* imports)'),
      )
    ) {
      await upsertTsConfigBasePath(directory);
    }
  }

  // ── Step 5: TypeDoc (offered for all project types) ────────────────────────
  if (
    await ask(chalk.bold('📚  Add this project to TypeDoc? (typedoc.json + tsconfig.typedoc.json)'))
  ) {
    upsertTypedocEntryPoint(directory);
    upsertTypedocTsconfig(directory, artifactType);
  }

  // ── Steps 6-8: app-only ───────────────────────────────────────────────────
  if (artifactType === 'app') {
    let projectName = name;

    if (
      await ask(chalk.bold('📦  Add version field to package.json? (required for CD version gate)'))
    ) {
      const result = ensureVersionedPackageJson(projectDir, name);
      projectName = result.projectName;
      console.log(chalk.green('  ✓ package.json has version field'));
    }

    if (await ask(chalk.bold('🚀  Generate CI workflow + register in monorepo CD pipeline?'))) {
      await generateWorkflowsWithPipelineRegistration({
        name,
        tech,
        directory,
        projectDir,
        projectName,
      });
    }

    if (
      await ask(
        chalk.bold(
          '🧷  Add this app to root Jest exclude list? (supports multiple projects + JEST_EXCLUDE_PROJECTS env)',
        ),
        false,
      )
    ) {
      upsertRootJestExclude(projectName);
    }
  }

  console.log(chalk.bold.green('\n  Done.'));
}

module.exports = { postProcess };
