import {
  parseJSON,
  getStringLength,
  assertNever,
  area,
  Shape,
  fail,
} from './03-unknown-never-void';

describe('03 — unknown, never, void', () => {
  describe('parseJSON', () => {
    it('should return unknown parsed value for valid JSON', () => {
      const result = parseJSON('{"name":"Alice"}');
      expect(result).toEqual({ name: 'Alice' });
    });

    it('should return null for invalid JSON', () => {
      expect(parseJSON('not json')).toBeNull();
    });

    it('should parse arrays', () => {
      expect(parseJSON('[1,2,3]')).toEqual([1, 2, 3]);
    });

    it('should parse primitives', () => {
      expect(parseJSON('"hello"')).toBe('hello');
      expect(parseJSON('42')).toBe(42);
    });
  });

  describe('getStringLength', () => {
    it('should return length for strings', () => {
      expect(getStringLength('hello')).toBe(5);
      expect(getStringLength('')).toBe(0);
    });

    it('should return -1 for non-strings', () => {
      expect(getStringLength(42)).toBe(-1);
      expect(getStringLength(null)).toBe(-1);
      expect(getStringLength({ length: 10 })).toBe(-1);
    });
  });

  describe('assertNever', () => {
    it('should throw when called at runtime', () => {
      expect(() => assertNever(null as never)).toThrow();
    });
  });

  describe('area', () => {
    it('should calculate circle area', () => {
      const circle: Shape = { kind: 'circle', radius: 5 };
      expect(area(circle)).toBeCloseTo(Math.PI * 25);
    });

    it('should calculate square area', () => {
      const square: Shape = { kind: 'square', side: 4 };
      expect(area(square)).toBe(16);
    });

    it('should calculate triangle area', () => {
      const triangle: Shape = { kind: 'triangle', base: 6, height: 4 };
      expect(area(triangle)).toBe(12);
    });
  });

  describe('fail', () => {
    it('should always throw an error', () => {
      expect(() => fail('Something went wrong')).toThrow('Something went wrong');
    });

    it('should throw with the provided message', () => {
      expect(() => fail('Custom error')).toThrow('Custom error');
    });
  });
});
