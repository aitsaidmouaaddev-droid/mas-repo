import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

  it('renders textarea in write mode', () => {
    render(<CodeEditor code="const x = 1;" mode="write" />);
    const ta = screen.getByRole('textbox');
    expect(ta).toBeTruthy();
    expect((ta as HTMLTextAreaElement).value).toBe('const x = 1;');
  });

  it('calls onChange when user types in write mode', () => {
    const onChange = vi.fn();
    render(<CodeEditor code="" mode="write" onChange={onChange} />);
    const ta = screen.getByRole('textbox');
    fireEvent.change(ta, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('shows placeholder in write mode when code is empty', () => {
    render(<CodeEditor code="" mode="write" placeholder="// Type here" />);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).placeholder).toBe('// Type here');
  });
});
