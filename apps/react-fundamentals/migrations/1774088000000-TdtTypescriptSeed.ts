import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TdtTypescriptSeed1774088000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const challenges = [

      // ── EASY (4) ────────────────────────────────────────────────────────────

      {
        id: 'b0000001-0000-4000-8000-000000000001',
        title: 'Compact Array',
        category: 'typescript',
        difficulty: 'easy',
        sortOrder: 100,
        data: {
          description: 'Remove all falsy values (`null`, `undefined`, `false`, `0`, `\'\'`) from an array and return the remaining elements.',
          starterCode: `export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {\n  // TODO: remove all falsy values\n  return [];\n}\n`,
          testCode: `import { compact } from './solution';\n\ndescribe('compact', () => {\n  it('removes null and undefined', () => {\n    expect(compact([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);\n  });\n  it('removes false, 0 and empty string', () => {\n    expect(compact([false, 0, '', 1, 'a'])).toEqual([1, 'a']);\n  });\n  it('returns empty array for empty input', () => {\n    expect(compact([])).toEqual([]);\n  });\n  it('preserves truthy values unchanged', () => {\n    expect(compact([1, 'hello', true, {a:1}])).toEqual([1, 'hello', true, {a:1}]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000001-0000-4000-8000-000000000002',
        title: 'Sum Array',
        category: 'typescript',
        difficulty: 'easy',
        sortOrder: 101,
        data: {
          description: 'Implement `sumArray` that returns the sum of all numbers in the array. Return `0` for an empty array.',
          starterCode: `export function sumArray(nums: number[]): number {\n  // TODO: compute the sum\n  return 0;\n}\n`,
          testCode: `import { sumArray } from './solution';\n\ndescribe('sumArray', () => {\n  it('returns 0 for empty array', () => {\n    expect(sumArray([])).toBe(0);\n  });\n  it('sums positive numbers', () => {\n    expect(sumArray([1, 2, 3, 4])).toBe(10);\n  });\n  it('handles negative numbers', () => {\n    expect(sumArray([-1, 2, -3, 4])).toBe(2);\n  });\n  it('handles single element', () => {\n    expect(sumArray([42])).toBe(42);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000001-0000-4000-8000-000000000003',
        title: 'Range',
        category: 'typescript',
        difficulty: 'easy',
        sortOrder: 102,
        data: {
          description: 'Implement `range(start, end, step?)` that returns an array `[start, start+step, ...]` up to (not including) `end`. `step` defaults to `1`.',
          starterCode: `export function range(start: number, end: number, step = 1): number[] {\n  // TODO: generate the range array\n  return [];\n}\n`,
          testCode: `import { range } from './solution';\n\ndescribe('range', () => {\n  it('generates a simple range', () => {\n    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);\n  });\n  it('respects a custom step', () => {\n    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);\n  });\n  it('returns empty array when start >= end', () => {\n    expect(range(5, 5)).toEqual([]);\n  });\n  it('handles non-zero start', () => {\n    expect(range(3, 7)).toEqual([3, 4, 5, 6]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000001-0000-4000-8000-000000000004',
        title: 'Last Element',
        category: 'typescript',
        difficulty: 'easy',
        sortOrder: 103,
        data: {
          description: 'Implement `last<T>(arr: T[]): T | undefined` that returns the last element of an array, or `undefined` if the array is empty.',
          starterCode: `export function last<T>(arr: T[]): T | undefined {\n  // TODO\n  return undefined;\n}\n`,
          testCode: `import { last } from './solution';\n\ndescribe('last', () => {\n  it('returns the last element', () => {\n    expect(last([1, 2, 3])).toBe(3);\n  });\n  it('returns undefined for empty array', () => {\n    expect(last([])).toBeUndefined();\n  });\n  it('works with strings', () => {\n    expect(last(['a', 'b', 'c'])).toBe('c');\n  });\n  it('works with single element', () => {\n    expect(last([42])).toBe(42);\n  });\n});\n`,
          docs: null,
        },
      },

      // ── MEDIUM (10) ──────────────────────────────────────────────────────────

      {
        id: 'b0000002-0000-4000-8000-000000000001',
        title: 'Chunk Array',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 110,
        data: {
          description: 'Implement `chunk<T>(arr: T[], size: number): T[][]` that splits an array into consecutive chunks of the given size.',
          starterCode: `export function chunk<T>(arr: T[], size: number): T[][] {\n  // TODO: split arr into chunks of length size\n  return [];\n}\n`,
          testCode: `import { chunk } from './solution';\n\ndescribe('chunk', () => {\n  it('splits into equal chunks', () => {\n    expect(chunk([1,2,3,4], 2)).toEqual([[1,2],[3,4]]);\n  });\n  it('handles a remainder chunk', () => {\n    expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]);\n  });\n  it('size larger than array', () => {\n    expect(chunk([1,2,3], 10)).toEqual([[1,2,3]]);\n  });\n  it('empty array returns empty', () => {\n    expect(chunk([], 3)).toEqual([]);\n  });\n  it('size 1 returns individual elements', () => {\n    expect(chunk([1,2,3], 1)).toEqual([[1],[2],[3]]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000002',
        title: 'Group By',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 111,
        data: {
          description: 'Implement `groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]>` that groups array elements by the value returned from `key`.',
          starterCode: `export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {\n  // TODO\n  return {};\n}\n`,
          testCode: `import { groupBy } from './solution';\n\ndescribe('groupBy', () => {\n  it('groups numbers by parity', () => {\n    const result = groupBy([1,2,3,4,5], n => n % 2 === 0 ? 'even' : 'odd');\n    expect(result.odd).toEqual([1,3,5]);\n    expect(result.even).toEqual([2,4]);\n  });\n  it('groups strings by first letter', () => {\n    const result = groupBy(['apple','ant','banana','bear'], s => s[0]);\n    expect(result.a).toEqual(['apple','ant']);\n    expect(result.b).toEqual(['banana','bear']);\n  });\n  it('returns empty object for empty array', () => {\n    expect(groupBy([], (s: string) => s)).toEqual({});\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000003',
        title: 'Deep Flatten',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 112,
        data: {
          description: 'Implement `deepFlatten(arr: any[]): any[]` that recursively flattens a nested array to a single-level array.',
          starterCode: `export function deepFlatten(arr: any[]): any[] {\n  // TODO: recursively flatten all nested arrays\n  return [];\n}\n`,
          testCode: `import { deepFlatten } from './solution';\n\ndescribe('deepFlatten', () => {\n  it('flattens one level', () => {\n    expect(deepFlatten([1,[2,3],4])).toEqual([1,2,3,4]);\n  });\n  it('flattens deeply nested arrays', () => {\n    expect(deepFlatten([1,[2,[3,[4]]]])).toEqual([1,2,3,4]);\n  });\n  it('handles already flat array', () => {\n    expect(deepFlatten([1,2,3])).toEqual([1,2,3]);\n  });\n  it('handles empty array', () => {\n    expect(deepFlatten([])).toEqual([]);\n  });\n  it('handles mixed nesting', () => {\n    expect(deepFlatten([[1,2],[3,[4,[5]]]])).toEqual([1,2,3,4,5]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000004',
        title: 'Zip Arrays',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 113,
        data: {
          description: 'Implement `zip<A, B>(a: A[], b: B[]): [A, B][]` that pairs elements from two arrays by index. Stop at the shorter array.',
          starterCode: `export function zip<A, B>(a: A[], b: B[]): [A, B][] {\n  // TODO: zip two arrays together\n  return [];\n}\n`,
          testCode: `import { zip } from './solution';\n\ndescribe('zip', () => {\n  it('zips two equal-length arrays', () => {\n    expect(zip([1,2,3], ['a','b','c'])).toEqual([[1,'a'],[2,'b'],[3,'c']]);\n  });\n  it('stops at the shorter array', () => {\n    expect(zip([1,2,3,4], ['a','b'])).toEqual([[1,'a'],[2,'b']]);\n  });\n  it('returns empty for empty inputs', () => {\n    expect(zip([], [])).toEqual([]);\n  });\n  it('first array shorter', () => {\n    expect(zip([1], ['a','b','c'])).toEqual([[1,'a']]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000005',
        title: 'Memoize',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 114,
        data: {
          description: 'Implement `memoize<T extends (...args: any[]) => any>(fn: T): T` that caches results using the first argument as the cache key.',
          starterCode: `export function memoize<T extends (...args: any[]) => any>(fn: T): T {\n  const cache = new Map<any, any>();\n  // TODO: return a wrapper that caches results by first argument\n  return fn;\n}\n`,
          testCode: `import { memoize } from './solution';\n\ndescribe('memoize', () => {\n  it('returns the same result for the same argument', () => {\n    const double = memoize((n: number) => n * 2);\n    expect(double(5)).toBe(10);\n    expect(double(5)).toBe(10);\n  });\n  it('calls the original function only once per unique argument', () => {\n    let calls = 0;\n    const fn = memoize((n: number) => { calls++; return n * 2; });\n    fn(3);\n    fn(3);\n    fn(4);\n    expect(calls).toBe(2);\n  });\n  it('handles different arguments independently', () => {\n    const sq = memoize((n: number) => n * n);\n    expect(sq(3)).toBe(9);\n    expect(sq(4)).toBe(16);\n    expect(sq(3)).toBe(9);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000006',
        title: 'Pipe',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 115,
        data: {
          description: 'Implement `pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T` that takes unary functions and returns a new function applying them left-to-right.',
          starterCode: `export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {\n  // TODO: compose functions left to right\n  return (arg: T) => arg;\n}\n`,
          testCode: `import { pipe } from './solution';\n\ndescribe('pipe', () => {\n  const add1 = (n: number) => n + 1;\n  const double = (n: number) => n * 2;\n  const square = (n: number) => n * n;\n\n  it('applies a single function', () => {\n    expect(pipe(add1)(5)).toBe(6);\n  });\n  it('composes two functions left to right', () => {\n    expect(pipe(add1, double)(3)).toBe(8);\n  });\n  it('composes three functions', () => {\n    expect(pipe(add1, double, square)(2)).toBe(36);\n  });\n  it('identity with no functions', () => {\n    expect(pipe<number>()(42)).toBe(42);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000007',
        title: 'Partition',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 116,
        data: {
          description: 'Implement `partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]]` that splits an array into `[matching, non-matching]`.',
          starterCode: `export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {\n  // TODO: split arr into [matching, non-matching]\n  return [[], []];\n}\n`,
          testCode: `import { partition } from './solution';\n\ndescribe('partition', () => {\n  it('splits into even and odd', () => {\n    const [even, odd] = partition([1,2,3,4,5], n => n % 2 === 0);\n    expect(even).toEqual([2,4]);\n    expect(odd).toEqual([1,3,5]);\n  });\n  it('all match predicate', () => {\n    const [pass, fail] = partition([2,4,6], n => n % 2 === 0);\n    expect(pass).toEqual([2,4,6]);\n    expect(fail).toEqual([]);\n  });\n  it('none match predicate', () => {\n    const [pass, fail] = partition([1,3,5], n => n % 2 === 0);\n    expect(pass).toEqual([]);\n    expect(fail).toEqual([1,3,5]);\n  });\n  it('handles empty array', () => {\n    expect(partition([], () => true)).toEqual([[],[]]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000008',
        title: 'Count By',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 117,
        data: {
          description: 'Implement `countBy<T>(arr: T[], key: (item: T) => string): Record<string, number>` that counts how many elements map to each key.',
          starterCode: `export function countBy<T>(arr: T[], key: (item: T) => string): Record<string, number> {\n  // TODO: count elements grouped by key\n  return {};\n}\n`,
          testCode: `import { countBy } from './solution';\n\ndescribe('countBy', () => {\n  it('counts by parity', () => {\n    const result = countBy([1,2,3,4,5], n => n % 2 === 0 ? 'even' : 'odd');\n    expect(result.odd).toBe(3);\n    expect(result.even).toBe(2);\n  });\n  it('counts strings by first letter', () => {\n    const result = countBy(['apple','ant','banana'], s => s[0]);\n    expect(result.a).toBe(2);\n    expect(result.b).toBe(1);\n  });\n  it('returns empty object for empty array', () => {\n    expect(countBy([], (s: string) => s)).toEqual({});\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000009',
        title: 'Intersection',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 118,
        data: {
          description: 'Implement `intersection<T>(...arrays: T[][]): T[]` that returns elements present in **all** provided arrays.',
          starterCode: `export function intersection<T>(...arrays: T[][]): T[] {\n  // TODO: return elements that appear in all arrays\n  return [];\n}\n`,
          testCode: `import { intersection } from './solution';\n\ndescribe('intersection', () => {\n  it('finds common elements between two arrays', () => {\n    expect(intersection([1,2,3,4], [2,4,6])).toEqual([2,4]);\n  });\n  it('finds common elements among three arrays', () => {\n    expect(intersection([1,2,3], [2,3,4], [2,3,5])).toEqual([2,3]);\n  });\n  it('returns empty when no common elements', () => {\n    expect(intersection([1,2], [3,4])).toEqual([]);\n  });\n  it('handles a single array', () => {\n    expect(intersection([1,2,3])).toEqual([1,2,3]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000002-0000-4000-8000-000000000010',
        title: 'Deep Equal',
        category: 'typescript',
        difficulty: 'medium',
        sortOrder: 119,
        data: {
          description: 'Implement `deepEqual(a: unknown, b: unknown): boolean` that performs a deep structural equality check on primitives, arrays, and objects.',
          starterCode: `export function deepEqual(a: unknown, b: unknown): boolean {\n  // TODO: recursively check equality\n  return false;\n}\n`,
          testCode: `import { deepEqual } from './solution';\n\ndescribe('deepEqual', () => {\n  it('compares primitives', () => {\n    expect(deepEqual(1, 1)).toBe(true);\n    expect(deepEqual('a', 'b')).toBe(false);\n    expect(deepEqual(null, null)).toBe(true);\n  });\n  it('compares arrays', () => {\n    expect(deepEqual([1,2,3], [1,2,3])).toBe(true);\n    expect(deepEqual([1,2], [1,2,3])).toBe(false);\n  });\n  it('compares nested objects', () => {\n    expect(deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}})).toBe(true);\n    expect(deepEqual({a:1}, {a:2})).toBe(false);\n  });\n  it('compares arrays of objects', () => {\n    expect(deepEqual([{a:1}], [{a:1}])).toBe(true);\n    expect(deepEqual([{a:1}], [{a:2}])).toBe(false);\n  });\n});\n`,
          docs: null,
        },
      },

      // ── HARD (16) ───────────────────────────────────────────────────────────

      {
        id: 'b0000003-0000-4000-8000-000000000001',
        title: 'Curry',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 120,
        data: {
          description: 'Implement `curry(fn)` that transforms a multi-argument function into a chain of unary functions. `curry((a,b,c) => a+b+c)(1)(2)(3)` should return `6`.',
          starterCode: `export function curry(fn: (...args: any[]) => any): any {\n  // TODO: return a curried version of fn\n  return fn;\n}\n`,
          testCode: `import { curry } from './solution';\n\ndescribe('curry', () => {\n  it('curries a 2-argument function', () => {\n    const add = curry((a: number, b: number) => a + b);\n    expect(add(1)(2)).toBe(3);\n  });\n  it('curries a 3-argument function', () => {\n    const sum3 = curry((a: number, b: number, c: number) => a + b + c);\n    expect(sum3(1)(2)(3)).toBe(6);\n  });\n  it('calls immediately when all args provided at once', () => {\n    const add = curry((a: number, b: number) => a + b);\n    expect(add(3, 4)).toBe(7);\n  });\n  it('supports partial application', () => {\n    const multiply = curry((a: number, b: number) => a * b);\n    const double = multiply(2);\n    expect(double(5)).toBe(10);\n    expect(double(3)).toBe(6);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000002',
        title: 'Deep Merge',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 121,
        data: {
          description: 'Implement `deepMerge<T extends object>(target: T, source: Partial<T>): T` that recursively merges `source` into `target`. Arrays are replaced, not merged. Do not mutate `target`.',
          starterCode: `export function deepMerge<T extends object>(target: T, source: Partial<T>): T {\n  // TODO: deep merge - nested objects merged recursively, arrays replaced\n  return target;\n}\n`,
          testCode: `import { deepMerge } from './solution';\n\ndescribe('deepMerge', () => {\n  it('merges flat objects', () => {\n    expect(deepMerge({a:1,b:2} as any, {b:3,c:4})).toEqual({a:1,b:3,c:4});\n  });\n  it('deep merges nested objects', () => {\n    expect(deepMerge({a:{x:1,y:2}} as any, {a:{y:3,z:4}})).toEqual({a:{x:1,y:3,z:4}});\n  });\n  it('replaces arrays from source', () => {\n    expect(deepMerge({a:[1,2,3]} as any, {a:[4,5]})).toEqual({a:[4,5]});\n  });\n  it('does not mutate target', () => {\n    const t = {a:1};\n    const result = deepMerge(t as any, {b:2});\n    expect(t).toEqual({a:1});\n    expect(result).toEqual({a:1,b:2});\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000003',
        title: 'Build Tree',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 122,
        data: {
          description: 'Implement `buildTree` that converts a flat array of `{id, parentId}` items into a nested tree. Return root nodes (where `parentId === null`).',
          starterCode: `export type TreeNode<T> = T & { children: TreeNode<T>[] };\n\nexport function buildTree<T extends { id: string; parentId: string | null }>(items: T[]): TreeNode<T>[] {\n  // TODO: build a tree from a flat list\n  return [];\n}\n`,
          testCode: `import { buildTree } from './solution';\n\ndescribe('buildTree', () => {\n  const items = [\n    { id: '1', parentId: null, name: 'root' },\n    { id: '2', parentId: '1', name: 'child1' },\n    { id: '3', parentId: '1', name: 'child2' },\n    { id: '4', parentId: '2', name: 'grandchild' },\n  ];\n\n  it('returns root nodes only at top level', () => {\n    const tree = buildTree(items);\n    expect(tree).toHaveLength(1);\n    expect(tree[0].id).toBe('1');\n  });\n  it('attaches direct children', () => {\n    const tree = buildTree(items);\n    expect(tree[0].children).toHaveLength(2);\n    expect(tree[0].children.map(c => c.id)).toContain('2');\n    expect(tree[0].children.map(c => c.id)).toContain('3');\n  });\n  it('handles grandchildren', () => {\n    const tree = buildTree(items);\n    const child1 = tree[0].children.find(c => c.id === '2');\n    expect(child1?.children[0].id).toBe('4');\n  });\n  it('handles empty list', () => {\n    expect(buildTree([])).toEqual([]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000004',
        title: 'Flatten Object',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 123,
        data: {
          description: 'Implement `flattenObject(obj, prefix?)` that flattens a nested object using dot-notation keys. E.g. `{a:{b:1}}` → `{"a.b":1}`.',
          starterCode: `export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {\n  // TODO: flatten nested object into dot-notation keys\n  return {};\n}\n`,
          testCode: `import { flattenObject } from './solution';\n\ndescribe('flattenObject', () => {\n  it('flattens one level', () => {\n    expect(flattenObject({a:{b:1,c:2}})).toEqual({'a.b':1,'a.c':2});\n  });\n  it('flattens deeply nested', () => {\n    expect(flattenObject({a:{b:{c:42}}})).toEqual({'a.b.c':42});\n  });\n  it('keeps primitives at root', () => {\n    expect(flattenObject({a:1,b:2})).toEqual({a:1,b:2});\n  });\n  it('handles mixed depth', () => {\n    const result = flattenObject({a:1,b:{c:2,d:{e:3}}});\n    expect(result).toEqual({a:1,'b.c':2,'b.d.e':3});\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000005',
        title: 'Once',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 124,
        data: {
          description: 'Implement `once<T extends (...args: any[]) => any>(fn: T): T` that ensures `fn` is called at most once. Subsequent calls return the result of the first invocation.',
          starterCode: `export function once<T extends (...args: any[]) => any>(fn: T): T {\n  // TODO: return a wrapper that calls fn at most once\n  return fn;\n}\n`,
          testCode: `import { once } from './solution';\n\ndescribe('once', () => {\n  it('calls the function on first invocation', () => {\n    const fn = once((n: number) => n * 2);\n    expect(fn(5)).toBe(10);\n  });\n  it('returns first result on all subsequent calls', () => {\n    const fn = once((n: number) => n * 2);\n    expect(fn(5)).toBe(10);\n    expect(fn(10)).toBe(10);\n    expect(fn(999)).toBe(10);\n  });\n  it('calls original function exactly once', () => {\n    let count = 0;\n    const fn = once(() => { count++; return count; });\n    fn(); fn(); fn();\n    expect(count).toBe(1);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000006',
        title: 'Deep Clone',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 125,
        data: {
          description: 'Implement `deepClone<T>(value: T): T` that recursively clones an object or array. Changes to the clone must not affect the original.',
          starterCode: `export function deepClone<T>(value: T): T {\n  // TODO: deep clone the value using recursion\n  return value;\n}\n`,
          testCode: `import { deepClone } from './solution';\n\ndescribe('deepClone', () => {\n  it('clones primitives', () => {\n    expect(deepClone(42)).toBe(42);\n    expect(deepClone('hello')).toBe('hello');\n  });\n  it('clones arrays without sharing references', () => {\n    const arr = [1, [2, 3]];\n    const clone = deepClone(arr) as any[][];\n    (clone[1] as number[])[0] = 99;\n    expect((arr[1] as number[])[0]).toBe(2);\n  });\n  it('clones objects without sharing references', () => {\n    const obj = { a: 1, b: { c: 2 } };\n    const clone = deepClone(obj);\n    clone.b.c = 99;\n    expect(obj.b.c).toBe(2);\n  });\n  it('clones arrays of objects independently', () => {\n    const val = [{ x: 1 }, { x: 2 }];\n    const clone = deepClone(val);\n    expect(clone).toEqual(val);\n    expect(clone[0]).not.toBe(val[0]);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000007',
        title: 'LRU Cache',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 126,
        data: {
          description: 'Implement a `LRUCache<K,V>` class with `get(key): V | undefined` and `set(key, value): void`. The least recently used item is evicted when capacity is exceeded.',
          starterCode: `export class LRUCache<K, V> {\n  // TODO: implement LRU cache\n  constructor(private readonly capacity: number) {}\n\n  get(key: K): V | undefined {\n    return undefined;\n  }\n\n  set(key: K, value: V): void {}\n}\n`,
          testCode: `import { LRUCache } from './solution';\n\ndescribe('LRUCache', () => {\n  it('stores and retrieves values', () => {\n    const cache = new LRUCache<string, number>(3);\n    cache.set('a', 1);\n    expect(cache.get('a')).toBe(1);\n  });\n  it('returns undefined for missing keys', () => {\n    const cache = new LRUCache<string, number>(3);\n    expect(cache.get('x')).toBeUndefined();\n  });\n  it('evicts the least recently used on overflow', () => {\n    const cache = new LRUCache<string, number>(2);\n    cache.set('a', 1);\n    cache.set('b', 2);\n    cache.set('c', 3);\n    expect(cache.get('a')).toBeUndefined();\n    expect(cache.get('b')).toBe(2);\n    expect(cache.get('c')).toBe(3);\n  });\n  it('updates recency on get', () => {\n    const cache = new LRUCache<string, number>(2);\n    cache.set('a', 1);\n    cache.set('b', 2);\n    cache.get('a');\n    cache.set('c', 3);\n    expect(cache.get('a')).toBe(1);\n    expect(cache.get('b')).toBeUndefined();\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000008',
        title: 'Parse Query String',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 127,
        data: {
          description: 'Implement `parseQueryString(qs: string): Record<string, string>` that parses a query string (with or without leading `?`) into an object. URL-decode values.',
          starterCode: `export function parseQueryString(qs: string): Record<string, string> {\n  // TODO: parse 'foo=bar&baz=qux' into {foo:'bar', baz:'qux'}\n  return {};\n}\n`,
          testCode: `import { parseQueryString } from './solution';\n\ndescribe('parseQueryString', () => {\n  it('parses a simple query string', () => {\n    expect(parseQueryString('foo=bar&baz=qux')).toEqual({foo:'bar', baz:'qux'});\n  });\n  it('handles leading question mark', () => {\n    expect(parseQueryString('?foo=bar')).toEqual({foo:'bar'});\n  });\n  it('returns empty object for empty string', () => {\n    expect(parseQueryString('')).toEqual({});\n  });\n  it('URL-decodes values', () => {\n    expect(parseQueryString('name=John%20Doe').name).toBe('John Doe');\n  });\n  it('handles single param', () => {\n    expect(parseQueryString('id=42')).toEqual({id:'42'});\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000009',
        title: 'Binary Search',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 128,
        data: {
          description: 'Implement `binarySearch<T>(arr: T[], target: T, compare: (a: T, b: T) => number): number` using **recursion**. Return the index of `target` in the sorted array, or `-1` if not found.',
          starterCode: `export function binarySearch<T>(\n  arr: T[],\n  target: T,\n  compare: (a: T, b: T) => number,\n): number {\n  // TODO: recursive binary search\n  return -1;\n}\n`,
          testCode: `import { binarySearch } from './solution';\n\nconst numCmp = (a: number, b: number) => a - b;\n\ndescribe('binarySearch', () => {\n  it('finds element in the middle', () => {\n    expect(binarySearch([1,3,5,7,9], 5, numCmp)).toBe(2);\n  });\n  it('finds the first element', () => {\n    expect(binarySearch([1,3,5,7,9], 1, numCmp)).toBe(0);\n  });\n  it('finds the last element', () => {\n    expect(binarySearch([1,3,5,7,9], 9, numCmp)).toBe(4);\n  });\n  it('returns -1 when not found', () => {\n    expect(binarySearch([1,3,5,7,9], 4, numCmp)).toBe(-1);\n  });\n  it('handles empty array', () => {\n    expect(binarySearch([], 1, numCmp)).toBe(-1);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000010',
        title: 'Quick Sort',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 129,
        data: {
          description: 'Implement `quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[]` using the quicksort algorithm. Return a **new** sorted array — do not mutate the input.',
          starterCode: `export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {\n  // TODO: implement quicksort recursively\n  return [...arr];\n}\n`,
          testCode: `import { quickSort } from './solution';\n\nconst asc = (a: number, b: number) => a - b;\n\ndescribe('quickSort', () => {\n  it('sorts numbers', () => {\n    expect(quickSort([3,1,4,1,5,9,2,6], asc)).toEqual([1,1,2,3,4,5,6,9]);\n  });\n  it('handles empty array', () => {\n    expect(quickSort([], asc)).toEqual([]);\n  });\n  it('handles single element', () => {\n    expect(quickSort([42], asc)).toEqual([42]);\n  });\n  it('does not mutate input', () => {\n    const input = [3,1,2];\n    quickSort(input, asc);\n    expect(input).toEqual([3,1,2]);\n  });\n  it('sorts strings', () => {\n    const strCmp = (a: string, b: string) => a.localeCompare(b);\n    expect(quickSort(['banana','apple','cherry'], strCmp)).toEqual(['apple','banana','cherry']);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000011',
        title: 'Permutations',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 130,
        data: {
          description: 'Implement `permutations<T>(arr: T[]): T[][]` that returns all permutations of the array elements. `permutations([])` should return `[[]]`.',
          starterCode: `export function permutations<T>(arr: T[]): T[][] {\n  // TODO: generate all permutations recursively\n  return [];\n}\n`,
          testCode: `import { permutations } from './solution';\n\ndescribe('permutations', () => {\n  it('returns [[]] for empty input', () => {\n    expect(permutations([])).toEqual([[]]);\n  });\n  it('returns [[1]] for single element', () => {\n    expect(permutations([1])).toEqual([[1]]);\n  });\n  it('returns 2 permutations for 2 elements', () => {\n    const result = permutations([1,2]);\n    expect(result).toHaveLength(2);\n    expect(result).toContainEqual([1,2]);\n    expect(result).toContainEqual([2,1]);\n  });\n  it('returns 6 permutations for 3 elements', () => {\n    expect(permutations([1,2,3])).toHaveLength(6);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000012',
        title: 'Power Set',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 131,
        data: {
          description: 'Implement `powerSet<T>(arr: T[]): T[][]` that returns all subsets of the array (including the empty set `[]`).',
          starterCode: `export function powerSet<T>(arr: T[]): T[][] {\n  // TODO: generate all subsets recursively\n  return [[]];\n}\n`,
          testCode: `import { powerSet } from './solution';\n\ndescribe('powerSet', () => {\n  it('returns [[]] for empty input', () => {\n    expect(powerSet([])).toEqual([[]]);\n  });\n  it('returns 2 subsets for 1 element', () => {\n    const result = powerSet([1]);\n    expect(result).toHaveLength(2);\n    expect(result).toContainEqual([]);\n    expect(result).toContainEqual([1]);\n  });\n  it('returns 4 subsets for 2 elements', () => {\n    expect(powerSet([1,2])).toHaveLength(4);\n  });\n  it('returns 2^n subsets', () => {\n    expect(powerSet([1,2,3])).toHaveLength(8);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000013',
        title: 'Longest Common Subsequence',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 132,
        data: {
          description: 'Implement `lcs(a: string, b: string): string` that returns the Longest Common Subsequence of two strings using dynamic programming.',
          starterCode: `export function lcs(a: string, b: string): string {\n  // TODO: find the longest common subsequence using dynamic programming\n  return '';\n}\n`,
          testCode: `import { lcs } from './solution';\n\ndescribe('lcs', () => {\n  it('finds lcs: ace from abcde and ace', () => {\n    expect(lcs('abcde', 'ace')).toBe('ace');\n  });\n  it('finds lcs: bd from abcd and bd', () => {\n    expect(lcs('abcd', 'bd')).toBe('bd');\n  });\n  it('returns empty when no common chars', () => {\n    expect(lcs('abc', 'xyz')).toBe('');\n  });\n  it('handles empty strings', () => {\n    expect(lcs('', 'hello')).toBe('');\n    expect(lcs('hello', '')).toBe('');\n  });\n  it('returns the string itself when equal', () => {\n    expect(lcs('cat', 'cat')).toBe('cat');\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000014',
        title: 'Levenshtein Distance',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 133,
        data: {
          description: 'Implement `levenshtein(a: string, b: string): number` that returns the minimum edit distance between two strings (insertions, deletions, substitutions each cost 1).',
          starterCode: `export function levenshtein(a: string, b: string): number {\n  // TODO: compute Levenshtein distance using dynamic programming\n  return 0;\n}\n`,
          testCode: `import { levenshtein } from './solution';\n\ndescribe('levenshtein', () => {\n  it('returns 0 for identical strings', () => {\n    expect(levenshtein('kitten', 'kitten')).toBe(0);\n  });\n  it('returns string length when other is empty', () => {\n    expect(levenshtein('hello', '')).toBe(5);\n    expect(levenshtein('', 'world')).toBe(5);\n  });\n  it('returns 3 for kitten to sitting', () => {\n    expect(levenshtein('kitten', 'sitting')).toBe(3);\n  });\n  it('returns 1 for one substitution', () => {\n    expect(levenshtein('cat', 'bat')).toBe(1);\n  });\n  it('returns 1 for one insertion', () => {\n    expect(levenshtein('car', 'cart')).toBe(1);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000015',
        title: 'Trie',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 134,
        data: {
          description: 'Implement a `Trie` class with `insert(word: string): void`, `search(word: string): boolean`, and `startsWith(prefix: string): boolean`.',
          starterCode: `export class Trie {\n  // TODO: implement a Trie data structure\n  constructor() {}\n\n  insert(word: string): void {}\n\n  search(word: string): boolean {\n    return false;\n  }\n\n  startsWith(prefix: string): boolean {\n    return false;\n  }\n}\n`,
          testCode: `import { Trie } from './solution';\n\ndescribe('Trie', () => {\n  it('inserts and searches words', () => {\n    const trie = new Trie();\n    trie.insert('apple');\n    expect(trie.search('apple')).toBe(true);\n  });\n  it('returns false for non-inserted words', () => {\n    const trie = new Trie();\n    trie.insert('apple');\n    expect(trie.search('app')).toBe(false);\n  });\n  it('startsWith returns true for valid prefix', () => {\n    const trie = new Trie();\n    trie.insert('apple');\n    expect(trie.startsWith('app')).toBe(true);\n  });\n  it('startsWith returns false for non-existing prefix', () => {\n    const trie = new Trie();\n    trie.insert('apple');\n    expect(trie.startsWith('banana')).toBe(false);\n  });\n  it('handles multiple words', () => {\n    const trie = new Trie();\n    trie.insert('apple');\n    trie.insert('app');\n    expect(trie.search('app')).toBe(true);\n    expect(trie.search('apple')).toBe(true);\n    expect(trie.startsWith('ap')).toBe(true);\n  });\n});\n`,
          docs: null,
        },
      },

      {
        id: 'b0000003-0000-4000-8000-000000000016',
        title: 'Merge Sort',
        category: 'typescript',
        difficulty: 'hard',
        sortOrder: 135,
        data: {
          description: 'Implement `mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[]` using merge sort. Return a **new** sorted array — do not mutate the input.',
          starterCode: `export function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {\n  // TODO: implement merge sort recursively\n  return [...arr];\n}\n`,
          testCode: `import { mergeSort } from './solution';\n\nconst asc = (a: number, b: number) => a - b;\n\ndescribe('mergeSort', () => {\n  it('sorts numbers', () => {\n    expect(mergeSort([5,2,8,1,9,3], asc)).toEqual([1,2,3,5,8,9]);\n  });\n  it('handles empty array', () => {\n    expect(mergeSort([], asc)).toEqual([]);\n  });\n  it('handles single element', () => {\n    expect(mergeSort([1], asc)).toEqual([1]);\n  });\n  it('does not mutate input', () => {\n    const input = [3,1,2];\n    mergeSort(input, asc);\n    expect(input).toEqual([3,1,2]);\n  });\n  it('handles already sorted array', () => {\n    expect(mergeSort([1,2,3,4,5], asc)).toEqual([1,2,3,4,5]);\n  });\n});\n`,
          docs: null,
        },
      },
    ];

    for (const c of challenges) {
      await queryRunner.query(
        `INSERT INTO "tdt_challenge" ("id", "title", "category", "difficulty", "sortOrder", "data") VALUES ($1, $2, $3, $4, $5, $6::jsonb) ON CONFLICT ("id") DO NOTHING`,
        [c.id, c.title, c.category, c.difficulty, c.sortOrder, JSON.stringify(c.data)],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ids = [
      'b0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000002',
      'b0000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000004',
      'b0000002-0000-4000-8000-000000000001', 'b0000002-0000-4000-8000-000000000002',
      'b0000002-0000-4000-8000-000000000003', 'b0000002-0000-4000-8000-000000000004',
      'b0000002-0000-4000-8000-000000000005', 'b0000002-0000-4000-8000-000000000006',
      'b0000002-0000-4000-8000-000000000007', 'b0000002-0000-4000-8000-000000000008',
      'b0000002-0000-4000-8000-000000000009', 'b0000002-0000-4000-8000-000000000010',
      'b0000003-0000-4000-8000-000000000001', 'b0000003-0000-4000-8000-000000000002',
      'b0000003-0000-4000-8000-000000000003', 'b0000003-0000-4000-8000-000000000004',
      'b0000003-0000-4000-8000-000000000005', 'b0000003-0000-4000-8000-000000000006',
      'b0000003-0000-4000-8000-000000000007', 'b0000003-0000-4000-8000-000000000008',
      'b0000003-0000-4000-8000-000000000009', 'b0000003-0000-4000-8000-000000000010',
      'b0000003-0000-4000-8000-000000000011', 'b0000003-0000-4000-8000-000000000012',
      'b0000003-0000-4000-8000-000000000013', 'b0000003-0000-4000-8000-000000000014',
      'b0000003-0000-4000-8000-000000000015', 'b0000003-0000-4000-8000-000000000016',
    ];
    for (const id of ids) {
      await queryRunner.query(`DELETE FROM "tdt_challenge" WHERE "id" = $1`, [id]);
    }
  }
}
