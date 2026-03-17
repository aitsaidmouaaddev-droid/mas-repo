import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

describe('Form', () => {
  it('renders children', () => {
    render(
      <Form>
        <span>field</span>
      </Form>,
    );
    expect(screen.getByText('field')).toBeInTheDocument();
  });

  it('calls onSubmit and prevents default', () => {
    const fn = vi.fn();
    render(
      <Form onSubmit={fn}>
        <button type="submit">Go</button>
      </Form>,
    );
    fireEvent.click(screen.getByText('Go'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('renders actions slot', () => {
    render(
      <Form actions={<button>Save</button>}>
        <span>body</span>
      </Form>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies testId', () => {
    render(
      <Form testId="frm">
        <span>x</span>
      </Form>,
    );
    expect(screen.getByTestId('frm')).toBeInTheDocument();
  });
});
