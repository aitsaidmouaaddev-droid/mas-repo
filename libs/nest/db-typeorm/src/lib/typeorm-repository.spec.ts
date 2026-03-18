import 'reflect-metadata';
import { In } from 'typeorm';
import { TypeOrmRepository } from './typeorm-repository';
import type { EntityManager, Repository } from 'typeorm';

// ─── Test entity ──────────────────────────────────────────────────────────────

class UserEntity {
  id!: string;
  name!: string;
  email!: string;
  role!: string;
  isActive!: boolean;
  createdAt!: Date;
}

// ─── Mock factory ─────────────────────────────────────────────────────────────

function makeMocks() {
  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<Repository<UserEntity>>;

  const mockManager = {
    getRepository: jest.fn().mockReturnValue(mockRepo),
  } as unknown as jest.Mocked<EntityManager>;

  const repo = new TypeOrmRepository<UserEntity>(UserEntity, mockManager);

  return { repo, mockRepo, mockManager };
}

// ─── findById ────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.findById', () => {
  it('calls repo.findOne with the id as where clause', async () => {
    const { repo, mockRepo } = makeMocks();
    const user: UserEntity = {
      id: '1',
      name: 'Alice',
      email: 'alice@x.com',
      role: 'user',
      isActive: true,
      createdAt: new Date(),
    };
    mockRepo.findOne.mockResolvedValue(user);

    const result = await repo.findById('1');

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(user);
  });

  it('returns null when entity is not found', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findOne.mockResolvedValue(null);

    const result = await repo.findById('nonexistent');

    expect(result).toBeNull();
  });
});

// ─── findAll ─────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.findAll', () => {
  it('calls repo.find with no options when called with no arguments', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.find.mockResolvedValue([]);

    await repo.findAll();

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
      take: undefined,
      skip: undefined,
    });
  });

  it('passes filter, limit, and offset to repo.find', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.find.mockResolvedValue([]);

    await repo.findAll({ filter: { role: 'admin' }, limit: 10, offset: 5 });

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { role: 'admin' },
      order: undefined,
      take: 10,
      skip: 5,
    });
  });

  it('converts a single SortOption to FindOptionsOrder', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.find.mockResolvedValue([]);

    await repo.findAll({ sort: { field: 'name', order: 'asc' } });

    expect(mockRepo.find).toHaveBeenCalledWith(expect.objectContaining({ order: { name: 'ASC' } }));
  });

  it('converts an array of SortOptions to FindOptionsOrder', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.find.mockResolvedValue([]);

    await repo.findAll({
      sort: [
        { field: 'role', order: 'asc' },
        { field: 'name', order: 'desc' },
      ],
    });

    expect(mockRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ order: { role: 'ASC', name: 'DESC' } }),
    );
  });

  it('returns the list from repo.find', async () => {
    const { repo, mockRepo } = makeMocks();
    const users = [{ id: '1' } as UserEntity, { id: '2' } as UserEntity];
    mockRepo.find.mockResolvedValue(users);

    const result = await repo.findAll();

    expect(result).toBe(users);
  });
});

// ─── findMany ────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.findMany', () => {
  it('calls findAndCount with correct take/skip for page 1', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 0]);

    await repo.findMany({ page: 1, pageSize: 10 });

    expect(mockRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10, skip: 0 }),
    );
  });

  it('calls findAndCount with correct take/skip for page 3', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 0]);

    await repo.findMany({ page: 3, pageSize: 20 });

    expect(mockRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ take: 20, skip: 40 }),
    );
  });

  it('returns correct Page envelope — first page of 3 pages', async () => {
    const { repo, mockRepo } = makeMocks();
    const items = [{ id: '1' } as UserEntity];
    mockRepo.findAndCount.mockResolvedValue([items, 25]);

    const page = await repo.findMany({ page: 1, pageSize: 10 });

    expect(page).toEqual({
      items,
      total: 25,
      page: 1,
      pageSize: 10,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('returns correct Page envelope — last page', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 25]);

    const page = await repo.findMany({ page: 3, pageSize: 10 });

    expect(page).toEqual({
      items: [],
      total: 25,
      page: 3,
      pageSize: 10,
      hasNext: false,
      hasPrev: true,
    });
  });

  it('returns correct Page envelope — middle page', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 100]);

    const page = await repo.findMany({ page: 2, pageSize: 10 });

    expect(page.hasNext).toBe(true);
    expect(page.hasPrev).toBe(true);
  });

  it('returns correct Page envelope — single page result', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 5]);

    const page = await repo.findMany({ page: 1, pageSize: 10 });

    expect(page.hasNext).toBe(false);
    expect(page.hasPrev).toBe(false);
  });

  it('passes filter and sort to findAndCount', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.findAndCount.mockResolvedValue([[], 0]);

    await repo.findMany({
      page: 1,
      pageSize: 5,
      filter: { isActive: true },
      sort: { field: 'createdAt', order: 'desc' },
    });

    expect(mockRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      }),
    );
  });
});

