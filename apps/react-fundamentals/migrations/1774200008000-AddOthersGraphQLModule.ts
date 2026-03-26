import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOthersGraphQLModule1774200008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: '08100000-0000-4000-8000-000000000001',
        label: 'GraphQL Definitions',
        description: 'Core GraphQL vocabulary: what is GraphQL, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, code-first vs schema-first, Apollo Server/Client, authentication, pagination, Federation and schema stitching.',
        sortOrder: 0,
        category: 'Others',
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
      [['08100000-0000-4000-8000-000000000001']]
    );
  }
}
