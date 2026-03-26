import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TestResultsSidebar from './TestResultsSidebar';
import type { TestSidebarResult } from './TestResultsSidebar';

const allPassedResult: TestSidebarResult = {
  passed: 3,
  failed: 0,
  tests: [
    { title: 'test one', status: 'passed', failureMessages: [] },
    { title: 'test two', status: 'passed', failureMessages: [] },
    { title: 'test three', status: 'passed', failureMessages: [] },
  ],
};

const mixedResult: TestSidebarResult = {
  passed: 2,
  failed: 1,
  tests: [
    { title: 'test one', status: 'passed', failureMessages: [] },
    { title: 'test two', status: 'passed', failureMessages: [] },
    { title: 'test three', status: 'failed', failureMessages: ['Expected true to be false'] },
  ],
};

describe('TestResultsSidebar', () => {
  it('returns null when no result and not running', () => {
    const { container } = render(<TestResultsSidebar result={null} running={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders sidebar when running', () => {
    const { container } = render(<TestResultsSidebar result={null} running />);
    expect(container.firstChild).not.toBeNull();
  });

  it('shows passed/failed counts when expanded', () => {
    render(<TestResultsSidebar result={allPassedResult} />);

    // Click toggle to expand
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows individual test results when expanded', () => {
    render(<TestResultsSidebar result={allPassedResult} />);

    fireEvent.click(screen.getByRole('button', { name: /expand/i }));

    expect(screen.getByText('test one')).toBeInTheDocument();
    expect(screen.getByText('test two')).toBeInTheDocument();
    expect(screen.getByText('test three')).toBeInTheDocument();
  });

  it('shows failure messages for failed tests', () => {
    render(<TestResultsSidebar result={mixedResult} />);

    fireEvent.click(screen.getByRole('button', { name: /expand/i }));

    expect(screen.getByText('Expected true to be false')).toBeInTheDocument();
  });
});
