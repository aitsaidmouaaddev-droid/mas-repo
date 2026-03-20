import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNodeJsModules1773961400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'd4000000-0000-4000-8000-000000000001',
        label: 'Node.js Core & Event Loop',
        description: 'How Node.js works: the V8 engine, libuv, the event loop phases (timers, I/O, poll, check), microtasks vs macrotasks and the call stack.',
        sortOrder: 0,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000002',
        label: 'Modules: CommonJS & ESM',
        description: 'require() vs import/export, module resolution algorithm, circular dependencies, package.json "type" field and dual CJS/ESM packages.',
        sortOrder: 1,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000003',
        label: 'File System & Streams',
        description: 'fs/promises API, readable/writable/transform streams, piping, backpressure, Buffer vs Uint8Array and working with large files efficiently.',
        sortOrder: 2,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000004',
        label: 'Async Patterns: Callbacks, Promises & async/await',
        description: 'Error-first callbacks, promisify, Promise combinators (all, allSettled, race, any), async iterators and top-level await.',
        sortOrder: 3,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000005',
        label: 'HTTP & REST API with Express',
        description: 'http module internals, building REST APIs with Express, middleware, routing, error handling, request validation and static files.',
        sortOrder: 4,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000006',
        label: 'Authentication & Security',
        description: 'JWT, session-based auth, bcrypt password hashing, CORS, helmet, rate limiting, CSRF protection and common Node.js security pitfalls.',
        sortOrder: 5,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000007',
        label: 'Databases: SQL & NoSQL',
        description: 'Connecting to PostgreSQL (pg, Prisma, TypeORM) and MongoDB (Mongoose), query patterns, transactions, indexing and connection pooling.',
        sortOrder: 6,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000008',
        label: 'Testing Node.js Apps',
        description: 'Unit and integration testing with Jest/Vitest, supertest for HTTP, mocking modules, code coverage and end-to-end API testing.',
        sortOrder: 7,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000009',
        label: 'Performance & Clustering',
        description: 'Worker threads, the cluster module, child_process, profiling with --prof, memory leak detection and Node.js performance best practices.',
        sortOrder: 8,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000010',
        label: 'WebSockets & Real-Time',
        description: 'ws library, Socket.IO, Server-Sent Events, long polling, scaling real-time connections with Redis pub/sub and sticky sessions.',
        sortOrder: 9,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000011',
        label: 'Deployment, Docker & CI/CD',
        description: 'Dockerising Node.js apps, multi-stage builds, environment variables, PM2 process management, health checks and GitHub Actions pipelines.',
        sortOrder: 10,
        category: 'NodeJs',
      },
      {
        id: 'd4000000-0000-4000-8000-000000000012',
        label: 'Node.js 22+ — Latest Features',
        description: 'Built-in test runner (node:test), native fetch, --watch mode, WebStreams, experimental permission model, ESM improvements and the v22 LTS highlights.',
        sortOrder: 11,
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
    const ids = [
      'd4000000-0000-4000-8000-000000000001',
      'd4000000-0000-4000-8000-000000000002',
      'd4000000-0000-4000-8000-000000000003',
      'd4000000-0000-4000-8000-000000000004',
      'd4000000-0000-4000-8000-000000000005',
      'd4000000-0000-4000-8000-000000000006',
      'd4000000-0000-4000-8000-000000000007',
      'd4000000-0000-4000-8000-000000000008',
      'd4000000-0000-4000-8000-000000000009',
      'd4000000-0000-4000-8000-000000000010',
      'd4000000-0000-4000-8000-000000000011',
      'd4000000-0000-4000-8000-000000000012',
    ];
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [ids]
    );
  }
}
