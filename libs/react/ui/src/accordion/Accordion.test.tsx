import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

const items = [
  { key: 'a', title: 'Section A', content: <p>Content A</p> },
  { key: 'b', title: 'Section B', content: <p>Content B</p> },
];

describe('Accordion', () => {
  it('renders all headers', () => {
    render(<Accordion items={items} testId="acc" />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });

  it('opens section on click', () => {
    render(<Accordion items={items} testId="acc" />);
    fireEvent.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('closes section on second click', () => {
    render(<Accordion items={items} testId="acc" />);
    fireEvent.click(screen.getByText('Section A'));
    fireEvent.click(screen.getByText('Section A'));
    expect(screen.queryByText('Content A')).toBeNull();
  });

  it('single mode closes other sections', () => {
    render(<Accordion items={items} testId="acc" />);
    fireEvent.click(screen.getByText('Section A'));
    fireEvent.click(screen.getByText('Section B'));
    expect(screen.queryByText('Content A')).toBeNull();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('multiple mode keeps sections open', () => {
    render(<Accordion items={items} multiple testId="acc" />);
    fireEvent.click(screen.getByText('Section A'));
    fireEvent.click(screen.getByText('Section B'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });
});
