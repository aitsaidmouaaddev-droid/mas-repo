import 'reflect-metadata';
import Jwt from 'jsonwebtoken';
import type { Repository } from 'typeorm';
import type { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../src/lib/modules/token/token.service';
import { RefreshToken } from '../../src/lib/modules/token/refresh-token.entity';
import { IdentityService } from '../../src/lib/modules/identity/identity.service';
import { User } from '../../src/lib/modules/identity/user.entity';
import { getDataSource } from './setup';

const SECRET = 'integration-test-secret';

/** Minimal JwtService shim backed by the real jsonwebtoken library. */
function makeRealJwt(): JwtService {
  return {
    sign: (payload: object) => Jwt.sign(payload, SECRET, { expiresIn: '15m' }),
    verify: (token: string) => Jwt.verify(token, SECRET),
  } as unknown as JwtService;
}

let identityService: IdentityService;
let tokenService: TokenService;
let tokenRepo: Repository<RefreshToken>;
let testUser: User;

beforeAll(async () => {
  await getDataSource().initialize();
  identityService = new IdentityService(getDataSource().manager);
  tokenRepo = getDataSource().getRepository(RefreshToken);
  tokenService = new TokenService(makeRealJwt(), tokenRepo);
});

afterAll(async () => {
  await getDataSource().destroy();
});

beforeEach(async () => {
  testUser = await identityService.create({ email: `tok-${Date.now()}@test.com` });
});

afterEach(async () => {
  await tokenRepo.delete({ identityId: testUser.id });
  await getDataSource().getRepository(User).delete({ id: testUser.id });
});

// ─── issueTokenPair + verifyAccessToken ───────────────────────────────────────

describe('[integration] TokenService — token pair', () => {
  it('issues a verifiable JWT access token', async () => {
    const pair = await tokenService.issueTokenPair({ sub: testUser.id, type: 'user' });

    const payload = tokenService.verifyAccessToken(pair.accessToken);
    expect(payload.sub).toBe(testUser.id);
  });

  it('persists the refresh token row in the DB', async () => {
    await tokenService.issueTokenPair({ sub: testUser.id, type: 'user' });

    const rows = await tokenRepo.find({ where: { identityId: testUser.id } });
    expect(rows).toHaveLength(1);
    expect(rows[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

// ─── rotateRefreshToken ───────────────────────────────────────────────────────

describe('[integration] TokenService — refresh token rotation', () => {
  it('old token is deleted and a new row is created', async () => {
    const pair = await tokenService.issueTokenPair({ sub: testUser.id, type: 'user' });

    const { newRefreshToken } = await tokenService.rotateRefreshToken(pair.refreshToken);

    const rows = await tokenRepo.find({ where: { identityId: testUser.id } });
    expect(rows).toHaveLength(1); // old deleted, new created
    expect(newRefreshToken).not.toBe(pair.refreshToken);
  });

  it('replaying the old token after rotation throws', async () => {
    const pair = await tokenService.issueTokenPair({ sub: testUser.id, type: 'user' });
    await tokenService.rotateRefreshToken(pair.refreshToken);

    await expect(tokenService.rotateRefreshToken(pair.refreshToken)).rejects.toThrow(
      'Invalid or expired refresh token',
    );
  });
});

// ─── revokeAllForIdentity ─────────────────────────────────────────────────────

describe('[integration] TokenService — revoke all sessions', () => {
  it('deletes all refresh token rows for the identity', async () => {
    await tokenService.issueRefreshToken(testUser.id);
    await tokenService.issueRefreshToken(testUser.id);

    await tokenService.revokeAllForIdentity(testUser.id);

    const rows = await tokenRepo.find({ where: { identityId: testUser.id } });
    expect(rows).toHaveLength(0);
  });
});
