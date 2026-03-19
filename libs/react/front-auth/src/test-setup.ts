import '@testing-library/jest-dom/vitest';

/* eslint-disable @typescript-eslint/no-empty-function */
Element.prototype.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

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
