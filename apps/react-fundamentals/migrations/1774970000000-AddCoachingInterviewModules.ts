import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoachingInterviewModules1774970000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      {
        id: 'e1000000-0000-4000-8000-000000000001',
        label: {
          en: 'Coaching — HR Interview',
          fr: 'Coaching — Entretien RH',
          de: 'Coaching — HR-Vorstellungsgespräch',
          es: 'Coaching — Entrevista RRHH',
          it: 'Coaching — Colloquio HR',
        },
        description: {
          en: 'Coaching questions to prepare for an HR interview: motivation, career path, soft skills, company values and handling tricky questions.',
          fr: 'Questions de coaching pour préparer un entretien RH : motivation, parcours, soft skills, valeurs d\'entreprise et gestion des questions sensibles.',
          de: 'Coaching-Fragen zur Vorbereitung auf ein HR-Gespräch: Motivation, Karriereweg, Soft Skills, Unternehmenswerte und schwierige Fragen.',
          es: 'Preguntas de coaching para preparar una entrevista de RRHH: motivación, trayectoria, soft skills, valores de empresa y gestión de preguntas difíciles.',
          it: 'Domande di coaching per prepararsi a un colloquio HR: motivazione, percorso, soft skill, valori aziendali e gestione delle domande difficili.',
        },
        sortOrder: 0,
        category: 'Coaching',
      },
      {
        id: 'e1000000-0000-4000-8000-000000000002',
        label: {
          en: 'Coaching — Manager & Project Interview',
          fr: 'Coaching — Entretien Manager & Projet',
          de: 'Coaching — Manager- & Projektinterview',
          es: 'Coaching — Entrevista Manager & Proyecto',
          it: 'Coaching — Colloquio Manager & Progetto',
        },
        description: {
          en: 'Coaching questions to prepare for a technical manager or project lead interview: architecture decisions, Agile delivery, client interaction, testing strategy and CI/CD.',
          fr: 'Questions de coaching pour un entretien manager technique ou chef de projet : décisions d\'architecture, delivery Agile, interaction client, stratégie de tests et CI/CD.',
          de: 'Coaching-Fragen für ein Interview mit einem technischen Manager: Architekturentscheidungen, Agile Delivery, Kundeninteraktion, Teststrategie und CI/CD.',
          es: 'Preguntas de coaching para una entrevista con manager técnico o jefe de proyecto: arquitectura, delivery Agile, cliente, tests y CI/CD.',
          it: 'Domande di coaching per un colloquio con manager tecnico o responsabile di progetto: architettura, delivery Agile, cliente, test e CI/CD.',
        },
        sortOrder: 1,
        category: 'Coaching',
      },
    ];

    for (const m of modules) {
      await queryRunner.query(
        `INSERT INTO "qcm_module" ("id", "label", "description", "sortOrder", "category")
         VALUES ($1, $2::jsonb, $3::jsonb, $4, $5)
         ON CONFLICT ("id") DO NOTHING`,
        [m.id, JSON.stringify(m.label), JSON.stringify(m.description), m.sortOrder, m.category],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "qcm_module" WHERE "id" = ANY($1)`,
      [['e1000000-0000-4000-8000-000000000001', 'e1000000-0000-4000-8000-000000000002']],
    );
  }
}
