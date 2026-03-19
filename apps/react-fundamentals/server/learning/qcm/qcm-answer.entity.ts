import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { QcmSession } from './qcm-session.entity';

@Entity('qcm_answer')
@Index(['sessionId', 'questionId'])
@ObjectType()
export class QcmAnswer extends BaseEntity {
  @Field(() => ID)
  @Column()
  sessionId!: string;

  @ManyToOne(() => QcmSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session?: QcmSession;

  @IsString()
  @Field()
  @Column()
  questionId!: string;

  @IsString()
  @Field()
  @Column()
  selectedOption!: string;

  @IsBoolean()
  @Field()
  @Column({ default: false })
  isCorrect!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  timeSpentMs?: number;

  @Field()
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  answeredAt!: Date;
}

@InputType()
export class AnswerQuestionInput {
  @Field(() => ID)
  sessionId!: string;

  @IsString()
  @Field()
  questionId!: string;

  @IsString()
  @Field()
  selectedOption!: string;

  @IsBoolean()
  @Field()
  isCorrect!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field({ nullable: true })
  timeSpentMs?: number;
}
