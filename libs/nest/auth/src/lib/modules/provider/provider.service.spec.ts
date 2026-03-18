import 'reflect-metadata';
import type { Repository } from 'typeorm';
import { ProviderService } from './provider.service';
import { IdentityProvider } from './identity-provider.entity';
import { ProviderType } from './provider-type.enum';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeQueryBuilderChain(returnValue: IdentityProvider | null) {
  const chain = {
    addSelect: jest.fn(),
    where: jest.fn(),
    getOne: jest.fn().mockResolvedValue(returnValue),
  };
  chain.addSelect.mockReturnValue(chain);
  chain.where.mockReturnValue(chain);
  return chain;
}

function makeMocks() {
  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn((x) => x),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as jest.Mocked<Repository<IdentityProvider>>;

  const service = new ProviderService(mockRepo);
  return { service, mockRepo };
}

// ─── findByProvider ───────────────────────────────────────────────────────────

describe('ProviderService.findByProvider', () => {
  it('calls repo.findOne with provider and providerAccountId', async () => {
    const { service, mockRepo } = makeMocks();
    const record = new IdentityProvider();
    mockRepo.findOne.mockResolvedValue(record);

    const result = await service.findByProvider(ProviderType.GOOGLE, 'google-uid-123');

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { provider: ProviderType.GOOGLE, providerAccountId: 'google-uid-123' },
    });
    expect(result).toBe(record);
  });

  it('returns null when not found', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.findOne.mockResolvedValue(null);

    expect(await service.findByProvider(ProviderType.GITHUB, 'x')).toBeNull();
  });
});

// ─── findLocalByIdentity ──────────────────────────────────────────────────────

describe('ProviderService.findLocalByIdentity', () => {
  it('uses queryBuilder to select passwordHash', async () => {
    const { service, mockRepo } = makeMocks();
    const record = new IdentityProvider();
    const chain = makeQueryBuilderChain(record);
    mockRepo.createQueryBuilder.mockReturnValue(chain as never);

    const result = await service.findLocalByIdentity('id-1');

    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('p');
    expect(chain.addSelect).toHaveBeenCalledWith('p.passwordHash');
    expect(result).toBe(record);
  });
});

// ─── createLocal ──────────────────────────────────────────────────────────────

describe('ProviderService.createLocal', () => {
  it('hashes the password and saves a LOCAL provider row', async () => {
    const { service, mockRepo } = makeMocks();
    const saved = new IdentityProvider();
    mockRepo.save.mockResolvedValue(saved);

    const result = await service.createLocal('id-1', 'a@b.com', 'password123');

    const savedArg = mockRepo.save.mock.calls[0][0] as {
      provider: ProviderType;
      providerAccountId: string;
      passwordHash: string;
    };
    expect(savedArg.provider).toBe(ProviderType.LOCAL);
    expect(savedArg.providerAccountId).toBe('a@b.com');
    expect(typeof savedArg.passwordHash).toBe('string');
    expect(savedArg.passwordHash).not.toBe('password123'); // must be hashed
    expect(result).toBe(saved);
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('ProviderService.validatePassword', () => {
  it('returns false when no LOCAL provider exists', async () => {
    const { service, mockRepo } = makeMocks();
    const chain = makeQueryBuilderChain(null);
    mockRepo.createQueryBuilder.mockReturnValue(chain as never);

    expect(await service.validatePassword('id-1', 'any')).toBe(false);
  });

  it('returns true for correct password', async () => {
    const { service, mockRepo } = makeMocks();
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('correct', 10);
    const record = Object.assign(new IdentityProvider(), { passwordHash: hash });
    const chain = makeQueryBuilderChain(record);
    mockRepo.createQueryBuilder.mockReturnValue(chain as never);

    expect(await service.validatePassword('id-1', 'correct')).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const { service, mockRepo } = makeMocks();
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('correct', 10);
    const record = Object.assign(new IdentityProvider(), { passwordHash: hash });
    const chain = makeQueryBuilderChain(record);
    mockRepo.createQueryBuilder.mockReturnValue(chain as never);

    expect(await service.validatePassword('id-1', 'wrong')).toBe(false);
  });
});

// ─── updatePassword ───────────────────────────────────────────────────────────

describe('ProviderService.updatePassword', () => {
  it('hashes the new password and calls repo.update', async () => {
    const { service, mockRepo } = makeMocks();
    mockRepo.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

    await service.updatePassword('id-1', 'newpass');

    const [where, update] = mockRepo.update.mock.calls[0] as [unknown, { passwordHash: string }];
    expect(where).toMatchObject({ identityId: 'id-1', provider: ProviderType.LOCAL });
    expect(typeof update.passwordHash).toBe('string');
    expect(update.passwordHash).not.toBe('newpass');
  });
});

// ─── createOAuth ──────────────────────────────────────────────────────────────

describe('ProviderService.createOAuth', () => {
  it('saves an OAuth provider row with the given data', async () => {
    const { service, mockRepo } = makeMocks();
    const saved = new IdentityProvider();
    mockRepo.save.mockResolvedValue(saved);

    const result = await service.createOAuth({
      identityId: 'id-1',
      provider: ProviderType.GOOGLE,
      providerAccountId: 'google-123',
    });

    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ provider: ProviderType.GOOGLE, providerAccountId: 'google-123' }),
    );
    expect(result).toBe(saved);
  });
});
