import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '../identity/identity.entity';
import { ProviderType } from './provider-type.enum';

/**
 * Links an {@link Identity} to an authentication provider.
 *
 * One identity can have multiple provider rows (e.g. LOCAL + GOOGLE),
 * enabling account linking.  The `(identityId, provider)` pair is unique
 * so the same provider cannot be linked twice to the same identity.
 *
 * ## Local auth
 * A `LOCAL` row stores `passwordHash`.  No OAuth tokens.
 *
 * ## OAuth (Google, Facebook, GitHub…)
 * The provider row stores the external `providerAccountId` and optionally
 * the provider's own `accessToken` / `refreshToken`.  No `passwordHash`.
 *
 * Adding a new OAuth provider later requires only:
 *   1. Adding its value to {@link ProviderType}
 *   2. Implementing a new Passport strategy that calls `validateOrCreate`
 *   No schema changes needed.
 */
@Entity('identity_provider')
@ObjectType()
@Unique(['identityId', 'provider'])
export class IdentityProvider extends BaseEntity {
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  identity!: Identity;

  @Field(() => ProviderType)
  @Column({ type: 'varchar' })
  provider!: ProviderType;

  @Field()
  @Column()
  providerAccountId!: string;

  /** Only set for {@link ProviderType.LOCAL}. Never exposed via GraphQL. */
  @Column({ nullable: true, select: false })
  passwordHash?: string;

  /** Provider OAuth access token. Never exposed via GraphQL. */
  @Column({ nullable: true, select: false })
  providerAccessToken?: string;

  /** Provider OAuth refresh token. Never exposed via GraphQL. */
  @Column({ nullable: true, select: false })
  providerRefreshToken?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  providerTokenExpiresAt?: Date;
}
