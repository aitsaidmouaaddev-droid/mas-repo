import type { User, AdminUser, Coordinates, GeoPoint } from './01-type-aliases-and-interfaces';
import { StringOrNumber, toDisplay } from './01-type-aliases-and-interfaces';

describe('01 — Type Aliases & Interfaces', () => {
  describe('User interface', () => {
    it('should accept a valid user object', () => {
      const user: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
      expect(user.id).toBe(1);
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
    });
  });

  describe('AdminUser interface', () => {
    it('should extend User with permissions and role', () => {
      const admin: AdminUser = {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        permissions: ['read', 'write'],
        role: 'admin',
      };
      expect(admin.permissions).toContain('read');
      expect(admin.role).toBe('admin');
    });

    it('should only allow valid role values', () => {
      // This is a compile-time test — if it compiles, the type is correct
      const admin: AdminUser = {
        id: 3,
        name: 'Super',
        email: 'super@example.com',
        permissions: [],
        role: 'superadmin',
      };
      expect(admin.role).toBe('superadmin');
    });
  });

  describe('Coordinates and GeoPoint types', () => {
    it('Coordinates should accept lat and lng', () => {
      const coords: Coordinates = { lat: 48.8566, lng: 2.3522 };
      expect(coords.lat).toBeCloseTo(48.8566);
      expect(coords.lng).toBeCloseTo(2.3522);
    });

    it('GeoPoint should have lat, lng and label', () => {
      const point: GeoPoint = { lat: 48.8566, lng: 2.3522, label: 'Paris' };
      expect(point.label).toBe('Paris');
      expect(point.lat).toBe(48.8566);
    });
  });

  describe('toDisplay function', () => {
    it('should return string as-is', () => {
      expect(toDisplay('hello')).toBe('hello');
    });

    it('should convert number to string', () => {
      expect(toDisplay(42)).toBe('42');
      expect(toDisplay(3.14)).toBe('3.14');
    });

    it('should handle 0', () => {
      expect(toDisplay(0)).toBe('0');
    });
  });

  describe('Declaration merging', () => {
    it('User should accept an optional createdAt date', () => {
      const user: User = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2024-01-01'),
      };
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('User without createdAt should still be valid', () => {
      const user: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
      expect(user.createdAt).toBeUndefined();
    });
  });
});
