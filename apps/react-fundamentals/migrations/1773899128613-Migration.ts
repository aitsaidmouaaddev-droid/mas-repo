import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773899128613 implements MigrationInterface {
    name = 'Migration1773899128613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qcm_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "identityId" uuid NOT NULL, "moduleId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'in_progress', "score" integer, "totalQuestions" integer NOT NULL DEFAULT '0', "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "completedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_760305ac93aeaea3af0a3219ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_759a880c7f18f5f0f8213ff104" ON "qcm_session" ("identityId", "moduleId") `);
        await queryRunner.query(`CREATE TABLE "qcm_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "sessionId" uuid NOT NULL, "questionId" character varying NOT NULL, "selectedOption" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "timeSpentMs" integer, "answeredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "PK_ddde46c926832025fad77ed8aa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e1781876ecf48f01ac7832d9f2" ON "qcm_answer" ("sessionId", "questionId") `);
        await queryRunner.query(`CREATE TABLE "qcm_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "identityId" uuid NOT NULL, "moduleId" character varying NOT NULL, "attemptsCount" integer NOT NULL DEFAULT '0', "bestScore" double precision, "isCompleted" boolean NOT NULL DEFAULT false, "firstCompletedAt" TIMESTAMP WITH TIME ZONE, "lastAttemptAt" TIMESTAMP WITH TIME ZONE, "lastSessionId" uuid, CONSTRAINT "UQ_2e9456d7c518b34ab77f2479376" UNIQUE ("identityId", "moduleId"), CONSTRAINT "PK_2732278bebe253311ad2b50a3a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f7e7e7240b1d685fe02b7ffee" ON "qcm_progress" ("identityId") `);
        await queryRunner.query(`CREATE TABLE "tdt_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "identityId" uuid NOT NULL, "challengeId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'in_progress', "attemptsCount" integer NOT NULL DEFAULT '0', "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "solvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_90df56f16e8e364e9be18dbf13d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5da7b59c8a1ec7fb0cd0bfb885" ON "tdt_session" ("identityId", "challengeId") `);
        await queryRunner.query(`CREATE TABLE "tdt_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "sessionId" uuid NOT NULL, "code" text NOT NULL, "passedTests" integer NOT NULL DEFAULT '0', "failedTests" integer NOT NULL DEFAULT '0', "totalTests" integer NOT NULL DEFAULT '0', "logs" text, "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "PK_a8f3bbe7277ae96c828eb6ef9a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b9ae6df0ad4e9a36807969f292" ON "tdt_submission" ("sessionId") `);
        await queryRunner.query(`CREATE TABLE "tdt_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "identityId" uuid NOT NULL, "challengeId" character varying NOT NULL, "isSolved" boolean NOT NULL DEFAULT false, "totalAttempts" integer NOT NULL DEFAULT '0', "firstSolvedAt" TIMESTAMP WITH TIME ZONE, "lastAttemptAt" TIMESTAMP WITH TIME ZONE, "bestSubmissionId" uuid, CONSTRAINT "UQ_cf292339544f890b120a6c0df7e" UNIQUE ("identityId", "challengeId"), CONSTRAINT "PK_96e928db7a23ad7b1a97fb45ac4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a841e77d4a0e40664b3253a56" ON "tdt_progress" ("identityId") `);
        await queryRunner.query(`ALTER TABLE "qcm_session" ADD CONSTRAINT "FK_1ad4844d4435994021947c23d2d" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_32c92937f5977ebd189b3f762a5" FOREIGN KEY ("sessionId") REFERENCES "qcm_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "FK_6f7e7e7240b1d685fe02b7ffeea" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" ADD CONSTRAINT "FK_b6e04dd5d4bae3d29382b767c7f" FOREIGN KEY ("lastSessionId") REFERENCES "qcm_session"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_session" ADD CONSTRAINT "FK_a75955a99e72091491cd7f01665" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" ADD CONSTRAINT "FK_b9ae6df0ad4e9a36807969f292f" FOREIGN KEY ("sessionId") REFERENCES "tdt_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "FK_6a841e77d4a0e40664b3253a563" FOREIGN KEY ("identityId") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" ADD CONSTRAINT "FK_df477a96af4fc64539b195eb88a" FOREIGN KEY ("bestSubmissionId") REFERENCES "tdt_submission"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "FK_df477a96af4fc64539b195eb88a"`);
        await queryRunner.query(`ALTER TABLE "tdt_progress" DROP CONSTRAINT "FK_6a841e77d4a0e40664b3253a563"`);
        await queryRunner.query(`ALTER TABLE "tdt_submission" DROP CONSTRAINT "FK_b9ae6df0ad4e9a36807969f292f"`);
        await queryRunner.query(`ALTER TABLE "tdt_session" DROP CONSTRAINT "FK_a75955a99e72091491cd7f01665"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "FK_b6e04dd5d4bae3d29382b767c7f"`);
        await queryRunner.query(`ALTER TABLE "qcm_progress" DROP CONSTRAINT "FK_6f7e7e7240b1d685fe02b7ffeea"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_32c92937f5977ebd189b3f762a5"`);
        await queryRunner.query(`ALTER TABLE "qcm_session" DROP CONSTRAINT "FK_1ad4844d4435994021947c23d2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a841e77d4a0e40664b3253a56"`);
        await queryRunner.query(`DROP TABLE "tdt_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9ae6df0ad4e9a36807969f292"`);
        await queryRunner.query(`DROP TABLE "tdt_submission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5da7b59c8a1ec7fb0cd0bfb885"`);
        await queryRunner.query(`DROP TABLE "tdt_session"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f7e7e7240b1d685fe02b7ffee"`);
        await queryRunner.query(`DROP TABLE "qcm_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1781876ecf48f01ac7832d9f2"`);
        await queryRunner.query(`DROP TABLE "qcm_answer"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759a880c7f18f5f0f8213ff104"`);
        await queryRunner.query(`DROP TABLE "qcm_session"`);
    }

}
