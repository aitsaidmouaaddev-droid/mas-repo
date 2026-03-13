import { identity, first, groupBy, pick, memoize } from './02-generic-functions';

describe('02 — Generic Functions', () => {
  describe('identity', () => {
    it('should return the same string', () => {
      expect(identity('hello')).toBe('hello');
    });
    it('should return the same number', () => {
      expect(identity(42)).toBe(42);
    });
    it('should return the same object reference', () => {
      const obj = { x: 1 };
      expect(identity(obj)).toBe(obj);
    });
  });

  describe('first', () => {
    it('should return first element', () => {
      expect(first([1, 2, 3])).toBe(1);
      expect(first(['a', 'b'])).toBe('a');
    });
    it('should return undefined for empty array', () => {
      expect(first([])).toBeUndefined();
    });
  });

  describe('groupBy', () => {
    it('should group by a key', () => {
      const data = [
        { dept: 'eng', name: 'Alice' },
        { dept: 'eng', name: 'Bob' },
        { dept: 'hr', name: 'Carol' },
      ];
      const grouped = groupBy(data, 'dept');
      expect(grouped.get('eng')).toHaveLength(2);
      expect(grouped.get('hr')).toHaveLength(1);
    });

    it('should handle single items per group', () => {
      const data = [
        { id: 1, val: 'a' },
        { id: 2, val: 'b' },
      ];
      const grouped = groupBy(data, 'id');
      expect(grouped.get(1)).toEqual([{ id: 1, val: 'a' }]);
    });
  });

  describe('pick', () => {
    it('should return only specified keys', () => {
      const user = { id: 1, name: 'Alice', email: 'a@a.com', age: 30 };
      const picked = pick(user, ['id', 'name']);
      expect(picked).toEqual({ id: 1, name: 'Alice' });
      expect('email' in picked).toBe(false);
    });

    it('should work with a single key', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['b'])).toEqual({ b: 2 });
    });
  });

  describe('memoize', () => {
    it('should cache results', () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoize(fn);
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1); // called only once
    });

    it('should recalculate for different args', () => {
      const fn = jest.fn((x: number) => x * 3);
      const memoized = memoize(fn);
      memoized(2);
      memoized(3);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
