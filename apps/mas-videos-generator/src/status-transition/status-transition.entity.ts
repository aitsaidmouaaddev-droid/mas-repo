import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import type { VideoJob } from '../video-job/video-job.entity';

export enum TransitionTrigger {
  SCHEDULER = 'scheduler',
  EMAIL_ACTION = 'email_action',
  USER_BO = 'user_bo',
  SYSTEM = 'system',
  RETRY = 'retry',
}

@Entity('status_transitions')
@ObjectType()
export class StatusTransition extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  jobId!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  fromStatus?: string;

  @IsString()
  @Field()
  @Column()
  toStatus!: string;

  @IsString()
  @Field()
  @Column()
  triggeredBy!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  actorId?: string;

  @ManyToOne('VideoJob', 'statusTransitions', { nullable: false })
  job!: VideoJob;
}

@InputType()
export class CreateStatusTransitionInput {
  @IsString()
  @Field()
  jobId!: string;

  @IsString()
  @Field()
  toStatus!: string;

  @IsString()
  @Field()
  triggeredBy!: string;

  @IsOptional()
  @Field({ nullable: true })
  fromStatus?: string;

  @IsOptional()
  @Field({ nullable: true })
  actorId?: string;
}

@InputType()
export class UpdateStatusTransitionInput extends PartialType(CreateStatusTransitionInput) {
  @Field(() => ID)
  id!: string;
}
