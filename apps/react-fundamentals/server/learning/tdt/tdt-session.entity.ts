import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '@mas/auth';
import { TdtChallenge } from './tdt-challenge.entity';

export enum TdtSessionStatus {
  InProgress = 'in_progress',
  Solved = 'solved',
  Abandoned = 'abandoned',
}

registerEnumType(TdtSessionStatus, { name: 'TdtSessionStatus' });

@Entity('tdt_session')
@Index(['identityId', 'challengeId'])
@ObjectType()
export class TdtSession extends BaseEntity {
  @Field(() => ID)
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identityId' })
  identity?: Identity;

  @IsString()
  @Field()
  @Column()
  challengeId!: string;

  @ManyToOne(() => TdtChallenge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  challenge?: TdtChallenge;

  @IsEnum(TdtSessionStatus)
  @Field(() => TdtSessionStatus)
  @Column({ type: 'varchar', default: TdtSessionStatus.InProgress })
  status!: TdtSessionStatus;

  @Field()
  @Column({ type: 'int', default: 0 })
  attemptsCount!: number;

  @Field()
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  startedAt!: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  solvedAt?: Date;
}

@InputType()
export class StartTdtSessionInput {
  @IsString()
  @Field()
  challengeId!: string;
}
