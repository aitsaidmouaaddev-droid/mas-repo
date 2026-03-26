import {
  BankAccount,
  Animal,
  Dog,
  Cat,
  Serializable,
  User,
  SerializableUser,
  EventEmitter,
} from './01-classes-and-mixins';

describe('01 — Classes & Mixins', () => {
  describe('BankAccount', () => {
    it('should start with initial balance', () => {
      const account = new BankAccount('Alice', 100);
      expect(account.currentBalance).toBe(100);
      expect(account.owner).toBe('Alice');
    });

    it('should deposit correctly', () => {
      const account = new BankAccount('Bob', 50);
      account.deposit(25);
      expect(account.currentBalance).toBe(75);
    });

    it('should withdraw correctly', () => {
      const account = new BankAccount('Carol', 100);
      account.withdraw(40);
      expect(account.currentBalance).toBe(60);
    });

    it('should throw on withdrawal exceeding balance', () => {
      const account = new BankAccount('Dave', 50);
      expect(() => account.withdraw(100)).toThrow();
    });

    it('should throw on non-positive deposit', () => {
      const account = new BankAccount('Eve', 100);
      expect(() => account.deposit(0)).toThrow();
      expect(() => account.deposit(-10)).toThrow();
    });
  });

  describe('Animal, Dog, Cat', () => {
    it('Dog.describe should use makeSound', () => {
      const dog = new Dog('Rex');
      const desc = dog.describe();
      expect(desc).toContain('Rex');
      expect(desc).toContain(dog.makeSound());
    });

    it('Cat.describe should use makeSound', () => {
      const cat = new Cat('Whiskers');
      expect(cat.describe()).toContain('Whiskers');
    });

    it('Dog and Cat should make different sounds', () => {
      const dog = new Dog('Rex');
      const cat = new Cat('Whiskers');
      expect(dog.makeSound()).not.toBe(cat.makeSound());
    });
  });

  describe('Serializable mixin', () => {
    it('SerializableUser should have serialize()', () => {
      const user = new SerializableUser('Alice', 30);
      const json = (user as any).serialize();
      expect(typeof json).toBe('string');
      expect(JSON.parse(json)).toMatchObject({ name: 'Alice', age: 30 });
    });
  });

  describe('EventEmitter', () => {
    it('should emit events to registered handlers', () => {
      type Events = { login: { userId: string }; logout: void };
      const emitter = new EventEmitter<Events>();
      const handler = jest.fn();
      emitter.on('login', handler);
      emitter.emit('login', { userId: 'abc123' });
      expect(handler).toHaveBeenCalledWith({ userId: 'abc123' });
    });

    it('should support multiple handlers', () => {
      type Events = { data: number };
      const emitter = new EventEmitter<Events>();
      const h1 = jest.fn();
      const h2 = jest.fn();
      emitter.on('data', h1);
      emitter.on('data', h2);
      emitter.emit('data', 42);
      expect(h1).toHaveBeenCalledWith(42);
      expect(h2).toHaveBeenCalledWith(42);
    });

    it('should not call handlers for other events', () => {
      type Events = { a: string; b: string };
      const emitter = new EventEmitter<Events>();
      const handler = jest.fn();
      emitter.on('a', handler);
      emitter.emit('b', 'other');
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
