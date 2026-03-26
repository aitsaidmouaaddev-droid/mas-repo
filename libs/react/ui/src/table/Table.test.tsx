import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age' },
];
const data = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
];

describe('Table', () => {
  it('renders headers', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty text when no data', () => {
    render(<Table columns={columns} data={[]} rowKey={() => 0} emptyText="Nothing" />);
    expect(screen.getByText('Nothing')).toBeInTheDocument();
  });

  it('sorts by column when clicked', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    fireEvent.click(screen.getByText('Name'));
    const cells = screen.getAllByRole('cell');
    // first data cell should be Alice (asc)
    expect(cells[0].textContent).toBe('Alice');
  });

  it('applies testId', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} testId="tbl" />);
    expect(screen.getByTestId('tbl')).toBeInTheDocument();
  });
});
