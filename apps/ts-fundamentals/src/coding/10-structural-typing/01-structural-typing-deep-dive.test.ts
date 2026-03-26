import {
  structuralCheck,
  demonstrateCovariance,
  deepEqual,
  clone,
} from './01-structural-typing-deep-dive';

describe('01 — Structural Typing Deep Dive', () => {
  describe('structuralCheck', () => {
    it('should return true when all expected keys have correct types', () => {
      const value = { name: 'Alice', email: 'alice@example.com' };
      const schema = { name: 'string', email: 'string' };
      expect(structuralCheck(value, schema)).toBe(true);
    });

    it('should return false when a key is missing', () => {
      const value = { name: 'Alice' };
      const schema = { name: 'string', age: 'number' };
      expect(structuralCheck(value, schema)).toBe(false);
    });

    it('should return false when type does not match', () => {
      const value = { age: 'thirty' }; // string, not number
      const schema = { age: 'number' };
      expect(structuralCheck(value, schema)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(structuralCheck(null, { name: 'string' })).toBe(false);
      expect(structuralCheck('hello', { name: 'string' })).toBe(false);
    });

    it('should return true for empty schema', () => {
      expect(structuralCheck({}, {})).toBe(true);
      expect(structuralCheck({ extra: 'ignored' }, {})).toBe(true);
    });
  });

  describe('demonstrateCovariance', () => {
    it('should return both flags as true', () => {
      const result = demonstrateCovariance();
      expect(result.dogWorksAsAnimal).toBe(true);
      expect(result.animalHandlerWorksForDog).toBe(true);
    });
  });

  describe('deepEqual', () => {
    it('should return true for identical primitives', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('hello', 'hello')).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('a', 'b')).toBe(false);
    });

    it('should return true for deeply equal objects', () => {
      expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    });

    it('should return false for different objects', () => {
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should compare arrays', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should compare nested arrays', () => {
      expect(
        deepEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ],
        ),
      ).toBe(true);
    });
  });

  describe('clone', () => {
    it('should create a deep copy of a plain object', () => {
      const original = { a: 1, b: { c: 2 } };
      const copy = clone(original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
      expect(copy.b).not.toBe(original.b);
    });

    it('should clone arrays', () => {
      const original = [1, [2, 3], { x: 4 }];
      const copy = clone(original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });

    it('mutations to clone should not affect original', () => {
      const original = { name: 'Alice', scores: [90, 95] };
      const copy = clone(original);
      copy.scores.push(100);
      expect(original.scores).toHaveLength(2);
    });
  });
});
