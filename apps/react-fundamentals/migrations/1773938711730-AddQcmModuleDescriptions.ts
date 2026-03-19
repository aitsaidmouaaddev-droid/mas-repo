import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQcmModuleDescriptions1773938711730 implements MigrationInterface {
    name = 'AddQcmModuleDescriptions1773938711730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" ADD IF NOT EXISTS "description" text`);

        const descriptions: { id: string; description: string }[] = [
            {
                id: '756c8434-a704-4c6e-88f9-e467dc8c3f91',
                description: 'Learn JSX syntax, how to write components, pass props, and render markup. Covers conditional rendering, lists, and keys.',
            },
            {
                id: '7da5ab84-ab82-4522-82e6-17835c297654',
                description: 'Handle user events, update the UI in response to interactions, and understand how React batches state updates.',
            },
            {
                id: '14f95086-16bb-4c2c-abad-4c96136ce04e',
                description: 'Deep dive into useState, useReducer, lifting state up, and sharing state between components via context.',
            },
            {
                id: '957b062a-1300-462c-a85e-ad70c2591671',
                description: 'Work with refs, synchronise with external systems using useEffect, and write custom hooks to escape React\'s declarative model.',
            },
            {
                id: 'cef9ccb0-c77f-4eea-97cc-89eea4fa1f05',
                description: 'Explore compound components, render props, higher-order components, and advanced context patterns used in large codebases.',
            },
            {
                id: '5d4b7fcf-b36e-473b-9618-6e793b2070f7',
                description: 'Master the Next.js App Router, React Server Components, server actions, data fetching strategies, and full-stack patterns.',
            },
            {
                id: '1c7b1f6f-4551-4ccc-8a69-293517a6ca8b',
                description: 'Review semantic HTML, CSS layout models (flexbox, grid), SCSS features, and styling approaches in React apps.',
            },
            {
                id: 'b06787b2-3a37-4847-bdae-705b2e082c83',
                description: 'Covers ESLint, Prettier, unit and integration testing, Git branching workflows, and CI/CD pipeline fundamentals.',
            },
            {
                id: '16aa695b-1eeb-4722-9b6a-44a40c43ea3d',
                description: 'Understand SOLID principles, clean architecture, design patterns, and how to structure scalable frontend applications.',
            },
            {
                id: 'bd2b1a5b-ca29-4a93-90da-e378cf7d5173',
                description: 'Practice common React technical interview questions, algorithm challenges, and live-coding exercises asked by top companies.',
            },
            {
                id: '18b0fa5c-a3c0-4d56-a2db-077b8de9dd00',
                description: 'Prepare for HR rounds: behavioural questions, STAR method answers, salary negotiation, and career progression topics.',
            },
        ];

        for (const { id, description } of descriptions) {
            await queryRunner.query(
                `UPDATE "qcm_module" SET "description" = $1 WHERE "id" = $2`,
                [description, id],
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" DROP COLUMN IF EXISTS "description"`);
    }
}
