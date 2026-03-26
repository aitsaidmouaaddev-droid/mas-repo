import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773905493284 implements MigrationInterface {
    name = 'Migration1773905493284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP CONSTRAINT "FK_1ad4844d4435994021947c23d2d"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "FK_6f7e7e7240b1d685fe02b7ffeea"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP CONSTRAINT "FK_a75955a99e72091491cd7f01665"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "FK_6a841e77d4a0e40664b3253a563"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759a880c7f18f5f0f8213ff104"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f7e7e7240b1d685fe02b7ffee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5da7b59c8a1ec7fb0cd0bfb885"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9ae6df0ad4e9a36807969f292"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a841e77d4a0e40664b3253a56"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "UQ_cf292339544f890b120a6c0df7e"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" RENAME COLUMN "identityId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" RENAME COLUMN "identityId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" RENAME COLUMN "identityId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" RENAME COLUMN "identityId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a4a1ef074f7a67392c7d6480da" ON "qcm_session" ("userId", "moduleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad2c4c642d74bce5d927ccc70b" ON "qcm_answer" ("userId", "sessionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4b3e7a8096c10de51a4926fe15" ON "qcm_progress" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc87b26de2f2812ec904f5b0c8" ON "tdt_session" ("userId", "challengeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3af026e74bc6261746d6b6f5f8" ON "tdt_submission" ("userId", "sessionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8013b4e83e1a451803e68d1ff7" ON "tdt_progress" ("userId") `);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "UQ_2993bc15a81e684ec7086613ed8" UNIQUE ("userId", "moduleId")`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "UQ_7cef3df7150d8134bf4911f56ed" UNIQUE ("userId", "challengeId")`);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD CONSTRAINT "FK_1adefe6fcf484ac6a3dd62f318b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_700512576b3227d60cf0ea02762" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "FK_4b3e7a8096c10de51a4926fe154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD CONSTRAINT "FK_d1593ae5a6c228c4986a49759b1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD CONSTRAINT "FK_78682e9bfe07902158b82c2a54c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "FK_8013b4e83e1a451803e68d1ff76" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "FK_8013b4e83e1a451803e68d1ff76"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP CONSTRAINT "FK_78682e9bfe07902158b82c2a54c"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP CONSTRAINT "FK_d1593ae5a6c228c4986a49759b1"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "FK_4b3e7a8096c10de51a4926fe154"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_700512576b3227d60cf0ea02762"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP CONSTRAINT "FK_1adefe6fcf484ac6a3dd62f318b"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "UQ_7cef3df7150d8134bf4911f56ed"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "UQ_2993bc15a81e684ec7086613ed8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8013b4e83e1a451803e68d1ff7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3af026e74bc6261746d6b6f5f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc87b26de2f2812ec904f5b0c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b3e7a8096c10de51a4926fe15"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad2c4c642d74bce5d927ccc70b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4a1ef074f7a67392c7d6480da"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" RENAME COLUMN "userId" TO "identityId"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" RENAME COLUMN "userId" TO "identityId"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" RENAME COLUMN "userId" TO "identityId"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" RENAME COLUMN "userId" TO "identityId"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "UQ_cf292339544f890b120a6c0df7e" UNIQUE ("challengeId", "identityId")`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376" UNIQUE ("identityId", "moduleId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6a841e77d4a0e40664b3253a56" ON "tdt_progress" ("identityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9ae6df0ad4e9a36807969f292" ON "tdt_submission" ("sessionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5da7b59c8a1ec7fb0cd0bfb885" ON "tdt_session" ("challengeId", "identityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f7e7e7240b1d685fe02b7ffee" ON "qcm_progress" ("identityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_759a880c7f18f5f0f8213ff104" ON "qcm_session" ("identityId", "moduleId") `);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "FK_6a841e77d4a0e40664b3253a563" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD CONSTRAINT "FK_a75955a99e72091491cd7f01665" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "FK_6f7e7e7240b1d685fe02b7ffeea" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD CONSTRAINT "FK_1ad4844d4435994021947c23d2d" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
