#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseQuotedList(listText) {
  const out = [];
  const re = /['\"]([^'\"]+)['\"]/g;
  let m;
  while ((m = re.exec(listText)) !== null) out.push(m[1]);
  return out;
}

function readStaticExcludesFromRootJest() {
  const jestPath = path.join(process.cwd(), 'jest.config.ts');
  if (!fs.existsSync(jestPath)) return [];

  const content = fs.readFileSync(jestPath, 'utf8');
  const match = content.match(/const\s+STATIC_EXCLUDES\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return [];

  return parseQuotedList(match[1]);
}

function resolveExcludes() {
  const staticExcludes = readStaticExcludesFromRootJest();
  const envExcludes = parseCsv(process.env.JEST_EXCLUDE_PROJECTS);
  return Array.from(new Set([...staticExcludes, ...envExcludes]));
}

module.exports = { resolveExcludes };
