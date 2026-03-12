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
 *
 * When Vitest is chosen: steps 1-4 are skipped; steps 5-7 still run for apps.
 * When unitTestRunner is "none": same as Vitest.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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

// ─── CI / CD workflow templates ───────────────────────────────────────────────

/**
 * Per-app CI workflow.
 * Triggers on direct changes to the app's directory.
 * For transitive changes (a lib this app depends on changed), the global ci.yml handles it.
 */
function buildCiWorkflow({ name, directory, projectName }) {
  const nxProject = projectName || name;
  return `# ─────────────────────────────────────────────────────────────────────────────
# Per-app CI for ${name}.
#
# Triggers when files in ${directory}/ change directly.
# For transitive changes (a shared lib this app depends on changed),
# the global ci.yml handles it via nx affected.
# ─────────────────────────────────────────────────────────────────────────────

name: ${name} CI

on:
  push:
    branches: [dev, main]
    paths:
      - '${directory}/**'
      - 'package.json'
      - 'package-lock.json'
      - 'tsconfig.base.json'
  pull_request:
    branches: [dev, main]
    paths:
      - '${directory}/**'
      - 'package.json'
      - 'package-lock.json'
      - 'tsconfig.base.json'

jobs:
  check:
    name: Lint + Test + Typecheck
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Lint + Test + Typecheck
        run: npx nx run-many --projects=${nxProject} --target=lint,test,typecheck
`;
}

/**
 * Returns the tech-specific deploy step(s) for the CD workflow.
 */
function buildCdDeploySteps(tech, name, directory) {
  if (tech === 'react-native') {
    return `
      # ── EAS Build (React Native / Expo) ──────────────────────────────────────────
      # Requires: EXPO_TOKEN secret in GitHub repository settings.
      # Requires: eas.json inside ${directory}/ with a "production" profile.
      - name: Install EAS CLI
        if: steps.version_check.outputs.is_new_release == 'true'
        run: npm install -g eas-cli

      - name: EAS Build (Android)
        if: steps.version_check.outputs.is_new_release == 'true'
        working-directory: ${directory}
        env:
          EXPO_TOKEN: \${{ secrets.EXPO_TOKEN }}
        run: eas build --platform android --profile production --non-interactive`;
  }

  if (tech === 'react' || tech === 'vue' || tech === 'angular') {
    return `
      # ── Web Build & Deploy ────────────────────────────────────────────────────────
      # TODO: replace the Deploy step with your actual deploy command.
      # Examples: Vercel CLI, Netlify CLI, aws s3 sync, gh-pages, etc.
      - name: Build
        if: steps.version_check.outputs.is_new_release == 'true'
        run: npx nx run ${name}:build

      - name: Deploy
        if: steps.version_check.outputs.is_new_release == 'true'
        run: echo "TODO: add your deploy command here (Vercel, Netlify, S3, etc.)"`;
  }

  // nest, node — server / container deploy
  return `
      # ── Server Deploy ─────────────────────────────────────────────────────────────
      # TODO: replace the Deploy step with your actual deploy command.
      # Examples: docker build + push, Cloud Run deploy, SSH rsync, etc.
      - name: Build
        if: steps.version_check.outputs.is_new_release == 'true'
        run: npx nx run ${name}:build

      - name: Deploy
        if: steps.version_check.outputs.is_new_release == 'true'
        run: 'echo "TODO: add your deploy command here (Docker, Kubernetes, Cloud Run, etc.)"'`;
}

/**
 * Per-app CD workflow.
 * Fires on PR merged to main, gates on version tag, then deploys.
 */
