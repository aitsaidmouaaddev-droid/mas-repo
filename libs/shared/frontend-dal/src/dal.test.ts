import type {
  SortDirection,
  SortParam,
  PageParams,
  PageResult,
  CursorParams,
  CursorResult,
  FieldOperators,
  FieldFilter,
  FilterCriteria,
  IReadRepository,
  IWriteRepository,
  IRepository,
} from './index';

// ---------------------------------------------------------------------------
// Shared test entity
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// ---------------------------------------------------------------------------
// SortDirection
// ---------------------------------------------------------------------------

describe('SortDirection', () => {
  it('accepts "asc" literal', () => {
    const dir: SortDirection = 'asc';
    expect(dir).toBe('asc');
  });

  it('accepts "desc" literal', () => {
    const dir: SortDirection = 'desc';
    expect(dir).toBe('desc');
  });
});

// ---------------------------------------------------------------------------
// SortParam
// ---------------------------------------------------------------------------

describe('SortParam', () => {
  it('constructs a valid SortParam with keyof T field', () => {
    const sort: SortParam<Product> = { field: 'price', direction: 'asc' };
    expect(sort.field).toBe('price');
    expect(sort.direction).toBe('asc');
  });

  it('constructs a SortParam with desc direction', () => {
    const sort: SortParam<Product> = { field: 'name', direction: 'desc' };
    expect(sort.direction).toBe('desc');
  });
});

// ---------------------------------------------------------------------------
// PageParams
// ---------------------------------------------------------------------------

describe('PageParams', () => {
  it('constructs minimal PageParams (no sort)', () => {
    const params: PageParams = { page: 1, pageSize: 20 };
    expect(params.page).toBe(1);
    expect(params.pageSize).toBe(20);
    expect(params.sort).toBeUndefined();
  });

  it('constructs PageParams with sort array', () => {
    const params: PageParams = {
      page: 2,
      pageSize: 10,
      sort: [{ field: 'name', direction: 'asc' }],
    };
    expect(params.sort).toHaveLength(1);
    expect(params.sort![0].direction).toBe('asc');
  });
});

// ---------------------------------------------------------------------------
// PageResult
// ---------------------------------------------------------------------------

