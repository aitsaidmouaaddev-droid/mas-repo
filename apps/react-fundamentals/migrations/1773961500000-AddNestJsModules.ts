import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNestJsModules1773961500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'e5000000-0000-4000-8000-000000000001',
        label: 'NestJS Core Concepts',
        description: 'Modules, controllers, providers, decorators, the request lifecycle and how NestJS builds on top of Express/Fastify.',
        sortOrder: 0,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000002',
        label: 'Dependency Injection & Providers',
        description: 'Custom providers (useClass, useValue, useFactory, useExisting), injection scopes (DEFAULT, REQUEST, TRANSIENT) and circular dependency resolution.',
        sortOrder: 1,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000003',
        label: 'Pipes, Guards & Interceptors',
        description: 'Validation pipes with class-validator/class-transformer, role-based guards, interceptors for logging/transformation and exception filters.',
        sortOrder: 2,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000004',
        label: 'Middleware & Exception Filters',
        description: 'Functional and class-based middleware, global vs scoped filters, built-in HttpException and creating custom exception hierarchies.',
        sortOrder: 3,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000005',
        label: 'REST API Design with NestJS',
        description: 'Resource-based routing, DTOs, @Body/@Param/@Query decorators, Swagger/OpenAPI with @nestjs/swagger and API versioning.',
        sortOrder: 4,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000006',
        label: 'GraphQL with NestJS',
        description: 'Code-first and schema-first approaches, resolvers, @ObjectType/@InputType, DataLoader for N+1 prevention and subscriptions.',
        sortOrder: 5,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000007',
        label: 'Authentication & Authorization',
        description: 'Passport.js strategies, JWT with @nestjs/jwt, refresh tokens, RBAC with custom guards and @nestjs/casl integration.',
        sortOrder: 6,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000008',
        label: 'TypeORM & Database Integration',
        description: 'TypeOrmModule setup, repositories, entities, migrations, transactions, query builder and relation handling in NestJS.',
        sortOrder: 7,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000009',
        label: 'Microservices & Message Queues',
        description: 'NestJS microservice transports (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, hybrid apps and gRPC.',
        sortOrder: 8,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000010',
        label: 'Testing NestJS Apps',
        description: 'Unit testing with Jest, createTestingModule(), mocking providers, e2e testing with supertest and testing guards/interceptors.',
        sortOrder: 9,
        category: 'NestJs',
      },
      {
        id: 'e5000000-0000-4000-8000-000000000011',
        label: 'Configuration, Caching & Task Scheduling',
        description: '@nestjs/config with validation, CacheModule with Redis, @Cron/@Interval/@Timeout with @nestjs/schedule and Bull queues.',
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
    const ids = [
      'e5000000-0000-4000-8000-000000000001',
      'e5000000-0000-4000-8000-000000000002',
      'e5000000-0000-4000-8000-000000000003',
      'e5000000-0000-4000-8000-000000000004',
      'e5000000-0000-4000-8000-000000000005',
      'e5000000-0000-4000-8000-000000000006',
      'e5000000-0000-4000-8000-000000000007',
      'e5000000-0000-4000-8000-000000000008',
      'e5000000-0000-4000-8000-000000000009',
      'e5000000-0000-4000-8000-000000000010',
      'e5000000-0000-4000-8000-000000000011',
    ];
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [ids]
    );
  }
}
