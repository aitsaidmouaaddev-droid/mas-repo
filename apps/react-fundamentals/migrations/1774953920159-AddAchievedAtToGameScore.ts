import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAchievedAtToGameScore1774953920159 implements MigrationInterface {
  name = 'AddAchievedAtToGameScore1774953920159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_score" ADD COLUMN IF NOT EXISTS "achievedAt" TIMESTAMP WITH TIME ZONE DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game_score" DROP COLUMN IF EXISTS "achievedAt"`);
  }
}
