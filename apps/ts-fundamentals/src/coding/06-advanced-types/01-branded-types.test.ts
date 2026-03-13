import {
  UserId,
  PostId,
  makeUserId,
  makePostId,
  Meters,
  Feet,
  makeMeters,
  makeFeet,
  metersToFeet,
  feetToMeters,
  ValidatedEmail,
  validateEmail,
  findUser,
} from './01-branded-types';

describe('01 — Branded Types', () => {
  describe('UserId and PostId factories', () => {
    it('makeUserId should create a UserId', () => {
      const id = makeUserId('user-123');
      expect(id).toBe('user-123');
    });

    it('makePostId should create a PostId', () => {
      const id = makePostId('post-456');
      expect(id).toBe('post-456');
    });

    it('UserId and PostId should not be interchangeable at the type level', () => {
      // This is a compile-time guarantee — runtime both are strings
      const userId = makeUserId('abc');
      const postId = makePostId('abc');
      expect(typeof userId).toBe('string');
      expect(typeof postId).toBe('string');
      // The test is that TypeScript won't allow: const p: PostId = userId;
    });
  });

  describe('Meters and Feet', () => {
    it('should create typed values', () => {
      expect(makeMeters(100)).toBe(100);
      expect(makeFeet(328)).toBe(328);
    });

    it('metersToFeet should convert correctly', () => {
      const m = makeMeters(1);
      expect(metersToFeet(m)).toBeCloseTo(3.28084);
    });

    it('feetToMeters should convert correctly', () => {
      const f = makeFeet(3.28084);
      expect(feetToMeters(f)).toBeCloseTo(1.0);
    });

    it('round trip should be approximately equal', () => {
      const original = makeMeters(42);
      const roundTrip = feetToMeters(metersToFeet(original));
      expect(roundTrip).toBeCloseTo(42);
    });
  });

  describe('validateEmail', () => {
    it('should return a ValidatedEmail for valid emails', () => {
      const email = validateEmail('alice@example.com');
      expect(email).toBe('alice@example.com');
    });

    it('should return null for invalid emails', () => {
      expect(validateEmail('not-an-email')).toBeNull();
      expect(validateEmail('missing@domain')).toBeNull();
      expect(validateEmail('@nodomain.com')).toBeNull();
    });
  });

  describe('findUser', () => {
    it('should find user by UserId', () => {
      const users = [
        { id: makeUserId('u1'), name: 'Alice' },
        { id: makeUserId('u2'), name: 'Bob' },
      ];
      const found = findUser(makeUserId('u1'), users);
      expect(found?.name).toBe('Alice');
    });

    it('should return undefined if not found', () => {
      const users = [{ id: makeUserId('u1'), name: 'Alice' }];
      expect(findUser(makeUserId('u999'), users)).toBeUndefined();
    });
  });
});
