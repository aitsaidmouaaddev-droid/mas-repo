import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import type { VideoJob } from '../video-job/video-job.entity';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum LogStep {
  SCHEDULER = 'scheduler',
  CLAUDE_GENERATE = 'claude_generate',
  EMAIL_SEND = 'email_send',
  EMAIL_RECEIVE = 'email_receive',
  TTS = 'tts',
  SUBTITLES = 'subtitles',
  RENDER = 'render',
  UPLOAD = 'upload',
  STATUS_CHANGE = 'status_change',
  WEBHOOK = 'webhook',
  RETRY = 'retry',
  VALIDATION = 'validation',
  SYSTEM = 'system',
}

@Entity('job_logs')
@ObjectType()
export class JobLog extends BaseEntity {
  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  jobId?: string;

  @IsString()
  @Field()
  @Column({ default: LogLevel.INFO })
  level!: string;

  @IsString()
  @Field()
  @Column()
  step!: string;

  @IsString()
  @Field()
  @Column({ type: 'text' })
  message!: string;

  @IsOptional()
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @ManyToOne('VideoJob', 'logs', { nullable: true })
  job?: VideoJob;
}

@InputType()
export class CreateJobLogInput {
  @IsString()
  @Field()
  level!: string;

  @IsString()
  @Field()
  step!: string;

  @IsString()
  @Field()
  message!: string;

  @IsOptional()
  @Field({ nullable: true })
  jobId?: string;
}

@InputType()
export class UpdateJobLogInput extends PartialType(CreateJobLogInput) {
  @Field(() => ID)
  id!: string;
}
