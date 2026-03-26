import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773888351519 implements MigrationInterface {
    name = 'Migration1773888351519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
    }

}
