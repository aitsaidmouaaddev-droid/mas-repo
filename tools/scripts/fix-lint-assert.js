'use strict';
const fs = require('fs');
const path = require('path');
const srcDir = 'apps/js-fundamentals/src';

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (f.endsWith('.js') && f !== 'main.js') files.push(full);
  }
  return files;
}

const disableLine = '// eslint-disable-next-line @typescript-eslint/no-unused-vars';
let patched = 0;

for (const file of walk(srcDir)) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix: function assert(condition, msg) — only if not already guarded
  if (
    /^function assert\(condition, msg\)/m.test(src) &&
    !src.includes(disableLine + '\nfunction assert(')
  ) {
    src = src.replace(/^(function assert\(condition, msg\))/m, disableLine + '\n$1');
    changed = true;
  }

  // Fix: function assertDeepEq(a, b) — only if not already guarded
  if (
    /^function assertDeepEq\(a, b\)/m.test(src) &&
    !src.includes(disableLine + '\nfunction assertDeepEq(')
  ) {
    src = src.replace(/^(function assertDeepEq\(a, b\))/m, disableLine + '\n$1');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, src, 'utf8');
    patched++;
    console.log('patched:', file);
  }
}
console.log('\nTotal patched:', patched);
