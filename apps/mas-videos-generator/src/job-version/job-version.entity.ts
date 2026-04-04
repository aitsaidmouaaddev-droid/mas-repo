import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { VideoJobData } from './video-job-data.types';
import type { VideoJob } from '../video-job/video-job.entity';

export enum JobVersionStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  SUPERSEDED = 'superseded',
}

@Entity('job_versions')
@ObjectType()
export class JobVersion extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  jobId!: string;

  @IsInt()
  @Min(1)
  @Field(() => Int)
  @Column({ type: 'int' })
  versionNumber!: number;

  @IsString()
  @Field()
  @Column({ default: JobVersionStatus.DRAFT })
  status!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  promptSent?: string;

  @Field(() => VideoJobData)
  @Column({ type: 'jsonb' })
  data!: VideoJobData;

  @IsBoolean()
  @Field()
  @Column({ default: false })
  isApproved!: boolean;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  approvedAt?: Date;

  @ManyToOne('VideoJob', 'versions', { nullable: false })
  job!: VideoJob;
}

@InputType()
export class CreateJobVersionInput {
  @IsString()
  @Field()
  jobId!: string;

  @IsInt()
  @Min(1)
  @Field(() => Int)
  versionNumber!: number;

  @IsOptional()
  @Field({ nullable: true })
  promptSent?: string;
}

@InputType()
export class UpdateJobVersionInput extends PartialType(CreateJobVersionInput) {
  @Field(() => ID)
  id!: string;
}
