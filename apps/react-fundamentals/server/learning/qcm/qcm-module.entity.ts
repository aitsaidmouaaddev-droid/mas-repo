import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion } from './qcm-question.entity';

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

  @OneToMany(() => QcmQuestion, (q) => q.module)
  questions?: QcmQuestion[];
}
