import {
  delay,
  Result,
  tryCatch,
  TimeoutError,
  withTimeout,
  sequential,
  retry,
} from './01-promise-patterns';

describe('01 — Promise Patterns', () => {
  describe('delay', () => {
    it('should resolve after the specified time', async () => {
      const start = Date.now();
      await delay(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });

    it('should return a Promise', () => {
      expect(delay(0)).toBeInstanceOf(Promise);
    });
  });

  describe('tryCatch', () => {
    it('should return ok:true for successful promise', async () => {
      const result = await tryCatch(() => Promise.resolve(42));
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(42);
    });

    it('should return ok:false for rejected promise', async () => {
      const result = await tryCatch(() => Promise.reject(new Error('fail')));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toBe('fail');
    });

    it('should return ok:false for thrown error', async () => {
      const result = await tryCatch(async () => {
        throw new Error('boom');
      });
      expect(result.ok).toBe(false);
    });
  });

  describe('withTimeout', () => {
    it('should resolve if promise resolves before timeout', async () => {
      const result = await withTimeout(Promise.resolve('hello'), 1000);
      expect(result).toBe('hello');
    });

    it('should reject with TimeoutError if too slow', async () => {
      const slow = new Promise<never>((resolve) => setTimeout(resolve, 500));
      await expect(withTimeout(slow, 50)).rejects.toBeInstanceOf(TimeoutError);
    });
  });

  describe('sequential', () => {
    it('should run tasks in order and return all results', async () => {
      const order: number[] = [];
      const tasks = [1, 2, 3].map((n) => async () => {
        order.push(n);
        return n * 10;
      });
      const results = await sequential(tasks);
      expect(results).toEqual([10, 20, 30]);
      expect(order).toEqual([1, 2, 3]);
    });

    it('should handle empty task array', async () => {
      expect(await sequential([])).toEqual([]);
    });
  });

  describe('retry', () => {
    it('should resolve on first try if successful', async () => {
      const fn = jest.fn().mockResolvedValue('ok');
      const result = await retry(fn, 3);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed eventually', async () => {
      let calls = 0;
      const fn = jest.fn(async () => {
        calls++;
        if (calls < 3) throw new Error('not yet');
        return 'success';
      });
      const result = await retry(fn, 5);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should reject after all attempts fail', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('always fails'));
      await expect(retry(fn, 3)).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
