import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReact19Modules1773961300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'c3000000-0000-4000-8000-000000000001',
        label: 'React 19 — What\'s New',
        description: 'Overview of React 19: the new compiler, automatic memoisation, removal of forwardRef, string refs and legacy context.',
        sortOrder: 0,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000002',
        label: 'React Compiler & Auto-Memoisation',
        description: 'How the React 19 compiler eliminates manual useMemo/useCallback, what it optimises, its limitations and opt-out escape hatches.',
        sortOrder: 1,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000003',
        label: 'Server Components & Server Actions',
        description: 'React Server Components model, async components, "use server" / "use client" directives, Server Actions and progressive enhancement.',
        sortOrder: 2,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000004',
        label: 'useTransition & Concurrent Features',
        description: 'startTransition, useTransition, useDeferredValue, Suspense boundaries and concurrent rendering in React 19.',
        sortOrder: 3,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000005',
        label: 'useActionState & useFormStatus',
        description: 'New React 19 hooks for forms: useActionState (replaces useFormState), useFormStatus, optimistic updates and pending states.',
        sortOrder: 4,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000006',
        label: 'useOptimistic',
        description: 'Optimistic UI with useOptimistic — updating state before the server responds and rolling back on error.',
        sortOrder: 5,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000007',
        label: 'use() API & Resource Fetching',
        description: 'The new use() hook for reading Promises and Context inside render, including integration with Suspense and error boundaries.',
        sortOrder: 6,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000008',
        label: 'ref as a Prop & cleanup',
        description: 'React 19 passes ref directly as a prop (no more forwardRef), ref callback cleanup functions and the new ref object shape.',
        sortOrder: 7,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000009',
        label: 'Document Metadata & Asset Loading',
        description: 'Built-in <title>, <meta> and <link> hoisting, preload/preinit APIs and stylesheet/script priority management in React 19.',
        sortOrder: 8,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000010',
        label: 'Error Handling & Hydration Errors',
        description: 'Improved error reporting, onCaughtError / onUncaughtError root options, hydration diff messages and error recovery.',
        sortOrder: 9,
        category: 'React',
      },
      {
        id: 'c3000000-0000-4000-8000-000000000011',
        label: 'Context, Portals & Fragments Updates',
        description: '<Context> as a provider (replaces <Context.Provider>), portal improvements and key as a prop in React 19.',
        sortOrder: 10,
        category: 'React',
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
      'c3000000-0000-4000-8000-000000000001',
      'c3000000-0000-4000-8000-000000000002',
      'c3000000-0000-4000-8000-000000000003',
      'c3000000-0000-4000-8000-000000000004',
      'c3000000-0000-4000-8000-000000000005',
      'c3000000-0000-4000-8000-000000000006',
      'c3000000-0000-4000-8000-000000000007',
      'c3000000-0000-4000-8000-000000000008',
      'c3000000-0000-4000-8000-000000000009',
      'c3000000-0000-4000-8000-000000000010',
      'c3000000-0000-4000-8000-000000000011',
    ];
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [ids]
    );
  }
}
