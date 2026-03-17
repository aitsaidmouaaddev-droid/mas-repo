import React from 'react';
import { render, screen } from '@testing-library/react';
import { FiCheck, FiStar } from 'react-icons/fi';
import Icon from './Icon';

describe('Icon', () => {
  it('renders a vector icon with correct size', () => {
    render(<Icon type="vector" icon={FiCheck} size={32} testId="my-icon" />);
    const el = screen.getByTestId('my-icon');
    expect(el).toBeTruthy();
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders an SVG child', () => {
    render(<Icon type="svg" svg={<svg data-testid="custom-svg" />} testId="svg-container" />);
    expect(screen.getByTestId('svg-container')).toBeTruthy();
    expect(screen.getByTestId('custom-svg')).toBeTruthy();
  });

  it('applies custom color via style', () => {
    render(<Icon type="vector" icon={FiStar} color="red" testId="color-icon" />);
    const el = screen.getByTestId('color-icon');
    expect(el.style.color).toBe('red');
  });

  it('defaults size to 20', () => {
    render(<Icon type="vector" icon={FiCheck} testId="default-icon" />);
    const el = screen.getByTestId('default-icon');
    expect(el.style.fontSize).toBe('20px');
  });
});
