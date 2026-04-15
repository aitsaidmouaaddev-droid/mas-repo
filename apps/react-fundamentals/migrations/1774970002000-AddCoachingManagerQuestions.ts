import type { MigrationInterface, QueryRunner } from 'typeorm';

const MODULE_ID = 'e1000000-0000-4000-8000-000000000002';

export class AddCoachingManagerQuestions1774970002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      // ── EASY (2) ────────────────────────────────────────────────────────────
      {
        id: 'e1000002-0000-4000-8001-000000000001',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 0,
        data: {
          question: 'Vous avez contribué aux "choix d\'architecture" chez Saint-Gobain. Comment structurez-vous un tel arbitrage technique ?',
          choices: [
            'Je choisis la technologie que je maîtrise le mieux sans consulter l\'équipe',
            'J\'analyse les contraintes (performance, scalabilité, équipe, budget, délai), je benchmark les options, je présente un ADR documenté avec les trade-offs, et je défends ma position en restant ouvert au contre-argument',
            'Je délègue entièrement ce type de décision à l\'architecte senior',
            'Je choisis la solution la plus moderne même si l\'équipe ne la connaît pas',
          ],
          answer: '1',
          tags: ['manager', 'architecture', 'adr', 'decision'],
          explanation: 'Un bon arbitrage technique suit un processus structuré : analyse des contraintes réelles (pas seulement techniques), benchmark documenté, présentation des trade-offs à l\'équipe via un ADR (Architecture Decision Record), et ouverture au débat. La décision unilatérale basée sur ses préférences ou la délégation totale sont deux extrêmes à éviter.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000002',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'easy',
        sortOrder: 1,
        data: {
          question: 'Un sprint se termine avec 3 user stories non livrées. En tant que lead dev, quelle est votre réaction ?',
          choices: [
            'Faire des heures supplémentaires pour rattraper le retard sans en informer personne',
            'Blâmer les développeurs qui n\'ont pas été assez rapides',
            'Analyser les causes (complexité sous-estimée, blocages techniques, dépendances), communiquer de façon transparente au PO lors de la sprint review, et proposer des actions correctives pour le prochain sprint',
            'Déplacer les stories sans les mentionner et les réintégrer discrètement dans le prochain sprint',
          ],
          answer: '2',
          tags: ['manager', 'agile', 'scrum', 'sprint', 'communication'],
          explanation: 'En Agile Scrum, la transparence est une valeur fondamentale. La bonne réaction : analyse post-mortem rapide des causes (découpage trop large, dépendances non identifiées, dette technique), communication honnête lors de la sprint review, et actions correctives concrètes (meilleur découpage, identification précoce des risques). Cacher les retards ou blâmer l\'équipe détruisent la confiance.',
          docs: null,
        },
      },

      // ── MEDIUM (4) ───────────────────────────────────────────────────────────
      {
        id: 'e1000002-0000-4000-8001-000000000003',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 2,
        data: {
          question: 'La documentation technique est une mission explicite chez Niji. Quelle approche adopter pour qu\'elle soit réellement utile et maintenue ?',
          choices: [
            'Rédiger une doc très détaillée sur chaque ligne de code',
            'Ne rédiger la doc qu\'à la fin du projet, quand tout est stable',
            'Adopter une approche layered : README pour l\'onboarding rapide, schémas d\'architecture pour les choix structurants, ADRs pour les décisions importantes — maintenue en continu, pas en fin de sprint',
            'La documentation est une perte de temps, le code bien écrit se suffit à lui-même',
          ],
          answer: '2',
          tags: ['manager', 'documentation', 'readme', 'architecture', 'adr'],
          explanation: 'Une bonne documentation technique est structurée en niveaux : README (onboarding en 5 min), schémas d\'architecture (décisions structurantes, diagrammes C4), ADRs (pourquoi on a choisi X plutôt que Y). Elle doit être maintenue au fil du projet, pas rédigée en urgence à la fin. "Le code parle de lui-même" est un mythe qui coûte cher lors des onboardings.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000004',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 3,
        data: {
          question: 'Vous devez présenter une proposition d\'architecture microservices à un DSI non technique. Comment procédez-vous ?',
          choices: [
            'Présenter les diagrammes techniques complets avec les ports, protocoles et APIs',
            'Éviter le sujet technique et parler uniquement de budget et délais',
            'Traduire les enjeux en bénéfices business : résilience, scalabilité ciblée, déploiement indépendant — en utilisant des analogies et en validant la compréhension à chaque étape',
            'Demander à un consultant senior de prendre la parole à votre place',
          ],
          answer: '2',
          tags: ['manager', 'client', 'communication', 'microservices', 'non-technique'],
          explanation: 'Face à un interlocuteur non technique, le bon réflexe est de parler le langage du business : résilience (une panne n\'affecte pas tout le système), scalabilité (on fait monter en charge uniquement ce qui en a besoin), time-to-market (déploiements indépendants = moins de risque). Les diagrammes techniques complexes créent de l\'anxiété, pas de la confiance.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000005',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 4,
        data: {
          question: 'Comment structurez-vous votre stratégie de tests sur un projet build full stack React/NestJS ?',
          choices: [
            'Uniquement des tests E2E car ils couvrent tout le parcours utilisateur',
            'Uniquement des tests unitaires car les autres sont trop lents',
            'Pyramide de tests : unitaires (Jest) sur la logique métier et composants isolés, tests d\'intégration sur les endpoints API et interactions DB, quelques E2E critiques sur les parcours principaux. TDD sur les fonctions complexes. SonarQube pour le suivi de couverture.',
            'Aucun test si le client ne l\'exige pas explicitement',
          ],
          answer: '2',
          tags: ['manager', 'tests', 'jest', 'tdd', 'sonarqube', 'qualité'],
          explanation: 'La pyramide de tests est la réponse standard : nombreux tests unitaires (rapides, précis), moins de tests d\'intégration (plus lents mais testent les contrats entre couches), et peu de tests E2E (lents mais valident les parcours complets). Le TDD sur la logique métier complexe réduit les bugs. SonarQube assure le suivi de couverture et détecte les code smells.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000006',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'medium',
        sortOrder: 5,
        data: {
          question: 'Vous avez utilisé un monorepo Nx chez Saint-Gobain. Dans quel contexte recommander cette approche à un client ?',
          choices: [
            'Toujours, c\'est la meilleure architecture dans tous les cas',
            'Jamais, c\'est trop complexe pour la plupart des équipes',
            'Lorsqu\'il y a plusieurs applications partageant du code commun (libs, types, Design System), des équipes coordonnées, et un besoin d\'outillage unifié (lint, tests, CI/CD affected). La complexité initiale est justifiée dès 2-3 apps liées.',
            'Uniquement pour les startups car les grandes entreprises ont leurs propres outils',
          ],
          answer: '2',
          tags: ['manager', 'monorepo', 'nx', 'architecture', 'scalabilité'],
          explanation: 'Un monorepo Nx est pertinent quand la complexité initiale est amortie par les gains : partage de libs typées entre apps (web, mobile, API), CI/CD affected (on ne rebuild que ce qui a changé), lint/tests unifiés. C\'est contre-productif sur un projet simple avec une seule app. La clé est d\'analyser le niveau de partage de code et la coordination des équipes.',
          docs: null,
        },
      },

      // ── HARD (4) ─────────────────────────────────────────────────────────────
      {
        id: 'e1000002-0000-4000-8001-000000000007',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 6,
        data: {
          question: 'Sur VERIFI, vous avez optimisé les "performances de recherche/filtrage". Quelle démarche adoptez-vous face à un problème de performance ?',
          choices: [
            'Réécrire tout le code en espérant que ce soit plus rapide',
            'Passer directement à un cache global même sans diagnostiquer le vrai goulot',
            'Profiler d\'abord (DevTools, APM, EXPLAIN ANALYZE sur les requêtes SQL) pour identifier le vrai goulot, puis appliquer la solution ciblée (index DB, pagination, virtualisation front, cache Redis) et mesurer l\'impact réel avant/après',
            'Augmenter les ressources serveur (scale up) sans analyser le code',
          ],
          answer: '2',
          tags: ['manager', 'performance', 'profiling', 'sql', 'redis', 'optimisation'],
          explanation: 'Le piège classique est d\'appliquer une solution générique (cache, scale up) sans diagnostiquer. La démarche correcte : mesurer d\'abord (profiling DevTools côté front, APM côté API, EXPLAIN ANALYZE sur les requêtes lentes), identifier le goulot précis, appliquer la solution ciblée (index manquant, N+1 query, virtualisation de liste), et mesurer le gain réel. Sans diagnostic, on optimise au hasard.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000008',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 7,
        data: {
          question: 'Niji vous place sur un projet avec une stack que vous ne connaissez pas encore. Quelle est votre approche pour être efficace rapidement ?',
          choices: [
            'Refuser la mission et attendre un projet sur votre stack habituelle',
            'Faire semblant de connaître et se débrouiller seul en cachant les lacunes',
            'Consacrer les premiers jours à comprendre l\'architecture existante (README, code, tests), identifier un référent technique, livrer des tâches simples d\'abord pour monter en confiance, et documenter les apprentissages pour les autres',
            'Réécrire les parties que vous ne comprenez pas avec votre propre stack',
          ],
          answer: '2',
          tags: ['manager', 'onboarding', 'adaptabilité', 'apprentissage', 'conseil'],
          explanation: 'En cabinet de conseil, l\'adaptabilité rapide est une compétence clé. L\'approche gagnante : read the code before writing code (README, tests, architecture), s\'appuyer sur un référent, livrer de la valeur rapidement sur des tâches bien cadrées, et documenter les apprentissages (qui profitent aux suivants). Cacher ses lacunes ou réécrire l\'existant sont des anti-patterns coûteux.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000009',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 8,
        data: {
          question: 'Un client vous demande de choisir entre GraphQL et REST pour une API consommée par web et mobile. Comment arbitrez-vous ?',
          choices: [
            'Je choisis toujours GraphQL car c\'est plus moderne',
            'Je choisis toujours REST car tout le monde le connaît',
            'J\'analyse les besoins réels : GraphQL si les clients ont des besoins de données hétérogènes, queries flexibles ou BFF complexe ; REST si l\'API est simple, orientée ressources, avec cache HTTP important ou nombreuses intégrations tierces',
            'Je laisse le client décider et je m\'adapte sans donner mon avis',
          ],
          answer: '2',
          tags: ['manager', 'graphql', 'rest', 'api', 'architecture', 'décision'],
          explanation: 'Ni GraphQL ni REST n\'est universellement supérieur. GraphQL brille quand les clients (web/mobile) ont des besoins différents (évite l\'over/under-fetching), pour les BFF complexes, ou quand on veut un schéma auto-documenté. REST reste préférable pour sa simplicité, la mise en cache HTTP native, et l\'interopérabilité avec des systèmes tiers. L\'expérience en production sur les deux (Saint-Gobain + Breath) est un atout à valoriser.',
          docs: null,
        },
      },
      {
        id: 'e1000002-0000-4000-8001-000000000010',
        moduleId: MODULE_ID,
        type: 'single',
        difficulty: 'hard',
        sortOrder: 9,
        data: {
          question: 'Comment concevez-vous un pipeline CI/CD pour un projet full stack Node.js/React de zéro ?',
          choices: [
            'Un seul job séquentiel qui lance tout, c\'est plus simple à maintenir',
            'Je ne m\'occupe pas du CI/CD, c\'est le rôle du DevOps',
            'Pipeline en stages parallèles : lint + typecheck + tests unitaires (rapide, bloque le merge) → build + tests d\'intégration (PR) → déploiement staging automatique + smoke tests → déploiement prod sur tag ou validation manuelle. Avec cache node_modules et artefacts de build.',
            'Je déploie directement en production sans pipeline car c\'est plus rapide au démarrage',
          ],
          answer: '2',
          tags: ['manager', 'cicd', 'github-actions', 'gitlab-ci', 'devops', 'qualité'],
          explanation: 'Un pipeline CI/CD mature est structuré en stages avec feedback rapide en amont : les checks rapides (lint, typecheck, tests unitaires) bloquent immédiatement les PRs défectueuses. Les checks plus lents (intégration, build) s\'exécutent ensuite. Le déploiement staging est automatique, le prod est protégé par un tag ou une validation. Le cache des dépendances et artefacts est crucial pour la vitesse. Cette expertise est directement valorisable chez Niji (GitHub Actions + GitLab CI sur votre CV).',
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
      (_, i) => `e1000002-0000-4000-8001-${String(i + 1).padStart(12, '0')}`,
    );
    await queryRunner.query(`DELETE FROM "qcm_question" WHERE "id" = ANY($1)`, [ids]);
  }
}
