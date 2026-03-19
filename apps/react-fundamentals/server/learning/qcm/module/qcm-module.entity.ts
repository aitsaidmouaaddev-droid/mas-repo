import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion } from '../question/qcm-question.entity';

@Entity('qcm_module')
@ObjectType()
export class QcmModule extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  label!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @OneToMany(() => QcmQuestion, (q: QcmQuestion) => q.module)
  questions?: QcmQuestion[];
}

@InputType()
export class CreateQcmModuleInput {
  @IsString()
  @Field()
  label!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  sortOrder!: number;
}

@InputType()
export class UpdateQcmModuleInput extends PartialType(CreateQcmModuleInput) {
  @Field(() => ID)
  id!: string;
}
