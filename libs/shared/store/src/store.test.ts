import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { createAppStore } from './store';
import type { AppStore } from './store';

// ---------------------------------------------------------------------------
// Test slices
// ---------------------------------------------------------------------------

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    add(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
    reset() {
      return { value: 0 };
    },
  },
});

const nameSlice = createSlice({
  name: 'name',
  initialState: { value: '' },
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

const { increment, decrement, add, reset } = counterSlice.actions;
const { setName } = nameSlice.actions;

// ---------------------------------------------------------------------------
// createAppStore — basic construction
// ---------------------------------------------------------------------------

describe('createAppStore — construction', () => {
  it('creates a store with a single reducer', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  it('returns correct initial state', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    expect(store.getState()).toEqual({ counter: { value: 0 } });
  });

  it('creates a store with multiple reducers', () => {
    const store = createAppStore({
      counter: counterSlice.reducer,
      name: nameSlice.reducer,
    });
    expect(store.getState()).toEqual({
      counter: { value: 0 },
      name: { value: '' },
    });
  });

  it('creates a store without extra argument', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    expect(store).toBeDefined();
  });

  it('creates a store with extra argument', () => {
    const extra = { apiUrl: 'https://example.com' };
    const store = createAppStore({ counter: counterSlice.reducer }, extra);
    expect(store).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// dispatch and state changes
// ---------------------------------------------------------------------------

describe('createAppStore — dispatch', () => {
  it('increment increases counter value by 1', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    store.dispatch(increment());
    expect(store.getState().counter.value).toBe(1);
  });

  it('decrement decreases counter value by 1', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    store.dispatch(increment());
    store.dispatch(increment());
    store.dispatch(decrement());
    expect(store.getState().counter.value).toBe(1);
  });

  it('add(n) increases counter value by n', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    store.dispatch(add(10));
    expect(store.getState().counter.value).toBe(10);
  });

  it('reset returns counter to 0', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    store.dispatch(add(99));
    store.dispatch(reset());
    expect(store.getState().counter.value).toBe(0);
  });

  it('multiple dispatches accumulate correctly', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    store.dispatch(add(5));
    store.dispatch(increment());
    store.dispatch(increment());
    store.dispatch(decrement());
    expect(store.getState().counter.value).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Multiple reducers — isolated slices
// ---------------------------------------------------------------------------

describe('createAppStore — multiple reducers', () => {
  it('dispatching to one slice does not affect another', () => {
    const store = createAppStore({
      counter: counterSlice.reducer,
      name: nameSlice.reducer,
    });
    store.dispatch(increment());
    expect(store.getState().counter.value).toBe(1);
    expect(store.getState().name.value).toBe('');
  });

  it('each slice updates independently', () => {
    const store = createAppStore({
      counter: counterSlice.reducer,
      name: nameSlice.reducer,
    });
    store.dispatch(add(42));
    store.dispatch(setName('Alice'));
    expect(store.getState().counter.value).toBe(42);
    expect(store.getState().name.value).toBe('Alice');
  });
});

// ---------------------------------------------------------------------------
// extraArgument passed to thunks
// ---------------------------------------------------------------------------

describe('createAppStore — extraArgument', () => {
  it('passes extra argument to thunks via thunkApi.extra', async () => {
    interface ExtraServices {
      multiply: (n: number) => number;
    }
    const extra: ExtraServices = { multiply: (n) => n * 3 };

    const multiplySlice = createSlice({
      name: 'multiply',
      initialState: { result: 0 },
      reducers: {
        setResult(state, action: PayloadAction<number>) {
          state.result = action.payload;
        },
      },
    });

    const store = createAppStore({ multiply: multiplySlice.reducer }, extra);

    const multiplyThunk = createAsyncThunk<number, number>(
      'multiply/run',
      async (input, thunkApi) => {
        return (thunkApi.extra as ExtraServices).multiply(input);
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (store.dispatch as any)(multiplyThunk(7));
    expect(result.payload).toBe(21);
  });

  it('extra defaults to empty object when not provided', async () => {
    let capturedExtra: unknown;

    const noopSlice = createSlice({
      name: 'noop',
      initialState: {},
      reducers: {},
    });

    const store = createAppStore({ noop: noopSlice.reducer });

    const captureThunk = createAsyncThunk('noop/capture', async (_: void, thunkApi) => {
      capturedExtra = thunkApi.extra;
    });

    await store.dispatch(captureThunk());
    expect(capturedExtra).toEqual({});
  });

  it('extra object with multiple services is accessible in thunk', async () => {
    interface Services {
      greet: (name: string) => string;
      double: (n: number) => number;
    }
    const services: Services = {
      greet: (name) => `Hello, ${name}!`,
      double: (n) => n * 2,
    };

    const testSlice = createSlice({
      name: 'test',
      initialState: { greeting: '', doubled: 0 },
      reducers: {
        setGreeting(state, action: PayloadAction<string>) {
          state.greeting = action.payload;
        },
        setDoubled(state, action: PayloadAction<number>) {
          state.doubled = action.payload;
        },
      },
    });

    const store = createAppStore({ test: testSlice.reducer }, services);

    const serviceThunk = createAsyncThunk<void, void>(
      'test/useServices',
      async (_: void, thunkApi) => {
        const svc = thunkApi.extra as Services;
        thunkApi.dispatch(testSlice.actions.setGreeting(svc.greet('World')));
        thunkApi.dispatch(testSlice.actions.setDoubled(svc.double(21)));
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (store.dispatch as any)(serviceThunk());
    expect(store.getState().test.greeting).toBe('Hello, World!');
    expect(store.getState().test.doubled).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// AppStore type
// ---------------------------------------------------------------------------

describe('AppStore type', () => {
  it('AppStore is assignable from createAppStore return value', () => {
    const store = createAppStore({ counter: counterSlice.reducer });
    // If this compiles and runs, the type is valid
    const typed: AppStore<{ counter: typeof counterSlice.reducer }> = store;
    expect(typed.getState().counter.value).toBe(0);
  });
});
