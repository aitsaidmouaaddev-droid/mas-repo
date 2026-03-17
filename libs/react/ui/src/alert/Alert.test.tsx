import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './Alert';

describe('Alert', () => {
  it('renders message', () => {
    render(<Alert testId="a">Something happened</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Something happened');
  });

  it('renders close button when onClose provided', () => {
    const onClose = vi.fn();
    render(
      <Alert testId="a" onClose={onClose}>
        Msg
      </Alert>,
    );
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <Alert testId="a" variant="success">
        Ok
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(
      <Alert testId="a" variant="error">
        Fail
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Fail');
  });

  it('renders icon', () => {
    const { container } = render(<Alert testId="a">Info</Alert>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
