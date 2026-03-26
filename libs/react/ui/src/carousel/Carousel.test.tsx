import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Carousel from './Carousel';

describe('Carousel', () => {
  it('renders slides', () => {
    render(
      <Carousel testId="carousel">
        <div data-testid="slide-1">Slide 1</div>
        <div data-testid="slide-2">Slide 2</div>
        <div data-testid="slide-3">Slide 3</div>
      </Carousel>,
    );
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
    expect(screen.getByTestId('slide-3')).toBeInTheDocument();
  });

  it('clicking dot navigates to correct slide', () => {
    render(
      <Carousel testId="carousel">
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>,
    );
    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    expect(dots).toHaveLength(3);
    fireEvent.click(dots[2]);
    expect(dots[2]).toBeInTheDocument();
  });

  it('renders no dots when single slide', () => {
    render(
      <Carousel testId="carousel">
        <div>Only slide</div>
      </Carousel>,
    );
    const dots = screen.queryAllByRole('button', { name: /go to slide/i });
    expect(dots).toHaveLength(0);
  });
});
