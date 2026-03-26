// @ts-check
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const base = path.resolve(__dirname, '..');
const qcm = JSON.parse(readFileSync(path.join(__dirname, 'qcm.json'), 'utf8'));
const tdt = JSON.parse(readFileSync(path.join(__dirname, 'tdt-challenges.json'), 'utf8'));

/**
 * Safely embed a JSON-serialized value inside the generator's own template literal.
 * The generated TS file uses double-quoted JS object literals so no SQL escaping
 * is needed there — only backticks and ${ matter for the generator template.
 */
function embed(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

// ── QCM ─────────────────────────────────────────────────────────────────────

const modulesData = qcm.modules.map((mod, i) => ({
  id: mod.id,
  label: mod.label,
  sortOrder: i,
}));

const questionsData = qcm.modules.flatMap((mod) =>
  mod.questions.map((q, i) => ({
    id: q.id,
    moduleId: mod.id,
    type: q.type,
    difficulty: q.difficulty,
    sortOrder: i,
    data: {
      question: q.question,
      choices: q.choices,
      answer: JSON.stringify(q.answer), // number | number[] → string for GraphQL
      tags: q.tags ?? [],
      explanation: q.explanation ?? null,
      docs: q.docs ?? null,
    },
  }))
);

const qcmTs = `import type { MigrationInterface, QueryRunner } from 'typeorm';

export class QcmSeed1773901000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = ${embed(modulesData)};

    for (const m of modules) {
      await queryRunner.query(
        \`INSERT INTO "qcm_module" ("id", "label", "sortOrder") VALUES ($1, $2, $3)\`,
        [m.id, m.label, m.sortOrder],
      );
    }

    const questions = ${embed(questionsData)};

    for (const q of questions) {
      await queryRunner.query(
        \`INSERT INTO "qcm_question" ("id", "moduleId", "type", "difficulty", "sortOrder", "data") VALUES ($1, $2, $3, $4, $5, $6::jsonb)\`,
        [q.id, q.moduleId, q.type, q.difficulty, q.sortOrder, JSON.stringify(q.data)],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`DELETE FROM "qcm_question";\`);
    await queryRunner.query(\`DELETE FROM "qcm_module";\`);
  }
}
`;

// ── TDT ─────────────────────────────────────────────────────────────────────

const challengesData = tdt.challenges.map((c, i) => ({
  id: c.id,
  title: c.title,
  category: c.category,
  difficulty: c.difficulty,
  sortOrder: i,
  data: {
    description: c.description,
    starterCode: c.starterCode,
    testCode: c.testCode,
    docs: c.docs ?? null,
  },
}));

const tdtTs = `import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TdtSeed1773901100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const challenges = ${embed(challengesData)};

    for (const c of challenges) {
      await queryRunner.query(
        \`INSERT INTO "tdt_challenge" ("id", "title", "category", "difficulty", "sortOrder", "data") VALUES ($1, $2, $3, $4, $5, $6::jsonb)\`,
        [c.id, c.title, c.category, c.difficulty, c.sortOrder, JSON.stringify(c.data)],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`DELETE FROM "tdt_challenge";\`);
  }
}
`;

writeFileSync(path.join(base, 'migrations/1773901000000-QcmSeed.ts'), qcmTs);
console.log('QCM written — modules:', modulesData.length, '| questions:', questionsData.length);

writeFileSync(path.join(base, 'migrations/1773901100000-TdtSeed.ts'), tdtTs);
console.log('TDT written — challenges:', challengesData.length);
