import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TdtUseMemoUseCallbackSeed1774100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const challenge = {
      id: 'a1000001-0000-4000-8000-000000000001',
      title: 'Implement useMyMemo & useMyCallback',
      category: 'react-hooks',
      difficulty: 'hard',
      sortOrder: 20,
      data: {
        description:
          'Implement two custom hooks from scratch using only useRef — no useMemo or useCallback allowed.\n\n' +
          '1. useMyMemo<T>(factory: () => T, deps: unknown[]): T\n' +
          '   - On the first call, run factory() and cache the result.\n' +
          '   - On subsequent calls, re-run factory() only if any dep changed (Object.is comparison).\n' +
          '   - Otherwise return the cached value.\n\n' +
          '2. useMyCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps: unknown[]): T\n' +
          '   - Returns a stable function reference that only changes when deps change.\n' +
          '   - Must use useMyMemo internally.\n\n' +
          'Export both hooks as named exports.',
        starterCode: `import { useRef } from 'react';

// TODO: implement useMyMemo
export function useMyMemo<T>(factory: () => T, deps: unknown[]): T {
  throw new Error('not implemented');
}

// TODO: implement useMyCallback using useMyMemo
export function useMyCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps: unknown[]): T {
  throw new Error('not implemented');
}
`,
        testCode: `import { renderHook } from '@testing-library/react';
import { useMyMemo, useMyCallback } from './solution';

// ─── useMyMemo ────────────────────────────────────────────────────────────────

describe('useMyMemo', () => {
  it('runs the factory on the first render', () => {
    const factory = vi.fn(() => 42);
    const { result } = renderHook(() => useMyMemo(factory, []));
    expect(result.current).toBe(42);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('returns the cached value when deps do not change', () => {
    const factory = vi.fn(() => ({ value: 1 }));
    const { result, rerender } = renderHook(() => useMyMemo(factory, [1, 'a']));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first); // same reference
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('recomputes when a dep changes', () => {
    let dep = 1;
    const factory = vi.fn(() => dep * 10);
    const { result, rerender } = renderHook(() => useMyMemo(factory, [dep]));
    expect(result.current).toBe(10);
    dep = 2;
    rerender();
    expect(result.current).toBe(20);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('uses Object.is semantics (NaN === NaN)', () => {
    const factory = vi.fn(() => 99);
    const { result, rerender } = renderHook(() => useMyMemo(factory, [NaN]));
    rerender(); // NaN deps unchanged
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('recomputes when dep changes from 0 to -0', () => {
    let dep: number = 0;
    const factory = vi.fn(() => String(dep));
    const { rerender } = renderHook(() => useMyMemo(factory, [dep]));
    dep = -0;
    rerender();
    // Object.is(0, -0) === false → should recompute
    expect(factory).toHaveBeenCalledTimes(2);
  });
});

// ─── useMyCallback ────────────────────────────────────────────────────────────

describe('useMyCallback', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useMyCallback(() => 1, []));
    expect(typeof result.current).toBe('function');
  });

  it('returns the same function reference when deps do not change', () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(() => useMyCallback(fn, [1]));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('returns a new function reference when a dep changes', () => {
    let dep = 1;
    const fn = vi.fn();
    const { result, rerender } = renderHook(() => useMyCallback(fn, [dep]));
    const first = result.current;
    dep = 2;
    rerender();
    expect(result.current).not.toBe(first);
  });

  it('the returned function calls through to the original fn', () => {
    const fn = vi.fn((x: number) => x * 2);
    const { result } = renderHook(() => useMyCallback(fn as unknown as (...args: unknown[]) => unknown, []));
    expect((result.current as (x: number) => number)(5)).toBe(10);
    expect(fn).toHaveBeenCalledWith(5);
  });
});
`,
        docs: 'https://react.dev/reference/react/useMemo',
      },
    };

    await queryRunner.query(
      `INSERT INTO "tdt_challenge" ("id", "title", "category", "difficulty", "sortOrder", "data")
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT ("id") DO NOTHING`,
      [
        challenge.id,
        challenge.title,
        challenge.category,
        challenge.difficulty,
        challenge.sortOrder,
        JSON.stringify(challenge.data),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "tdt_challenge" WHERE "id" = 'a1000001-0000-4000-8000-000000000001'`,
    );
  }
}
