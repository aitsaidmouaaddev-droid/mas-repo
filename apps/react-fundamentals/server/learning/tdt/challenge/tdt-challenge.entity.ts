import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';

@ObjectType()
export class TdtChallengeData {
  @Field()
  description!: string;

  @Field()
  starterCode!: string;

  @Field()
  testCode!: string;

  @Field({ nullable: true })
  docs?: string;
}

@Entity('tdt_challenge')
@ObjectType()
export class TdtChallenge extends BaseEntity {
  @IsString()
  @Field()
  @Column()
  title!: string;

  @IsString()
  @Field()
  @Column()
  category!: string;

  @IsString()
  @Field()
  @Column()
  difficulty!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Field(() => TdtChallengeData)
  @Column({ type: 'jsonb' })
  data!: TdtChallengeData;
}

@InputType()
export class TdtChallengeDataInput {
  @IsString()
  @Field()
  description!: string;

  @IsString()
  @Field()
  starterCode!: string;

  @IsString()
  @Field()
  testCode!: string;

  @Field({ nullable: true })
  docs?: string;
}

@InputType()
export class CreateTdtChallengeInput {
  @IsString()
  @Field()
  title!: string;

  @IsString()
  @Field()
  category!: string;

  @IsString()
  @Field()
  difficulty!: string;

  @IsInt()
  @Min(0)
  @Field(() => Int)
  sortOrder!: number;

  @Field(() => TdtChallengeDataInput)
  data!: TdtChallengeDataInput;
}

@InputType()
export class UpdateTdtChallengeInput extends PartialType(CreateTdtChallengeInput) {
  @Field(() => ID)
  id!: string;
}
