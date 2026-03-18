import 'reflect-metadata';
import type { Repository } from 'typeorm';
import { ProviderService } from '../../src/lib/modules/provider/provider.service';
import { IdentityService } from '../../src/lib/modules/identity/identity.service';
import { IdentityProvider } from '../../src/lib/modules/provider/identity-provider.entity';
import { User } from '../../src/lib/modules/identity/user.entity';
import { ProviderType } from '../../src/lib/modules/provider/provider-type.enum';
import { getDataSource } from './setup';

let identityService: IdentityService;
let providerService: ProviderService;
let providerRepo: Repository<IdentityProvider>;
let testUser: User;

beforeAll(async () => {
  await getDataSource().initialize();
  identityService = new IdentityService(getDataSource().manager);
  providerRepo = getDataSource().getRepository(IdentityProvider);
  providerService = new ProviderService(providerRepo);
});

afterAll(async () => {
  await getDataSource().destroy();
});

beforeEach(async () => {
  testUser = await identityService.create({ email: `prov-${Date.now()}@test.com` });
});

afterEach(async () => {
  await providerRepo.delete({ identityId: testUser.id });
  await getDataSource().getRepository(User).delete({ id: testUser.id });
});

// ─── createLocal + validatePassword ──────────────────────────────────────────

describe('[integration] ProviderService — LOCAL provider', () => {
  it('creates a LOCAL provider row and validates the correct password', async () => {
    await providerService.createLocal(testUser.id, testUser.email!, 'secret123');

    expect(await providerService.validatePassword(testUser.id, 'secret123')).toBe(true);
  });

  it('rejects the wrong password', async () => {
    await providerService.createLocal(testUser.id, testUser.email!, 'secret123');

    expect(await providerService.validatePassword(testUser.id, 'wrong')).toBe(false);
  });

  it('updatePassword invalidates the old password and accepts the new one', async () => {
    await providerService.createLocal(testUser.id, testUser.email!, 'old');

    await providerService.updatePassword(testUser.id, 'new');

    expect(await providerService.validatePassword(testUser.id, 'old')).toBe(false);
    expect(await providerService.validatePassword(testUser.id, 'new')).toBe(true);
  });
});

// ─── createOAuth + findByProvider ─────────────────────────────────────────────

describe('[integration] ProviderService — OAuth provider', () => {
  it('creates an OAuth row and finds it by provider + providerAccountId', async () => {
    await providerService.createOAuth({
      identityId: testUser.id,
      provider: ProviderType.GOOGLE,
      providerAccountId: 'google-uid-42',
    });

    const found = await providerService.findByProvider(ProviderType.GOOGLE, 'google-uid-42');

    expect(found).not.toBeNull();
    expect(found!.identityId).toBe(testUser.id);
  });

  it('returns null for unknown provider account', async () => {
    expect(await providerService.findByProvider(ProviderType.GITHUB, 'unknown')).toBeNull();
  });
});
