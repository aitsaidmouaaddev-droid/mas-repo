import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1743724800000 implements MigrationInterface {
  name = 'InitSchema1743724800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "subjects" (
        "id"               uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"        TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"        TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"        boolean           NOT NULL DEFAULT false,
        "deletedAt"        TIMESTAMP,
        "topic"            character varying NOT NULL,
        "targetDuration"   integer,
        "targetPlatforms"  jsonb             NOT NULL DEFAULT '["youtube"]',
        "generateShorts"   boolean           NOT NULL DEFAULT false,
        "voiceLanguage"    character varying NOT NULL DEFAULT 'en',
        "status"           character varying NOT NULL DEFAULT 'pending',
        "priority"         integer           NOT NULL DEFAULT 0,
        "scheduledFor"     date,
        "isActive"         boolean           NOT NULL DEFAULT true,
        "editorialData"    jsonb,
        CONSTRAINT "PK_subjects" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "video_jobs" (
        "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"               TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"               TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"               boolean           NOT NULL DEFAULT false,
        "deletedAt"               TIMESTAMP,
        "subjectId"               uuid              NOT NULL,
        "status"                  character varying NOT NULL DEFAULT 'pending',
        "versionCount"            integer           NOT NULL DEFAULT 0,
        "lockKey"                 character varying UNIQUE,
        "lockedAt"                TIMESTAMP,
        "lockedByInstance"        character varying,
        "triggerTokenExpiresAt"   TIMESTAMP,
        "triggerTokenUsedAt"      TIMESTAMP,
        "approvedVersionId"       uuid,
        "scheduledDate"           date,
        "retryCount"              integer           NOT NULL DEFAULT 0,
        "errorMessage"            text,
        "startedAt"               TIMESTAMP,
        "approvedAt"              TIMESTAMP,
        "renderedAt"              TIMESTAMP,
        "uploadedAt"              TIMESTAMP,
        "completedAt"             TIMESTAMP,
        CONSTRAINT "PK_video_jobs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "video_jobs"
        ADD CONSTRAINT "FK_video_jobs_subjects"
        FOREIGN KEY ("subjectId")
        REFERENCES "subjects"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "job_versions" (
        "id"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"      TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"      TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"      boolean           NOT NULL DEFAULT false,
        "deletedAt"      TIMESTAMP,
        "jobId"          uuid              NOT NULL,
        "versionNumber"  integer           NOT NULL,
        "status"         character varying NOT NULL DEFAULT 'draft',
        "promptSent"     text,
        "data"           jsonb             NOT NULL,
        "isApproved"     boolean           NOT NULL DEFAULT false,
        "approvedAt"     TIMESTAMP,
        CONSTRAINT "PK_job_versions" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "job_versions"
        ADD CONSTRAINT "FK_job_versions_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "job_assets" (
        "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"    TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"    boolean           NOT NULL DEFAULT false,
        "deletedAt"    TIMESTAMP,
        "jobId"        uuid              NOT NULL,
        "versionId"    uuid,
        "assetType"    character varying NOT NULL,
        "storagePath"  character varying,
        "fileSize"     integer,
        "durationMs"   integer,
        "metadata"     jsonb,
        "status"       character varying NOT NULL DEFAULT 'pending',
        "error"        text,
        CONSTRAINT "PK_job_assets" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "job_assets"
        ADD CONSTRAINT "FK_job_assets_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "email_events" (
        "id"                     uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"              TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"              TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"              boolean           NOT NULL DEFAULT false,
        "deletedAt"              TIMESTAMP,
        "jobId"                  uuid,
        "direction"              character varying NOT NULL,
        "emailType"              character varying NOT NULL,
        "toAddress"              character varying,
        "fromAddress"            character varying,
        "subject"                character varying,
        "bodyHtml"               text,
        "bodyText"               text,
        "gmailMessageId"         character varying,
        "gmailThreadId"          character varying,
        "actionTokenExpiresAt"   TIMESTAMP,
        "actionTokenUsed"        boolean           NOT NULL DEFAULT false,
        "sentAt"                 TIMESTAMP,
        "receivedAt"             TIMESTAMP,
        "parsedInstruction"      text,
        CONSTRAINT "PK_email_events" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "email_events"
        ADD CONSTRAINT "FK_email_events_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "webhook_events" (
        "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"  TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"  boolean           NOT NULL DEFAULT false,
        "deletedAt"  TIMESTAMP,
        "jobId"      uuid,
        "source"     character varying NOT NULL,
        "eventType"  character varying NOT NULL,
        "payload"    jsonb,
        "processed"  boolean           NOT NULL DEFAULT false,
        "error"      text,
        CONSTRAINT "PK_webhook_events" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "webhook_events"
        ADD CONSTRAINT "FK_webhook_events_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "job_logs" (
        "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted" boolean           NOT NULL DEFAULT false,
        "deletedAt" TIMESTAMP,
        "jobId"     uuid,
        "level"     character varying NOT NULL DEFAULT 'info',
        "step"      character varying NOT NULL,
        "message"   text              NOT NULL,
        "metadata"  jsonb,
        CONSTRAINT "PK_job_logs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "job_logs"
        ADD CONSTRAINT "FK_job_logs_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "status_transitions" (
        "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"    TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP         NOT NULL DEFAULT now(),
        "isDeleted"    boolean           NOT NULL DEFAULT false,
        "deletedAt"    TIMESTAMP,
        "jobId"        uuid              NOT NULL,
        "fromStatus"   character varying,
        "toStatus"     character varying NOT NULL,
        "triggeredBy"  character varying NOT NULL,
        "actorId"      uuid,
        CONSTRAINT "PK_status_transitions" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "status_transitions"
        ADD CONSTRAINT "FK_status_transitions_video_jobs"
        FOREIGN KEY ("jobId")
        REFERENCES "video_jobs"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE INDEX "IDX_subjects_status_active" ON "subjects" ("status", "isActive")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_subjects_scheduled_for" ON "subjects" ("scheduledFor")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_video_jobs_subject_id" ON "video_jobs" ("subjectId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_video_jobs_status" ON "video_jobs" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_video_jobs_scheduled_date" ON "video_jobs" ("scheduledDate")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_job_versions_job_id" ON "job_versions" ("jobId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_job_assets_job_id" ON "job_assets" ("jobId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_email_events_job_id" ON "email_events" ("jobId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_email_events_gmail_thread" ON "email_events" ("gmailThreadId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_job_logs_job_id_level" ON "job_logs" ("jobId", "level")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_status_transitions_job_id" ON "status_transitions" ("jobId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_status_transitions_job_id"`);
    await queryRunner.query(`DROP INDEX "IDX_job_logs_job_id_level"`);
    await queryRunner.query(`DROP INDEX "IDX_email_events_gmail_thread"`);
    await queryRunner.query(`DROP INDEX "IDX_email_events_job_id"`);
    await queryRunner.query(`DROP INDEX "IDX_job_assets_job_id"`);
    await queryRunner.query(`DROP INDEX "IDX_job_versions_job_id"`);
    await queryRunner.query(`DROP INDEX "IDX_video_jobs_scheduled_date"`);
    await queryRunner.query(`DROP INDEX "IDX_video_jobs_status"`);
    await queryRunner.query(`DROP INDEX "IDX_video_jobs_subject_id"`);
    await queryRunner.query(`DROP INDEX "IDX_subjects_scheduled_for"`);
    await queryRunner.query(`DROP INDEX "IDX_subjects_status_active"`);

    await queryRunner.query(`DROP TABLE "status_transitions"`);
    await queryRunner.query(`DROP TABLE "job_logs"`);
    await queryRunner.query(`DROP TABLE "webhook_events"`);
    await queryRunner.query(`DROP TABLE "email_events"`);
    await queryRunner.query(`DROP TABLE "job_assets"`);
    await queryRunner.query(`DROP TABLE "job_versions"`);
    await queryRunner.query(`DROP TABLE "video_jobs"`);
    await queryRunner.query(`DROP TABLE "subjects"`);
  }
}
