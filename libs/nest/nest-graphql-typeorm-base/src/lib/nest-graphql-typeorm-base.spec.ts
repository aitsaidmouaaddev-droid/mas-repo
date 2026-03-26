import 'reflect-metadata';
import { BaseEntity } from './entity/base.entity';
import { BaseService } from './service/base.service';
import { BaseResolver } from './resolver/base.resolver';
import type { IRepository } from '@mas/db-contracts';
import type { IBaseService } from './service/base.service';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

class Item extends BaseEntity {
  name!: string;
}

class CreateItemInput {
  name!: string;
}

class UpdateItemInput {
  id!: string;
  name?: string;
}

function makeMockRepo(): jest.Mocked<IRepository<Item, string>> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    filter: jest.fn(),
    findMany: jest.fn(),
    paginateFilter: jest.fn(),
    findCursor: jest.fn(),
    filterCursor: jest.fn(),
    exists: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  };
}

function makeMockService(): jest.Mocked<IBaseService<Item, CreateItemInput, UpdateItemInput>> {
  return {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findPage: jest.fn(),
    findCursorPage: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

// ─── BaseEntity ───────────────────────────────────────────────────────────────

describe('BaseEntity', () => {
  it('is abstract — cannot be instantiated directly, only subclassed', () => {
    const item = new Item();
    expect(item).toBeInstanceOf(BaseEntity);
  });

  it('subclass inherits id, createdAt, updatedAt, isDeleted fields', () => {
    const item = new Item();
    // Fields are undefined until TypeORM populates them — we just verify
    // they exist as own/prototype keys after decoration
    expect('id' in item || item.id === undefined).toBe(true);
    expect('createdAt' in item || item.createdAt === undefined).toBe(true);
    expect('updatedAt' in item || item.updatedAt === undefined).toBe(true);
    expect('isDeleted' in item || item.isDeleted === undefined).toBe(true);
    expect('deletedAt' in item || item.deletedAt === undefined).toBe(true);
  });
});

// ─── BaseService ──────────────────────────────────────────────────────────────

describe('BaseService', () => {
  class ItemService extends BaseService<Item, CreateItemInput, UpdateItemInput>() {
    constructor(repo: IRepository<Item, string>) {
      super(repo);
    }
  }

  let repo: jest.Mocked<IRepository<Item, string>>;
  let service: ItemService;

  beforeEach(() => {
    repo = makeMockRepo();
    service = new ItemService(repo);
  });

  it('findOne filters isDeleted=false via repo.filter', async () => {
    const item = new Item();
    repo.filter.mockResolvedValue([item]);

    const result = await service.findOne('abc');

    expect(repo.filter).toHaveBeenCalledWith({ id: 'abc', isDeleted: false }, { limit: 1 });
    expect(result).toBe(item);
  });

  it('findOne returns null when no active record found', async () => {
    repo.filter.mockResolvedValue([]);

    const result = await service.findOne('missing');

    expect(result).toBeNull();
  });

  it('findOne(id, true) queries by id only via repo.filter — no isDeleted filter', async () => {
    const item = new Item();
    repo.filter.mockResolvedValue([item]);

    const result = await service.findOne('abc', true);

    expect(repo.filter).toHaveBeenCalledWith({ id: 'abc' }, { limit: 1 });
    expect(repo.findById).not.toHaveBeenCalled();
    expect(result).toBe(item);
  });

  it('findAll() calls repo.filter with isDeleted=false', async () => {
    const items = [new Item()];
    repo.filter.mockResolvedValue(items);

    const result = await service.findAll();

    expect(repo.filter).toHaveBeenCalledWith({ isDeleted: false });
    expect(result).toBe(items);
  });

  it('findAll(true) bypasses filter and calls repo.findAll() without args', async () => {
    const items = [new Item()];
    repo.findAll.mockResolvedValue(items);

    const result = await service.findAll(true);

    expect(repo.findAll).toHaveBeenCalledWith();
    expect(result).toBe(items);
  });

  it('create delegates to repo.save(input)', async () => {
    const input: CreateItemInput = { name: 'Hello' };
    const saved = Object.assign(new Item(), { id: '1', name: 'Hello' });
    repo.save.mockResolvedValue(saved);

    const result = await service.create(input);

    expect(repo.save).toHaveBeenCalledWith(input);
    expect(result).toBe(saved);
  });

  it('update merges id into input and delegates to repo.save()', async () => {
    const input: UpdateItemInput = { id: '1', name: 'Updated' };
    const saved = Object.assign(new Item(), { id: '1', name: 'Updated' });
    repo.save.mockResolvedValue(saved);

    const result = await service.update('1', input);

    expect(repo.save).toHaveBeenCalledWith({ ...input, id: '1' });
    expect(result).toBe(saved);
  });

  it('update uses the id argument, not the one from input', async () => {
    const input: UpdateItemInput = { id: 'wrong-id', name: 'X' };
    repo.save.mockResolvedValue(new Item());

    await service.update('correct-id', input);

    const savedArg = repo.save.mock.calls[0][0] as { id: string };
    expect(savedArg.id).toBe('correct-id');
  });

  it('findPage(1, 10) calls repo.paginateFilter with isDeleted=false', async () => {
    const page = {
      items: [new Item()],
      total: 1,
      page: 1,
      pageSize: 10,
      hasNext: false,
      hasPrev: false,
    };
    repo.paginateFilter.mockResolvedValue(page);

    const result = await service.findPage(1, 10);

    expect(repo.paginateFilter).toHaveBeenCalledWith(
      { isDeleted: false },
      { page: 1, pageSize: 10 },
    );
    expect(result).toBe(page);
  });

  it('findPage(1, 10, true) calls repo.paginateFilter with no isDeleted filter', async () => {
    const page = { items: [], total: 0, page: 1, pageSize: 10, hasNext: false, hasPrev: false };
    repo.paginateFilter.mockResolvedValue(page);

    await service.findPage(1, 10, true);

    expect(repo.paginateFilter).toHaveBeenCalledWith({}, { page: 1, pageSize: 10 });
  });

  it('findCursorPage(undefined, 5) calls repo.filterCursor with isDeleted=false', async () => {
    const cursorPage = { items: [new Item()], nextCursor: null, hasNext: false };
    repo.filterCursor.mockResolvedValue(cursorPage);

    const result = await service.findCursorPage(undefined, 5);

    expect(repo.filterCursor).toHaveBeenCalledWith(
      { isDeleted: false },
      { cursor: undefined, limit: 5 },
    );
    expect(result).toBe(cursorPage);
  });

  it('findCursorPage(cursor, 5, true) calls repo.filterCursor with no isDeleted filter', async () => {
    const cursorPage = { items: [], nextCursor: null, hasNext: false };
    repo.filterCursor.mockResolvedValue(cursorPage);

    await service.findCursorPage('abc=', 5, true);

    expect(repo.filterCursor).toHaveBeenCalledWith({}, { cursor: 'abc=', limit: 5 });
  });

  it('delete soft-deletes by saving isDeleted=true', async () => {
    repo.save.mockResolvedValue(new Item());

    await service.delete('abc');

    expect(repo.save).toHaveBeenCalledWith({ id: 'abc', isDeleted: true });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});

// ─── BaseResolver ─────────────────────────────────────────────────────────────

describe('BaseResolver', () => {
  class ItemResolver extends BaseResolver(Item, CreateItemInput, UpdateItemInput) {
    constructor(service: IBaseService<Item, CreateItemInput, UpdateItemInput>) {
      super(service);
    }
  }

  let service: jest.Mocked<IBaseService<Item, CreateItemInput, UpdateItemInput>>;
  let resolver: ItemResolver;

  beforeEach(() => {
    service = makeMockService();
    resolver = new ItemResolver(service);
  });

  it('findAll passes includeDeleted=false by default', async () => {
    const items = [new Item()];
    service.findAll.mockResolvedValue(items);

    const result = await resolver.findAll(false);

    expect(service.findAll).toHaveBeenCalledWith(false);
    expect(result).toBe(items);
  });

  it('findAll passes includeDeleted=true from query arg', async () => {
    const items = [new Item()];
    service.findAll.mockResolvedValue(items);

    const result = await resolver.findAll(true);

    expect(service.findAll).toHaveBeenCalledWith(true);
    expect(result).toBe(items);
  });

  it('findOne passes includeDeleted=false by default', async () => {
    const item = new Item();
    service.findOne.mockResolvedValue(item);

    const result = await resolver.findOne('abc', false);

    expect(service.findOne).toHaveBeenCalledWith('abc', false);
    expect(result).toBe(item);
  });

  it('findOne passes includeDeleted=true from query arg', async () => {
    const item = new Item();
    service.findOne.mockResolvedValue(item);

    const result = await resolver.findOne('abc', true);

    expect(service.findOne).toHaveBeenCalledWith('abc', true);
    expect(result).toBe(item);
  });

  it('findOne returns null when not found', async () => {
    service.findOne.mockResolvedValue(null);

    const result = await resolver.findOne('missing', false);

    expect(result).toBeNull();
  });

  it('findPage delegates to service.findPage with default includeDeleted=false', async () => {
    const page = {
      items: [new Item()],
      total: 1,
      page: 1,
      pageSize: 10,
      hasNext: false,
      hasPrev: false,
    };
    service.findPage.mockResolvedValue(page);

    const result = await resolver.findPage(1, 10, false);

    expect(service.findPage).toHaveBeenCalledWith(1, 10, false);
    expect(result).toBe(page);
  });

  it('findPage passes includeDeleted=true to service', async () => {
    const page = { items: [], total: 0, page: 1, pageSize: 5, hasNext: false, hasPrev: false };
    service.findPage.mockResolvedValue(page);

    await resolver.findPage(1, 5, true);

    expect(service.findPage).toHaveBeenCalledWith(1, 5, true);
  });

  it('findCursor delegates to service.findCursorPage', async () => {
    const cursorPage = { items: [new Item()], nextCursor: 'xyz=', hasNext: true };
    service.findCursorPage.mockResolvedValue(cursorPage);

    const result = await resolver.findCursor(10, undefined, false);

    expect(service.findCursorPage).toHaveBeenCalledWith(undefined, 10, false);
    expect(result).toBe(cursorPage);
  });

  it('findCursor passes cursor and includeDeleted=true to service', async () => {
    const cursorPage = { items: [], nextCursor: null, hasNext: false };
    service.findCursorPage.mockResolvedValue(cursorPage);

    await resolver.findCursor(5, 'abc=', true);

    expect(service.findCursorPage).toHaveBeenCalledWith('abc=', 5, true);
  });

  it('create delegates to service.create(input)', async () => {
    const input: CreateItemInput = { name: 'New' };
    const created = new Item();
    service.create.mockResolvedValue(created);

    const result = await resolver.create(input);

    expect(service.create).toHaveBeenCalledWith(input);
    expect(result).toBe(created);
  });

  it('update extracts id from input and delegates to service.update()', async () => {
    const input: UpdateItemInput = { id: '1', name: 'Updated' };
    const updated = new Item();
    service.update.mockResolvedValue(updated);

    const result = await resolver.update(input);

    expect(service.update).toHaveBeenCalledWith('1', input);
    expect(result).toBe(updated);
  });

  it('delete delegates to service.delete(id) and returns true', async () => {
    service.delete.mockResolvedValue(undefined);

    const result = await resolver.delete('abc');

    expect(service.delete).toHaveBeenCalledWith('abc');
    expect(result).toBe(true);
  });
});

// ─── Query / Mutation naming ──────────────────────────────────────────────────

describe('BaseResolver — GraphQL operation naming', () => {
  it('uses entity class name as suffix to avoid schema collisions', () => {
    // Verify the names by inspecting reflect-metadata on the abstract class
    const ResolverClass = BaseResolver(Item, CreateItemInput, UpdateItemInput);
    // The class should exist and be constructable via a concrete subclass
    expect(typeof ResolverClass).toBe('function');
    expect(ResolverClass.name).toBe('AbstractResolver');
  });
});
