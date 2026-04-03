import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775226465083 implements MigrationInterface {
  name = 'Migration1775226465083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_jobs" DROP CONSTRAINT "FK_video_jobs_subjects"`);
    await queryRunner.query(
      `ALTER TABLE "job_versions" DROP CONSTRAINT "FK_job_versions_video_jobs"`,
    );
    await queryRunner.query(`ALTER TABLE "job_assets" DROP CONSTRAINT "FK_job_assets_video_jobs"`);
    await queryRunner.query(
      `ALTER TABLE "email_events" DROP CONSTRAINT "FK_email_events_video_jobs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_events" DROP CONSTRAINT "FK_webhook_events_video_jobs"`,
    );
    await queryRunner.query(`ALTER TABLE "job_logs" DROP CONSTRAINT "FK_job_logs_video_jobs"`);
    await queryRunner.query(
      `ALTER TABLE "status_transitions" DROP CONSTRAINT "FK_status_transitions_video_jobs"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_subjects_status_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_subjects_scheduled_for"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_video_jobs_subject_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_video_jobs_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_video_jobs_scheduled_date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_job_versions_job_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_job_assets_job_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_email_events_job_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_email_events_gmail_thread"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_job_logs_job_id_level"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_status_transitions_job_id"`);
    await queryRunner.query(`ALTER TABLE "video_jobs" DROP COLUMN "approvedVersionId"`);
    await queryRunner.query(`ALTER TABLE "video_jobs" ADD "approvedVersionId" character varying`);
    await queryRunner.query(`ALTER TABLE "job_assets" DROP COLUMN "versionId"`);
    await queryRunner.query(`ALTER TABLE "job_assets" ADD "versionId" character varying`);
    await queryRunner.query(`ALTER TABLE "status_transitions" DROP COLUMN "actorId"`);
    await queryRunner.query(`ALTER TABLE "status_transitions" ADD "actorId" character varying`);
    await queryRunner.query(
      `ALTER TABLE "video_jobs" ADD CONSTRAINT "FK_e25ef7c3459b0c777dfc437a94a" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_versions" ADD CONSTRAINT "FK_785d207a8bb8e76d83b308504fa" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_assets" ADD CONSTRAINT "FK_c4ceef52f2ed82f6a9cb7dae8c2" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_events" ADD CONSTRAINT "FK_5490d525d242a8b3a5dbf4f270d" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_events" ADD CONSTRAINT "FK_470594bbf09cc961f704a69e768" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_logs" ADD CONSTRAINT "FK_35fcfcba9d292c0c1738b8edd97" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "status_transitions" ADD CONSTRAINT "FK_3ebfb2876d7118797757d026aa7" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "status_transitions" DROP CONSTRAINT "FK_3ebfb2876d7118797757d026aa7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_logs" DROP CONSTRAINT "FK_35fcfcba9d292c0c1738b8edd97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_events" DROP CONSTRAINT "FK_470594bbf09cc961f704a69e768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_events" DROP CONSTRAINT "FK_5490d525d242a8b3a5dbf4f270d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_assets" DROP CONSTRAINT "FK_c4ceef52f2ed82f6a9cb7dae8c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_versions" DROP CONSTRAINT "FK_785d207a8bb8e76d83b308504fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_jobs" DROP CONSTRAINT "FK_e25ef7c3459b0c777dfc437a94a"`,
    );
    await queryRunner.query(`ALTER TABLE "status_transitions" DROP COLUMN "actorId"`);
    await queryRunner.query(`ALTER TABLE "status_transitions" ADD "actorId" uuid`);
    await queryRunner.query(`ALTER TABLE "job_assets" DROP COLUMN "versionId"`);
    await queryRunner.query(`ALTER TABLE "job_assets" ADD "versionId" uuid`);
    await queryRunner.query(`ALTER TABLE "video_jobs" DROP COLUMN "approvedVersionId"`);
    await queryRunner.query(`ALTER TABLE "video_jobs" ADD "approvedVersionId" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_status_transitions_job_id" ON "status_transitions" ("jobId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_job_logs_job_id_level" ON "job_logs" ("jobId", "level") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_email_events_gmail_thread" ON "email_events" ("gmailThreadId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_email_events_job_id" ON "email_events" ("jobId") `);
    await queryRunner.query(`CREATE INDEX "IDX_job_assets_job_id" ON "job_assets" ("jobId") `);
    await queryRunner.query(`CREATE INDEX "IDX_job_versions_job_id" ON "job_versions" ("jobId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_video_jobs_scheduled_date" ON "video_jobs" ("scheduledDate") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_video_jobs_status" ON "video_jobs" ("status") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_video_jobs_subject_id" ON "video_jobs" ("subjectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_subjects_scheduled_for" ON "subjects" ("scheduledFor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_subjects_status_active" ON "subjects" ("isActive", "status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "status_transitions" ADD CONSTRAINT "FK_status_transitions_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_logs" ADD CONSTRAINT "FK_job_logs_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_events" ADD CONSTRAINT "FK_webhook_events_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_events" ADD CONSTRAINT "FK_email_events_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_assets" ADD CONSTRAINT "FK_job_assets_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_versions" ADD CONSTRAINT "FK_job_versions_video_jobs" FOREIGN KEY ("jobId") REFERENCES "video_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_jobs" ADD CONSTRAINT "FK_video_jobs_subjects" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
