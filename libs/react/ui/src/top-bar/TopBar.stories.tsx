import type { Meta, StoryObj } from '@storybook/react';
import TopBar from './TopBar';
import { FiHome, FiUser, FiSun, FiMoon, FiGlobe } from 'react-icons/fi';

const meta: Meta<typeof TopBar> = {
  title: 'UI/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '200vh', background: 'var(--color-background, #111)' }}>
        <Story />
        <div style={{ padding: '120px 24px 24px' }}>
          <p style={{ color: 'var(--color-text, #fff)' }}>
            Scroll down to see the TopBar shrink.
          </p>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ color: 'var(--color-muted-text, #888)', padding: '12px 0' }}>
              Content line {i + 1}
            </p>
          ))}
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopBar>;

const Logo = () => (
  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text, #fff)' }}>
    MyApp
  </span>
);

const NavLinks = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    {['About', 'Projects', 'Contact'].map((label) => (
      <button
        key={label}
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-muted-text, #aaa)',
          cursor: 'pointer',
          fontSize: 14,
          fontFamily: 'inherit',
        }}
      >
        {label}
      </button>
    ))}
  </div>
);

const Actions = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <FiGlobe size={18} color="var(--color-muted-text, #aaa)" />
    <FiSun size={18} color="var(--color-muted-text, #aaa)" />
  </div>
);

export const Default: Story = {
  args: {
    left: <Logo />,
    center: <NavLinks />,
    right: <Actions />,
    testId: 'topbar',
  },
};

export const ShrinkOnScroll: Story = {
  args: {
    left: <Logo />,
    center: <NavLinks />,
    right: <Actions />,
    shrinkOnScroll: true,
    expandedHeight: 80,
    compactHeight: 56,
    scrollThreshold: 40,
    testId: 'topbar',
  },
};

export const LeftAndRightOnly: Story = {
  args: {
    left: <Logo />,
    right: <Actions />,
    shrinkOnScroll: true,
    testId: 'topbar',
  },
};

export const CustomHeights: Story = {
  args: {
    left: <Logo />,
    center: <NavLinks />,
    right: <Actions />,
    shrinkOnScroll: true,
    expandedHeight: 100,
    compactHeight: 48,
    scrollThreshold: 60,
    testId: 'topbar',
  },
};
