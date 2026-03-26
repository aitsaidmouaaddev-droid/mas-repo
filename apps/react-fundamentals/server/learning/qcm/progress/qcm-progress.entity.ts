import { Field, Float, ID, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { QcmModule } from '../module/qcm-module.entity';
import { QcmSession } from '../session/qcm-session.entity';

@Entity('qcm_progress')
@Unique(['userId', 'moduleId'])
@Index(['userId'])
@ObjectType()
export class QcmProgress extends BaseEntity {
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field()
  @Column()
  moduleId!: string;

  @ManyToOne(() => QcmModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module?: QcmModule;

  @Field()
  @Column({ type: 'int', default: 0 })
  attemptsCount!: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  bestScore?: number;

  @Field()
  @Column({ default: false })
  isCompleted!: boolean;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  firstCompletedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastAttemptAt?: Date;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  lastSessionId?: string;

  @ManyToOne(() => QcmSession, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastSessionId' })
  lastSession?: QcmSession;
}

@InputType()
export class CreateQcmProgressInput extends PickType(QcmProgress, ['moduleId'] as const, InputType) {}

@InputType()
export class UpdateQcmProgressInput extends PartialType(
  PickType(
    QcmProgress,
    ['moduleId', 'attemptsCount', 'bestScore', 'isCompleted', 'firstCompletedAt', 'lastAttemptAt', 'lastSessionId'] as const,
    InputType,
  ),
) {
  @Field(() => ID)
  id!: string;
}
