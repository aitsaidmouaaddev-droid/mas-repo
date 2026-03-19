import 'reflect-metadata';
import { Field, ID, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AtLeastOneOf, BaseEntity } from '@mas/nest-graphql-typeorm-base';

@Entity('identity')
@ObjectType()
export class Identity extends BaseEntity {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  identityName?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @Field()
  @Column({ default: true })
  isActive!: boolean;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  /** Discriminator — 'user' | 'bot' | etc. Set by the creation flow. */
  @Field()
  @Column({ default: 'user' })
  type!: string;
}

@InputType()
export class CreateIdentityInput extends PickType(
  Identity,
  ['email', 'identityName', 'displayName', 'avatarUrl'] as const,
  InputType,
) {
  @AtLeastOneOf(['email', 'identityName'])
  override email?: string;
}

@InputType()
export class UpdateIdentityInput extends PartialType(CreateIdentityInput) {
  @Field(() => ID) id!: string;
}

/** Input for the `login` mutation — accepts email or identityName plus password. */
@InputType()
export class LoginInput {
  @IsString()
  @Field()
  login!: string;
  @IsString()
  @MinLength(8)
  @Field()
  password!: string;
}
