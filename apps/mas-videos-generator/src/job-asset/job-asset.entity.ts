import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import type { VideoJob } from '../video-job/video-job.entity';

export enum AssetType {
  VOICE_AUDIO = 'voice_audio',
  SUBTITLE_EN = 'subtitle_en',
  SUBTITLE_FR = 'subtitle_fr',
  SUBTITLE_AR = 'subtitle_ar',
  THUMBNAIL = 'thumbnail',
  VIDEO = 'video',
  SHORT_1 = 'short_1',
  SHORT_2 = 'short_2',
  SHORT_3 = 'short_3',
}

export enum AssetStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity('job_assets')
@ObjectType()
export class JobAsset extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  jobId!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  versionId?: string;

  @IsString()
  @Field()
  @Column()
  assetType!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  storagePath?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  fileSize?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  durationMs?: number;

  @IsOptional()
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @IsString()
  @Field()
  @Column({ default: AssetStatus.PENDING })
  status!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error?: string;

  @ManyToOne('VideoJob', 'assets', { nullable: false })
  job!: VideoJob;
}

@InputType()
export class CreateJobAssetInput {
  @IsString()
  @Field()
  jobId!: string;

  @IsString()
  @Field()
  assetType!: string;

  @IsOptional()
  @Field({ nullable: true })
  versionId?: string;
}

@InputType()
export class UpdateJobAssetInput extends PartialType(CreateJobAssetInput) {
  @Field(() => ID)
  id!: string;
}
