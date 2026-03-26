import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Identity } from '../identity/identity.entity';

/**
 * One-time password-reset token.
 *
 * The raw token is returned at creation and must be sent to the user via email.
 * Only the SHA-256 hash is stored so a DB leak cannot be used to reset passwords.
 *
 * A token expires after {@link RESET_TOKEN_TTL_MS} and is marked used after consumption.
 */
@Entity('password_reset_token')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** SHA-256 of the raw token. Never store the raw value. */
  @Column({ unique: true })
  tokenHash!: string;

  @Column()
  identityId!: string;

  @ManyToOne(() => Identity, { onDelete: 'CASCADE' })
  identity!: Identity;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  /** Set when the token is consumed — prevents reuse. */
  @Column({ type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
