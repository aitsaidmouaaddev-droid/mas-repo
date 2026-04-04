import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import type { VideoJob } from '../video-job/video-job.entity';

export enum EmailDirection {
  SENT = 'sent',
  RECEIVED = 'received',
}

export enum EmailEventType {
  TRIGGER_CONFIRM = 'trigger_confirm',
  REVIEW = 'review',
  REVISION = 'revision',
  APPROVAL_START = 'approval_start',
  UPLOAD_DONE = 'upload_done',
  ERROR_NOTIFY = 'error_notify',
  INBOUND_REVISION = 'inbound_revision',
}

@Entity('email_events')
@ObjectType()
export class EmailEvent extends BaseEntity {
  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  jobId?: string;

  @IsString()
  @Field()
  @Column()
  direction!: string;

  @IsString()
  @Field()
  @Column()
  emailType!: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  toAddress?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  fromAddress?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  subject?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bodyHtml?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bodyText?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  gmailMessageId?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  gmailThreadId?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  actionTokenExpiresAt?: Date;

  @IsOptional()
  @Field()
  @Column({ default: false })
  actionTokenUsed!: boolean;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  sentAt?: Date;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  receivedAt?: Date;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  parsedInstruction?: string;

  @ManyToOne('VideoJob', 'emailEvents', { nullable: true })
  job?: VideoJob;
}

@InputType()
export class CreateEmailEventInput {
  @IsString()
  @Field()
  direction!: string;

  @IsString()
  @Field()
  emailType!: string;

  @IsOptional()
  @Field({ nullable: true })
  jobId?: string;
}

@InputType()
export class UpdateEmailEventInput extends PartialType(CreateEmailEventInput) {
  @Field(() => ID)
  id!: string;
}
