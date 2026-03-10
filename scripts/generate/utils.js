const chalk = require('chalk');
const { execSync } = require('child_process');
const prompts = require('prompts');

// ─── Colours ────────────────────────────────────────────────────────────────
const c = {
  title:     chalk.bold.cyan,
  success:   chalk.bold.green,
  error:     chalk.bold.red,
  warn:      chalk.bold.yellow,
  info:      chalk.bold.blue,
  dim:       chalk.dim,
  highlight: chalk.bold.white,
  cmd:       chalk.bold.magenta,
  accent:    chalk.bold.cyan,
};

// ─── On cancel ──────────────────────────────────────────────────────────────
const onCancel = () => {
  console.log(chalk.yellow('\n⚠️  Cancelled.'));
  process.exit(0);
};

// ─── Banner ──────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(chalk.bold.cyan('╔══════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('   🏗️   MAS Monorepo — Project Generator      ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════════╝'));
  console.log('');
}

// ─── Section header ──────────────────────────────────────────────────────────
function section(title) {
  console.log('\n' + chalk.bold.cyan(`▸ ${title}`));
  console.log(chalk.dim('─'.repeat(50)));
}

// ─── Summary box ─────────────────────────────────────────────────────────────
function summaryBox(label, entries) {
  const width = 52;
  const line  = '─'.repeat(width);
  console.log('\n' + chalk.bold.cyan(`┌${line}┐`));
  console.log(chalk.bold.cyan('│') + chalk.bold.white(` 📋  ${label}`.padEnd(width)) + chalk.bold.cyan('│'));
  console.log(chalk.bold.cyan(`├${line}┤`));
  for (const [key, val] of entries) {
    const row = ` ${chalk.dim(key.padEnd(22))} ${chalk.bold.white(String(val))}`;
    // strip ansi for length calculation
    const rawLen = key.padEnd(22).length + String(val).length + 3;
    const pad = ' '.repeat(Math.max(0, width - rawLen));
    console.log(chalk.bold.cyan('│') + row + pad + chalk.bold.cyan('│'));
  }
  console.log(chalk.bold.cyan(`└${line}┘`));
}

// ─── Log helpers ─────────────────────────────────────────────────────────────
function success(msg) { console.log(chalk.bold.green(`\n✅  ${msg}`)); }
function error(msg)   { console.log(chalk.bold.red(`\n❌  ${msg}`)); process.exit(1); }
function info(msg)    { console.log(chalk.bold.blue(`ℹ️   ${msg}`)); }
function warn(msg)    { console.log(chalk.bold.yellow(`⚠️   ${msg}`)); }

// ─── Show command ─────────────────────────────────────────────────────────────
function showCommand(cmd) {
  console.log('\n' + chalk.bold.yellow('📋  Command to run:'));
  console.log('\n   ' + chalk.bold.magenta(cmd) + '\n');
}

// ─── Case helpers ─────────────────────────────────────────────────────────────
function toPascalCase(str) {
  return str
    .replace(/[_\s]+/g, '-')
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

// ─── Build nx flags string ────────────────────────────────────────────────────
function buildFlagsString(flags) {
  return Object.entries(flags)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => {
      if (typeof v === 'boolean') return v ? `--${k}` : `--no-${k}`;
      return `--${k}=${v}`;
    })
    .join(' ');
}

// ─── Run command ──────────────────────────────────────────────────────────────
async function runCommand(cmd, extraEnv = {}) {
  showCommand(cmd);

  const { confirm } = await prompts({
    type:    'confirm',
    name:    'confirm',
    message: chalk.bold('Run this command?'),
    initial: true,
  }, { onCancel });

  if (!confirm) { info('Cancelled.'); process.exit(0); }

  console.log('\n' + chalk.bold.cyan('🚀  Running nx generate...\n'));
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd(), env: { ...process.env, ...extraEnv } });
    success('Generation complete!');
  } catch {
    error('Command failed. See output above.');
  }
}

module.exports = {
  c, onCancel, banner, section, summaryBox,
  success, error, info, warn, showCommand,
  toPascalCase, toKebabCase, buildFlagsString, runCommand,
};
