import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CodeEditor from './CodeEditor';

describe('CodeEditor', () => {
  it('renders toolbar with filename', () => {
    render(<CodeEditor code="const x = 1;" filename="test.ts" />);
    expect(screen.getByText('test.ts')).toBeTruthy();
  });

  it('renders toolbar with language label', () => {
    render(<CodeEditor code="const x = 1;" language="typescript" />);
    expect(screen.getByText('typescript')).toBeTruthy();
  });

  it('renders highlighted code in view mode', () => {
    render(<CodeEditor code="const x = 1;" mode="view" />);
    expect(screen.getByText(/const/)).toBeTruthy();
  });

  it('renders write mode without crashing', () => {
    expect(() => render(<CodeEditor code="const x = 1;" mode="write" />)).not.toThrow();
  });

  it('renders write mode with different languages without crashing', () => {
    expect(() =>
      render(<CodeEditor code="const x = 1;" mode="write" language="typescript" />),
    ).not.toThrow();
    expect(() =>
      render(<CodeEditor code="const x = 1;" mode="write" language="javascript" />),
    ).not.toThrow();
  });
});
