import type { Meta, StoryObj } from '@storybook/react';
import Form from './Form';

const meta: Meta<typeof Form> = { title: 'Organisms/Form', component: Form };
export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    children: (
      <>
        <label>
          Name <input />
        </label>
        <label>
          Email <input type="email" />
        </label>
      </>
    ),
    actions: <button type="submit">Submit</button>,
  },
};
