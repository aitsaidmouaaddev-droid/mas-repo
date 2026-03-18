import 'reflect-metadata';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { Identity } from '../identity/identity.entity';

/**
 * Persisted refresh token — one row per active session.
 *
 * Refresh tokens must be stored so they can be:
 * - **Revoked** on logout or suspicious activity
 * - **Rotated** — each use invalidates the old token and issues a new one
 * - **Listed** — "logout all devices" deletes all rows for an identity
 *
 * The actual token value is hashed before storage (never stored in plain text).
 */
@Entity('refresh_token')
export class RefreshToken extends BaseEntity {
  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  identity!: Identity;

  /** SHA-256 hash of the token. The raw token is only returned at issuance. */
  @Column({ unique: true })
  tokenHash!: string;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  /** Device/browser hint for the "active sessions" UI. */
  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;
}
