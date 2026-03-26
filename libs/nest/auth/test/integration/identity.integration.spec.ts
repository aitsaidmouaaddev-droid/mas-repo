import 'reflect-metadata';
import { IdentityService } from '../../src/lib/modules/identity/identity.service';
import { Identity } from '../../src/lib/modules/identity/identity.entity';
import { getDataSource } from './setup';

let service: IdentityService;

beforeAll(async () => {
  await getDataSource().initialize();
  service = new IdentityService(getDataSource().getRepository(Identity));
});

afterAll(async () => {
  await getDataSource().destroy();
});

afterEach(async () => {
  await getDataSource().getRepository(Identity).delete({});
});

// ─── create + findOne ─────────────────────────────────────────────────────────

describe('[integration] IdentityService — create & findOne', () => {
  it('persists an identity and retrieves it by id', async () => {
    const identity = await service.create({ email: 'int-1@test.com', displayName: 'Alice' });

    expect(identity.id).toBeDefined();
    expect(identity.email).toBe('int-1@test.com');

    const found = await service.findOne(identity.id);
    expect(found?.email).toBe('int-1@test.com');
  });

  it('findOne returns null for a non-existent id', async () => {
    expect(await service.findOne('00000000-0000-0000-0000-000000000000')).toBeNull();
  });
});

// ─── soft delete ──────────────────────────────────────────────────────────────

describe('[integration] IdentityService — soft delete', () => {
  it('delete marks isDeleted=true and findOne returns null', async () => {
    const identity = await service.create({ email: 'int-del@test.com' });

    await service.delete(identity.id);

    expect(await service.findOne(identity.id)).toBeNull();
  });

  it('findOne(id, true) returns soft-deleted record', async () => {
    const identity = await service.create({ email: 'int-del2@test.com' });
    await service.delete(identity.id);

    const found = await service.findOne(identity.id, true);
    expect(found?.isDeleted).toBe(true);
  });
});

// ─── findAll ──────────────────────────────────────────────────────────────────

describe('[integration] IdentityService — findAll', () => {
  it('returns only non-deleted identities', async () => {
    await service.create({ email: 'int-all-a@test.com' });
    const b = await service.create({ email: 'int-all-b@test.com' });
    await service.delete(b.id);

    const all = await service.findAll();
    const emails = all.map((i) => i.email);

    expect(emails).toContain('int-all-a@test.com');
    expect(emails).not.toContain('int-all-b@test.com');
  });
});
