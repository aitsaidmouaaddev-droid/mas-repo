#!/usr/bin/env node
/**
 * test.js — same interactive flow as index.js, with a surgical git-undo step at the end.
 * Usage: npm run generate:test
 */

const { execSync, spawnSync } = require('child_process');
const prompts = require('prompts');
const chalk = require('chalk');

const { banner, section, onCancel, success, info, warn } = require('./utils');
const { runFlow } = require('./flow');
const { postProcess } = require('./post-process');

// ─── Undo ─────────────────────────────────────────────────────────────────────

async function offerUndo() {
  const { undo } = await prompts(
    {
      type: 'confirm',
      name: 'undo',
      message: chalk.bold('↩️   Undo this generation? (full git reset of working tree)'),
      initial: false,
    },
    { onCancel },
  );

  if (!undo) {
    info('Keeping generated files.');
    return;
  }

  section('Undoing generation');
  try {
    execSync('git clean -fd', { stdio: 'inherit', cwd: process.cwd() });
    execSync('git checkout -- .', { stdio: 'inherit', cwd: process.cwd() });
    success('Undo complete. Working tree fully restored.');
  } catch {
    warn('Could not fully undo — restore manually with: git clean -fd && git checkout -- .');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  banner();

  // Full interactive flow (same as npm run generate), name pre-filled with "test-"
  const { cmd, extraEnv, meta } = await runFlow({ nameDefault: 'test-' });

  // Show command & confirm
  console.log('\n' + chalk.bold.yellow('📋  Command to run:'));
  console.log('\n   ' + chalk.bold.magenta(cmd) + '\n');

  const { go } = await prompts(
    {
      type: 'confirm',
      name: 'go',
      message: chalk.bold('Run this command?'),
      initial: true,
    },
    { onCancel },
  );

  if (!go) {
    info('Cancelled.');
    return;
  }

  console.log('\n' + chalk.bold.cyan('🚀  Running...\n'));
  const result = spawnSync(cmd, {
    shell: true,
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, ...extraEnv },
  });

  if (result.status !== 0) {
    console.log(chalk.bold.red('\n❌  Command failed. See output above.'));
    return;
  }

  success('Generation complete!');
  await postProcess(meta);
  await offerUndo();
}

main().catch((e) => {
  console.error(chalk.red('\n💥  Unexpected error:'), e);
  process.exit(1);
});
