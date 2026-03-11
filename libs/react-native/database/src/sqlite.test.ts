import { ExpoSQLiteAdapter } from './sqlite';

// ---------------------------------------------------------------------------
// Mock expo-sqlite
// ---------------------------------------------------------------------------

jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue(undefined),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
  };
  return {
    openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
    __mockDb: mockDb,
  };
});

// ---------------------------------------------------------------------------
// Helper — get the mock db handle
// ---------------------------------------------------------------------------

function getMockDb() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SQLite = require('expo-sqlite');
  return SQLite.__mockDb as {
    execAsync: jest.Mock;
    runAsync: jest.Mock;
    getFirstAsync: jest.Mock;
    getAllAsync: jest.Mock;
  };
}

// ---------------------------------------------------------------------------
// Reset mock state between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  const db = getMockDb();
  db.execAsync.mockReset();
  db.runAsync.mockReset();
  db.getFirstAsync.mockReset();
  db.getAllAsync.mockReset();

  db.execAsync.mockResolvedValue(undefined);
  db.runAsync.mockResolvedValue(undefined);
  db.getFirstAsync.mockResolvedValue(null);
  db.getAllAsync.mockResolvedValue([]);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SQLite = require('expo-sqlite');
  (SQLite.openDatabaseAsync as jest.Mock).mockReset();
  (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(db);
});

// ---------------------------------------------------------------------------
// open
// ---------------------------------------------------------------------------

describe('ExpoSQLiteAdapter.open', () => {
  it('calls SQLite.openDatabaseAsync with the given name', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('media.db');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SQLite = require('expo-sqlite');
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('media.db');
  });

  it('resolves without error', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await expect(adapter.open('test.db')).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// exec
// ---------------------------------------------------------------------------

describe('ExpoSQLiteAdapter.exec', () => {
  it('calls db.execAsync with the sql string', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    await adapter.exec('CREATE TABLE IF NOT EXISTS t (id TEXT);');
    expect(db.execAsync).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS t (id TEXT);');
  });

  it('resolves without error', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    await expect(adapter.exec('PRAGMA journal_mode = WAL;')).resolves.toBeUndefined();
  });

  it('throws "call open() before use" when called before open', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await expect(adapter.exec('SELECT 1')).rejects.toThrow('call open() before use');
  });
});

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

describe('ExpoSQLiteAdapter.run', () => {
  it('calls db.runAsync with sql and params', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    await adapter.run('INSERT INTO t (id) VALUES (?)', ['abc']);
    expect(db.runAsync).toHaveBeenCalledWith('INSERT INTO t (id) VALUES (?)', ['abc']);
  });

  it('defaults params to empty array when not provided', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    await adapter.run('DELETE FROM t');
    expect(db.runAsync).toHaveBeenCalledWith('DELETE FROM t', []);
  });

  it('throws "call open() before use" when called before open', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await expect(adapter.run('DELETE FROM t')).rejects.toThrow('call open() before use');
  });
});

// ---------------------------------------------------------------------------
// getFirst
// ---------------------------------------------------------------------------

describe('ExpoSQLiteAdapter.getFirst', () => {
  it('returns the result from db.getFirstAsync', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    const row = { id: '1', name: 'Test' };
    db.getFirstAsync.mockResolvedValueOnce(row);
    const result = await adapter.getFirst('SELECT * FROM t WHERE id = ?', ['1']);
    expect(result).toEqual(row);
  });

  it('returns null when db.getFirstAsync returns null', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    db.getFirstAsync.mockResolvedValueOnce(null);
    const result = await adapter.getFirst('SELECT * FROM t WHERE id = ?', ['missing']);
    expect(result).toBeNull();
  });

  it('returns null when db.getFirstAsync returns undefined', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    db.getFirstAsync.mockResolvedValueOnce(undefined);
    const result = await adapter.getFirst('SELECT * FROM t WHERE id = ?', ['missing']);
    expect(result).toBeNull();
  });

  it('defaults params to empty array when not provided', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    db.getFirstAsync.mockResolvedValueOnce(null);
    await adapter.getFirst('SELECT * FROM t LIMIT 1');
    expect(db.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM t LIMIT 1', []);
  });

  it('throws "call open() before use" when called before open', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await expect(adapter.getFirst('SELECT 1')).rejects.toThrow('call open() before use');
  });
});

// ---------------------------------------------------------------------------
// getAll
// ---------------------------------------------------------------------------

describe('ExpoSQLiteAdapter.getAll', () => {
  it('returns array of rows from db.getAllAsync', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    const rows = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    db.getAllAsync.mockResolvedValueOnce(rows);
    const result = await adapter.getAll('SELECT * FROM t');
    expect(result).toEqual(rows);
  });

  it('returns empty array when no rows match', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    db.getAllAsync.mockResolvedValueOnce([]);
    const result = await adapter.getAll('SELECT * FROM t WHERE id = ?', ['nope']);
    expect(result).toEqual([]);
  });

  it('defaults params to empty array when not provided', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await adapter.open('test.db');
    const db = getMockDb();
    db.getAllAsync.mockResolvedValueOnce([]);
    await adapter.getAll('SELECT * FROM t');
    expect(db.getAllAsync).toHaveBeenCalledWith('SELECT * FROM t', []);
  });

  it('throws "call open() before use" when called before open', async () => {
    const adapter = new ExpoSQLiteAdapter();
    await expect(adapter.getAll('SELECT 1')).rejects.toThrow('call open() before use');
  });
});
