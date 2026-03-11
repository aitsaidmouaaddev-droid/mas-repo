import { DatabaseManager } from './manager';
import { BaseSQLiteRepository } from './repository';
import type { ISQLiteAdapter } from './adapter';
import type { DatabaseConfig } from './schema';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockAdapter(): jest.Mocked<ISQLiteAdapter> {
  return {
    open: jest.fn().mockResolvedValue(undefined),
    exec: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue(undefined),
    getFirst: jest.fn().mockResolvedValue(null),
    getAll: jest.fn().mockResolvedValue([]),
  };
}

// ---------------------------------------------------------------------------
// Test entity + repository
// ---------------------------------------------------------------------------

type Item = { id: string; name: string; score: number };

class ItemRepo extends BaseSQLiteRepository<Item> {
  tableName = 'items';
  selectColumns = ['id', 'name', 'score'];
  toRow(e: Item) {
    return { id: e.id, name: e.name, score: e.score };
  }
}

// ---------------------------------------------------------------------------
// DatabaseManager — reset singleton state before each test
// ---------------------------------------------------------------------------

beforeEach(() => {
  let res!: () => void;
  (DatabaseManager as any)._ready = new Promise<void>((r) => {
    res = r;
  });
  (DatabaseManager as any)._resolve = res;
  (DatabaseManager as any)._adapter = null;
});

// ---------------------------------------------------------------------------
// DatabaseManager.mount
// ---------------------------------------------------------------------------

describe('DatabaseManager.mount', () => {
  it('calls adapter.open with the database name', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = { name: 'test.db', tables: [] };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.open).toHaveBeenCalledWith('test.db');
    expect(adapter.open).toHaveBeenCalledTimes(1);
  });

  it('calls adapter.exec with combined PRAGMA SQL when pragmas are provided', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [],
      pragmas: ['journal_mode = WAL', 'foreign_keys = ON'],
    };
    await DatabaseManager.mount(config, adapter);
    const execCalls = (adapter.exec as jest.Mock).mock.calls;
    const pragmaCall = execCalls.find((call: string[]) =>
      call[0].includes('PRAGMA journal_mode = WAL'),
    );
    expect(pragmaCall).toBeDefined();
    expect(pragmaCall![0]).toContain('PRAGMA foreign_keys = ON');
  });

  it('does not call exec for pragmas when pragmas array is empty', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = { name: 'test.db', tables: [], pragmas: [] };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).not.toHaveBeenCalled();
  });

  it('does not call exec for pragmas when pragmas is undefined', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = { name: 'test.db', tables: [] };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).not.toHaveBeenCalled();
  });

  it('calls adapter.exec once per table with CREATE TABLE IF NOT EXISTS', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        { name: 'items', columns: [{ name: 'id', type: 'TEXT', primaryKey: true }] },
        { name: 'tags', columns: [{ name: 'id', type: 'TEXT', primaryKey: true }] },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    const execCalls = (adapter.exec as jest.Mock).mock.calls as string[][];
    const tableCalls = execCalls.filter((call) => call[0].includes('CREATE TABLE IF NOT EXISTS'));
    expect(tableCalls).toHaveLength(2);
  });

  it('builds correct CREATE TABLE SQL with PRIMARY KEY', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        {
          name: 'items',
          columns: [{ name: 'id', type: 'TEXT', primaryKey: true }],
        },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).toHaveBeenCalledWith(
      'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY);',
    );
  });

  it('builds CREATE TABLE SQL with NOT NULL', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        {
          name: 'items',
          columns: [{ name: 'name', type: 'TEXT', notNull: true }],
        },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).toHaveBeenCalledWith(
      'CREATE TABLE IF NOT EXISTS items (name TEXT NOT NULL);',
    );
  });

  it('builds CREATE TABLE SQL with UNIQUE', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        {
          name: 'items',
          columns: [{ name: 'email', type: 'TEXT', unique: true }],
        },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).toHaveBeenCalledWith(
      'CREATE TABLE IF NOT EXISTS items (email TEXT UNIQUE);',
    );
  });

  it('builds CREATE TABLE SQL with DEFAULT', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        {
          name: 'items',
          columns: [{ name: 'score', type: 'INTEGER', default: '0' }],
        },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).toHaveBeenCalledWith(
      'CREATE TABLE IF NOT EXISTS items (score INTEGER DEFAULT 0);',
    );
  });

  it('builds CREATE TABLE SQL combining all column constraints', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = {
      name: 'test.db',
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'TEXT', primaryKey: true },
            { name: 'email', type: 'TEXT', notNull: true, unique: true },
            { name: 'score', type: 'INTEGER', default: '0' },
          ],
        },
      ],
    };
    await DatabaseManager.mount(config, adapter);
    expect(adapter.exec).toHaveBeenCalledWith(
      'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, score INTEGER DEFAULT 0);',
    );
  });
});

