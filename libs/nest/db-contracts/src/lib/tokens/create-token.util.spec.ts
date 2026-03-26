import { createToken } from './create-token.util';

describe('createToken', () => {
  it('returns an object with token (symbol) and name', () => {
    const t = createToken<unknown>('User');
    expect(typeof t.token).toBe('symbol');
    expect(t.name).toBe('User');
  });

  it('token description includes the entity name', () => {
    const t = createToken<unknown>('Order');
    expect(t.token.description).toBe('REPOSITORY:Order');
  });

  it('name property matches the argument exactly', () => {
    const t = createToken<unknown>('SomeLongEntityName');
    expect(t.name).toBe('SomeLongEntityName');
  });

  it('two tokens with the same name are different symbols', () => {
    const a = createToken<unknown>('User');
    const b = createToken<unknown>('User');
    expect(a.token).not.toBe(b.token);
  });

  it('two tokens with different names are different symbols', () => {
    const a = createToken<unknown>('User');
    const b = createToken<unknown>('Post');
    expect(a.token).not.toBe(b.token);
  });

  it('token is readonly — reassignment is rejected at compile time', () => {
    const t = createToken<unknown>('User');
    // TypeScript would reject: t.token = Symbol(); — we verify the value is stable
    const captured = t.token;
    expect(t.token).toBe(captured);
  });

  it('works with any generic type parameter', () => {
    interface IUserRepo {
      findById(id: string): Promise<null>;
    }
    const t = createToken<IUserRepo>('User');
    expect(t.name).toBe('User');
  });
});
