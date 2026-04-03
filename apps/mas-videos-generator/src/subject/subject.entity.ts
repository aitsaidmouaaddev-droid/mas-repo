import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';

export enum SubjectStatus {
  PENDING = 'pending',
  AWAITING_TRIGGER_CONFIRMATION = 'awaiting_trigger_confirmation',
  SKIPPED_TODAY = 'skipped_today',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ARCHIVED = 'archived',
}

@ObjectType()
export class SubjectEditorialData {
  @Field({ nullable: true })
  tone?: string;

  @Field({ nullable: true })
  cta?: string;

  @Field(() => [String], { nullable: true })
  forbiddenWords?: string[];

  @Field({ nullable: true })
  angle?: string;

  @Field(() => [String], { nullable: true })
  references?: string[];

  @Field({ nullable: true })
  notes?: string;
}

@Entity('subjects')
@ObjectType()
export class Subject extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  topic!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  targetDuration?: number;

  @Field(() => [String])
  @Column({ type: 'jsonb', default: '["youtube"]' })
  targetPlatforms!: string[];

  @IsBoolean()
  @Field()
  @Column({ default: false })
  generateShorts!: boolean;

  @IsString()
  @Field()
  @Column({ default: 'en' })
  voiceLanguage!: string;

  @IsString()
  @Field()
  @Column({ default: SubjectStatus.PENDING })
  status!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  priority!: number;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  scheduledFor?: Date;

  @IsBoolean()
  @Field()
  @Column({ default: true })
  isActive!: boolean;

  @IsOptional()
  @Field(() => SubjectEditorialData, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  editorialData?: SubjectEditorialData;
}

@InputType()
export class SubjectEditorialDataInput {
  @IsOptional()
  @Field({ nullable: true })
  tone?: string;

  @IsOptional()
  @Field({ nullable: true })
  cta?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  forbiddenWords?: string[];

  @IsOptional()
  @Field({ nullable: true })
  angle?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  references?: string[];

  @IsOptional()
  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class CreateSubjectInput {
  @IsString()
  @Field()
  topic!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  targetDuration?: number;

  @Field(() => [String])
  targetPlatforms!: string[];

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  generateShorts?: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  voiceLanguage?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  priority?: number;

  @IsOptional()
  @Field({ nullable: true })
  scheduledFor?: Date;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;

  @IsOptional()
  @Field(() => SubjectEditorialDataInput, { nullable: true })
  editorialData?: SubjectEditorialDataInput;
}

@InputType()
export class UpdateSubjectInput extends PartialType(CreateSubjectInput) {
  @Field(() => ID)
  id!: string;
}
