import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip text="Info" testId="tt">
        <button>Hover</button>
      </Tooltip>,
    );
    expect(screen.getByText('Hover')).toBeInTheDocument();
  });

  it('shows tooltip text on hover', () => {
    render(
      <Tooltip text="Info" testId="tt">
        <button>Hover</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByTestId('tt'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Info');
  });

  it('hides tooltip on mouse leave', () => {
    render(
      <Tooltip text="Info" testId="tt">
        <button>Hover</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByTestId('tt'));
    fireEvent.mouseLeave(screen.getByTestId('tt'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
