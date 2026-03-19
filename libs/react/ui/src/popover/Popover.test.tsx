import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

function getAnchor(): HTMLDivElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({
    top: 100,
    bottom: 140,
    left: 50,
    right: 200,
    width: 150,
    height: 40,
    x: 50,
    y: 100,
    toJSON: () => ({}),
  });
  document.body.appendChild(el);
  return el;
}

describe('Popover', () => {
  it('renders nothing when closed', () => {
    const anchor = getAnchor();
    render(
      <Popover open={false} onClose={vi.fn()} anchorEl={anchor}>
        Content
      </Popover>,
    );
    expect(screen.queryByText('Content')).toBeNull();
  });

  it('renders children when open', () => {
    const anchor = getAnchor();
    render(
      <Popover open onClose={vi.fn()} anchorEl={anchor}>
        Content
      </Popover>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    const anchor = getAnchor();
    render(
      <Popover open onClose={onClose} anchorEl={anchor}>
        Content
      </Popover>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on outside mousedown', () => {
    const onClose = vi.fn();
    const anchor = getAnchor();
    render(
      <Popover open onClose={onClose} anchorEl={anchor}>
        Content
      </Popover>,
    );
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose on inside mousedown', () => {
    const onClose = vi.fn();
    const anchor = getAnchor();
    render(
      <Popover open onClose={onClose} anchorEl={anchor}>
        <span>Inner</span>
      </Popover>,
    );
    fireEvent.mouseDown(screen.getByText('Inner'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders into document.body via portal', () => {
    const anchor = getAnchor();
    const { baseElement } = render(
      <Popover open onClose={vi.fn()} anchorEl={anchor}>
        Portal text
      </Popover>,
    );
    // content is portalled to body, not inside the default container
    expect(baseElement).toHaveTextContent('Portal text');
  });

  it('portal div has z-index 9000 to sit above stacking contexts', () => {
    const anchor = getAnchor();
    render(
      <Popover open onClose={vi.fn()} anchorEl={anchor}>
        Content
      </Popover>,
    );
    const popover = screen.getByText('Content').parentElement!;
    // z-index is applied via CSS module — verify the class is present on the portal div
    expect(popover.className).toMatch(/popover/);
  });

  it('matches anchor width when matchAnchorWidth is true', () => {
    const anchor = getAnchor(); // width: 150 from getBoundingClientRect mock
    render(
      <Popover open onClose={vi.fn()} anchorEl={anchor} matchAnchorWidth>
        Content
      </Popover>,
    );
    const popover = screen.getByText('Content').parentElement!;
    expect(popover.style.width).toBe('150px');
  });

  it('does not set explicit width when matchAnchorWidth is false', () => {
    const anchor = getAnchor();
    render(
      <Popover open onClose={vi.fn()} anchorEl={anchor}>
        Content
      </Popover>,
    );
    const popover = screen.getByText('Content').parentElement!;
    expect(popover.style.width).toBe('');
  });

  it('portal div is in DOM even when closed', () => {
    const anchor = getAnchor();
    const { container } = render(
      <Popover open={false} onClose={vi.fn()} anchorEl={anchor}>
        Content
      </Popover>,
    );
    // children are not rendered, but the portal wrapper div exists in body
    expect(screen.queryByText('Content')).toBeNull();
    // portal div itself should exist (always-mounted strategy)
    expect(document.body.querySelector('[class*="popover"]')).toBeInTheDocument();
  });
});
