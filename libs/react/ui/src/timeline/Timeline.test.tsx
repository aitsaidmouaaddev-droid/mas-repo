import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Timeline from './Timeline';

const basicItems = [
  { title: 'Senior Developer', subtitle: '2021 - Present', location: 'Acme, Paris' },
  { title: 'Junior Developer', subtitle: '2019 - 2021', location: 'Startup, Lyon' },
];

describe('Timeline', () => {
  it('renders all item titles', () => {
    render(<Timeline items={basicItems} testId="tl" />);
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
  });

  it('renders subtitle and location if provided', () => {
    render(<Timeline items={basicItems} testId="tl" />);
    expect(screen.getByText('2021 - Present')).toBeInTheDocument();
    expect(screen.getByText('Acme, Paris')).toBeInTheDocument();
  });

  it('renders bullets', () => {
    const items = [{ title: 'Role', bullets: ['Led team of 5', 'Shipped v2.0'] }];
    render(<Timeline items={items} testId="tl" />);
    expect(screen.getByText('Led team of 5')).toBeInTheDocument();
    expect(screen.getByText('Shipped v2.0')).toBeInTheDocument();
  });

  it('renders sub-item toggle buttons', () => {
    const items = [
      {
        title: 'Consultant',
        subItems: [{ title: 'Mission A' }, { title: 'Mission B' }],
      },
    ];
    render(<Timeline items={items} testId="tl" />);
    expect(screen.getByText('Mission A')).toBeInTheDocument();
    expect(screen.getByText('Mission B')).toBeInTheDocument();
  });

  it('expands sub-item on click and shows description', () => {
    const items = [
      {
        title: 'Consultant',
        subItems: [{ title: 'Mission A', description: 'Built the API layer' }],
      },
    ];
    render(<Timeline items={items} testId="tl" />);

    expect(screen.queryByText('Built the API layer')).toBeNull();

    fireEvent.click(screen.getByText('Mission A'));
    expect(screen.getByText('Built the API layer')).toBeInTheDocument();
  });

  it('collapses sub-item on second click', () => {
    const items = [
      {
        title: 'Consultant',
        subItems: [{ title: 'Mission A', description: 'Built the API layer' }],
      },
    ];
    render(<Timeline items={items} testId="tl" />);

    fireEvent.click(screen.getByText('Mission A'));
    expect(screen.getByText('Built the API layer')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mission A'));
    expect(screen.queryByText('Built the API layer')).toBeNull();
  });
});
