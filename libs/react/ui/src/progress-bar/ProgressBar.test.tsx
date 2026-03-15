import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  describe('Linear determinate', () => {
    it('renders correct width percentage for value 0.5', () => {
      render(<ProgressBar value={0.5} testId="pb" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.style.width).toBe('50%');
      expect(screen.getByText('50%')).toBeTruthy();
    });

    it('clamps values above 1 to 100%', () => {
      render(<ProgressBar value={1.5} testId="pb" />);
      expect(screen.getByTestId('progress-fill').style.width).toBe('100%');
      expect(screen.getByText('100%')).toBeTruthy();
    });

    it('clamps values below 0 to 0%', () => {
      render(<ProgressBar value={-0.5} testId="pb" />);
      expect(screen.getByTestId('progress-fill').style.width).toBe('0%');
      expect(screen.getByText('0%')).toBeTruthy();
    });

    it('defaults to 0% when no value provided', () => {
      render(<ProgressBar testId="pb" />);
      expect(screen.getByTestId('progress-fill').style.width).toBe('0%');
      expect(screen.getByText('0%')).toBeTruthy();
    });
  });

  describe('Linear infinite', () => {
    it('does not render percent label', () => {
      render(<ProgressBar isInfinite testId="pb" />);
      expect(screen.getByTestId('progress-fill')).toBeTruthy();
      expect(screen.queryByText(/\d+%/)).toBeNull();
    });
  });

  describe('Circular determinate', () => {
    it('renders circular variant with percent in center', () => {
      render(<ProgressBar variant="circular" value={0.7} size={60} strokeWidth={6} />);
      expect(screen.getByTestId('progress-circle')).toBeTruthy();
      expect(screen.getByText('70%')).toBeTruthy();
      expect(screen.queryByTestId('progress-track')).toBeNull();
    });

    it('clamps circular value above 1', () => {
      render(<ProgressBar variant="circular" value={2} />);
      expect(screen.getByText('100%')).toBeTruthy();
    });

    it('clamps circular value below 0', () => {
      render(<ProgressBar variant="circular" value={-1} />);
      expect(screen.getByText('0%')).toBeTruthy();
    });
  });

  describe('Circular infinite', () => {
    it('does not render percent label', () => {
      render(<ProgressBar variant="circular" isInfinite />);
      expect(screen.getByTestId('progress-circle')).toBeTruthy();
      expect(screen.queryByText(/\d+%/)).toBeNull();
    });
  });
});
