import { Field, ID, InputType, Int, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { TdtChallenge } from '../challenge/tdt-challenge.entity';
import { TdtSubmission } from '../submission/tdt-submission.entity';

@Entity('tdt_progress')
@Unique(['userId', 'challengeId'])
@Index(['userId'])
@ObjectType()
export class TdtProgress extends BaseEntity {
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field()
  @Column()
  challengeId!: string;

  @ManyToOne(() => TdtChallenge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  challenge?: TdtChallenge;

  @Field()
  @Column({ default: false })
  isSolved!: boolean;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalAttempts!: number;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  firstSolvedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastAttemptAt?: Date;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  bestSubmissionId?: string;

  @ManyToOne(() => TdtSubmission, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bestSubmissionId' })
  bestSubmission?: TdtSubmission;
}

@InputType()
export class CreateTdtProgressInput extends PickType(TdtProgress, ['challengeId'] as const, InputType) {}

@InputType()
export class UpdateTdtProgressInput extends PartialType(
  PickType(
    TdtProgress,
    ['challengeId', 'isSolved', 'totalAttempts', 'firstSolvedAt', 'lastAttemptAt', 'bestSubmissionId'] as const,
    InputType,
  ),
) {
  @Field(() => ID)
  id!: string;
}
