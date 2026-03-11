/**
 * @module repository
 * Abstract SQLite repository base class for the `@mas/mas-sqlite` package.
 *
 * Extend {@link BaseSQLiteRepository} for each entity to get a full
 * {@link IRepository} implementation backed by any {@link ISQLiteAdapter}.
 *
 * @see {@link BaseSQLiteRepository} — the class to extend
 * @see {@link ISQLiteAdapter} — the driver this depends on
 * @see {@link DatabaseManager} — must be mounted before any repository method is called
 */
import type {
  IRepository,
  FilterCriteria,
  PageParams,
  PageResult,
  CursorParams,
  CursorResult,
} from '@mas/frontend-dal';
import type { BindValue, ISQLiteAdapter } from './adapter';
import { DatabaseManager } from './manager';

// ---------------------------------------------------------------------------
// WHERE clause builder (generic over any entity T)
// ---------------------------------------------------------------------------

type WhereClause = { sql: string; values: BindValue[] };

function buildWhere<T>(criteria: FilterCriteria<T>): WhereClause {
  const parts: string[] = [];
  const values: BindValue[] = [];

  for (const key of Object.keys(criteria as object)) {
    const value = (criteria as Record<string, unknown>)[key];
    if (value === undefined) continue;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const ops = value as Record<string, BindValue | BindValue[]>;
      if (ops['eq']  != null) { parts.push(`${key} = ?`);  values.push(ops['eq']  as BindValue); }
      if (ops['ne']  != null) { parts.push(`${key} != ?`); values.push(ops['ne']  as BindValue); }
      if (ops['gt']  != null) { parts.push(`${key} > ?`);  values.push(ops['gt']  as BindValue); }
      if (ops['gte'] != null) { parts.push(`${key} >= ?`); values.push(ops['gte'] as BindValue); }
      if (ops['lt']  != null) { parts.push(`${key} < ?`);  values.push(ops['lt']  as BindValue); }
      if (ops['lte'] != null) { parts.push(`${key} <= ?`); values.push(ops['lte'] as BindValue); }
      if (Array.isArray(ops['in']) && (ops['in'] as BindValue[]).length > 0) {
        const arr = ops['in'] as BindValue[];
        parts.push(`${key} IN (${arr.map(() => '?').join(',')})`);
        values.push(...arr);
      }
      if (ops['contains'] != null) {
        parts.push(`${key} LIKE ?`);
        values.push(`%${ops['contains']}%`);
      }
    } else {
      parts.push(`${key} = ?`);
      values.push(value as BindValue);
    }
  }

  return { sql: parts.length ? ` WHERE ${parts.join(' AND ')}` : '', values };
}

// ---------------------------------------------------------------------------
// Base repository
// ---------------------------------------------------------------------------

/**
 * Abstract base class that implements IRepository<T> over any ISQLiteAdapter.
 *
 * Subclass it for each entity:
 *
 *   class MediaLedgerRepository extends BaseSQLiteRepository<MediaDecisionRow> {
 *     protected tableName = 'media_ledger';
 *     protected selectColumns = ['id', 'verdict'];
 *     protected toRow(entity: MediaDecisionRow) {
 *       return { id: entity.id, verdict: entity.verdict, scannedAt: Date.now() };
 *     }
 *   }
 */
