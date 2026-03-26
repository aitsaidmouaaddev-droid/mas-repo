import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';

describe('TopBar', () => {
  it('renders left, center, and right slots', () => {
    render(
      <TopBar
        left={<span>Logo</span>}
        center={<span>Nav</span>}
        right={<span>Actions</span>}
        testId="topbar"
      />,
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('does not render empty slots', () => {
    const { container } = render(<TopBar left={<span>Logo</span>} testId="topbar" />);
    const bar = screen.getByTestId('topbar');
    // Only left slot should be rendered (1 child div)
    expect(bar.children).toHaveLength(1);
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });

  it('starts in expanded state by default', () => {
    render(<TopBar left={<span>Logo</span>} shrinkOnScroll testId="topbar" />);
    const bar = screen.getByTestId('topbar');
    expect(bar).not.toHaveAttribute('data-compact');
  });

  it('enters compact state when scrolled past threshold', () => {
    render(
      <TopBar left={<span>Logo</span>} shrinkOnScroll scrollThreshold={20} testId="topbar" />,
    );
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    fireEvent.scroll(window);

    const bar = screen.getByTestId('topbar');
    expect(bar).toHaveAttribute('data-compact');
  });

  it('returns to expanded state when scrolled back to top', () => {
    render(
      <TopBar left={<span>Logo</span>} shrinkOnScroll scrollThreshold={20} testId="topbar" />,
    );
    // Scroll down
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('topbar')).toHaveAttribute('data-compact');

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('topbar')).not.toHaveAttribute('data-compact');
  });

  it('renders a spacer div with matching height', () => {
    const { container } = render(
      <TopBar left={<span>Logo</span>} expandedHeight={100} testId="topbar" />,
    );
    const spacer = container.querySelector('[aria-hidden]') as HTMLElement;
    expect(spacer).toHaveStyle({ height: '100px' });
  });

  it('does not toggle on scroll when shrinkOnScroll is false', () => {
    render(<TopBar left={<span>Logo</span>} testId="topbar" />);
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('topbar')).not.toHaveAttribute('data-compact');
  });
});
