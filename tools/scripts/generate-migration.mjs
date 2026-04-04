#!/usr/bin/env node
/**
 * Interactive migration generator.
 *
 * Usage:
 *   node generate-migration.mjs <Name> [folder]
 *   node generate-migration.mjs AddUserTable
 *   node generate-migration.mjs AddUserTable db/migrations
 *
 * Via Nx:
 *   npx nx run mas-videos-generator:db:generate --args="--name=AddUserTable"
 *   npx nx run mas-videos-generator:db:generate -- AddUserTable
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const toolsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(name, folder = 'migrations') {
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) {
    console.error(
      'Error: use only letters and digits, starting with a letter (e.g. AddUserTable).',
    );
    process.exit(1);
  }

  // TypeORM adds its own timestamp prefix — do NOT add one here or you get doubled timestamps
  const migrationPath = `${folder}/${name}`;
  const cmd = `node ${JSON.stringify(path.join(toolsDir, 'typeorm-cli.js'))} migration:generate ${migrationPath} -d datasource.ts`;

  console.log(`\nGenerating: ${migrationPath}<timestamp>.ts (timestamp added by TypeORM)`);
  console.log(`Running: ${cmd}\n`);

  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    process.exit(1);
  }
}

const nameArg = process.argv[2]?.trim();
const folderArg = process.argv[3]?.trim();

if (nameArg) {
  run(nameArg, folderArg);
} else {
  // Fallback: interactive prompt (only works outside Nx run-commands)
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Migration name (PascalCase, e.g. AddUserTable): ', (raw) => {
    rl.close();
    const name = raw.trim();
    if (!name) {
      console.error('Error: migration name cannot be empty.');
      process.exit(1);
    }
    run(name, folderArg);
  });
}
