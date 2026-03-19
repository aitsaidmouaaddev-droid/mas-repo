import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773938637319 implements MigrationInterface {
    name = 'Migration1773938637319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_module" DROP COLUMN "description"`);
    }

}