// ─── exists ──────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.exists', () => {
  it('returns true when count is > 0', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.count.mockResolvedValue(1);

    expect(await repo.exists('1')).toBe(true);
  });

  it('returns false when count is 0', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.count.mockResolvedValue(0);

    expect(await repo.exists('nonexistent')).toBe(false);
  });
});

// ─── count ───────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.count', () => {
  it('calls repo.count with no filter when not provided', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.count.mockResolvedValue(42);

    const result = await repo.count();

    expect(mockRepo.count).toHaveBeenCalledWith({ where: undefined });
    expect(result).toBe(42);
  });

  it('passes filter to repo.count', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.count.mockResolvedValue(7);

    const result = await repo.count({ role: 'admin' });

    expect(mockRepo.count).toHaveBeenCalledWith({ where: { role: 'admin' } });
    expect(result).toBe(7);
  });
});

// ─── save ────────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.save', () => {
  it('calls repo.save with the entity', async () => {
    const { repo, mockRepo } = makeMocks();
    const user = { id: '1', name: 'Alice' } as UserEntity;
    mockRepo.save.mockResolvedValue(user);

    const result = await repo.save(user);

    expect(mockRepo.save).toHaveBeenCalledWith(user);
    expect(result).toBe(user);
  });

  it('returns the saved entity (with DB-generated fields)', async () => {
    const { repo, mockRepo } = makeMocks();
    const input = { name: 'Bob' } as UserEntity;
    const saved = { id: 'generated-uuid', name: 'Bob' } as UserEntity;
    mockRepo.save.mockResolvedValue(saved);

    expect(await repo.save(input)).toBe(saved);
  });
});

// ─── saveMany ────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.saveMany', () => {
  it('calls repo.save with the entity array', async () => {
    const { repo, mockRepo } = makeMocks();
    const users = [{ id: '1' } as UserEntity, { id: '2' } as UserEntity];
    mockRepo.save.mockResolvedValue(users);

    const result = await repo.saveMany(users);

    expect(mockRepo.save).toHaveBeenCalledWith(users);
    expect(result).toBe(users);
  });
});

// ─── delete ──────────────────────────────────────────────────────────────────

describe('TypeOrmRepository.delete', () => {
  it('calls repo.delete with the id', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await repo.delete('abc');

    expect(mockRepo.delete).toHaveBeenCalledWith('abc');
  });
});

// ─── deleteMany ──────────────────────────────────────────────────────────────

describe('TypeOrmRepository.deleteMany', () => {
  it('calls repo.delete with an In() operator on the id field', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.delete.mockResolvedValue({ affected: 2, raw: {} });

    await repo.deleteMany(['1', '2']);

    expect(mockRepo.delete).toHaveBeenCalledWith(expect.objectContaining({ id: In(['1', '2']) }));
  });

  it('handles empty array', async () => {
    const { repo, mockRepo } = makeMocks();
    mockRepo.delete.mockResolvedValue({ affected: 0, raw: {} });

    await repo.deleteMany([]);

    expect(mockRepo.delete).toHaveBeenCalledWith(expect.objectContaining({ id: In([]) }));
  });
});

// ─── constructor ─────────────────────────────────────────────────────────────

describe('TypeOrmRepository — constructor', () => {
  it('calls manager.getRepository with the entity class', () => {
    const { mockManager } = makeMocks();

    expect(mockManager.getRepository).toHaveBeenCalledWith(UserEntity);
  });
});
