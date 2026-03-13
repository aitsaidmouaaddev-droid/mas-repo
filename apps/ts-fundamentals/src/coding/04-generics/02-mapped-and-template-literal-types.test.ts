import {
  MyPartial,
  Nullable,
  Getters,
  BaseEvent,
  EventName,
  createGetters,
} from './02-mapped-and-template-literal-types';

describe('02 — Mapped & Template Literal Types', () => {
  describe('MyPartial', () => {
    it('should make all properties optional at type level', () => {
      type User = { id: number; name: string };
      const partial: MyPartial<User> = {}; // no error — all optional
      expect(partial).toEqual({});
      const withName: MyPartial<User> = { name: 'Alice' };
      expect(withName.name).toBe('Alice');
    });
  });

  describe('Nullable', () => {
    it('should allow null for all properties', () => {
      type Config = { host: string; port: number };
      const nullable: Nullable<Config> = { host: null, port: null };
      expect(nullable.host).toBeNull();
    });

    it('should still allow original values', () => {
      type Config = { host: string; port: number };
      const config: Nullable<Config> = { host: 'localhost', port: 3000 };
      expect(config.host).toBe('localhost');
    });
  });

  describe('Getters type', () => {
    it('Getters should map name → getName', () => {
      type User = { name: string; age: number };
      type UserGetters = Getters<User>;
      // Compile-time: UserGetters should have getName and getAge
      const getters = {} as UserGetters;
      expect(getters).toBeDefined(); // type-level check only
    });
  });

  describe('EventName template literal type', () => {
    it('should produce prefixed event names (type-level)', () => {
      const onClick: EventName = 'onClick';
      const onFocus: EventName = 'onFocus';
      const onBlur: EventName = 'onBlur';
      const onChange: EventName = 'onChange';
      expect([onClick, onFocus, onBlur, onChange]).toHaveLength(4);
    });
  });

  describe('createGetters', () => {
    it('should create getter functions for each property', () => {
      const user = { name: 'Alice', age: 30 };
      const getters = createGetters(user);
      expect(typeof getters['getName']).toBe('function');
      expect(getters['getName']()).toBe('Alice');
      expect(getters['getAge']()).toBe(30);
    });

    it('should reflect current values', () => {
      const obj = { x: 1, y: 2 };
      const getters = createGetters(obj);
      expect(getters['getX']()).toBe(1);
      expect(getters['getY']()).toBe(2);
    });
  });
});
