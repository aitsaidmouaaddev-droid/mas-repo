import 'reflect-metadata';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Injectable, Inject, Module } from '@nestjs/common';
import { DbContractsModule } from './db-contracts.module';
import type { DbConfig } from './config/db-config';
import { DB_ADAPTER, DB_CONFIG } from './config/db-config';
import type { IDbAdapter, IRepository } from '..';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeMockAdapter(): jest.Mocked<IDbAdapter> {
  return {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    getRepository: jest.fn(),
    getConnection: jest.fn(),
  };
}

// ─── forRoot ─────────────────────────────────────────────────────────────────

describe('DbContractsModule.forRoot', () => {
  let module: TestingModule;
  let adapter: jest.Mocked<IDbAdapter>;

  beforeEach(async () => {
    adapter = makeMockAdapter();

    module = await Test.createTestingModule({
      imports: [DbContractsModule.forRoot({ adapter })],
    }).compile();
  });

  afterEach(() => module.close());

  it('provides DB_ADAPTER', () => {
    const resolved = module.get<IDbAdapter>(DB_ADAPTER);
    expect(resolved).toBe(adapter);
  });

  it('provides DB_CONFIG with the adapter', () => {
    const config = module.get<DbConfig>(DB_CONFIG);
    expect(config.adapter).toBe(adapter);
  });

  it('calls adapter.connect() on bootstrap', async () => {
    await module.init();
    expect(adapter.connect).toHaveBeenCalledTimes(1);
  });

  it('calls adapter.disconnect() on shutdown', async () => {
    await module.init();
    await module.close();
    expect(adapter.disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not call disconnect before init', async () => {
    // close without init — NestJS does not call lifecycle hooks before init
    expect(adapter.disconnect).not.toHaveBeenCalled();
  });
});

// ─── forRootAsync ─────────────────────────────────────────────────────────────

describe('DbContractsModule.forRootAsync', () => {
  let module: TestingModule;
  let adapter: jest.Mocked<IDbAdapter>;

  beforeEach(async () => {
    adapter = makeMockAdapter();

    module = await Test.createTestingModule({
      imports: [
        DbContractsModule.forRootAsync({
          useFactory: () => ({ adapter }),
        }),
      ],
    }).compile();
  });

  afterEach(() => module.close());

  it('resolves DB_ADAPTER from the factory', () => {
    const resolved = module.get<IDbAdapter>(DB_ADAPTER);
    expect(resolved).toBe(adapter);
  });

  it('resolves DB_CONFIG from the factory', () => {
    const config = module.get<DbConfig>(DB_CONFIG);
    expect(config.adapter).toBe(adapter);
  });

  it('calls adapter.connect() on bootstrap', async () => {
    await module.init();
    expect(adapter.connect).toHaveBeenCalledTimes(1);
  });

  it('calls adapter.disconnect() on shutdown', async () => {
    await module.init();
    await module.close();
    expect(adapter.disconnect).toHaveBeenCalledTimes(1);
  });
});

// ─── forRootAsync with injected provider ─────────────────────────────────────

describe('DbContractsModule.forRootAsync — factory with inject', () => {
  @Injectable()
  class FakeConfigService {
    getAdapter(): IDbAdapter {
      return makeMockAdapter();
    }
  }

  // Build a NestJS module that exports FakeConfigService so it can be imported
  // into forRootAsync via the `imports` option.
  @Module({ providers: [FakeConfigService], exports: [FakeConfigService] })
  class FakeConfigModule {}

  it('injects the provider into the factory via imports', async () => {
    const module = await Test.createTestingModule({
      imports: [
        DbContractsModule.forRootAsync({
          imports: [FakeConfigModule],
          inject: [FakeConfigService],
          useFactory: (cfg: FakeConfigService) => ({
            adapter: cfg.getAdapter(),
          }),
        }),
      ],
    }).compile();

    const adapter = module.get<IDbAdapter>(DB_ADAPTER);
    expect(adapter).toBeDefined();
    expect(typeof adapter.connect).toBe('function');

    await module.close();
  });
});

// ─── Global module — DB_ADAPTER accessible from any importing module ──────────

@Injectable()
class ConsumerService {
  constructor(@Inject(DB_ADAPTER) public readonly db: IDbAdapter) {}
}

@Injectable()
class RepoConsumer {
  constructor(@Inject(DB_ADAPTER) private db: IDbAdapter) {}
  getRepo() {
    return this.db.getRepository(class {});
  }
}

describe('DbContractsModule — global scope', () => {
  it('exposes DB_ADAPTER to a sibling module without re-import', async () => {
    const adapter = makeMockAdapter();

    const module = await Test.createTestingModule({
      imports: [DbContractsModule.forRoot({ adapter })],
      providers: [ConsumerService],
    }).compile();

    const consumer = module.get(ConsumerService);
    expect(consumer.db).toBe(adapter);

    await module.close();
  });

  it('getRepository on adapter is callable after injection', async () => {
    const adapter = makeMockAdapter();
    const fakeRepo = {} as IRepository<unknown>;
    adapter.getRepository.mockReturnValue(fakeRepo);

    const module = await Test.createTestingModule({
      imports: [DbContractsModule.forRoot({ adapter })],
      providers: [RepoConsumer],
    }).compile();

    const consumer = module.get(RepoConsumer);
    expect(consumer.getRepo()).toBe(fakeRepo);

    await module.close();
  });
});
