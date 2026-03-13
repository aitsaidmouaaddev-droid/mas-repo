import {
  isString,
  isNumber,
  isBoolean,
  Dog,
  Cat,
  isDog,
  speak,
  isNonNullable,
  filterNonNullable,
  assertDefined,
  isShape,
  isCircle,
} from './01-type-predicates';

describe('01 — Type Predicates', () => {
  describe('primitive predicates', () => {
    it('isString should identify strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
    });
    it('isNumber should identify numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber('42')).toBe(false);
      expect(isNumber(NaN)).toBe(true); // NaN IS a number in JS!
    });
    it('isBoolean should identify booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
    });
  });

  describe('isDog and speak', () => {
    const dog: Dog = { name: 'Rex', bark: () => 'Woof!' };
    const cat: Cat = { name: 'Whiskers', meow: () => 'Meow!' };

    it('isDog should return true for dogs', () => {
      expect(isDog(dog)).toBe(true);
      expect(isDog(cat)).toBe(false);
    });

    it('speak should call bark for dogs', () => {
      expect(speak(dog)).toBe('Woof!');
    });

    it('speak should call meow for cats', () => {
      expect(speak(cat)).toBe('Meow!');
    });
  });

  describe('filterNonNullable', () => {
    it('should filter out null and undefined', () => {
      const arr = [1, null, 2, undefined, 3];
      expect(filterNonNullable(arr)).toEqual([1, 2, 3]);
    });

    it('isNonNullable should return false for null/undefined', () => {
      expect(isNonNullable(null)).toBe(false);
      expect(isNonNullable(undefined)).toBe(false);
      expect(isNonNullable(0)).toBe(true);
      expect(isNonNullable('')).toBe(true);
    });
  });

  describe('assertDefined', () => {
    it('should not throw for defined values', () => {
      expect(() => assertDefined('hello')).not.toThrow();
      expect(() => assertDefined(0)).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => assertDefined(null)).toThrow();
    });

    it('should throw for undefined', () => {
      expect(() => assertDefined(undefined)).toThrow();
    });

    it('should include message in error', () => {
      expect(() => assertDefined(null, 'Value is null!')).toThrow('Value is null!');
    });
  });

  describe('shape predicates', () => {
    it('isShape should detect objects with kind', () => {
      expect(isShape({ kind: 'circle' })).toBe(true);
      expect(isShape({ kind: 'square' })).toBe(true);
      expect(isShape({ x: 1 })).toBe(false);
      expect(isShape(null)).toBe(false);
    });

    it('isCircle should detect circles with radius', () => {
      expect(isCircle({ kind: 'circle', radius: 5 })).toBe(true);
      expect(isCircle({ kind: 'circle' })).toBe(false); // missing radius
      expect(isCircle({ kind: 'square', side: 5 })).toBe(false);
    });
  });
});
