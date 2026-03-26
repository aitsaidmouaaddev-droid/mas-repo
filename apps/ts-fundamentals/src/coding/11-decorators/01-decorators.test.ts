import { SealedClass, LoggedClass, MemoizedClass } from './01-decorators';

describe('01 — Decorators', () => {
  describe('@sealed class decorator', () => {
    it('should prevent adding new properties to instance', () => {
      const instance = new SealedClass();
      expect(() => {
        // @ts-expect-error -- intentionally testing sealed
        instance.newProp = 'oops';
      }).toThrow();
    });

    it('should still allow reading existing properties', () => {
      const instance = new SealedClass();
      expect(instance.value).toBe(42);
      expect(instance.greet()).toBe('hello 42');
    });
  });

  describe('@log method decorator', () => {
    it('should preserve original return value', () => {
      const obj = new LoggedClass();
      expect(obj.add(2, 3)).toBe(5);
    });

    it('should record call info in __logCalls', () => {
      const obj = new LoggedClass();
      obj.add(4, 6);
      const calls = (obj as any).__logCalls as Array<{
        method: string;
        args: unknown[];
        returnValue: unknown;
      }>;
      expect(calls).toBeDefined();
      expect(calls[0].method).toBe('add');
      expect(calls[0].args).toEqual([4, 6]);
      expect(calls[0].returnValue).toBe(10);
    });
  });

  describe('@memoize() decorator factory', () => {
    it('should return correct result', () => {
      const obj = new MemoizedClass();
      expect(obj.expensive(5)).toBe(25);
    });

    it('should not call the method again for same args', () => {
      const obj = new MemoizedClass();
      obj.expensive(4);
      obj.expensive(4);
      obj.expensive(4);
      expect(obj.callCount).toBe(1);
    });

    it('should call the method again for different args', () => {
      const obj = new MemoizedClass();
      obj.expensive(3);
      obj.expensive(4);
      obj.expensive(5);
      expect(obj.callCount).toBe(3);
    });
  });
});
