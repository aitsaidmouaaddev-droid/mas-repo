import { Field, ID, InputType, ObjectType, PartialType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '@mas/auth';

export enum QcmSessionStatus {
  InProgress = 'in_progress',
  Completed = 'completed',
  Abandoned = 'abandoned',
}

registerEnumType(QcmSessionStatus, { name: 'QcmSessionStatus' });

@Entity('qcm_session')
@Index(['identityId', 'moduleId'])
@ObjectType()
export class QcmSession extends BaseEntity {
  @Field(() => ID)
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identityId' })
  identity?: Identity;

  @IsString()
  @Field()
  @Column()
  moduleId!: string;

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
}

@InputType()
export class StartQcmSessionInput {
  @IsString()
  @Field()
  moduleId!: string;

  @IsInt()
  @Min(1)
  @Field()
  totalQuestions!: number;
}

@InputType()
export class UpdateQcmSessionInput extends PartialType(StartQcmSessionInput) {
  @Field(() => ID)
  id!: string;
}
