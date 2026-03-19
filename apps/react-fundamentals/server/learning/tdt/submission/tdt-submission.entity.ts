import { Field, ID, InputType, Int, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { TdtSession } from '../session/tdt-session.entity';

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

  @Field()
  @Column({ type: 'text' })
  code!: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  passedTests!: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  failedTests!: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalTests!: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  logs?: string;

  @Field()
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  submittedAt!: Date;
}

@InputType()
export class CreateTdtSubmissionInput extends PickType(
  TdtSubmission,
  ['sessionId', 'code', 'passedTests', 'failedTests', 'totalTests', 'logs'] as const,
  InputType,
) {}

@InputType()
export class UpdateTdtSubmissionInput extends PartialType(
  PickType(
    TdtSubmission,
    ['sessionId', 'code', 'passedTests', 'failedTests', 'totalTests', 'logs'] as const,
    InputType,
  ),
) {
  @Field(() => ID)
  id!: string;
}
