import { convert, createElement } from './01-overloads';

describe('01 — Function Overloads', () => {
  describe('convert', () => {
    it('should convert string to number', () => {
      const result = convert('42');
      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('should convert number to string', () => {
      const result = convert(99);
      expect(result).toBe('99');
      expect(typeof result).toBe('string');
    });

    it('should handle negative numbers', () => {
      expect(convert(-5)).toBe('-5');
      expect(convert('-5')).toBe(-5);
    });
  });

  describe('createElement', () => {
    it('should create input element', () => {
      const el = createElement('input');
      expect(el.type).toBe('input');
      expect('value' in el).toBe(true);
    });

    it('should create checkbox element', () => {
      const el = createElement('checkbox');
      expect(el.type).toBe('checkbox');
      expect('checked' in el).toBe(true);
    });

    it('should create text element', () => {
      const el = createElement('text');
      expect(el.type).toBe('text');
      expect('content' in el).toBe(true);
    });
  });
});
