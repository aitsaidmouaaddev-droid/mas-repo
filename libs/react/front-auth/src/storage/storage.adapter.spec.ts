import { localStorageAdapter, TOKEN_KEYS } from './storage.adapter';

describe('localStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('returns the value stored under the given key', () => {
      localStorage.setItem('test.key', 'stored-value');
      expect(localStorageAdapter.get('test.key')).toBe('stored-value');
    });

    it('returns null when the key does not exist', () => {
      expect(localStorageAdapter.get('nonexistent')).toBeNull();
    });
  });

  describe('set', () => {
    it('writes a value to localStorage under the given key', () => {
      localStorageAdapter.set('test.key', 'new-value');
      expect(localStorage.getItem('test.key')).toBe('new-value');
    });

    it('overwrites an existing value', () => {
      localStorage.setItem('test.key', 'old');
      localStorageAdapter.set('test.key', 'new');
      expect(localStorage.getItem('test.key')).toBe('new');
    });
  });

  describe('remove', () => {
    it('removes the key from localStorage', () => {
      localStorage.setItem('test.key', 'value');
      localStorageAdapter.remove('test.key');
      expect(localStorage.getItem('test.key')).toBeNull();
    });

    it('does not throw when the key does not exist', () => {
      expect(() => localStorageAdapter.remove('nonexistent')).not.toThrow();
    });
  });
});

describe('TOKEN_KEYS', () => {
  it('has an ACCESS key', () => {
    expect(TOKEN_KEYS.ACCESS).toBe('auth.accessToken');
  });

  it('has a REFRESH key', () => {
    expect(TOKEN_KEYS.REFRESH).toBe('auth.refreshToken');
  });
});
