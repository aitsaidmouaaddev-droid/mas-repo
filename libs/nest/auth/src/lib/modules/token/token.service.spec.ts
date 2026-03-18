import 'reflect-metadata';
import type { Repository } from 'typeorm';
import type { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { RefreshToken } from './refresh-token.entity';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeMocks() {
  const mockJwt = {
    sign: jest.fn().mockReturnValue('signed-token'),
    verify: jest.fn().mockReturnValue({ sub: 'id-1', type: 'user' }),
  } as unknown as jest.Mocked<JwtService>;

  const mockRepo = {
    save: jest.fn(),
    create: jest.fn((x) => x),
    findOne: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<Repository<RefreshToken>>;

  const mockDb = {
    getConnection: jest
      .fn()
      .mockReturnValue({ getRepository: jest.fn().mockReturnValue(mockRepo) }),
  };
  const service = new TokenService(mockJwt, mockDb as never);
  return { service, mockJwt, mockRepo };
}

// ─── signAccessToken ──────────────────────────────────────────────────────────

describe('TokenService.signAccessToken', () => {
  it('delegates to JwtService.sign and returns the token', () => {
    const { service, mockJwt } = makeMocks();

    const token = service.signAccessToken({ sub: 'id-1', type: 'user' });

    expect(mockJwt.sign).toHaveBeenCalledWith({ sub: 'id-1', type: 'user' });
    expect(token).toBe('signed-token');
  });
});

// ─── verifyAccessToken ────────────────────────────────────────────────────────

describe('TokenService.verifyAccessToken', () => {
  it('delegates to JwtService.verify and returns the payload', () => {
    const { service, mockJwt } = makeMocks();

    const payload = service.verifyAccessToken('some-token');

    expect(mockJwt.verify).toHaveBeenCalledWith('some-token');
    expect(payload).toEqual({ sub: 'id-1', type: 'user' });
  });
});

// ─── issueRefreshToken ────────────────────────────────────────────────────────

describe('TokenService.issueRefreshToken', () => {
  it('saves a hashed token row and returns the raw token', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.save.mockResolvedValue(new RefreshToken());

    const raw = await service.issueRefreshToken('id-1');

    expect(typeof raw).toBe('string');
    expect(raw.length).toBeGreaterThan(0);

    const saved = mockRepo.save.mock.calls[0][0] as {
      identityId: string;
      tokenHash: string;
      expiresAt: Date;
    };
    expect(saved.identityId).toBe('id-1');
    expect(saved.tokenHash).not.toBe(raw); // must be hashed
    expect(saved.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('stores userAgent and ipAddress when provided', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.save.mockResolvedValue(new RefreshToken());

    await service.issueRefreshToken('id-1', { userAgent: 'Mozilla', ipAddress: '1.2.3.4' });

    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ userAgent: 'Mozilla', ipAddress: '1.2.3.4' }),
    );
  });
});

// ─── rotateRefreshToken ───────────────────────────────────────────────────────

describe('TokenService.rotateRefreshToken', () => {
  it('throws when the token is not found or expired', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.rotateRefreshToken('invalid-raw')).rejects.toThrow(
      'Invalid or expired refresh token',
    );
  });

  it('deletes the old token, issues a new one, and returns the identity id', async () => {
    const { service, mockRepo } = makeMocks();
    const existing = Object.assign(new RefreshToken(), {
      id: 'row-1',
      identityId: 'id-1',
    });
    mockRepo.findOne.mockResolvedValue(existing);
    mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} });
    mockRepo.save.mockResolvedValue(new RefreshToken());

    const { identityId, newRefreshToken } = await service.rotateRefreshToken('some-raw');

    expect(mockRepo.delete).toHaveBeenCalledWith('row-1');
    expect(identityId).toBe('id-1');
    expect(typeof newRefreshToken).toBe('string');
  });

  it('two consecutive rotations with the same token — second fails', async () => {
    const { service, mockRepo } = makeMocks();
    const existing = Object.assign(new RefreshToken(), { id: 'row-1', identityId: 'id-1' });

    // First call finds the token, second call finds nothing (already deleted)
    mockRepo.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
    mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} });
    mockRepo.save.mockResolvedValue(new RefreshToken());

    const { newRefreshToken } = await service.rotateRefreshToken('raw-1');
    await expect(service.rotateRefreshToken('raw-1')).rejects.toThrow();

    expect(mockRepo.delete).toHaveBeenCalledTimes(1);
    expect(newRefreshToken).toBeDefined();
  });
});

// ─── revokeRefreshToken ───────────────────────────────────────────────────────

describe('TokenService.revokeRefreshToken', () => {
  it('deletes by the hash of the raw token', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.revokeRefreshToken('raw-token');

    const deleted = mockRepo.delete.mock.calls[0][0] as { tokenHash: string };
    expect(typeof deleted.tokenHash).toBe('string');
    expect(deleted.tokenHash).not.toBe('raw-token');
  });
});

// ─── revokeAllForIdentity ─────────────────────────────────────────────────────

describe('TokenService.revokeAllForIdentity', () => {
  it('deletes all rows by identityId', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.delete.mockResolvedValue({ affected: 3, raw: {} });

    await service.revokeAllForIdentity('id-1');

    expect(mockRepo.delete).toHaveBeenCalledWith({ identityId: 'id-1' });
  });
});

// ─── issueTokenPair ───────────────────────────────────────────────────────────

describe('TokenService.issueTokenPair', () => {
  it('returns both an access token and a refresh token', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.save.mockResolvedValue(new RefreshToken());

    const pair = await service.issueTokenPair({ sub: 'id-1', type: 'user' });

    expect(pair.accessToken).toBe('signed-token');
    expect(typeof pair.refreshToken).toBe('string');
  });
});