export abstract class BaseSQLiteRepository<T, ID = string>
  implements IRepository<T, ID>
{
  /** Table this repository reads/writes. */
  protected abstract tableName: string;

  /**
   * Columns returned by SELECT queries.
   * May be a subset of the table columns (e.g. exclude internal timestamps).
   */
  protected abstract selectColumns: string[];

  /**
   * Map an entity (plus any DB-internal fields like timestamps) to a full row
   * ready for INSERT OR REPLACE.
   */
  protected abstract toRow(entity: T): Record<string, BindValue>;

  protected get baseSelect(): string {
    return `SELECT ${this.selectColumns.join(', ')} FROM ${this.tableName}`;
  }

  protected async getDb(): Promise<ISQLiteAdapter> {
    return DatabaseManager.ensureReady();
  }

  // ── Read ─────────────────────────────────────────────────────────────────

  async getById(id: ID): Promise<T | null> {
    const db = await this.getDb();
    const row = await db.getFirst<T>(`${this.baseSelect} WHERE id = ?`, [id as BindValue]);
    return row;
  }

  async getAll(): Promise<T[]> {
    const db = await this.getDb();
    return db.getAll<T>(this.baseSelect);
  }

  async paginate(params: PageParams): Promise<PageResult<T>> {
    const db = await this.getDb();
    const offset = (params.page - 1) * params.pageSize;
    const [items, countRow] = await Promise.all([
      db.getAll<T>(`${this.baseSelect} LIMIT ? OFFSET ?`, [params.pageSize, offset]),
      db.getFirst<{ count: number }>(`SELECT COUNT(*) as count FROM ${this.tableName}`),
    ]);
    const total = countRow?.count ?? 0;
    return {
      items,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
      hasMore: offset + items.length < total,
    };
  }

  async paginateCursor(params: CursorParams): Promise<CursorResult<T>> {
    const db = await this.getDb();
    const fetchLimit = params.limit + 1;
    const items = await db.getAll<T>(
      `${this.baseSelect} WHERE id > ? ORDER BY id ASC LIMIT ?`,
      [params.cursor ?? '', fetchLimit],
    );
    const hasMore = items.length > params.limit;
    const result = hasMore ? items.slice(0, params.limit) : items;
    return {
      items: result,
      nextCursor: hasMore ? (result[result.length - 1] as Record<string, unknown>)['id'] as string : undefined,
      hasMore,
    };
  }

  async filter(criteria: FilterCriteria<T>): Promise<T[]> {
    const db = await this.getDb();
    const { sql, values } = buildWhere(criteria);
    return db.getAll<T>(`${this.baseSelect}${sql}`, values);
  }

  async paginateFilter(criteria: FilterCriteria<T>, params: PageParams): Promise<PageResult<T>> {
    const db = await this.getDb();
    const { sql: where, values } = buildWhere(criteria);
    const offset = (params.page - 1) * params.pageSize;
    const [items, countRow] = await Promise.all([
      db.getAll<T>(`${this.baseSelect}${where} LIMIT ? OFFSET ?`, [...values, params.pageSize, offset]),
      db.getFirst<{ count: number }>(`SELECT COUNT(*) as count FROM ${this.tableName}${where}`, values),
    ]);
    const total = countRow?.count ?? 0;
    return {
      items,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
      hasMore: offset + items.length < total,
    };
  }

  async paginateFilterCursor(criteria: FilterCriteria<T>, params: CursorParams): Promise<CursorResult<T>> {
    const db = await this.getDb();
    const { sql: where, values } = buildWhere(criteria);
    const fetchLimit = params.limit + 1;
    const cursorSql = where ? `${where} AND id > ?` : ' WHERE id > ?';
    const items = await db.getAll<T>(
      `${this.baseSelect}${cursorSql} ORDER BY id ASC LIMIT ?`,
      [...values, params.cursor ?? '', fetchLimit],
    );
    const hasMore = items.length > params.limit;
    const result = hasMore ? items.slice(0, params.limit) : items;
    return {
      items: result,
      nextCursor: hasMore ? (result[result.length - 1] as Record<string, unknown>)['id'] as string : undefined,
      hasMore,
    };
  }

  // ── Write ────────────────────────────────────────────────────────────────

  async save(entity: T | Omit<T, 'id'>): Promise<T> {
    const row = this.toRow(entity as T);
    const cols = Object.keys(row);
    const placeholders = cols.map(() => '?').join(', ');
    const values = cols.map((c) => row[c]);
    const db = await this.getDb();
    await db.run(
      `INSERT OR REPLACE INTO ${this.tableName} (${cols.join(', ')}) VALUES (${placeholders})`,
      values,
    );
    return entity as T;
  }

  async update(id: ID, partial: Partial<Omit<T, 'id'>>): Promise<T> {
    const fields = Object.keys(partial);
    const setClauses = fields.map((f) => `${f} = ?`).join(', ');
    const values: BindValue[] = fields.map((f) => ((partial as Record<string, unknown>)[f] ?? null) as BindValue);
    const db = await this.getDb();
    await db.run(
      `UPDATE ${this.tableName} SET ${setClauses} WHERE id = ?`,
      [...values, id as BindValue],
    );
    const updated = await this.getById(id);
    if (!updated) throw new Error(`${this.constructor.name}: id "${id}" not found after update`);
    return updated;
  }

  async delete(id: ID): Promise<void> {
    const db = await this.getDb();
    await db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id as BindValue]);
  }

  async deleteMany(ids: ID[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await this.getDb();
    const placeholders = ids.map(() => '?').join(',');
    await db.run(
      `DELETE FROM ${this.tableName} WHERE id IN (${placeholders})`,
      ids as BindValue[],
    );
  }
}
