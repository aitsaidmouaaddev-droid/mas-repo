import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} testId="m">
        Content
      </Modal>,
    );
    expect(screen.queryByTestId('m')).toBeNull();
  });

  it('renders when open', () => {
    render(
      <Modal open onClose={vi.fn()} testId="m" title="Hello">
        Content
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} testId="m">
        Content
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on overlay click', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} testId="m">
        Content
      </Modal>,
    );
    fireEvent.click(screen.getByTestId('m'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders footer', () => {
    render(
      <Modal open onClose={vi.fn()} testId="m" footer={<button>Save</button>}>
        Body
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
