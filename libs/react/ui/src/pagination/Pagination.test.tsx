import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders all pages when total is small', () => {
    render(<Pagination page={1} total={5} onChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination page={3} total={5} onChange={vi.fn()} />);
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onChange with next page', () => {
    const fn = vi.fn();
    render(<Pagination page={2} total={5} onChange={fn} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('calls onChange with previous page', () => {
    const fn = vi.fn();
    render(<Pagination page={3} total={5} onChange={fn} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(fn).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination page={1} total={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={5} total={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('shows ellipsis for large totals', () => {
    render(<Pagination page={5} total={20} onChange={vi.fn()} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('calls onChange with clicked page', () => {
    const fn = vi.fn();
    render(<Pagination page={1} total={5} onChange={fn} />);
    fireEvent.click(screen.getByText('4'));
    expect(fn).toHaveBeenCalledWith(4);
  });

  it('applies testId', () => {
    render(<Pagination page={1} total={5} onChange={vi.fn()} testId="pag" />);
    expect(screen.getByTestId('pag')).toBeInTheDocument();
  });
});
