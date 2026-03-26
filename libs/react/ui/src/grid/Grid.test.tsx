import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Grid from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid columns={3}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Grid>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('applies grid-template-columns', () => {
    render(
      <Grid columns={4} testId="grd">
        <span>X</span>
      </Grid>,
    );
    expect(screen.getByTestId('grd').style.gridTemplateColumns).toBe('repeat(4, 1fr)');
  });

  it('accepts string columns', () => {
    render(
      <Grid columns="200px 1fr" testId="grd">
        <span>X</span>
      </Grid>,
    );
    expect(screen.getByTestId('grd').style.gridTemplateColumns).toBe('200px 1fr');
  });

  it('applies testId', () => {
    render(
      <Grid testId="grd">
        <span>Y</span>
      </Grid>,
    );
    expect(screen.getByTestId('grd')).toBeInTheDocument();
  });
});
