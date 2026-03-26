import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773960433066 implements MigrationInterface {
    name = 'Migration1773960433066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" ADD "category" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "qcm_module" ALTER COLUMN "category" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" DROP COLUMN "category"`);
    }

}
