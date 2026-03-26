import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LocalePicker from './LocalePicker';

function createI18n(lng = 'en') {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng,
    supportedLngs: ['en', 'fr', 'es'],
    resources: {
      en: { translation: {} },
      fr: { translation: {} },
      es: { translation: {} },
    },
    interpolation: { escapeValue: false },
  });
  return instance;
}

function renderPicker(props = {}, lng = 'en') {
  const instance = createI18n(lng);
  return {
    ...render(
      <I18nextProvider i18n={instance}>
        <LocalePicker testId="lp" {...props} />
      </I18nextProvider>,
    ),
    i18n: instance,
  };
}

describe('LocalePicker', () => {
  it('renders trigger button with current language', () => {
    renderPicker({}, 'fr');
    const trigger = screen.getByLabelText('Change language');
    expect(trigger.textContent).toContain('Français');
  });

  it('opens dropdown on trigger click', () => {
    renderPicker();
    fireEvent.click(screen.getByLabelText('Change language'));
    const listbox = screen.getByRole('listbox');
    expect(listbox.querySelectorAll('button')).toHaveLength(3);
  });

  it('changes language on item click', () => {
    const { i18n } = renderPicker();
    fireEvent.click(screen.getByLabelText('Change language'));
    const items = screen.getByRole('listbox').querySelectorAll('button');
    const esBtn = Array.from(items).find((b) => b.textContent?.includes('Español'));
    fireEvent.click(esBtn!);
    expect(i18n.language).toBe('es');
  });

  it('closes dropdown after selection', () => {
    renderPicker();
    fireEvent.click(screen.getByLabelText('Change language'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    const items = screen.getByRole('listbox').querySelectorAll('button');
    fireEvent.click(items[1]);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('marks current language as selected', () => {
    renderPicker({}, 'fr');
    fireEvent.click(screen.getByLabelText('Change language'));
    const items = screen.getByRole('listbox').querySelectorAll('button');
    const frBtn = Array.from(items).find((b) => b.textContent?.includes('Français'));
    expect(frBtn?.getAttribute('aria-selected')).toBe('true');
  });

  it('supports display="flag" mode (no text)', () => {
    renderPicker({ display: 'flag' });
    const trigger = screen.getByLabelText('Change language');
    // In flag-only mode, no label or code text — just the flag SVG
    expect(trigger.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(trigger.textContent?.trim()).toBe('');
  });

  it('supports display="code" mode', () => {
    renderPicker({ display: 'code' });
    const trigger = screen.getByLabelText('Change language');
    expect(trigger.textContent).toContain('EN');
  });

  it('closes on Escape key', () => {
    renderPicker();
    fireEvent.click(screen.getByLabelText('Change language'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('bare mode renders without button chrome', () => {
    renderPicker({ bare: true, display: 'flag' });
    const trigger = screen.getByLabelText('Change language');
    // bare trigger has no border/background — check it still opens dropdown
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
  });
});
