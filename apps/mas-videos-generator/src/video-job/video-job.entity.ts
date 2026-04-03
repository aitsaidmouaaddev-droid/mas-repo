import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Subject } from '../subject/subject.entity';
import type { JobVersion } from '../job-version/job-version.entity';
import type { JobAsset } from '../job-asset/job-asset.entity';
import type { EmailEvent } from '../email-event/email-event.entity';
import type { JobLog } from '../job-log/job-log.entity';
import type { StatusTransition } from '../status-transition/status-transition.entity';

export enum VideoJobStatus {
  PENDING = 'pending',
  AWAITING_TRIGGER_CONFIRMATION = 'awaiting_trigger_confirmation',
  EXPIRED = 'expired',
  SKIPPED_TODAY = 'skipped_today',
  DRAFT_GENERATING = 'draft_generating',
  AWAITING_REVIEW = 'awaiting_review',
  REVISION_REQUESTED = 'revision_requested',
  APPROVED = 'approved',
  RENDERING = 'rendering',
  RENDERED = 'rendered',
  UPLOADING = 'uploading',
  UPLOADED_PRIVATE = 'uploaded_private',
  DONE = 'done',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('video_jobs')
@ObjectType()
export class VideoJob extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  subjectId!: string;

  @IsString()
  @Field()
  @Column({ default: VideoJobStatus.PENDING })
  status!: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  versionCount!: number;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  lockKey?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lockedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lockedByInstance?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  triggerTokenExpiresAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  triggerTokenUsedAt?: Date;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  approvedVersionId?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  scheduledDate?: Date;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  retryCount!: number;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  approvedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  renderedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  uploadedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Subject, { nullable: false })
  subject!: Subject;

  @OneToMany('JobVersion', 'job')
  versions!: JobVersion[];

  @OneToMany('JobAsset', 'job')
  assets!: JobAsset[];

  @OneToMany('EmailEvent', 'job')
  emailEvents!: EmailEvent[];

  @OneToMany('JobLog', 'job')
  logs!: JobLog[];

  @OneToMany('StatusTransition', 'job')
  statusTransitions!: StatusTransition[];
}

@InputType()
export class CreateVideoJobInput {
  @IsString()
  @Field()
  subjectId!: string;

  @IsOptional()
  @Field({ nullable: true })
  scheduledDate?: Date;
}

@InputType()
export class UpdateVideoJobInput extends PartialType(CreateVideoJobInput) {
  @Field(() => ID)
  id!: string;
}
