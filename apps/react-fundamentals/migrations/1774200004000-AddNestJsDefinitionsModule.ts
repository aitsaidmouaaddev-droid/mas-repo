import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNestJsDefinitionsModule1774200004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'e5100000-0000-4000-8000-000000000001',
        label: 'NestJS Definitions',
        description: 'Core NestJS vocabulary: modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices and WebSockets.',
        sortOrder: 10,
        category: 'NestJs',
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
      [['e5100000-0000-4000-8000-000000000001']]
    );
  }
}
