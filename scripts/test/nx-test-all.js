#!/usr/bin/env node

'use strict';

const { spawnSync } = require('child_process');
const { resolveExcludes } = require('./resolve-excludes');

const excludes = resolveExcludes();
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
