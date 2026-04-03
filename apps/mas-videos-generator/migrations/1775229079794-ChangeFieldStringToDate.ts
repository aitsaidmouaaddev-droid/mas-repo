import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFieldStringToDate1775229079794 implements MigrationInterface {
  name = 'ChangeFieldStringToDate1775229079794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "scheduledFor"`);
    await queryRunner.query(`ALTER TABLE "subjects" ADD "scheduledFor" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "video_jobs" DROP COLUMN "scheduledDate"`);
    await queryRunner.query(
      `ALTER TABLE "video_jobs" ADD "scheduledDate" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_jobs" DROP COLUMN "scheduledDate"`);
    await queryRunner.query(`ALTER TABLE "video_jobs" ADD "scheduledDate" date`);
    await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "scheduledFor"`);
    await queryRunner.query(`ALTER TABLE "subjects" ADD "scheduledFor" date`);
  }
}
