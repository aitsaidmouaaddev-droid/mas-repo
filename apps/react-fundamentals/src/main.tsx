import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@mas/react-ui';
import { RouterProvider } from '@mas/react-router';
import type { RouterProviderProps } from '@mas/react-router';
import { store } from './store';
import App from './app/app';
import { authClient } from './app/auth/auth.client';
import { routes } from './routes';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider initialMode="dark" initialFont="robotocondensed">
        <authClient.Provider>
          <ApolloProvider client={authClient.apolloClient}>
            <RouterProvider routes={routes} store={store as unknown as RouterProviderProps['store']}>
              <App />
            </RouterProvider>
          </ApolloProvider>
        </authClient.Provider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
