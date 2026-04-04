import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import type { VideoJob } from '../video-job/video-job.entity';

@Entity('webhook_events')
@ObjectType()
export class WebhookEvent extends BaseEntity {
  @IsOptional()
  @Field({ nullable: true })
  @Column({ nullable: true })
  jobId?: string;

  @IsString()
  @Field()
  @Column()
  source!: string;

  @IsString()
  @Field()
  @Column()
  eventType!: string;

  @IsOptional()
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown>;

  @IsBoolean()
  @Field()
  @Column({ default: false })
  processed!: boolean;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error?: string;

  @ManyToOne('VideoJob', { nullable: true })
  job?: VideoJob;
}

@InputType()
export class CreateWebhookEventInput {
  @IsString()
  @Field()
  source!: string;

  @IsString()
  @Field()
  eventType!: string;

  @IsOptional()
  @Field({ nullable: true })
  jobId?: string;
}

@InputType()
export class UpdateWebhookEventInput extends PartialType(CreateWebhookEventInput) {
  @Field(() => ID)
  id!: string;
}
