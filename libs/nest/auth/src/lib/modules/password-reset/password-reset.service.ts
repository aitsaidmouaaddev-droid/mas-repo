import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import { createHash, randomBytes } from 'crypto';
import { IsNull, MoreThan, type DataSource } from 'typeorm';
import { PasswordResetToken } from './password-reset-token.entity';

/** How long a reset token remains valid. */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class PasswordResetService {
  constructor(@Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>) {}

  private get repo() {
    return this.db.getConnection().getRepository(PasswordResetToken);
  }

  /**
   * Creates a fresh reset token for the given identity, invalidating any
   * previous unused tokens.
   *
   * @returns The raw (unhashed) token — send this to the user via email.
   */
  async createToken(identityId: string): Promise<string> {
    // Expire previous unused tokens for this identity
    await this.repo.update({ identityId, usedAt: IsNull() }, { usedAt: new Date() });

    const raw = randomBytes(32).toString('hex');
    const tokenHash = this.hash(raw);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.repo.save(this.repo.create({ identityId, tokenHash, expiresAt, usedAt: null }));
    return raw;
  }

  /**
   * Validates the raw token and returns the DB record.
   * @throws {@link BadRequestException} if the token is invalid, expired, or already used.
   */
  async validateToken(raw: string): Promise<PasswordResetToken> {
    const tokenHash = this.hash(raw);
    const record = await this.repo.findOne({
      where: { tokenHash, expiresAt: MoreThan(new Date()), usedAt: IsNull() },
    });
    if (!record) throw new BadRequestException('Invalid or expired reset token');
    return record;
  }

  /**
   * Validates and marks the token as used in one atomic step.
   * @returns The `identityId` the token belongs to.
   * @throws {@link BadRequestException} if the token is invalid, expired, or already used.
   */
  async consumeToken(raw: string): Promise<string> {
    const record = await this.validateToken(raw);
    await this.repo.update(record.id, { usedAt: new Date() });
    return record.identityId;
  }

  private hash(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }
}
