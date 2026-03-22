import {
  Field,
  Float,
  ID,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { TdtSession } from '../session/tdt-session.entity';

export enum TdtSubmissionStatus {
  Passed = 'Passed',
  Failed = 'Failed',
}

registerEnumType(TdtSubmissionStatus, { name: 'TdtSubmissionStatus' });

@ObjectType()
export class TdtSubmissionData {
  @Field()
  code!: string;

  @Field(() => Float)
  duration!: number;
}

@Entity('tdt_submission')
@Index(['userId', 'sessionId'])
@ObjectType()
export class TdtSubmission extends BaseEntity {
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field(() => ID)
  @Column()
  sessionId!: string;

  @ManyToOne(() => TdtSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session?: TdtSession;

  @Field(() => TdtSubmissionData)
  @Column({ type: 'jsonb' })
  data!: TdtSubmissionData;

  @IsEnum(TdtSubmissionStatus)
  @Field(() => TdtSubmissionStatus)
  @Column({ type: 'varchar', default: TdtSubmissionStatus.Failed })
  status!: TdtSubmissionStatus;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalTests!: number;

  @Field()
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  submittedAt!: Date;
}

@InputType()
export class TdtSubmissionDataInput {
  @IsString()
  @Field()
  code!: string;

  @IsNumber()
  @Field(() => Float)
  duration!: number;
}

@InputType()
export class CreateTdtSubmissionInput extends PickType(
  TdtSubmission,
  ['sessionId', 'status', 'totalTests'] as const,
  InputType,
) {
  @Field(() => TdtSubmissionDataInput)
  data!: TdtSubmissionDataInput;
}

@InputType()
export class UpdateTdtSubmissionInput extends PartialType(
  PickType(TdtSubmission, ['sessionId', 'status', 'totalTests'] as const, InputType),
) {
  @Field(() => ID)
  id!: string;

  @Field(() => TdtSubmissionDataInput, { nullable: true })
  data?: TdtSubmissionDataInput;
}
