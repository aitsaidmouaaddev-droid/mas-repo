#!/usr/bin/env node

'use strict';

const { spawnSync } = require('child_process');
const { resolveExcludes } = require('./resolve-excludes');

const targets = process.argv[2] || 'test';
const base = process.argv[3] || 'origin/dev';
const head = process.argv[4] || '';

const excludes = resolveExcludes();
const args = ['nx', 'affected', `--target=${targets}`, `--base=${base}`];

if (head) args.push(`--head=${head}`);
if (excludes.length) args.push(`--exclude=${excludes.join(',')}`);

const result = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status == null ? 1 : result.status);