// ---------------------------------------------------------------------------
// DatabaseManager.ensureReady
// ---------------------------------------------------------------------------

describe('DatabaseManager.ensureReady', () => {
  it('resolves and returns the adapter after mount', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = { name: 'test.db', tables: [] };
    await DatabaseManager.mount(config, adapter);
    const result = await DatabaseManager.ensureReady();
    expect(result).toBe(adapter);
  });

  it('waits for mount before resolving', async () => {
    const adapter = mockAdapter();
    const config: DatabaseConfig = { name: 'test.db', tables: [] };

    let resolved = false;
    const readyPromise = DatabaseManager.ensureReady().then((a) => {
      resolved = true;
      return a;
    });

    expect(resolved).toBe(false);
    await DatabaseManager.mount(config, adapter);
    const result = await readyPromise;
    expect(resolved).toBe(true);
    expect(result).toBe(adapter);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository — helpers
// ---------------------------------------------------------------------------

async function mountAndGetRepo() {
  const adapter = mockAdapter();
  const config: DatabaseConfig = { name: 'test.db', tables: [] };
  await DatabaseManager.mount(config, adapter);
  const repo = new ItemRepo();
  return { adapter, repo };
}

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.getById
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.getById', () => {
  it('calls getFirst with correct SQL and id param', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.getById('abc');
    expect(adapter.getFirst).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE id = ?',
      ['abc'],
    );
  });

  it('returns the row from getFirst', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const item: Item = { id: 'abc', name: 'Test', score: 10 };
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(item);
    const result = await repo.getById('abc');
    expect(result).toEqual(item);
  });

  it('returns null when getFirst returns null', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(null);
    const result = await repo.getById('missing');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.getAll
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.getAll', () => {
  it('calls getAll with base SELECT', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.getAll();
    expect(adapter.getAll).toHaveBeenCalledWith('SELECT id, name, score FROM items');
  });

  it('returns the rows from getAll', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = [
      { id: '1', name: 'A', score: 1 },
      { id: '2', name: 'B', score: 2 },
    ];
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    const result = await repo.getAll();
    expect(result).toEqual(items);
  });

  it('returns empty array when no rows exist', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    const result = await repo.getAll();
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.paginate
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.paginate', () => {
  it('calls getAll with LIMIT/OFFSET SQL', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 0 });
    await repo.paginate({ page: 1, pageSize: 10 });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items LIMIT ? OFFSET ?',
      [10, 0],
    );
  });

  it('computes correct OFFSET for page 2', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 50 });
    await repo.paginate({ page: 2, pageSize: 10 });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items LIMIT ? OFFSET ?',
      [10, 10],
    );
  });

  it('returns correct totalPages', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 35 });
    const result = await repo.paginate({ page: 1, pageSize: 10 });
    expect(result.totalPages).toBe(4);
  });

  it('hasMore is true when more pages remain', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 50 });
    const result = await repo.paginate({ page: 1, pageSize: 10 });
    expect(result.hasMore).toBe(true);
  });

  it('hasMore is false on the last page', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 15 });
    const result = await repo.paginate({ page: 2, pageSize: 10 });
    expect(result.hasMore).toBe(false);
  });

  it('calls COUNT query on the table', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 0 });
    await repo.paginate({ page: 1, pageSize: 10 });
    expect(adapter.getFirst).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM items');
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.paginateCursor
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.paginateCursor', () => {
  it('fetches limit+1 rows to determine hasMore', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.paginateCursor({ limit: 5 });
    expect(adapter.getAll).toHaveBeenCalledWith(expect.stringContaining('LIMIT ?'), [
      expect.anything(),
      6,
    ]);
  });

  it('hasMore is true when returned rows exceed limit', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    // Return limit+1 items (6 when limit=5)
    const items: Item[] = Array.from({ length: 6 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    const result = await repo.paginateCursor({ limit: 5 });
    expect(result.hasMore).toBe(true);
    expect(result.items).toHaveLength(5);
  });

  it('nextCursor equals the id of the last item when hasMore is true', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = Array.from({ length: 6 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    const result = await repo.paginateCursor({ limit: 5 });
    expect(result.nextCursor).toBe('5');
  });

  it('hasMore is false when fewer results than limit are returned', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const items: Item[] = Array.from({ length: 3 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i}`,
      score: i,
    }));
    (adapter.getAll as jest.Mock).mockResolvedValueOnce(items);
    const result = await repo.paginateCursor({ limit: 5 });
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });

  it('nextCursor is undefined when hasMore is false', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    const result = await repo.paginateCursor({ limit: 5 });
    expect(result.nextCursor).toBeUndefined();
  });

  it('uses cursor param in WHERE id > ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.paginateCursor({ cursor: 'cursor_10', limit: 5 });
    expect(adapter.getAll).toHaveBeenCalledWith(expect.stringContaining('WHERE id > ?'), [
      'cursor_10',
      6,
    ]);
  });

  it('uses empty string as cursor when cursor is undefined', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.paginateCursor({ limit: 5 });
    expect(adapter.getAll).toHaveBeenCalledWith(expect.anything(), ['', 6]);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.filter
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.filter', () => {
  it('plain value criteria produces WHERE key = ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ name: 'Alice' });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE name = ?',
      ['Alice'],
    );
  });

  it('eq operator produces WHERE key = ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { eq: 42 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score = ?',
      [42],
    );
  });

  it('ne operator produces WHERE key != ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { ne: 0 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score != ?',
      [0],
    );
  });

  it('gt operator produces WHERE key > ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { gt: 10 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score > ?',
      [10],
    );
  });

  it('gte operator produces WHERE key >= ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { gte: 10 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score >= ?',
      [10],
    );
  });

  it('lt operator produces WHERE key < ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { lt: 100 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score < ?',
      [100],
    );
  });

  it('lte operator produces WHERE key <= ?', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ score: { lte: 100 } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE score <= ?',
      [100],
    );
  });

  it('in operator produces WHERE key IN (?,?)', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ id: { in: ['a', 'b'] } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE id IN (?,?)',
      ['a', 'b'],
    );
  });

  it('contains operator produces WHERE key LIKE %value%', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ name: { contains: 'foo' } });
    expect(adapter.getAll).toHaveBeenCalledWith(
      'SELECT id, name, score FROM items WHERE name LIKE ?',
      ['%foo%'],
    );
  });

  it('multiple criteria are AND-joined in WHERE clause', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({ name: 'Bob', score: { gt: 5 } });
    const [sql, values] = (adapter.getAll as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(sql).toContain('WHERE');
    expect(sql).toContain('AND');
    expect(sql).toContain('name = ?');
    expect(sql).toContain('score > ?');
    expect(values).toContain('Bob');
    expect(values).toContain(5);
  });

  it('empty criteria produces no WHERE clause', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    await repo.filter({});
    expect(adapter.getAll).toHaveBeenCalledWith('SELECT id, name, score FROM items', []);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.paginateFilter
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.paginateFilter', () => {
  it('combines WHERE clause with LIMIT/OFFSET', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 0 });
    await repo.paginateFilter({ name: 'Alice' }, { page: 1, pageSize: 5 });
    const [sql, values] = (adapter.getAll as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(sql).toContain('WHERE name = ?');
    expect(sql).toContain('LIMIT ?');
    expect(sql).toContain('OFFSET ?');
    expect(values).toContain('Alice');
    expect(values).toContain(5);
    expect(values).toContain(0);
  });

  it('passes criteria values to COUNT query', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getAll as jest.Mock).mockResolvedValueOnce([]);
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce({ count: 10 });
    await repo.paginateFilter({ score: { gte: 5 } }, { page: 1, pageSize: 10 });
    expect(adapter.getFirst).toHaveBeenCalledWith(expect.stringContaining('SELECT COUNT(*)'), [5]);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.save
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.save', () => {
  it('calls INSERT OR REPLACE with correct SQL', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const item: Item = { id: 'x1', name: 'Widget', score: 99 };
    await repo.save(item);
    const [sql] = (adapter.run as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(sql).toMatch(/INSERT OR REPLACE INTO items/);
    expect(sql).toContain('id');
    expect(sql).toContain('name');
    expect(sql).toContain('score');
  });

  it('passes all column values as bind params', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const item: Item = { id: 'x1', name: 'Widget', score: 99 };
    await repo.save(item);
    const [, values] = (adapter.run as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(values).toContain('x1');
    expect(values).toContain('Widget');
    expect(values).toContain(99);
  });

  it('returns the saved entity', async () => {
    const { repo } = await mountAndGetRepo();
    const item: Item = { id: 'x1', name: 'Widget', score: 99 };
    const result = await repo.save(item);
    expect(result).toEqual(item);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.update
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.update', () => {
  it('calls UPDATE SET with correct SQL', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const updated: Item = { id: 'x1', name: 'Updated', score: 50 };
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(updated);
    await repo.update('x1', { name: 'Updated', score: 50 });
    const [sql] = (adapter.run as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(sql).toMatch(/UPDATE items SET/);
    expect(sql).toContain('WHERE id = ?');
    expect(sql).toContain('name = ?');
    expect(sql).toContain('score = ?');
  });

  it('passes partial values and id as bind params', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const updated: Item = { id: 'x1', name: 'Updated', score: 50 };
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(updated);
    await repo.update('x1', { name: 'Updated', score: 50 });
    const [, values] = (adapter.run as jest.Mock).mock.calls[0] as [string, unknown[]];
    expect(values).toContain('Updated');
    expect(values).toContain(50);
    expect(values).toContain('x1');
  });

  it('returns the updated entity from getById', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    const updated: Item = { id: 'x1', name: 'Updated', score: 50 };
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(updated);
    const result = await repo.update('x1', { name: 'Updated' });
    expect(result).toEqual(updated);
  });

  it('throws when entity not found after update', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    (adapter.getFirst as jest.Mock).mockResolvedValueOnce(null);
    await expect(repo.update('missing', { name: 'X' })).rejects.toThrow(/not found after update/);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.delete
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.delete', () => {
  it('calls DELETE WHERE id = ? with the given id', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.delete('x1');
    expect(adapter.run).toHaveBeenCalledWith('DELETE FROM items WHERE id = ?', ['x1']);
  });
});

// ---------------------------------------------------------------------------
// BaseSQLiteRepository.deleteMany
// ---------------------------------------------------------------------------

describe('BaseSQLiteRepository.deleteMany', () => {
  it('makes no db call when ids array is empty', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.deleteMany([]);
    expect(adapter.run).not.toHaveBeenCalled();
  });

  it('calls DELETE WHERE id IN (?,?) for multiple ids', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.deleteMany(['a', 'b', 'c']);
    expect(adapter.run).toHaveBeenCalledWith('DELETE FROM items WHERE id IN (?,?,?)', [
      'a',
      'b',
      'c',
    ]);
  });

  it('calls DELETE WHERE id IN (?) for a single id', async () => {
    const { adapter, repo } = await mountAndGetRepo();
    await repo.deleteMany(['solo']);
    expect(adapter.run).toHaveBeenCalledWith('DELETE FROM items WHERE id IN (?)', ['solo']);
  });
});
