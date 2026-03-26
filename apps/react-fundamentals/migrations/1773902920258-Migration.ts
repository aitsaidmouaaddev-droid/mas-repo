import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773902920258 implements MigrationInterface {
    name = 'Migration1773902920258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "question"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "choices"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "explanation"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "docs"`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" DROP COLUMN "starterCode"`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" DROP COLUMN "testCode"`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" DROP COLUMN "docs"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" ADD "data" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_challenge" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "qcm_question" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" ADD "docs" character varying`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" ADD "testCode" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" ADD "starterCode" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_challenge" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "docs" character varying`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "explanation" text`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "answer" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "choices" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "question" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qcm_question" ADD "tags" jsonb NOT NULL DEFAULT '[]'`);
    }

}
