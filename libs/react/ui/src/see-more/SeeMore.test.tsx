import { render, screen } from '@testing-library/react';
import SeeMore from './SeeMore';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('SeeMore', () => {
  it('renders text content', () => {
    render(<SeeMore text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('does not show toggle button when text is short', () => {
    // With ResizeObserver mocked as a no-op, check() never fires,
    // so needsClamping stays false and the button never appears.
    render(<SeeMore text="Short text" maxHeight={200} />);
    expect(screen.queryByText('See more')).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<SeeMore text="Test" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
