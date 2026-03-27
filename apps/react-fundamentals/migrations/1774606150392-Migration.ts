import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774606150392 implements MigrationInterface {
    name = 'Migration1774606150392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "uniqueName" character varying NOT NULL, "hasProgress" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_7c2de416adf8615dd6ceda9f490" UNIQUE ("uniqueName"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7c2de416adf8615dd6ceda9f49" ON "game" ("uniqueName") `);
        await queryRunner.query(`CREATE TABLE "game_score" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "gameId" uuid NOT NULL, "bestScore" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_f4d9ff9a33a333d50175f1aef92" UNIQUE ("userId", "gameId"), CONSTRAINT "PK_e4df2b01ce3771ed0c0fe9aaf67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f8e7dc178ee11dec8d78e07bf" ON "game_score" ("userId") `);
        await queryRunner.query(`CREATE TABLE "game_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "gameId" uuid NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "UQ_255f77be5f057612e4d0abd2345" UNIQUE ("userId", "gameId"), CONSTRAINT "PK_de6c047e1eb7ceca5ae545a2b28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ae91de3065e953a495590df18" ON "game_progress" ("userId") `);
        await queryRunner.query(`ALTER TABLE "game_score" ADD CONSTRAINT "FK_5f8e7dc178ee11dec8d78e07bf3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_score" ADD CONSTRAINT "FK_58807993dc20767e26dc060ec63" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_progress" ADD CONSTRAINT "FK_7ae91de3065e953a495590df18b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_progress" ADD CONSTRAINT "FK_282fc303f2caecf74f7af9d802e" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_progress" DROP CONSTRAINT "FK_282fc303f2caecf74f7af9d802e"`);
        await queryRunner.query(`ALTER TABLE "game_progress" DROP CONSTRAINT "FK_7ae91de3065e953a495590df18b"`);
        await queryRunner.query(`ALTER TABLE "game_score" DROP CONSTRAINT "FK_58807993dc20767e26dc060ec63"`);
        await queryRunner.query(`ALTER TABLE "game_score" DROP CONSTRAINT "FK_5f8e7dc178ee11dec8d78e07bf3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ae91de3065e953a495590df18"`);
        await queryRunner.query(`DROP TABLE "game_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f8e7dc178ee11dec8d78e07bf"`);
        await queryRunner.query(`DROP TABLE "game_score"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c2de416adf8615dd6ceda9f49"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
