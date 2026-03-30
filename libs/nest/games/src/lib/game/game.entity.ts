import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';

@Entity('game')
@Index(['uniqueName'], { unique: true })
@ObjectType()
export class Game extends BaseEntity {
  @IsString()
  @Field()
  @Column({ unique: true })
  uniqueName!: string;

  @IsBoolean()
  @Field()
  @Column({ default: false })
  hasScore!: boolean;

  @IsBoolean()
  @Field()
  @Column({ default: false })
  hasProgress!: boolean;
}

@InputType()
export class CreateGameInput {
  @IsString()
  @Field()
  uniqueName!: string;

  @IsBoolean()
  @Field({ defaultValue: false })
  hasScore!: boolean;

  @IsBoolean()
  @Field({ defaultValue: false })
  hasProgress!: boolean;
}

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => ID)
  id!: string;
}
