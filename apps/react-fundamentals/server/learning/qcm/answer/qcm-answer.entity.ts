import { Field, ID, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { QcmSession } from '../session/qcm-session.entity';
import { QcmQuestion } from '../question/qcm-question.entity';

@Entity('qcm_answer')
@Index(['userId', 'sessionId'])
@Index(['sessionId', 'questionId'])
@ObjectType()
export class QcmAnswer extends BaseEntity {
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

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

  @ManyToOne(() => QcmQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question?: QcmQuestion;

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
export class CreateQcmAnswerInput extends PickType(
  QcmAnswer,
  ['sessionId', 'questionId', 'selectedOption', 'isCorrect', 'timeSpentMs'] as const,
  InputType,
) {}

@InputType()
export class UpdateQcmAnswerInput extends PartialType(
  PickType(QcmAnswer, ['sessionId', 'questionId', 'selectedOption', 'isCorrect', 'timeSpentMs'] as const, InputType),
) {
  @Field(() => ID)
  id!: string;
}
