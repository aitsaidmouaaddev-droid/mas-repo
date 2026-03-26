import type { Meta, StoryObj } from '@storybook/react';
import Table, { TableWithSkeleton } from './Table';
import Avatar from '../avatar/Avatar';
import Badge from '../badge/Badge';
import Tag from '../tag/Tag';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import { FiMoreVertical } from 'react-icons/fi';

const meta: Meta<typeof Table> = { title: 'Organisms/Table', component: Table };
export default meta;
type Story = StoryObj<typeof Table>;

// ─── Simple story ────────────────────────────────────────────────────────────

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

// ─── Rich cells story ────────────────────────────────────────────────────────

type User = {
  id: number;
  name: string;
  email: string;
  role: 'Engineer' | 'Designer' | 'PM' | 'QA';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
};

const users: User[] = [
  { id: 1, name: 'Alice Martin', email: 'alice@mas.dev', role: 'Engineer', status: 'active' },
  { id: 2, name: 'Bob Dupont', email: 'bob@mas.dev', role: 'Designer', status: 'inactive' },
  { id: 3, name: 'Charlie Durand', email: 'charlie@mas.dev', role: 'PM', status: 'active' },
  { id: 4, name: 'Diana Prince', email: 'diana@mas.dev', role: 'QA', status: 'pending' },
];

const statusVariant: Record<User['status'], 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
};

const roleVariant: Record<User['role'], 'info' | 'success' | 'warning' | 'error'> = {
  Engineer: 'info',
  Designer: 'success',
  PM: 'warning',
  QA: 'error',
};

const richColumns = [
  {
    key: 'name',
    header: 'User',
    sortable: true,
    render: (row: User) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar
          initials={row.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
          size="sm"
          src={row.avatar}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
            {row.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted-text, #64748b)' }}>{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (row: User) => <Tag label={row.role} variant={roleVariant[row.role]} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: User) => (
      <Badge
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        variant={statusVariant[row.status]}
      />
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (row: User) => (
      <DropdownMenu
        trigger={
          <button
            aria-label="Actions"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted-text, #64748b)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 'var(--radius-sm, 6px)',
            }}
          >
            <FiMoreVertical size={16} />
          </button>
        }
        items={[
          { key: 'view', label: 'View profile', onClick: () => alert(`View ${row.name}`) },
          { key: 'edit', label: 'Edit', onClick: () => alert(`Edit ${row.name}`) },
          {
            key: 'deactivate',
            label: 'Deactivate',
            onClick: () => alert(`Deactivate ${row.name}`),
          },
        ]}
      />
    ),
  },
];

export const RichCells: Story = {
  render: () => <Table<User> columns={richColumns} data={users} rowKey={(row) => row.id} />,
};
