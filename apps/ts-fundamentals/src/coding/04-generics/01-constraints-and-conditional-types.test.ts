import {
  getProperty,
  merge,
  IsArray,
  UnpackArray,
  Stack,
  DeepReadonly,
} from './01-constraints-and-conditional-types';

describe('01 — Generic Constraints & Conditional Types', () => {
  describe('getProperty', () => {
    it('should return the correct property value', () => {
      const obj = { name: 'Alice', age: 30, active: true };
      expect(getProperty(obj, 'name')).toBe('Alice');
      expect(getProperty(obj, 'age')).toBe(30);
      expect(getProperty(obj, 'active')).toBe(true);
    });
  });

  describe('merge', () => {
    it('should combine properties from both objects', () => {
      const a = { id: 1, name: 'Alice' };
      const b = { email: 'alice@example.com', active: true };
      const result = merge(a, b);
      expect(result).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com', active: true });
    });

    it('b should override a for duplicate keys', () => {
      const a = { x: 1, y: 2 };
      const b = { y: 99, z: 3 };
      const result = merge(a, b);
      expect(result.y).toBe(99);
      expect(result.x).toBe(1);
      expect(result.z).toBe(3);
    });
  });

  describe('IsArray conditional type', () => {
    it('IsArray of number[] should be true', () => {
      type T = IsArray<number[]>;
      const check: T = true as T;
      expect(check).toBe(true);
    });

    it('IsArray of string should be false', () => {
      type T = IsArray<string>;
      const check: T = false as T;
      expect(check).toBe(false);
    });
  });

  describe('UnpackArray', () => {
    it('should unpack array element type at the type level', () => {
      type T = UnpackArray<number[]>;
      const val: T = 42 as T;
      expect(typeof val).toBe('number');
    });

    it('should return T for non-arrays', () => {
      type T = UnpackArray<string>;
      const val: T = 'hello' as T;
      expect(typeof val).toBe('string');
    });
  });

  describe('Stack<T>', () => {
    it('should push and pop items', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
    });

    it('peek should not remove the item', () => {
      const stack = new Stack<string>();
      stack.push('hello');
      expect(stack.peek()).toBe('hello');
      expect(stack.size).toBe(1);
    });

    it('isEmpty should return true for empty stack', () => {
      const stack = new Stack<number>();
      expect(stack.isEmpty()).toBe(true);
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
    });

    it('pop on empty stack should return undefined', () => {
      const stack = new Stack<number>();
      expect(stack.pop()).toBeUndefined();
    });

    it('size should reflect current count', () => {
      const stack = new Stack<boolean>();
      expect(stack.size).toBe(0);
      stack.push(true);
      stack.push(false);
      expect(stack.size).toBe(2);
      stack.pop();
      expect(stack.size).toBe(1);
    });
  });

  describe('DeepReadonly', () => {
    it('should make nested properties readonly at type level', () => {
      type Config = { db: { host: string; port: number }; debug: boolean };
      type ReadonlyConfig = DeepReadonly<Config>;
      const config: ReadonlyConfig = {
        db: { host: 'localhost', port: 5432 },
        debug: false,
      };
      expect(config.db.host).toBe('localhost');
    });
  });
});
