import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion } from '../question/qcm-question.entity';

@Entity('qcm_module')
@ObjectType()
export class QcmModule extends BaseEntity {
  @Column({ type: 'jsonb', name: 'label' })
  labelI18n!: Record<string, string>;

  @IsOptional()
  @Column({ type: 'jsonb', name: 'description', nullable: true })
  descriptionI18n?: Record<string, string>;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @OneToMany(() => QcmQuestion, (q: QcmQuestion) => q.module)
  questions?: QcmQuestion[];

  @IsString()
  @Field()
  @Column()
  category!: string;
}

@InputType()
export class CreateQcmModuleInput {
  @Field(() => String)
  label!: Record<string, string>;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: Record<string, string>;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  sortOrder!: number;

  @IsString()
  @Field()
  category!: string;

}

@InputType()
export class UpdateQcmModuleInput extends PartialType(CreateQcmModuleInput) {
  @Field(() => ID)
  id!: string;
}
