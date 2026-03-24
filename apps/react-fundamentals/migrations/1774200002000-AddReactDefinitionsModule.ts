import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReactDefinitionsModule1774200002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'c3100000-0000-4000-8000-000000000001',
        label: 'React Definitions',
        description: 'Core React vocabulary: what is React, JSX, components, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtual DOM, reconciliation, Fiber, Context API, memoization, portals, Suspense, lazy loading, error boundaries, HOCs, controlled/uncontrolled components, custom hooks, hydration and React 19 additions.',
        sortOrder: 11,
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
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [['c3100000-0000-4000-8000-000000000001']]
    );
  }
}
