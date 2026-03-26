/* eslint-disable react-hooks/rules-of-hooks */


import type { Meta, StoryObj } from '@storybook/react';
import Form, { FormWithSkeleton } from './Form';
import InputField from '../input-field/InputField';
import Select from '../select/Select';
import Checkbox from '../checkbox/Checkbox';
import Radio from '../radio/Radio';
import Button from '../button/Button';
import { useState } from 'react';

const meta: Meta<typeof Form> = { title: 'Organisms/Form', component: Form };
export default meta;
type Story = StoryObj<typeof Form>;

export const AllControls: Story = {
  render: () => {
    const [gender, setGender] = useState('');
    const [newsletter, setNewsletter] = useState(false);
    const [terms, setTerms] = useState(false);
    const [contact, setContact] = useState('email');
    return (
      <Form
        actions={
          <>
            <Button type="submit" label="Submit" variant="primary" />
            <Button type="reset" label="Reset" variant="secondary" style={{ marginLeft: 8 }} />
          </>
        }
        onSubmit={e => { e.preventDefault(); alert('Submitted!'); }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
          <InputField name="name" label="Name" placeholder="Enter your name" required />
          <InputField name="email" label="Email" placeholder="Enter your email" type="email" required />
          <InputField name="password" label="Password" placeholder="Password" type="password" required />
          <InputField name="age" label="Age" type="number" min={0} max={120} />
          <Select
            options={[
              { label: 'Select...', value: '' },
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            value={gender}
            onSelect={value => setGender(String(value))}
            placeholder="Gender"
          />
          <InputField name="bio" label="Bio" placeholder="Tell us about yourself" />
          <fieldset style={{ border: '1px solid #ccc', padding: 8 }}>
            <legend>Preferences</legend>
            <Checkbox
              checked={newsletter}
              onChange={setNewsletter}
              label="Subscribe to newsletter"
              name="newsletter"
            />
            <Checkbox
              checked={terms}
              onChange={setTerms}
              label="Accept terms and conditions"
              name="terms"
              required
            />
          </fieldset>
          <fieldset style={{ border: '1px solid #ccc', padding: 8 }}>
            <legend>Contact Method</legend>
            <Radio
              selected={contact === 'email'}
              onChange={() => setContact('email')}
              value="email"
              label="Email"
              name="contact"
            />
            <Radio
              selected={contact === 'phone'}
              onChange={() => setContact('phone')}
              value="phone"
              label="Phone"
              name="contact"
            />
          </fieldset>
        </div>
      </Form>
    );
  },
};

export const Skeleton: Story = {
  render: () => <FormWithSkeleton loading>{null}</FormWithSkeleton>,
};
