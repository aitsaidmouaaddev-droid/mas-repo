import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer, useToast } from './Toast';
import Button from '../button/Button';

const meta: Meta<typeof ToastContainer> = { title: 'UI/Toast', component: ToastContainer };
export default meta;
type Story = StoryObj<typeof ToastContainer>;

const ToastDemo = () => {
  const { toasts, add, dismiss } = useToast();
  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button label="Info" onClick={() => add({ message: 'Info toast', variant: 'info' })} />
        <Button
          label="Success"
          variant="secondary"
          onClick={() => add({ message: 'Success!', variant: 'success' })}
        />
        <Button
          label="Error"
          variant="danger"
          onClick={() => add({ message: 'Error occurred', variant: 'error' })}
        />
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export const Interactive: Story = {
  render: () => <ToastDemo />,
};

export const Variants: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { toasts, add, dismiss } = useToast();
    return (
      <>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button label="Info" onClick={() => add({ message: 'Info toast', variant: 'info' })} />
          <Button variant="secondary" label="Success" onClick={() => add({ message: 'Success toast', variant: 'success' })} />
          <Button variant="warning" label="Warning" onClick={() => add({ message: 'Warning toast', variant: 'warning' })} />
          <Button variant="danger" label="Error" onClick={() => add({ message: 'Error toast', variant: 'error' })} />
        </div>
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  },
};
