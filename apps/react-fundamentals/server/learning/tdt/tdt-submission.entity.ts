import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { TdtSession } from './tdt-session.entity';

@Entity('tdt_submission')
@Index(['sessionId'])
@ObjectType()
export class TdtSubmission extends BaseEntity {
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
export class SubmitCodeInput {
  @Field(() => ID)
  sessionId!: string;

  @IsString()
  @Field()
  code!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  passedTests!: number;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  failedTests!: number;

  @IsInt()
  @Min(1)
  @Field(() => Int)
  totalTests!: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  logs?: string;
}
