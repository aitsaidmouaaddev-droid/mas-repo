import type { Meta, StoryObj } from '@storybook/react';
import Table, { TableWithSkeleton } from './Table';

const meta: Meta<typeof Table> = { title: 'Organisms/Table', component: Table };
export default meta;
type Story = StoryObj<typeof Table>;

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'age', header: 'Age', sortable: true },
];

const data = [
  { id: 1, name: 'Alice', role: 'Engineer', age: 30 },
  { id: 2, name: 'Bob', role: 'Designer', age: 25 },
  { id: 3, name: 'Charlie', role: 'PM', age: 35 },
];

export const Default: Story = {
  args: { columns, data, rowKey: (row: unknown) => (row as { id: number }).id },
};

export const Exemple: Story = {
  args: { columns, data: [], rowKey: (_row: unknown) => 0, emptyText: 'No records found' },
};

export const Skeleton: Story = {
  render: () => <TableWithSkeleton loading columns={columns} data={[]} rowKey={() => ''} />,
};
