import type {
  UserProfile,
  CreateUserInput,
  UpdateUserInput,
  UserPreview,
  UserMap,
} from './01-utility-types-in-practice';
import { createFactory, extractKeys, getSignatureInfo } from './01-utility-types-in-practice';

describe('01 — Utility Types in Practice', () => {
  const sampleUser: UserProfile = {
    id: 'u1',
    username: 'alice',
    email: 'alice@example.com',
    age: 30,
    bio: 'Developer',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  describe('CreateUserInput type', () => {
    it('should accept user input without id, createdAt, updatedAt', () => {
      const input: CreateUserInput = {
        username: 'alice',
        email: 'alice@example.com',
        age: 30,
      };
      expect(input).toBeDefined();
      // Type-level: 'id' should not exist in CreateUserInput
      expect('id' in input).toBe(false);
    });
  });

  describe('UpdateUserInput type', () => {
    it('should allow partial update with only some fields', () => {
      const update: UpdateUserInput = { username: 'new_alice' };
      expect(update).toBeDefined();
    });

    it('should allow empty update', () => {
      const update: UpdateUserInput = {};
      expect(update).toBeDefined();
    });
  });

  describe('UserPreview type', () => {
    it('should only have id, username, bio', () => {
      const preview: UserPreview = { id: 'u1', username: 'alice', bio: 'Dev' };
      expect(preview.id).toBe('u1');
      expect(preview.username).toBe('alice');
      expect('email' in preview).toBe(false);
    });
  });

  describe('UserMap type', () => {
    it('should work as a string-keyed map of UserProfile', () => {
      const map: UserMap = { u1: sampleUser };
      expect(map['u1'].username).toBe('alice');
    });
  });

  describe('createFactory', () => {
    it('should return defaults when no overrides given', () => {
      const factory = createFactory({ x: 1, y: 2, label: 'point' });
      expect(factory()).toEqual({ x: 1, y: 2, label: 'point' });
    });

    it('should merge overrides', () => {
      const factory = createFactory({ x: 0, y: 0, label: 'origin' });
      expect(factory({ x: 5, label: 'custom' })).toEqual({ x: 5, y: 0, label: 'custom' });
    });

    it('should not mutate defaults', () => {
      const defaults = { x: 0, y: 0 };
      const factory = createFactory(defaults);
      factory({ x: 99 });
      expect(defaults.x).toBe(0);
    });
  });

  describe('extractKeys', () => {
    it('should extract specified keys', () => {
      const result = extractKeys(sampleUser, ['id', 'username', 'email'] as const);
      expect(result).toEqual({ id: 'u1', username: 'alice', email: 'alice@example.com' });
      expect('age' in result).toBe(false);
    });
  });

  describe('getSignatureInfo', () => {
    it('should return param count and function name', () => {
      function add(a: number, b: number) {
        return a + b;
      }
      const info = getSignatureInfo(add);
      expect(info.paramCount).toBe(2);
      expect(info.name).toBe('add');
    });

    it('should work with arrow functions (empty name)', () => {
      const fn = (x: number) => x;
      const info = getSignatureInfo(fn);
      expect(info.paramCount).toBe(1);
    });
  });
});
