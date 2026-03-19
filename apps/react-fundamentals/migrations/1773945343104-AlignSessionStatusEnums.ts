import { MigrationInterface, QueryRunner } from "typeorm";

export class AlignSessionStatusEnums1773945343104 implements MigrationInterface {
    name = 'AlignSessionStatusEnums1773945343104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // QCM session status: snake_case → PascalCase
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'InProgress' WHERE "status" = 'in_progress'`);
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'Completed'  WHERE "status" = 'completed'`);
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'Abandoned'  WHERE "status" = 'abandoned'`);

        // TDT session status: snake_case → PascalCase
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'InProgress' WHERE "status" = 'in_progress'`);
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'Solved'     WHERE "status" = 'solved'`);
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'Abandoned'  WHERE "status" = 'abandoned'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // QCM session status: PascalCase → snake_case
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'in_progress' WHERE "status" = 'InProgress'`);
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'completed'   WHERE "status" = 'Completed'`);
        await queryRunner.query(`UPDATE "qcm_session" SET "status" = 'abandoned'   WHERE "status" = 'Abandoned'`);

        // TDT session status: PascalCase → snake_case
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'in_progress' WHERE "status" = 'InProgress'`);
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'solved'      WHERE "status" = 'Solved'`);
        await queryRunner.query(`UPDATE "tdt_session" SET "status" = 'abandoned'   WHERE "status" = 'Abandoned'`);
    }
}
