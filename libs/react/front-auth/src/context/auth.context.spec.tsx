import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuthContext } from './auth.context';
import type { ReactNode } from 'react';

function TestConsumer() {
  const ctx = useAuthContext();
  return (
    <div>
      <span data-testid="authenticated">{String(ctx.isAuthenticated)}</span>
      <span data-testid="identity">{ctx.identity?.id ?? 'null'}</span>
      <button
        onClick={() =>
          ctx.setAuthenticated(
            { id: '42', email: 'a@b.com' },
            { accessToken: 'acc', refreshToken: 'ref' },
          )
        }
      >
        login
      </button>
      <button onClick={() => ctx.clearAuth()}>logout</button>
    </div>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  it('renders children without throwing', () => {
    render(
      <Wrapper>
        <span data-testid="child">hello</span>
      </Wrapper>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('provides initial unauthenticated state', () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });

  it('setAuthenticated updates isAuthenticated to true', () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => {
      screen.getByRole('button', { name: 'login' }).click();
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('setAuthenticated sets the identity id', () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => {
      screen.getByRole('button', { name: 'login' }).click();
    });
    expect(screen.getByTestId('identity').textContent).toBe('42');
  });

  it('clearAuth resets isAuthenticated to false', () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => {
      screen.getByRole('button', { name: 'login' }).click();
    });
    act(() => {
      screen.getByRole('button', { name: 'logout' }).click();
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });

  it('clearAuth resets identity to null', () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => {
      screen.getByRole('button', { name: 'login' }).click();
    });
    act(() => {
      screen.getByRole('button', { name: 'logout' }).click();
    });
    expect(screen.getByTestId('identity').textContent).toBe('null');
  });
});

describe('useAuthContext', () => {
  it('throws when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Bare() {
      useAuthContext();
      return null;
    }
    expect(() => render(<Bare />)).toThrow('useAuthContext must be used inside <AuthProvider>');
    spy.mockRestore();
  });
});
