import type { MigrationInterface, QueryRunner } from 'typeorm';

const MODULE_ID = 'e1000000-0000-4000-8000-000000000001';

export class AddCoachingRHQuestions1774970001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      // ── EASY (4) ────────────────────────────────────────────────────────────
      {
        id: 'e1000001-0000-4000-8001-000000000001',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 0,
        data: {
          question: 'Breath est une expérience entrepreneuriale de 5 mois. Comment la présenter positivement à un recruteur ?',
          choices: [
            'Minimiser cette période et ne pas la mentionner dans la présentation',
            'Expliquer que c\'était une erreur et que j\'aurais mieux fait de chercher un poste directement',
            'La présenter comme une expérience de Lead Dev end-to-end (MVP, architecture, CI/CD) qui a apporté une vision produit complète, en assumant la décision d\'arrêt de façon lucide',
            'Dire que le projet n\'a pas fonctionné à cause du marché, sans entrer dans les détails',
          ],
          answer: '2',
          tags: ['rh', 'parcours', 'entrepreneuriat', 'breath'],
          explanation: 'Un recruteur cherche la lucidité et l\'apprentissage, pas la perfection. Assumer l\'arrêt tout en valorisant les compétences déployées (architecture end-to-end, décisions techniques autonomes, CI/CD) montre de la maturité professionnelle. Minimiser ou fuir la question est perçu négativement.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000002',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 1,
        data: {
          question: 'Pourquoi rejoindre Niji plutôt qu\'un éditeur logiciel ou une SSII classique ?',
          choices: [
            'Niji est connu, c\'est bon pour le CV',
            'Parce que Niji combine conseil, design et réalisation dans une même chaîne de valeur — ce qui permet de contribuer du cadrage technique à la livraison et d\'avoir un impact plus large qu\'en tant que simple développeur',
            'Je préfère les cabinets de conseil car les journées sont moins techniques',
            'Je cherche avant tout la stabilité et les avantages sociaux',
          ],
          answer: '1',
          tags: ['rh', 'motivation', 'niji', 'conseil'],
          explanation: 'La réponse attendue montre que vous avez compris la proposition de valeur unique de Niji (conseil + design + réalisation) et que votre motivation est alignée avec elle. Citer le nom seul ou parler d\'avantages sociaux ne démontre aucune connaissance de l\'entreprise.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000003',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 2,
        data: {
          question: '"Comment faites-vous votre veille technologique ?" — Quelle réponse démontre le mieux un engagement concret ?',
          choices: [
            'Je lis parfois des articles sur Medium',
            'Je n\'en fais pas vraiment, je préfère me concentrer sur les projets en cours',
            'Je maintiens un workflow structuré : blogs officiels (React.dev, NestJS docs), intégration d\'outils IA (Copilot, Claude) en conditions réelles sur mes projets perso, et application directe des nouvelles pratiques dans mon travail',
            'Je regarde des tutoriels YouTube le week-end',
          ],
          answer: '2',
          tags: ['rh', 'soft-skills', 'veille', 'ia'],
          explanation: 'La veille technologique doit être active et appliquée, pas passive. Mentionner des sources officielles, des outils IA utilisés en production (pas juste expérimentés), et l\'application concrète dans des projets réels démontre un engagement sincère. Les réponses vagues ou l\'absence de veille sont des signaux négatifs.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000004',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 3,
        data: {
          question: 'Vous habitez à Nangis (77) pour un poste hybride sur Paris. Comment rassurer le recruteur sur votre organisation ?',
          choices: [
            'Déménager si nécessaire, mais sans certitude pour l\'instant',
            'Ne pas répondre directement et changer de sujet',
            'Préciser que vous connaissez le trajet (RER + Transilien, ~1h), que vous avez déjà travaillé en hybride sur des projets précédents, et proposer de définir ensemble le rythme présentiel/remote optimal',
            'Affirmer que vous préférez le full remote et que vous viendriez rarement',
          ],
          answer: '2',
          tags: ['rh', 'logistique', 'hybride', 'organisation'],
          explanation: 'Rassurer sur la mobilité, c\'est montrer que vous avez anticipé la contrainte (trajet connu) et que vous avez un historique de travail hybride fonctionnel. Proposer de co-construire le rythme montre de la flexibilité. Refuser de s\'engager ou prioriser le remote sans nuance peut inquiéter le recruteur sur votre engagement.',
          docs: null,
        },
      },

      // ── MEDIUM (4) ───────────────────────────────────────────────────────────
      {
        id: 'e1000001-0000-4000-8001-000000000005',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 4,
        data: {
          question: 'Un collègue ou client insiste sur une décision technique avec laquelle vous êtes en désaccord. Quelle est la meilleure approche ?',
          choices: [
            'Accepter sans discussion : le client/collègue a toujours raison',
            'Refuser catégoriquement et escalader immédiatement à la hiérarchie',
            'Présenter vos arguments techniques avec des exemples concrets, écouter les contraintes de l\'autre partie, et proposer un compromis documenté',
            'Développer votre solution de façon autonome et présenter le résultat accompli',
          ],
          answer: '2',
          tags: ['rh', 'soft-skills', 'désaccord', 'communication'],
          explanation: 'La gestion du désaccord démontre votre maturité relationnelle. L\'approche gagnante : argumenter factuellement (pas émotionnellement), comprendre les contraintes de l\'autre (coût, délai, équipe), et documenter le compromis. Ni la soumission aveugle ni la confrontation ne sont des réponses adaptées en environnement professionnel.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000006',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 5,
        data: {
          question: 'Vous avez travaillé en ESN (3 ans), en client final (2 ans) et en entrepreneuriat (5 mois). Comment valoriser cette diversité de contextes ?',
          choices: [
            'Préciser que vous n\'avez pas aimé l\'ESN et que vous voulez fuir ce modèle',
            'Minimiser l\'ESN car c\'est perçu négativement dans le conseil',
            'Présenter chaque contexte comme complémentaire : l\'ESN pour la diversité métier, le client final pour la profondeur produit, l\'entrepreneuriat pour la vision et l\'autonomie',
            'Dire que vous avez beaucoup changé de poste car vous vous ennuyez vite',
          ],
          answer: '2',
          tags: ['rh', 'parcours', 'esn', 'valorisation'],
          explanation: 'Chaque contexte apporte quelque chose d\'unique : l\'ESN expose à de nombreux domaines métier et clients, le client final apprend la profondeur et la durée sur un produit complexe, l\'entrepreneuriat développe la prise de décision autonome et la vision produit. Dénigrer un contexte passe pour du manque de recul.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000007',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 6,
        data: {
          question: 'Niji valorise l\'audace. Quel exemple de votre parcours illustre le mieux cette valeur ?',
          choices: [
            'Avoir toujours fait ce qui était demandé sans prendre d\'initiative',
            'Avoir créé Breath from scratch : architecture microservices, GraphQL, React Native et AWS en tant que seul développeur et fondateur, en acceptant le risque de l\'échec entrepreneurial',
            'Avoir effectué une migration Angular de v12 à v13 en suivant la documentation officielle',
            'Avoir proposé d\'utiliser Redux sur un projet React alors que personne ne le connaissait dans l\'équipe',
          ],
          answer: '1',
          tags: ['rh', 'valeurs', 'audace', 'niji', 'breath'],
          explanation: 'L\'audace chez Niji signifie prendre des décisions à risque calculé et les assumer. Breath incarne cela : démarrage from scratch, stack ambitieuse, rôle de fondateur avec toutes les responsabilités techniques et business. Une migration via la doc officielle ou un choix de lib dans une équipe ne démontre pas vraiment l\'audace au sens Niji.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000008',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 7,
        data: {
          question: '"Aimez-vous partager votre savoir ?" — Quelle réponse concrète valorise le mieux votre profil ?',
          choices: [
            'Oui, j\'explique les choses à mes collègues quand ils me posent des questions',
            'Je préfère travailler seul pour aller plus vite',
            'Chez Saint-Gobain, j\'ai conçu un Design System documenté sous Storybook utilisé par toute l\'équipe, rédigé les schémas d\'architecture et README, et participé aux code reviews avec retours constructifs formalisés',
            'Je partage mes connaissances en dehors du travail mais pas vraiment en entreprise',
          ],
          answer: '2',
          tags: ['rh', 'soft-skills', 'partage', 'documentation', 'storybook'],
          explanation: 'La réponse doit être illustrée par des exemples concrets et mesurables. Un Design System Storybook utilisé par toute l\'équipe, une documentation d\'architecture, des code reviews formalisées — ce sont des preuves tangibles de partage de savoir. "Oui quand on me pose des questions" est une réponse passive qui ne valorise pas votre impact.',
          docs: null,
        },
      },

      // ── HARD (2) ─────────────────────────────────────────────────────────────
      {
        id: 'e1000001-0000-4000-8001-000000000009',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 8,
        data: {
          question: '"Pourquoi avoir quitté Saint-Gobain après 2 ans ?" — Quelle réponse est la plus convaincante ?',
          choices: [
            'Je m\'ennuyais et j\'avais besoin de changer d\'air',
            'J\'avais des conflits avec l\'équipe et le management',
            'Ma mission de consultant s\'est terminée naturellement. J\'ai souhaité relever le défi entrepreneurial de Breath pour consolider mes compétences en mode fondateur, avant de rejoindre un cabinet de conseil pour apporter cette double expérience produit + conseil',
            'Je cherchais une augmentation qu\'ils n\'ont pas pu offrir',
          ],
          answer: '2',
          tags: ['rh', 'parcours', 'saint-gobain', 'départ', 'motivation'],
          explanation: 'La question sur le départ cherche à détecter des signaux de risque (conflit, ennui, attentes salariales non comblées). La réponse idéale cadre le départ comme une décision positive et proactive : fin naturelle de mission + aspiration entrepreneuriale + retour en cabinet avec une valeur ajoutée enrichie. Jamais parler négativement d\'un employeur précédent.',
          docs: null,
        },
      },
      {
        id: 'e1000001-0000-4000-8001-000000000010',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 9,
        data: {
          question: '"Où vous voyez-vous dans 3 ans chez Niji ?" — Quelle réponse équilibre ambition et réalisme ?',
          choices: [
            'Je souhaite devenir manager le plus vite possible et ne plus coder',
            'Je n\'y ai pas encore réfléchi',
            'Je vise un profil de référent technique Full Stack JS, contribuant aux livrables clients, à l\'évolution des pratiques de l\'équipe (Design System, qualité, CI/CD) et potentiellement au mentoring de développeurs plus juniors',
            'Je veux créer ma propre startup à partir des projets Niji',
          ],
          answer: '2',
          tags: ['rh', 'projection', 'ambition', 'niji', 'long-terme'],
          explanation: 'La réponse doit montrer une ambition réaliste ancrée dans le rôle technique, sans nier toute évolution. "Référent technique + contribution aux pratiques + mentoring" est idéal : cela prouve que vous restez dans la valeur ajoutée technique tout en montrant une dimension collective et de leadership. "Ne plus coder" ou "créer une startup avec les ressources Niji" envoient de mauvais signaux.',
          docs: null,
        },
      },
    ];

    for (const q of questions) {
      await queryRunner.query(
        `INSERT INTO "qcm_question" ("id", "moduleId", "type", "difficulty", "sortOrder", "data")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT ("id") DO NOTHING`,
        [q.id, q.moduleId, q.type, q.difficulty, q.sortOrder, JSON.stringify(q.data)],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ids = Array.from(
      { length: 10 },
      (_, i) => `e1000001-0000-4000-8001-${String(i + 1).padStart(12, '0')}`,
    );
    await queryRunner.query(`DELETE FROM "qcm_question" WHERE "id" = ANY($1)`, [ids]);
  }
}