describe('PageResult', () => {
  function makePageResult(overrides: Partial<PageResult<Product>> = {}): PageResult<Product> {
    return {
      items: [],
      total: 100,
      page: 1,
      pageSize: 10,
      totalPages: 10,
      hasMore: true,
      ...overrides,
    };
  }

  it('constructs a conforming PageResult', () => {
    const result = makePageResult();
    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(10);
    expect(result.hasMore).toBe(true);
  });

  it('totalPages = ceil(total / pageSize) — exact division', () => {
    const total = 100;
    const pageSize = 10;
    const totalPages = Math.ceil(total / pageSize);
    const result = makePageResult({ total, pageSize, totalPages });
    expect(result.totalPages).toBe(10);
  });

  it('totalPages = ceil(total / pageSize) — inexact division rounds up', () => {
    const total = 101;
    const pageSize = 10;
    const totalPages = Math.ceil(total / pageSize);
    const result = makePageResult({ total, pageSize, totalPages });
    expect(result.totalPages).toBe(11);
  });

  it('hasMore is false on the last page', () => {
    const result = makePageResult({ page: 10, totalPages: 10, hasMore: false });
    expect(result.hasMore).toBe(false);
  });

  it('hasMore is true when current page is not the last', () => {
    const result = makePageResult({ page: 1, totalPages: 5, hasMore: true });
    expect(result.hasMore).toBe(true);
  });

  it('items array is typed correctly', () => {
    const items: Product[] = [{ id: '1', name: 'Widget', price: 9.99, inStock: true }];
    const result = makePageResult({ items });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Widget');
  });

  it('empty result has total=0, totalPages=0, hasMore=false', () => {
    const result = makePageResult({ total: 0, totalPages: 0, hasMore: false, items: [] });
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasMore).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CursorParams
// ---------------------------------------------------------------------------

describe('CursorParams', () => {
  it('constructs first-page CursorParams (no cursor)', () => {
    const params: CursorParams = { limit: 20 };
    expect(params.limit).toBe(20);
    expect(params.cursor).toBeUndefined();
  });

  it('constructs subsequent-page CursorParams with cursor', () => {
    const params: CursorParams = { cursor: 'abc123', limit: 20 };
    expect(params.cursor).toBe('abc123');
    expect(params.limit).toBe(20);
  });

  it('constructs CursorParams with sort', () => {
    const params: CursorParams = {
      limit: 10,
      sort: [{ field: 'price', direction: 'desc' }],
    };
    expect(params.sort).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// CursorResult
// ---------------------------------------------------------------------------

describe('CursorResult', () => {
  it('constructs a CursorResult with more pages', () => {
    const result: CursorResult<Product> = {
      items: [{ id: '1', name: 'Widget', price: 9.99, inStock: true }],
      nextCursor: 'cursor_1',
      hasMore: true,
    };
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe('cursor_1');
    expect(result.items).toHaveLength(1);
  });

  it('constructs a CursorResult for the last page (no nextCursor)', () => {
    const result: CursorResult<Product> = {
      items: [],
      hasMore: false,
    };
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });

  it('nextCursor is the id of the last item in a typical impl', () => {
    const items: Product[] = [
      { id: 'a', name: 'A', price: 1, inStock: true },
      { id: 'b', name: 'B', price: 2, inStock: false },
    ];
    const result: CursorResult<Product> = {
      items,
      nextCursor: items[items.length - 1].id,
      hasMore: true,
    };
    expect(result.nextCursor).toBe('b');
  });
});

// ---------------------------------------------------------------------------
// FieldOperators
// ---------------------------------------------------------------------------

describe('FieldOperators', () => {
  it('constructs FieldOperators with eq', () => {
    const ops: FieldOperators<number> = { eq: 42 };
    expect(ops.eq).toBe(42);
  });

  it('constructs FieldOperators with ne', () => {
    const ops: FieldOperators<string> = { ne: 'excluded' };
    expect(ops.ne).toBe('excluded');
  });

  it('constructs FieldOperators with gt/gte/lt/lte', () => {
    const ops: FieldOperators<number> = { gt: 10, gte: 10, lt: 100, lte: 100 };
    expect(ops.gt).toBe(10);
    expect(ops.gte).toBe(10);
    expect(ops.lt).toBe(100);
    expect(ops.lte).toBe(100);
  });

  it('constructs FieldOperators with in array', () => {
    const ops: FieldOperators<string> = { in: ['a', 'b', 'c'] };
    expect(ops.in).toEqual(['a', 'b', 'c']);
  });

  it('constructs FieldOperators with contains', () => {
    const ops: FieldOperators<string> = { contains: 'widget' };
    expect(ops.contains).toBe('widget');
  });

  it('constructs FieldOperators with multiple operators', () => {
    const ops: FieldOperators<number> = { gte: 5, lte: 50 };
    expect(ops.gte).toBe(5);
    expect(ops.lte).toBe(50);
  });

  it('all operator fields are optional', () => {
    const ops: FieldOperators<number> = {};
    expect(ops.eq).toBeUndefined();
    expect(ops.ne).toBeUndefined();
    expect(ops.gt).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// FieldFilter
// ---------------------------------------------------------------------------

describe('FieldFilter', () => {
  it('accepts a plain value', () => {
    const filter: FieldFilter<number> = 42;
    expect(filter).toBe(42);
  });

  it('accepts a FieldOperators object', () => {
    const filter: FieldFilter<number> = { gt: 10, lt: 100 };
    expect((filter as FieldOperators<number>).gt).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// FilterCriteria
// ---------------------------------------------------------------------------

describe('FilterCriteria', () => {
  it('constructs a single-field criteria with plain value', () => {
    const criteria: FilterCriteria<Product> = { inStock: true };
    expect(criteria.inStock).toBe(true);
  });

  it('constructs a single-field criteria with operator', () => {
    const criteria: FilterCriteria<Product> = { price: { gte: 10 } };
    expect((criteria.price as FieldOperators<number>).gte).toBe(10);
  });

  it('constructs multi-field criteria', () => {
    const criteria: FilterCriteria<Product> = {
      name: { contains: 'widget' },
      price: { lt: 50 },
      inStock: true,
    };
    expect((criteria.name as FieldOperators<string>).contains).toBe('widget');
    expect((criteria.price as FieldOperators<number>).lt).toBe(50);
    expect(criteria.inStock).toBe(true);
  });

  it('all fields in FilterCriteria are optional', () => {
    const criteria: FilterCriteria<Product> = {};
    expect(criteria.id).toBeUndefined();
    expect(criteria.name).toBeUndefined();
    expect(criteria.price).toBeUndefined();
    expect(criteria.inStock).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// IReadRepository — structural / mock conformance test
// ---------------------------------------------------------------------------

describe('IReadRepository', () => {
  it('a mock implementing IReadRepository satisfies the interface shape', () => {
    const repo: IReadRepository<Product> = {
      getById: jest.fn().mockResolvedValue(null),
      getAll: jest.fn().mockResolvedValue([]),
      paginate: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasMore: false,
      }),
      paginateCursor: jest.fn().mockResolvedValue({ items: [], hasMore: false }),
      filter: jest.fn().mockResolvedValue([]),
      paginateFilter: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasMore: false,
      }),
      paginateFilterCursor: jest.fn().mockResolvedValue({ items: [], hasMore: false }),
    };
    expect(typeof repo.getById).toBe('function');
    expect(typeof repo.getAll).toBe('function');
    expect(typeof repo.paginate).toBe('function');
    expect(typeof repo.paginateCursor).toBe('function');
    expect(typeof repo.filter).toBe('function');
    expect(typeof repo.paginateFilter).toBe('function');
    expect(typeof repo.paginateFilterCursor).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// IWriteRepository — structural / mock conformance test
// ---------------------------------------------------------------------------

describe('IWriteRepository', () => {
  it('a mock implementing IWriteRepository satisfies the interface shape', () => {
    const repo: IWriteRepository<Product> = {
      save: jest.fn().mockResolvedValue({ id: '1', name: 'A', price: 1, inStock: true }),
      update: jest.fn().mockResolvedValue({ id: '1', name: 'A', price: 1, inStock: true }),
      delete: jest.fn().mockResolvedValue(undefined),
      deleteMany: jest.fn().mockResolvedValue(undefined),
    };
    expect(typeof repo.save).toBe('function');
    expect(typeof repo.update).toBe('function');
    expect(typeof repo.delete).toBe('function');
    expect(typeof repo.deleteMany).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// IRepository — extends both read + write
// ---------------------------------------------------------------------------

describe('IRepository', () => {
  it('a mock implementing IRepository has all read and write methods', () => {
    const repo: IRepository<Product> = {
      getById: jest.fn().mockResolvedValue(null),
      getAll: jest.fn().mockResolvedValue([]),
      paginate: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasMore: false,
      }),
      paginateCursor: jest.fn().mockResolvedValue({ items: [], hasMore: false }),
      filter: jest.fn().mockResolvedValue([]),
      paginateFilter: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasMore: false,
      }),
      paginateFilterCursor: jest.fn().mockResolvedValue({ items: [], hasMore: false }),
      save: jest.fn().mockResolvedValue({ id: '1', name: 'A', price: 1, inStock: true }),
      update: jest.fn().mockResolvedValue({ id: '1', name: 'A', price: 1, inStock: true }),
      delete: jest.fn().mockResolvedValue(undefined),
      deleteMany: jest.fn().mockResolvedValue(undefined),
    };
    // Read methods
    expect(typeof repo.getById).toBe('function');
    expect(typeof repo.getAll).toBe('function');
    expect(typeof repo.paginate).toBe('function');
    expect(typeof repo.filter).toBe('function');
    // Write methods
    expect(typeof repo.save).toBe('function');
    expect(typeof repo.update).toBe('function');
    expect(typeof repo.delete).toBe('function');
    expect(typeof repo.deleteMany).toBe('function');
  });
});
