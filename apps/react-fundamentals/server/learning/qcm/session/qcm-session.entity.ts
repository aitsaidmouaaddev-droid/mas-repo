import { Field, ID, InputType, Int, ObjectType, PartialType, PickType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { QcmModule } from '../module/qcm-module.entity';

export enum QcmSessionStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Abandoned = 'Abandoned',
}

registerEnumType(QcmSessionStatus, { name: 'QcmSessionStatus' });

@Entity('qcm_session')
@Index(['userId', 'moduleId'])
@ObjectType()
export class QcmSession extends BaseEntity {
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @IsString()
  @Field()
  @Column()
  moduleId!: string;

  @ManyToOne(() => QcmModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module?: QcmModule;

  @IsEnum(QcmSessionStatus)
  @Field(() => QcmSessionStatus)
  @Column({ type: 'varchar', default: QcmSessionStatus.InProgress })
  status!: QcmSessionStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  score?: number;

  @IsInt()
  @Min(0)
  @Field()
  @Column({ type: 'int', default: 0 })
  totalQuestions!: number;

  @Field()
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  startedAt!: Date;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  /** Computed GraphQL-only field: seconds elapsed since startedAt (or until completedAt). Not persisted. */
  @Field(() => Int)
  duration!: number;
}

@InputType()
export class CreateQcmSessionInput extends PickType(QcmSession, ['moduleId', 'totalQuestions'] as const, InputType) {}

@InputType()
export class UpdateQcmSessionInput extends PartialType(
  PickType(QcmSession, ['moduleId', 'totalQuestions', 'status', 'score', 'completedAt'] as const, InputType),
) {
  @Field(() => ID)
  id!: string;
}
