import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '@mas/auth';
import { QcmModule } from './qcm-module.entity';
import { QcmSession } from './qcm-session.entity';

@Entity('qcm_progress')
@Unique(['identityId', 'moduleId'])
@Index(['identityId'])
@ObjectType()
export class QcmProgress extends BaseEntity {
  @Field(() => ID)
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identityId' })
  identity?: Identity;

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
