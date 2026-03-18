import 'reflect-metadata';
import { UnauthorizedException } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import type { IdentityService } from '../modules/identity/identity.service';
import type { UserService } from '../modules/user/user.service';
import type { ProviderService } from '../modules/provider/provider.service';
import type { TokenService } from '../modules/token/token.service';
import type { Repository } from 'typeorm';
import { Identity } from '../modules/identity/identity.entity';
import { User } from '../modules/user/user.entity';

function makeIdentity(id = 'i1'): Identity {
  return Object.assign(new Identity(), {
    id,
    email: `${id}@test.com`,
    isActive: true,
    isDeleted: false,
    type: 'user',
  });
}

function makeServices() {
  const identityRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<Repository<Identity>>;

  const mockDb = {
    getConnection: jest
      .fn()
      .mockReturnValue({ getRepository: jest.fn().mockReturnValue(identityRepo) }),
  };

  const identityService = {
    create: jest.fn(),
    findOne: jest.fn(),
  } as unknown as jest.Mocked<IdentityService>;

  const userService = {
    create: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  const providerService = {
    validatePassword: jest.fn(),
    createLocal: jest.fn(),
  } as unknown as jest.Mocked<ProviderService>;

  const tokenService = {
    issueTokenPair: jest.fn(),
    signAccessToken: jest.fn(),
    rotateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeAllForIdentity: jest.fn(),
  } as unknown as jest.Mocked<TokenService>;

  const resolver = new AuthResolver(
    mockDb as never,
    identityService,
    userService,
    providerService,
    tokenService,
  );
  return { resolver, identityRepo, identityService, userService, providerService, tokenService };
}

describe('AuthResolver — login', () => {
  it('returns token pair and identity on valid credentials', async () => {
    const { resolver, identityRepo, providerService, tokenService } = makeServices();
    const identity = makeIdentity();
    identityRepo.findOne.mockResolvedValue(identity);
    providerService.validatePassword.mockResolvedValue(true);
    tokenService.issueTokenPair.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt' });
    identityRepo.update.mockResolvedValue(undefined as never);

    const result = await resolver.login({ login: 'i1@test.com', password: 'pass12345' });

    expect(result).toEqual({ accessToken: 'at', refreshToken: 'rt', identity });
    expect(identityRepo.update).toHaveBeenCalledWith(
      identity.id,
      expect.objectContaining({ lastLoginAt: expect.any(Date) }),
    );
  });

  it('throws when identity not found', async () => {
    const { resolver, identityRepo } = makeServices();
    identityRepo.findOne.mockResolvedValue(null);
    await expect(
      resolver.login({ login: 'nobody@test.com', password: 'pass12345' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when password is wrong', async () => {
    const { resolver, identityRepo, providerService } = makeServices();
    identityRepo.findOne.mockResolvedValue(makeIdentity());
    providerService.validatePassword.mockResolvedValue(false);
    await expect(resolver.login({ login: 'i1@test.com', password: 'wrongpass1' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

describe('AuthResolver — register', () => {
  it('cascade-creates user+identity, local provider, returns token pair', async () => {
    const { resolver, userService, providerService, tokenService } = makeServices();
    const identity = makeIdentity();
    const user = Object.assign(new User(), { identityId: identity.id, identity });
    userService.create.mockResolvedValue(user);
    providerService.createLocal.mockResolvedValue(undefined as never);
    tokenService.issueTokenPair.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt' });

    const result = await resolver.register({ email: 'i1@test.com', password: 'pass12345' });

    expect(userService.create).toHaveBeenCalledWith(
      expect.objectContaining({ identity: expect.objectContaining({ email: 'i1@test.com' }) }),
    );
    expect(providerService.createLocal).toHaveBeenCalledWith(
      identity.id,
      'i1@test.com',
      'pass12345',
    );
    expect(result).toEqual({ accessToken: 'at', refreshToken: 'rt', identity });
  });
});

describe('AuthResolver — refreshToken', () => {
  it('rotates token and returns new pair with identity', async () => {
    const { resolver, identityService, tokenService } = makeServices();
    const identity = makeIdentity();
    tokenService.rotateRefreshToken.mockResolvedValue({
      identityId: identity.id,
      newRefreshToken: 'rt2',
    });
    identityService.findOne.mockResolvedValue(identity);
    tokenService.signAccessToken.mockReturnValue('at2');

    expect(await resolver.refreshToken('rt1')).toEqual({
      accessToken: 'at2',
      refreshToken: 'rt2',
      identity,
    });
  });

  it('throws when identity no longer exists', async () => {
    const { resolver, identityService, tokenService } = makeServices();
    tokenService.rotateRefreshToken.mockResolvedValue({ identityId: 'i1', newRefreshToken: 'rt2' });
    identityService.findOne.mockResolvedValue(null);
    await expect(resolver.refreshToken('rt1')).rejects.toThrow(UnauthorizedException);
  });
});

describe('AuthResolver — logout', () => {
  it('revokes token and returns true', async () => {
    const { resolver, tokenService } = makeServices();
    tokenService.revokeRefreshToken.mockResolvedValue(undefined);
    expect(await resolver.logout(makeIdentity(), 'rt')).toBe(true);
  });
});

describe('AuthResolver — logoutAll', () => {
  it('revokes all tokens and returns true', async () => {
    const { resolver, tokenService } = makeServices();
    tokenService.revokeAllForIdentity.mockResolvedValue(undefined);
    const identity = makeIdentity();
    expect(await resolver.logoutAll(identity)).toBe(true);
    expect(tokenService.revokeAllForIdentity).toHaveBeenCalledWith(identity.id);
  });
});
