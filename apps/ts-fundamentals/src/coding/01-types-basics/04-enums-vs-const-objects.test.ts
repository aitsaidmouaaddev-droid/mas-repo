import type { StatusValue } from './04-enums-vs-const-objects';
import {
  Direction,
  Status,
  STATUS_MAP,
  getStatusLabel,
  isValidDirection,
} from './04-enums-vs-const-objects';

describe('04 — Enums vs const objects', () => {
  describe('Direction enum', () => {
    it('should have Up, Down, Left, Right as numeric members', () => {
      expect(typeof Direction.Up).toBe('number');
      expect(typeof Direction.Down).toBe('number');
      expect(typeof Direction.Left).toBe('number');
      expect(typeof Direction.Right).toBe('number');
    });

    it('members should be distinct values', () => {
      const values = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
      const unique = new Set(values);
      expect(unique.size).toBe(4);
    });
  });

  describe('Status string enum', () => {
    it('should have string values', () => {
      expect(Status.Pending).toBe('PENDING');
      expect(Status.Active).toBe('ACTIVE');
      expect(Status.Inactive).toBe('INACTIVE');
    });
  });

  describe('STATUS_MAP as const', () => {
    it('should have same values as Status enum', () => {
      expect(STATUS_MAP.Pending).toBe('PENDING');
      expect(STATUS_MAP.Active).toBe('ACTIVE');
      expect(STATUS_MAP.Inactive).toBe('INACTIVE');
    });
  });

  describe('getStatusLabel', () => {
    it('should return Pending for PENDING', () => {
      expect(getStatusLabel('PENDING' as StatusValue)).toBe('Pending');
    });

    it('should return Active for ACTIVE', () => {
      expect(getStatusLabel('ACTIVE' as StatusValue)).toBe('Active');
    });

    it('should return Inactive for INACTIVE', () => {
      expect(getStatusLabel('INACTIVE' as StatusValue)).toBe('Inactive');
    });
  });

  describe('isValidDirection', () => {
    it('should return true for valid Direction values', () => {
      expect(isValidDirection(Direction.Up)).toBe(true);
      expect(isValidDirection(Direction.Down)).toBe(true);
    });

    it('should return false for non-Direction values', () => {
      expect(isValidDirection(999)).toBe(false);
      expect(isValidDirection('Up')).toBe(false);
      expect(isValidDirection(null)).toBe(false);
    });
  });
});
