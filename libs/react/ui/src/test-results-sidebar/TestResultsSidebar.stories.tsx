import type { Meta, StoryObj } from '@storybook/react';
import TestResultsSidebar from './TestResultsSidebar';

const meta: Meta<typeof TestResultsSidebar> = {
  title: 'UI/TestResultsSidebar',
  component: TestResultsSidebar,
};

export default meta;
type Story = StoryObj<typeof TestResultsSidebar>;

export const AllPassed: Story = {
  args: {
    result: {
      passed: 3,
      failed: 0,
      tests: [
        { title: 'renders correctly', status: 'passed', failureMessages: [] },
        { title: 'handles click events', status: 'passed', failureMessages: [] },
        { title: 'applies styles', status: 'passed', failureMessages: [] },
      ],
    },
  },
};

export const SomeFailed: Story = {
  args: {
    result: {
      passed: 2,
      failed: 1,
      tests: [
        { title: 'renders correctly', status: 'passed', failureMessages: [] },
        { title: 'handles click events', status: 'passed', failureMessages: [] },
        {
          title: 'validates input',
          status: 'failed',
          failureMessages: ['Expected value to be "hello" but received "world"'],
        },
      ],
    },
  },
};

export const Running: Story = {
  args: {
    result: null,
    running: true,
  },
};

export const NoResult: Story = {
  args: {
    result: null,
    running: false,
  },
};
