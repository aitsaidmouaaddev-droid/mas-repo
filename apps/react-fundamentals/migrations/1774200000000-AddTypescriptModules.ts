import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypescriptModules1774200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: '07000000-0000-4000-8000-000000000001',
        label: 'TypeScript Definitions',
        description: 'Core TypeScript vocabulary: what is TypeScript, type aliases, interfaces, unions, intersections, generics, tuples, enums, utility types, type guards, never, unknown, mapped types, conditional types and discriminated unions.',
        sortOrder: 0,
        category: 'TypeScript',
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
      [['07000000-0000-4000-8000-000000000001']]
    );
  }
}
