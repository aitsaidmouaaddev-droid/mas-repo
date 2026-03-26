import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LocalePicker from './LocalePicker';

function createI18n(lng = 'en', supportedLngs = ['en', 'fr', 'es']) {
  const instance = i18next.createInstance();
  const resources = Object.fromEntries(supportedLngs.map((l) => [l, { translation: {} }]));
  instance.use(initReactI18next).init({
    lng,
    supportedLngs,
    resources,
    interpolation: { escapeValue: false },
  });
  return instance;
}

const meta: Meta<typeof LocalePicker> = {
  title: 'UI/LocalePicker',
  component: LocalePicker,
  argTypes: {
    display: {
      control: 'select',
      options: ['flag', 'label', 'code', 'flag-label', 'flag-code', 'full'],
    },
    menuPosition: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right'],
    },
    flagSize: { control: { type: 'range', min: 12, max: 32, step: 2 } },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={createI18n()}>
        <Story />
      </I18nextProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof LocalePicker>;

export const FlagAndLabel: Story = {
  args: { display: 'flag-label' },
};

export const FlagOnly: Story = {
  args: { display: 'flag' },
};

export const LabelOnly: Story = {
  args: { display: 'label' },
};

export const CodeOnly: Story = {
  args: { display: 'code' },
};

export const FlagAndCode: Story = {
  args: { display: 'flag-code' },
};

export const Full: Story = {
  args: { display: 'full' },
};

export const ManyLocales: Story = {
  args: { display: 'flag-label' },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={createI18n('en', ['en', 'fr', 'es', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'])}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export const FrenchActive: Story = {
  args: { display: 'flag-label' },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={createI18n('fr')}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export const BareFlag: Story = {
  args: { display: 'flag', bare: true },
};

export const BareFlagLabel: Story = {
  args: { display: 'flag-label', bare: true },
};

export const MenuTop: Story = {
  args: { display: 'flag-label', menuPosition: 'top' },
  decorators: [
    (Story) => (
      <div style={{ marginTop: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const MenuRight: Story = {
  args: { display: 'flag', menuPosition: 'right', bare: true },
};

export const MenuLeft: Story = {
  args: { display: 'flag', menuPosition: 'left', bare: true },
  decorators: [
    (Story) => (
      <div style={{ marginLeft: 200 }}>
        <Story />
      </div>
    ),
  ],
};
