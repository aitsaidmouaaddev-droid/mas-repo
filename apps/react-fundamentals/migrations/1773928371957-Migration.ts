import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773928371957 implements MigrationInterface {
    name = 'Migration1773928371957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" date`);
    }

}
