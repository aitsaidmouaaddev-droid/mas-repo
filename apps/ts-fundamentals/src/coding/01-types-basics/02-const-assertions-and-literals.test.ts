import type { Route, HttpMethod } from './02-const-assertions-and-literals';
import { HTTP_METHODS, ROUTES, PALETTE, getMethod } from './02-const-assertions-and-literals';

describe('02 — Const Assertions & Literal Types', () => {
  describe('HTTP_METHODS', () => {
    it('should define GET, POST, PUT, DELETE, PATCH', () => {
      expect(HTTP_METHODS.GET).toBe('GET');
      expect(HTTP_METHODS.POST).toBe('POST');
      expect(HTTP_METHODS.PUT).toBe('PUT');
      expect(HTTP_METHODS.DELETE).toBe('DELETE');
      expect(HTTP_METHODS.PATCH).toBe('PATCH');
    });

    it('values should be readonly (via as const)', () => {
      // TypeScript should prevent mutation — verified by compilation
      // Runtime check: object should have the correct values
      expect(Object.values(HTTP_METHODS)).toEqual(
        expect.arrayContaining(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      );
    });
  });

  describe('ROUTES', () => {
    it('should include /home, /about, /contact', () => {
      expect(ROUTES).toContain('/home');
      expect(ROUTES).toContain('/about');
      expect(ROUTES).toContain('/contact');
    });

    it('should be a readonly array', () => {
      // TypeScript compile-time check — as const makes it readonly
      expect(Array.isArray(ROUTES)).toBe(true);
    });
  });

  describe('Route type', () => {
    it('should be usable as a type constraint', () => {
      const home: Route = '/home';
      const about: Route = '/about';
      expect(home).toBe('/home');
      expect(about).toBe('/about');
    });
  });

  describe('PALETTE', () => {
    it('should have red as a number array', () => {
      expect(Array.isArray(PALETTE.red)).toBe(true);
      expect(PALETTE.red).toEqual([255, 0, 0]);
    });

    it('should have green as a string', () => {
      expect(typeof PALETTE.green).toBe('string');
      expect(PALETTE.green).toBe('#00ff00');
    });

    it('should have blue as a number array', () => {
      expect(PALETTE.blue).toEqual([0, 0, 255]);
    });
  });

  describe('getMethod', () => {
    it('should return the method as-is', () => {
      expect(getMethod('GET' as HttpMethod)).toBe('GET');
      expect(getMethod('POST' as HttpMethod)).toBe('POST');
    });
  });
});
