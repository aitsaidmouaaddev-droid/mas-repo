import 'reflect-metadata';
import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeGuard(isPublic = false) {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(isPublic),
  } as unknown as Reflector;
  const guard = new JwtAuthGuard(reflector);
  // Stub the parent canActivate so we don't need a real Passport setup
  jest
    .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
    .mockReturnValue(true);
  return { guard, reflector };
}

function makeRestContext(user = {}): ExecutionContext {
  return {
    getType: jest.fn().mockReturnValue('http'),
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({}),
    switchToHttp: jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue({ user }) }),
  } as unknown as ExecutionContext;
}

function makeGqlContext(user = {}): ExecutionContext {
  const req = { user };
  return {
    getType: jest.fn().mockReturnValue('graphql'),
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({}),
    getArgs: jest.fn().mockReturnValue([null, null, { req }, null]),
    getArgByIndex: jest.fn((i: number) => [null, null, { req }, null][i]),
    switchToHttp: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  } as unknown as ExecutionContext;
}

// ─── @Public() bypass ────────────────────────────────────────────────────────

describe('JwtAuthGuard — @Public() bypass', () => {
  it('returns true immediately when the route is marked @Public()', () => {
    const { guard, reflector } = makeGuard(true);
    const ctx = makeRestContext();

    const result = guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
    expect(result).toBe(true);
  });

  it('delegates to parent canActivate when route is not @Public()', () => {
    const { guard } = makeGuard(false);
    const ctx = makeRestContext();

    const result = guard.canActivate(ctx);

    expect(result).toBe(true); // stubbed parent returns true
  });
});

// ─── getRequest ───────────────────────────────────────────────────────────────

describe('JwtAuthGuard.getRequest', () => {
  it('returns the HTTP request for REST context', () => {
    const { guard } = makeGuard();
    const req = { headers: {} };
    const ctx = makeRestContext(req);

    const result = guard.getRequest(ctx);

    expect(result).toEqual(expect.objectContaining({ user: req }));
  });

  it('extracts req from GraphQL context', () => {
    const { guard } = makeGuard();
    const user = { id: 'u1' };
    const ctx = makeGqlContext(user);

    const result = guard.getRequest(ctx);

    expect(result).toEqual({ user });
  });
});
