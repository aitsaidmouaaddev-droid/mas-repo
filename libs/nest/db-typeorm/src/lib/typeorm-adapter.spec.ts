import 'reflect-metadata';

// Mock TypeORM's DataSource before importing the adapter
jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: jest.fn(),
  };
});

import { DataSource } from 'typeorm';
import { TypeOrmAdapter } from './typeorm-adapter';
import { TypeOrmRepository } from './typeorm-repository';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeMockDataSource(isInitialized = false): jest.Mocked<DataSource> {
  return {
    isInitialized,
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    manager: {
      getRepository: jest.fn().mockReturnValue({}),
    },
  } as unknown as jest.Mocked<DataSource>;
}

class TestEntity {
  id!: string;
  name!: string;
}

// ─── connect ─────────────────────────────────────────────────────────────────

describe('TypeOrmAdapter.connect', () => {
  it('calls dataSource.initialize() when not yet initialized', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    expect(mockDs.initialize).toHaveBeenCalledTimes(1);
  });

  it('does NOT call initialize() again when already initialized', async () => {
    const mockDs = makeMockDataSource(true);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    expect(mockDs.initialize).not.toHaveBeenCalled();
  });

  it('creates the DataSource lazily on first connect', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockClear().mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });

    expect(DataSource).not.toHaveBeenCalled();

    await adapter.connect();

    expect(DataSource).toHaveBeenCalledTimes(1);
  });
});

// ─── disconnect ──────────────────────────────────────────────────────────────

describe('TypeOrmAdapter.disconnect', () => {
  it('calls dataSource.destroy() when initialized', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    mockDs.isInitialized = true;
    await adapter.disconnect();

    expect(mockDs.destroy).toHaveBeenCalledTimes(1);
  });

  it('does NOT call destroy() when not initialized', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();
    await adapter.disconnect(); // isInitialized is false → no destroy

    expect(mockDs.destroy).not.toHaveBeenCalled();
  });

  it('is safe to call before connect — no-op', async () => {
    const mockDs = makeMockDataSource(true);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.disconnect(); // dataSource is null → no-op

    expect(mockDs.destroy).not.toHaveBeenCalled();
  });

  it('is idempotent — safe to call multiple times', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    mockDs.isInitialized = true;
    await adapter.disconnect();
    mockDs.isInitialized = false;
    await adapter.disconnect();

    expect(mockDs.destroy).toHaveBeenCalledTimes(1);
  });
});

// ─── getRepository ────────────────────────────────────────────────────────────

describe('TypeOrmAdapter.getRepository', () => {
  it('throws when called before connect', () => {
    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });

    expect(() => adapter.getRepository(TestEntity)).toThrow(
      'TypeOrmAdapter.getRepository: adapter is not connected',
    );
  });

  it('returns a TypeOrmRepository for an entity class after connect', async () => {
    const mockDs = makeMockDataSource(true);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();
    const repo = adapter.getRepository(TestEntity);

    expect(repo).toBeInstanceOf(TypeOrmRepository);
  });

  it('throws when a string entity name is passed', async () => {
    const mockDs = makeMockDataSource(true);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    expect(() => adapter.getRepository('TestEntity')).toThrow(
      'TypeOrmAdapter.getRepository: string entity names are not supported',
    );
  });

  it('returns different repository instances for different entity classes', async () => {
    const mockDs = makeMockDataSource(true);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    class PostEntity {
      id!: string;
    }

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();
    const userRepo = adapter.getRepository(TestEntity);
    const postRepo = adapter.getRepository(PostEntity);

    expect(userRepo).not.toBe(postRepo);
  });
});

// ─── getConnection ────────────────────────────────────────────────────────────

describe('TypeOrmAdapter.getConnection', () => {
  it('throws when called before connect', () => {
    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });

    expect(() => adapter.getConnection()).toThrow(
      'TypeOrmAdapter.getConnection: adapter is not connected',
    );
  });

  it('returns the DataSource instance after connect', async () => {
    const mockDs = makeMockDataSource();
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });
    await adapter.connect();

    expect(adapter.getConnection()).toBe(mockDs);
  });
});

// ─── lifecycle integration ────────────────────────────────────────────────────

describe('TypeOrmAdapter — connect then disconnect lifecycle', () => {
  it('initializes on connect and destroys on disconnect', async () => {
    const mockDs = makeMockDataSource(false);
    (DataSource as jest.Mock).mockImplementation(() => mockDs);

    const adapter = new TypeOrmAdapter({ type: 'sqlite', database: ':memory:' });

    await adapter.connect();
    expect(mockDs.initialize).toHaveBeenCalledTimes(1);

    // Simulate DataSource becoming initialized
    mockDs.isInitialized = true;

    await adapter.disconnect();
    expect(mockDs.destroy).toHaveBeenCalledTimes(1);
  });
});
