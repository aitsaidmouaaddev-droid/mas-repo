import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { QcmModule } from './qcm-module.entity';

@ObjectType()
export class QcmQuestionData {
  @Field()
  question!: string;

  @Field(() => [String])
  choices!: string[];

  /** JSON-encoded: number for single, number[] for multiple */
  @Field()
  answer!: string;

  @Field(() => [String])
  tags!: string[];

  @Field({ nullable: true })
  explanation?: string;

  @Field({ nullable: true })
  docs?: string;
}

@Entity('qcm_question')
@Index(['moduleId'])
@ObjectType()
export class QcmQuestion extends BaseEntity {
  @Field(() => ID)
  @Column()
  moduleId!: string;

  @ManyToOne(() => QcmModule, (m) => m.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module?: QcmModule;

  @IsString()
  @Field()
  @Column()
  type!: string;

  @IsString()
  @Field()
  @Column()
  difficulty!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Field(() => QcmQuestionData)
  @Column({ type: 'jsonb' })
  data!: QcmQuestionData;
}