function buildCdWorkflow({ name, tech, directory }) {
  const deploySteps = buildCdDeploySteps(tech, name, directory);
  return `# ─────────────────────────────────────────────────────────────────────────────
# App-level CD for ${name}.
#
# Trigger:
#   Fires when a PR from dev → main is MERGED.
#
# Version control:
#   Handled locally by the Husky pre-push hook before pushing to dev.
#   The hook asks: patch | minor | major | skip, bumps package.json,
#   commits it to the branch, and creates a local git tag.
#   This workflow does NOT touch versioning — it reads what's already there.
#
# Release gate:
#   Checks whether the current version in ${directory}/package.json already
#   has a remote tag (${name}/vX.Y.Z). If yes → already deployed, skip.
#   If no → new version, proceed with deploy and push the tag.
#   Merging without a version bump is a no-op.
# ─────────────────────────────────────────────────────────────────────────────

name: ${name} CD

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    name: Release
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout main
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Check if version is already released
        id: version_check
        run: |
          VERSION=\$(node -p "require('./${directory}/package.json').version")
          TAG="${name}/v\$VERSION"
          echo "VERSION=\$VERSION" >> \$GITHUB_ENV
          echo "TAG=\$TAG" >> \$GITHUB_ENV
          if git ls-remote --tags origin "\$TAG" | grep -q "\$TAG"; then
            echo "is_new_release=false" >> \$GITHUB_OUTPUT
            echo "Tag \$TAG already exists — nothing to deploy."
          else
            echo "is_new_release=true" >> \$GITHUB_OUTPUT
            echo "New version \$VERSION detected — proceeding with release."
          fi

      - name: Push release tag
        if: steps.version_check.outputs.is_new_release == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag "\$TAG"
          git push origin "\$TAG"
${deploySteps}
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

// ─── Write workflow files ─────────────────────────────────────────────────────

function generateWorkflows({ name, tech, directory, projectName }) {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  fs.mkdirSync(workflowsDir, { recursive: true });

  const ciPath = path.join(workflowsDir, `${name}-ci.yml`);
  const cdPath = path.join(workflowsDir, `${name}-cd.yml`);

  if (!fs.existsSync(ciPath)) {
    fs.writeFileSync(ciPath, buildCiWorkflow({ name, directory, projectName }), 'utf8');
    console.log(chalk.green(`  ✓ .github/workflows/${name}-ci.yml created`));
  } else {
    console.log(chalk.dim(`  – .github/workflows/${name}-ci.yml already exists, skipped`));
  }

  if (!fs.existsSync(cdPath)) {
    fs.writeFileSync(cdPath, buildCdWorkflow({ name, tech, directory }), 'utf8');
    console.log(chalk.green(`  ✓ .github/workflows/${name}-cd.yml created`));
  } else {
    console.log(chalk.dim(`  – .github/workflows/${name}-cd.yml already exists, skipped`));
  }
}

// ─── Main post-processor ──────────────────────────────────────────────────────

function postProcess({ artifactType, tech, name, directory, techFlags }) {
  const unitTestRunner = techFlags && techFlags.unitTestRunner;

  console.log('\n' + chalk.bold.cyan('▸ Post-processing generated project'));
  console.log(chalk.dim('─'.repeat(50)));

  const projectDir = path.join(process.cwd(), directory);

  // ── Jest-specific fixes (steps 1-4) ──────────────────────────────────────
  if (unitTestRunner === 'jest') {
    const rootDir = computeRootDir(directory);

    // 1. Convert jest.config.ts → jest.config.js
    const jestConfigTs = path.join(projectDir, 'jest.config.ts');
    const jestConfigJs = path.join(projectDir, 'jest.config.js');

    if (fs.existsSync(jestConfigTs)) {
      const content = buildJestConfig({ name, tech, directory, rootDir });
      fs.writeFileSync(jestConfigJs, content, 'utf8');
      fs.unlinkSync(jestConfigTs);
      console.log(chalk.green('  ✓ jest.config.ts → jest.config.js (CommonJS, workspace rootDir)'));
    } else if (!fs.existsSync(jestConfigJs)) {
      const content = buildJestConfig({ name, tech, directory, rootDir });
      fs.writeFileSync(jestConfigJs, content, 'utf8');
      console.log(chalk.green('  ✓ jest.config.js created'));
    }

    // 2. Remove "type": "module" from package.json
    const packageJsonPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.type === 'module') {
        delete pkg.type;
        fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        console.log(chalk.green('  ✓ Removed "type": "module" from package.json'));
      }
    }

    // 3. Create/update project.json with standard test target
    const projectJsonPath = path.join(projectDir, 'project.json');
    let proj = {};
    if (fs.existsSync(projectJsonPath)) {
      proj = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
    }
    if (!proj.targets) proj.targets = {};
    proj.targets.test = buildTestTarget({ directory, tech });
    fs.writeFileSync(projectJsonPath, JSON.stringify(proj, null, 2) + '\n', 'utf8');
    console.log(
      chalk.green('  ✓ project.json — test target set to nx:run-commands (workspace root)'),
    );

    // 4. Delete .spec.swcrc
    const swcrc = path.join(projectDir, '.spec.swcrc');
    if (fs.existsSync(swcrc)) {
      fs.unlinkSync(swcrc);
      console.log(chalk.green('  ✓ .spec.swcrc removed (not used in our jest setup)'));
    }
  }

  // ── App-only: CI + CD workflows (steps 5-7) ───────────────────────────────
  if (artifactType === 'app') {
    // 5. Ensure versioned package.json exists (required for CD version gate)
    const { projectName } = ensureVersionedPackageJson(projectDir, name);
    console.log(chalk.green('  ✓ package.json has version field (CD gate ready)'));

    // 6 & 7. Generate CI and CD workflow files
    generateWorkflows({ name, tech, directory, projectName });
  }

  if (unitTestRunner === 'jest') {
    console.log(chalk.bold.green('\n  Project ready. Run: npx nx run ' + name + ':test'));
  } else {
    console.log(chalk.bold.green('\n  Project ready.'));
  }
}

module.exports = { postProcess };
