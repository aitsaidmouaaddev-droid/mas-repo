import React from 'react';
import { render, screen } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
  it('renders label', () => {
    render(<InputField label="Email" testId="if" />);
    expect(screen.getByTestId('if')).toHaveTextContent('Email');
  });

  it('renders hint text', () => {
    render(<InputField hint="We won't share your email" testId="if" />);
    expect(screen.getByTestId('if')).toHaveTextContent("We won't share your email");
  });

  it('renders error text and hides hint', () => {
    render(<InputField hint="Hint" errorText="Required" testId="if" />);
    expect(screen.getByTestId('if')).toHaveTextContent('Required');
    expect(screen.getByTestId('if')).not.toHaveTextContent('Hint');
  });

  it('renders input element', () => {
    render(<InputField label="Name" testId="if" placeholder="Enter name" />);
    const input = screen.getByTestId('if').querySelector('input');
    expect(input).toBeInTheDocument();
  });
});
