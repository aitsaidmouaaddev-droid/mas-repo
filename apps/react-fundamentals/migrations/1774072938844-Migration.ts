import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774072938844 implements MigrationInterface {
    name = 'Migration1774072938844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "passedTests"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "failedTests"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "logs"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "status" character varying NOT NULL DEFAULT 'Failed'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "logs" text`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "failedTests" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "passedTests" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "code" text NOT NULL`);
    }

}
