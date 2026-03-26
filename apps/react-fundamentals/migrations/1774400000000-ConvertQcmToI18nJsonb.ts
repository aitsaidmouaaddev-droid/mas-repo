import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertQcmToI18nJsonb1774400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert label varchar → jsonb
    await queryRunner.query(`
      ALTER TABLE qcm_module
        ALTER COLUMN label TYPE jsonb USING jsonb_build_object('en', label);
    `);

    // Convert description text → jsonb
    await queryRunner.query(`
      ALTER TABLE qcm_module
        ALTER COLUMN description TYPE jsonb USING
          CASE WHEN description IS NULL THEN NULL
               ELSE jsonb_build_object('en', description)
          END;
    `);

    // Wrap question/choices/explanation in qcm_question.data
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(
            data,
            '{question}',
            jsonb_build_object('en', data->>'question')
          ),
          '{choices}',
          jsonb_build_object('en', data->'choices')
        ),
        '{explanation}',
        CASE
          WHEN data->>'explanation' IS NULL THEN 'null'::jsonb
          ELSE jsonb_build_object('en', data->>'explanation')
        END
      )
      WHERE data->>'question' IS NOT NULL
        AND (data->'question') IS NOT NULL
        AND jsonb_typeof(data->'question') = 'string';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert label jsonb → varchar
    await queryRunner.query(`
      ALTER TABLE qcm_module
        ALTER COLUMN label TYPE varchar USING label->>'en';
    `);

    // Revert description jsonb → text
    await queryRunner.query(`
      ALTER TABLE qcm_module
        ALTER COLUMN description TYPE text USING description->>'en';
    `);

    // Revert question data
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(
            data,
            '{question}',
            to_jsonb(data->'question'->>'en')
          ),
          '{choices}',
          data->'choices'->'en'
        ),
        '{explanation}',
        CASE
          WHEN data->'explanation' IS NULL OR data->'explanation' = 'null'::jsonb THEN 'null'::jsonb
          ELSE to_jsonb(data->'explanation'->>'en')
        END
      )
      WHERE data->'question' IS NOT NULL
        AND jsonb_typeof(data->'question') = 'object';
    `);
  }
}
