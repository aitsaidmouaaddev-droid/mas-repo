import { authReducer, initialAuthState } from './auth.store';
import type { AuthIdentity, AuthState } from '../interfaces';

interface TestIdentity extends AuthIdentity {
  id: string;
  email: string;
}

const makeIdentity = (): TestIdentity => ({ id: '1', email: 'user@example.com' });
const makeState = (): AuthState<TestIdentity> => initialAuthState<TestIdentity>();

describe('authReducer', () => {
  describe('SET_AUTHENTICATED', () => {
    it('sets identity on the state', () => {
      const identity = makeIdentity();
      const next = authReducer(makeState(), {
        type: 'SET_AUTHENTICATED',
        identity,
        accessToken: 'acc',
        refreshToken: 'ref',
      });
      expect(next.identity).toBe(identity);
    });

    it('sets accessToken and refreshToken', () => {
      const next = authReducer(makeState(), {
        type: 'SET_AUTHENTICATED',
        identity: makeIdentity(),
        accessToken: 'acc',
        refreshToken: 'ref',
      });
      expect(next.accessToken).toBe('acc');
      expect(next.refreshToken).toBe('ref');
    });

    it('sets isAuthenticated to true', () => {
      const next = authReducer(makeState(), {
        type: 'SET_AUTHENTICATED',
        identity: makeIdentity(),
        accessToken: 'acc',
        refreshToken: 'ref',
      });
      expect(next.isAuthenticated).toBe(true);
    });

    it('sets isLoading to false', () => {
      const loading = { ...makeState(), isLoading: true };
      const next = authReducer(loading, {
        type: 'SET_AUTHENTICATED',
        identity: makeIdentity(),
        accessToken: 'acc',
        refreshToken: 'ref',
      });
      expect(next.isLoading).toBe(false);
    });
  });

  describe('CLEAR_AUTH', () => {
    it('resets identity to null', () => {
      const state = {
        ...makeState(),
        identity: makeIdentity(),
        accessToken: 'acc',
        refreshToken: 'ref',
        isAuthenticated: true,
      };
      const next = authReducer(state, { type: 'CLEAR_AUTH' });
      expect(next.identity).toBeNull();
    });

    it('resets accessToken and refreshToken to null', () => {
      const state = {
        ...makeState(),
        identity: makeIdentity(),
        accessToken: 'acc',
        refreshToken: 'ref',
        isAuthenticated: true,
      };
      const next = authReducer(state, { type: 'CLEAR_AUTH' });
      expect(next.accessToken).toBeNull();
      expect(next.refreshToken).toBeNull();
    });

    it('sets isAuthenticated to false', () => {
      const state = { ...makeState(), isAuthenticated: true };
      const next = authReducer(state, { type: 'CLEAR_AUTH' });
      expect(next.isAuthenticated).toBe(false);
    });

    it('sets isLoading to false', () => {
      const state = { ...makeState(), isLoading: true };
      const next = authReducer(state, { type: 'CLEAR_AUTH' });
      expect(next.isLoading).toBe(false);
    });
  });

  describe('REFRESH_SUCCESS', () => {
    it('updates accessToken', () => {
      const state = {
        ...makeState(),
        identity: makeIdentity(),
        accessToken: 'old-acc',
        refreshToken: 'old-ref',
      };
      const next = authReducer(state, {
        type: 'REFRESH_SUCCESS',
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
      });
      expect(next.accessToken).toBe('new-acc');
    });

    it('updates refreshToken', () => {
      const state = {
        ...makeState(),
        identity: makeIdentity(),
        accessToken: 'old-acc',
        refreshToken: 'old-ref',
      };
      const next = authReducer(state, {
        type: 'REFRESH_SUCCESS',
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
      });
      expect(next.refreshToken).toBe('new-ref');
    });

    it('keeps identity unchanged', () => {
      const identity = makeIdentity();
      const state = { ...makeState(), identity, accessToken: 'old', refreshToken: 'old-ref' };
      const next = authReducer(state, {
        type: 'REFRESH_SUCCESS',
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
      });
      expect(next.identity).toBe(identity);
    });

    it('does not change isAuthenticated', () => {
      const state = {
        ...makeState(),
        identity: makeIdentity(),
        isAuthenticated: true,
        accessToken: 'a',
        refreshToken: 'r',
      };
      const next = authReducer(state, {
        type: 'REFRESH_SUCCESS',
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
      });
      expect(next.isAuthenticated).toBe(true);
    });
  });

  describe('SET_LOADING', () => {
    it('sets isLoading to true', () => {
      const next = authReducer(makeState(), { type: 'SET_LOADING', isLoading: true });
      expect(next.isLoading).toBe(true);
    });

    it('sets isLoading to false', () => {
      const state = { ...makeState(), isLoading: true };
      const next = authReducer(state, { type: 'SET_LOADING', isLoading: false });
      expect(next.isLoading).toBe(false);
    });

    it('does not change other fields', () => {
      const identity = makeIdentity();
      const state = {
        ...makeState(),
        identity,
        accessToken: 'acc',
        refreshToken: 'ref',
        isAuthenticated: true,
      };
      const next = authReducer(state, { type: 'SET_LOADING', isLoading: true });
      expect(next.identity).toBe(identity);
      expect(next.accessToken).toBe('acc');
      expect(next.refreshToken).toBe('ref');
      expect(next.isAuthenticated).toBe(true);
    });
  });

  describe('initialAuthState', () => {
    it('returns null identity', () => {
      expect(initialAuthState().identity).toBeNull();
    });

    it('returns null tokens', () => {
      const state = initialAuthState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('returns isAuthenticated false', () => {
      expect(initialAuthState().isAuthenticated).toBe(false);
    });

    it('returns isLoading false', () => {
      expect(initialAuthState().isLoading).toBe(false);
    });
  });
});
