import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774606681625 implements MigrationInterface {
    name = 'Migration1774606681625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "hasScore" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "hasScore"`);
    }

}
