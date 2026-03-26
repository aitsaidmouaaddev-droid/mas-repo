import '@testing-library/jest-dom/vitest';

/* eslint-disable @typescript-eslint/no-empty-function */
// jsdom does not implement scrollTo / scrollIntoView on elements
Element.prototype.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

// jsdom does not implement matchMedia — provide a minimal stub
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
