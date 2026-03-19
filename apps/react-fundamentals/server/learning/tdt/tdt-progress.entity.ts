import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '@mas/auth';
import { TdtChallenge } from './tdt-challenge.entity';
import { TdtSubmission } from './tdt-submission.entity';

@Entity('tdt_progress')
@Unique(['identityId', 'challengeId'])
@Index(['identityId'])
@ObjectType()
export class TdtProgress extends BaseEntity {
  @Field(() => ID)
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identityId' })
  identity?: Identity;

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
