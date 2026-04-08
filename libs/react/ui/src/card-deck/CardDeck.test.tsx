import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CardDeck from './CardDeck';
import type { CardDeckItem } from './CardDeck';

const ITEMS: CardDeckItem[] = [
  { key: 'a', image: '/a.png', title: 'Card A' },
  { key: 'b', image: '/b.png', title: 'Card B' },
  { key: 'c', image: '/c.png', title: 'Card C' },
];

describe('CardDeck', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders the top card image and title', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const imgs = screen.getAllByRole('img');
    expect(imgs[imgs.length - 1]).toHaveAttribute('alt', 'Card A');
    expect(screen.getAllByText('Card A').length).toBeGreaterThan(0);
  });

  it('renders a dot per item', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
  });

  it('first dot is active (aria-selected=true)', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    expect(dots[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('advances to next card when top card is clicked', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const topCard = screen.getByRole('button');
    fireEvent.click(topCard);

    act(() => jest.advanceTimersByTime(500));

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('jumps to a specific card when its dot is clicked', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const dots = screen.getAllByRole('tab');
    fireEvent.click(dots[2]);

    act(() => jest.advanceTimersByTime(500));

    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not render dots for a single item', () => {
    render(<CardDeck items={[ITEMS[0]]} testId="deck" />);
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it('autoplay advances the card after the interval', () => {
    render(<CardDeck items={ITEMS} autoplay autoplayInterval={1000} testId="deck" />);

    act(() => jest.advanceTimersByTime(1000 + 500));

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('loops back to first card after last', () => {
    render(<CardDeck items={ITEMS} testId="deck" />);
    const topCard = () => screen.getByRole('button');

    // advance twice to reach last card
    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));
    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));

    const dots = screen.getAllByRole('tab');
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');

    // advance once more — should loop to index 0
    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));

    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not loop when loop=false and at last card', () => {
    render(<CardDeck items={ITEMS} loop={false} testId="deck" />);
    const topCard = () => screen.getByRole('button');

    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));
    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));

    const dots = screen.getAllByRole('tab');
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');

    // Should NOT advance further
    fireEvent.click(topCard());
    act(() => jest.advanceTimersByTime(500));
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('applies testId to root element', () => {
    render(<CardDeck items={ITEMS} testId="my-deck" />);
    expect(screen.getByTestId('my-deck')).toBeInTheDocument();
  });
});
