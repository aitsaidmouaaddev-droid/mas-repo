import { Injectable, Inject } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import { createHash, randomBytes } from 'crypto';
import { MoreThan, type DataSource } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export interface JwtPayload {
  sub: string; // identity id
  type: string; // identity type discriminator ('user', 'bot'…)
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
  ) {}

  private get repo() {
    return this.db.getConnection().getRepository(RefreshToken);
  }

  // ─── Access token ───────────────────────────────────────────────────────────

  signAccessToken(payload: JwtPayload): string {
    return this.jwt.sign(payload);
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwt.verify<JwtPayload>(token);
  }

  // ─── Refresh token ──────────────────────────────────────────────────────────

  async issueRefreshToken(
    identityId: string,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<string> {
    const raw = randomBytes(40).toString('hex');
    const tokenHash = this.hash(raw);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.repo.save(this.repo.create({ identityId, tokenHash, expiresAt, ...meta }));

    return raw;
  }

  async rotateRefreshToken(
    raw: string,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<{ identityId: string; newRefreshToken: string }> {
    const tokenHash = this.hash(raw);
    const record = await this.repo.findOne({
      where: { tokenHash, expiresAt: MoreThan(new Date()) },
    });

    if (!record) throw new Error('Invalid or expired refresh token');

    await this.repo.delete(record.id);

    const newRefreshToken = await this.issueRefreshToken(record.identityId, meta);

    return { identityId: record.identityId, newRefreshToken };
  }

  async revokeRefreshToken(raw: string): Promise<void> {
    await this.repo.delete({ tokenHash: this.hash(raw) });
  }

  async revokeAllForIdentity(identityId: string): Promise<void> {
    await this.repo.delete({ identityId });
  }

  // ─── Full pair ──────────────────────────────────────────────────────────────

  async issueTokenPair(
    payload: JwtPayload,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.issueRefreshToken(payload.sub, meta),
    ]);
    return { accessToken, refreshToken };
  }

  // ─── Internals ──────────────────────────────────────────────────────────────

  private hash(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }
}
