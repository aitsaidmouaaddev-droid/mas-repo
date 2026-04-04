import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider, uiReducer } from '@mas/react-ui';
import App from './app/App';
import './styles.css';

const store = configureStore({ reducer: { ui: uiReducer } });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider initialMode="dark">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
