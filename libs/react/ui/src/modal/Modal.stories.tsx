import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Modal, { ModalWithSkeleton } from './Modal';
import Button from '../button/Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
};
export default meta;
type Story = StoryObj<typeof Modal>;

const ModalDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Open Modal" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button label="Cancel" variant="ghost" onClick={() => setOpen(false)} />
            <Button label="Confirm" onClick={() => setOpen(false)} />
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Skeleton: Story = {
  render: () => (
    <ModalWithSkeleton loading open onClose={() => {return;}} title="Loading..." footer={null}>
      <p />
    </ModalWithSkeleton>
  ),
};
