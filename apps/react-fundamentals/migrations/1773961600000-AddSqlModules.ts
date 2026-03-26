import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSqlModules1773961600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'f6000000-0000-4000-8000-000000000001',
        label: 'SQL Fundamentals',
        description: 'Relational model basics, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) and data types in PostgreSQL.',
        sortOrder: 0,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000002',
        label: 'Filtering, Sorting & Aggregation',
        description: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, aggregate functions (COUNT, SUM, AVG, MIN, MAX) and DISTINCT.',
        sortOrder: 1,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000003',
        label: 'Joins & Relationships',
        description: 'INNER, LEFT, RIGHT, FULL OUTER and CROSS JOINs, self-joins, foreign keys, ON DELETE CASCADE and resolving N+1 with joins.',
        sortOrder: 2,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000004',
        label: 'Subqueries & CTEs',
        description: 'Correlated and non-correlated subqueries, EXISTS/IN/ANY/ALL, Common Table Expressions (WITH), recursive CTEs and readability trade-offs.',
        sortOrder: 3,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000005',
        label: 'Window Functions',
        description: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY inside OVER() and frame clauses.',
        sortOrder: 4,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000006',
        label: 'Indexes & Query Performance',
        description: 'B-tree, hash, GIN and GiST indexes, EXPLAIN ANALYZE, sequential vs index scans, composite indexes and covering indexes.',
        sortOrder: 5,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000007',
        label: 'Transactions & Concurrency',
        description: 'ACID properties, isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), deadlocks, MVCC and pessimistic vs optimistic locking.',
        sortOrder: 6,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000008',
        label: 'Schema Design & Normalisation',
        description: '1NF through 3NF/BCNF, denormalisation trade-offs, entity-relationship modelling, many-to-many junction tables and UUID vs serial PKs.',
        sortOrder: 7,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000009',
        label: 'PostgreSQL Advanced Features',
        description: 'JSONB columns, full-text search, array types, generated columns, partitioning, triggers, stored procedures and pg extensions.',
        sortOrder: 8,
        category: 'SQL',
      },
      {
        id: 'f6000000-0000-4000-8000-000000000010',
        label: 'Migrations & Database Versioning',
        description: 'Migration strategies, TypeORM and Prisma migration workflows, schema drift, zero-downtime migrations and rollback patterns.',
        sortOrder: 9,
        category: 'SQL',
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
    const ids = [
      'f6000000-0000-4000-8000-000000000001',
      'f6000000-0000-4000-8000-000000000002',
      'f6000000-0000-4000-8000-000000000003',
      'f6000000-0000-4000-8000-000000000004',
      'f6000000-0000-4000-8000-000000000005',
      'f6000000-0000-4000-8000-000000000006',
      'f6000000-0000-4000-8000-000000000007',
      'f6000000-0000-4000-8000-000000000008',
      'f6000000-0000-4000-8000-000000000009',
      'f6000000-0000-4000-8000-000000000010',
    ];
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [ids]
    );
  }
}
