import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNodeJsDefinitionsModule1774200006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'd4100000-0000-4000-8000-000000000001',
        label: 'NodeJS Definitions',
        description: 'Core Node.js vocabulary: what is Node.js, event loop phases, V8, libuv, non-blocking I/O, CommonJS vs ESM, npm, package.json, process object, Buffer, streams, EventEmitter, child_process, cluster, worker threads, fs, http, path, env vars, async patterns, error handling and global objects.',
        sortOrder: 10,
        category: 'NodeJs',
      },
    ];

    for (const m of modules) {
      await queryRunner.query(
        `INSERT INTO "qcm_module" ("id", "label", "description", "sortOrder", "category")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("id") DO NOTHING`,
        [m.id, m.label, m.description, m.sortOrder, m.category]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [['d4100000-0000-4000-8000-000000000001']]
    );
  }
}
