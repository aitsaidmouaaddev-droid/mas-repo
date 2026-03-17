import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mas/react-ui';
import { store } from './store';
import App from './app/app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider initialMode="dark" initialFont="robotocondensed">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
