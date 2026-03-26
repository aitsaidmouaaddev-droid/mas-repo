/**
 * TypeORM CLI runner with ts-node + tsconfig-paths support.
 *
 * Reads `tsconfig.migrations.json` from the current working directory,
 * so it works for any app in the monorepo.
 *
 * Usage (from an app's package.json scripts):
 *   node ../../tools/typeorm-cli.js migration:generate -d datasource.ts migrations/MyMigration
 *   node ../../tools/typeorm-cli.js migration:run      -d datasource.ts
 *   node ../../tools/typeorm-cli.js migration:revert   -d datasource.ts
 *   node ../../tools/typeorm-cli.js migration:show     -d datasource.ts
 */
const path = require('path');

const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.migrations.json');
const tsconfig = require(tsconfigPath);

require('ts-node').register({
  project: tsconfigPath,
  transpileOnly: false,
});

require('tsconfig-paths').register({
  baseUrl: process.cwd(),
  paths: tsconfig.compilerOptions.paths,
});

require('typeorm/cli');
