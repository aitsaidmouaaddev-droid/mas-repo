#!/usr/bin/env node

'use strict';

const { spawnSync } = require('child_process');

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const excludes = parseCsv(process.env.JEST_EXCLUDE_PROJECTS);
const args = ['nx', 'run-many', '--target=test', '--all'];

if (excludes.length) {
  args.push(`--exclude=${excludes.join(',')}`);
}

const result = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  // Keep the message concise but actionable.
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status == null ? 1 : result.status);
