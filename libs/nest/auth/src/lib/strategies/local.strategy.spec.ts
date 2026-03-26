import 'reflect-metadata';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import type { ProviderService } from '../modules/provider/provider.service';
import type { Repository } from 'typeorm';
import { Identity } from '../modules/identity/identity.entity';

function makeMocks(
  overrides: { identity?: Identity | null; isActive?: boolean; validPassword?: boolean } = {},
) {
  const identity =
    overrides.identity !== undefined
      ? overrides.identity
      : Object.assign(new Identity(), {
          id: 'id-1',
          email: 'a@b.com',
          isActive: overrides.isActive ?? true,
        });

  const identityRepo = {
    findOne: jest.fn().mockResolvedValue(identity),
  } as unknown as jest.Mocked<Repository<Identity>>;

  const mockDb = {
    getConnection: jest
      .fn()
      .mockReturnValue({ getRepository: jest.fn().mockReturnValue(identityRepo) }),
  };

  const providerService = {
    validatePassword: jest.fn().mockResolvedValue(overrides.validPassword ?? true),
  } as unknown as jest.Mocked<ProviderService>;

  const strategy = new LocalStrategy(mockDb as never, providerService);
  return { strategy, identityRepo, providerService };
}

describe('LocalStrategy.validate', () => {
  it('returns the identity when credentials are correct', async () => {
    const { strategy } = makeMocks({ validPassword: true });
    expect(await strategy.validate('a@b.com', 'correct')).toBeInstanceOf(Identity);
  });

  it('throws when identity not found', async () => {
    const { strategy } = makeMocks({ identity: null });
    await expect(strategy.validate('unknown@b.com', 'any')).rejects.toThrow(UnauthorizedException);
  });

  it('throws when identity is inactive', async () => {
    const { strategy } = makeMocks({ isActive: false });
    await expect(strategy.validate('a@b.com', 'any')).rejects.toThrow(UnauthorizedException);
  });

  it('throws when password is wrong', async () => {
    const { strategy } = makeMocks({ validPassword: false });
    await expect(strategy.validate('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('calls providerService.validatePassword with the identity id', async () => {
    const { strategy, providerService } = makeMocks();
    await strategy.validate('a@b.com', 'pass');
    expect(providerService.validatePassword).toHaveBeenCalledWith('id-1', 'pass');
  });
});
