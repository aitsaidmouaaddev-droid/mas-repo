import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';

import App from './app';

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>);

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithStore(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { baseElement } = renderWithStore(<App />);
    expect(baseElement).toBeTruthy();
  });
});
