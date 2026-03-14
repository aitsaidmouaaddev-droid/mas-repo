import { compose, pipe, curry, once, partialFirst } from './03-higher-order-functions';

describe('03 — Higher-Order Functions', () => {
  describe('compose', () => {
    it('should compose two functions right-to-left', () => {
      const double = (x: number) => x * 2;
      const addOne = (x: number) => x + 1;
      const doubleAfterAddOne = compose(double, addOne);
      expect(doubleAfterAddOne(3)).toBe(8); // (3+1)*2
    });

    it('should compose string functions', () => {
      const toUpper = (s: string) => s.toUpperCase();
      const addExcl = (s: string) => s + '!';
      const fn = compose(toUpper, addExcl);
      expect(fn('hello')).toBe('HELLO!');
    });
  });

  describe('pipe', () => {
    it('should pass value through functions left-to-right', () => {
      const result = pipe(
        5,
        (x: number) => x * 2,
        (x: number) => x + 1,
      );
      expect(result).toBe(11);
    });

    it('should work with no functions (return value)', () => {
      expect(pipe(42)).toBe(42);
    });

    it('should chain string transformations', () => {
      const result = pipe(
        '  hello world  ',
        (s: string) => s.trim(),
        (s: string) => s.toUpperCase(),
      );
      expect(result).toBe('HELLO WORLD');
    });
  });

  describe('curry', () => {
    it('should return a curried function', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);
      expect(curriedAdd(3)(4)).toBe(7);
    });

    it('should work with string concatenation', () => {
      const concat = (a: string, b: string) => a + b;
      const greet = curry(concat)('Hello, ');
      expect(greet('World')).toBe('Hello, World');
    });
  });

  describe('once', () => {
    it('should call the function only the first time', () => {
      const fn = jest.fn((x: number) => x * 2);
      const onceFn = once(fn);
      expect(onceFn(5)).toBe(10);
      expect(onceFn(5)).toBe(10); // returns cached result
      expect(onceFn(99)).toBe(10); // still returns first result
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('partialFirst', () => {
    it('should bind the first argument', () => {
      const add = (a: number, b: number) => a + b;
      const add5 = partialFirst(add, 5);
      expect(add5(3)).toBe(8);
      expect(add5(10)).toBe(15);
    });

    it('should work with more arguments', () => {
      const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
      const hello = partialFirst(greet, 'Hello');
      expect(hello('Alice')).toBe('Hello, Alice!');
    });
  });
});
