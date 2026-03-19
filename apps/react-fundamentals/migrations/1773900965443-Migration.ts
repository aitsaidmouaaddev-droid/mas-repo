import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773900965443 implements MigrationInterface {
    name = 'Migration1773900965443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qcm_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "moduleId" uuid NOT NULL, "type" character varying NOT NULL, "difficulty" character varying NOT NULL, "tags" jsonb NOT NULL DEFAULT '[]', "question" text NOT NULL, "choices" jsonb NOT NULL DEFAULT '[]', "answer" jsonb NOT NULL, "explanation" text, "docs" character varying, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_dd8ba06f17356a976e73743ae9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3221dcc4d3fe117b70c546f3b" ON "qcm_question" ("moduleId") `);
        await queryRunner.query(`CREATE TABLE "qcm_module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "label" character varying NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_73bd5898120982177494deb2fb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tdt_challenge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "category" character varying NOT NULL, "difficulty" character varying NOT NULL, "description" text NOT NULL, "starterCode" text NOT NULL, "testCode" text NOT NULL, "docs" character varying, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_623a719329c0b480d2f1c2af3b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759a880c7f18f5f0f8213ff104"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD "moduleId" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1781876ecf48f01ac7832d9f2"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP COLUMN "questionId"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD "questionId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD "moduleId" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5da7b59c8a1ec7fb0cd0bfb885"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP COLUMN "challengeId"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD "challengeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "UQ_cf292339544f890b120a6c0df7e"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP COLUMN "challengeId"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD "challengeId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_759a880c7f18f5f0f8213ff104" ON "qcm_session" ("identityId", "moduleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1781876ecf48f01ac7832d9f2" ON "qcm_answer" ("sessionId", "questionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5da7b59c8a1ec7fb0cd0bfb885" ON "tdt_session" ("identityId", "challengeId") `);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376" UNIQUE ("identityId", "moduleId")`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "UQ_cf292339544f890b120a6c0df7e" UNIQUE ("identityId", "challengeId")`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD CONSTRAINT "FK_a3221dcc4d3fe117b70c546f3b6" FOREIGN KEY ("moduleId") REFERENCES "qcm_module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD CONSTRAINT "FK_d3c9fc5c471f5bb68c7aaa1742c" FOREIGN KEY ("moduleId") REFERENCES "qcm_module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_a661200e32eb2c8435254920e77" FOREIGN KEY ("questionId") REFERENCES "qcm_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "FK_0a0243bb88805a8e11d399b646d" FOREIGN KEY ("moduleId") REFERENCES "qcm_module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD CONSTRAINT "FK_34d3022e0f33b9bd6210d7c6c4a" FOREIGN KEY ("challengeId") REFERENCES "tdt_challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "FK_b9a3eb58cb4bdcdb9e04cc1b630" FOREIGN KEY ("challengeId") REFERENCES "tdt_challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "FK_b9a3eb58cb4bdcdb9e04cc1b630"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP CONSTRAINT "FK_34d3022e0f33b9bd6210d7c6c4a"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "FK_0a0243bb88805a8e11d399b646d"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_a661200e32eb2c8435254920e77"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP CONSTRAINT "FK_d3c9fc5c471f5bb68c7aaa1742c"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP CONSTRAINT "FK_a3221dcc4d3fe117b70c546f3b6"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "UQ_cf292339544f890b120a6c0df7e"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5da7b59c8a1ec7fb0cd0bfb885"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1781876ecf48f01ac7832d9f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759a880c7f18f5f0f8213ff104"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP COLUMN "challengeId"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD "challengeId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "UQ_cf292339544f890b120a6c0df7e" UNIQUE ("challengeId", "identityId")`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP COLUMN "challengeId"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD "challengeId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_5da7b59c8a1ec7fb0cd0bfb885" ON "tdt_session" ("challengeId", "identityId") `);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD "moduleId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376" UNIQUE ("identityId", "moduleId")`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP COLUMN "questionId"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD "questionId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_e1781876ecf48f01ac7832d9f2" ON "qcm_answer" ("questionId", "sessionId") `);
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD "moduleId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_759a880c7f18f5f0f8213ff104" ON "qcm_session" ("identityId", "moduleId") `);
        await queryRunner.query(`DROP TABLE "tdt_challenge"`);
        await queryRunner.query(`DROP TABLE "qcm_module"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3221dcc4d3fe117b70c546f3b"`);
        await queryRunner.query(`DROP TABLE "qcm_question"`);
    }

}
