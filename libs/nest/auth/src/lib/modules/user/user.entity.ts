import 'reflect-metadata';
import { Field, ID, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import {
  IsLocale,
  IsOptional,
  IsString,
  IsTimeZone,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity, CreateIdentityInput, UpdateIdentityInput } from '../identity/identity.entity';

@Entity('user')
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @Column({ nullable: true })
  identityId?: string;

  @Field(() => Identity, { nullable: true })
  @OneToOne(() => Identity, { cascade: true, eager: false })
  @JoinColumn({ name: 'identityId' })
  identity?: Identity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  emailVerifiedAt?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @IsOptional()
  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Field({ nullable: true })
  @Column({ nullable: true })
  gender?: string;

  @IsOptional()
  @IsLocale()
  @Field({ nullable: true })
  @Column({ nullable: true })
  locale?: string;

  @IsOptional()
  @IsTimeZone()
  @Field({ nullable: true })
  @Column({ nullable: true })
  timezone?: string;
}

@InputType()
export class CreateUserInput extends PickType(
  User,
  ['locale', 'timezone', 'firstName', 'lastName', 'dateOfBirth', 'gender'] as const,
  InputType,
) {
  @ValidateNested()
  @Type(() => CreateIdentityInput)
  @Field(() => CreateIdentityInput)
  identity!: CreateIdentityInput;
}

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(
    User,
    ['locale', 'timezone', 'firstName', 'lastName', 'dateOfBirth', 'gender'] as const,
    InputType,
  ),
) {
  @Field(() => ID) id!: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateIdentityInput)
  @Field(() => UpdateIdentityInput, { nullable: true })
  identity?: UpdateIdentityInput;
}
