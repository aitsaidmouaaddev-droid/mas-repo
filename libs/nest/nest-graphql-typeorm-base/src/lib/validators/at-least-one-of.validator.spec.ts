import 'reflect-metadata';
import { validate } from 'class-validator';
import { AtLeastOneOf } from './at-least-one-of.validator';

class TestInput {
  @AtLeastOneOf(['email', 'identityName'])
  email?: string;
  identityName?: string;
}

async function run(data: Partial<TestInput>) {
  const input = Object.assign(new TestInput(), data);
  return validate(input);
}

describe('AtLeastOneOf', () => {
  it('passes when only email is provided', async () => {
    expect(await run({ email: 'a@b.com' })).toHaveLength(0);
  });

  it('passes when only identityName is provided', async () => {
    expect(await run({ identityName: 'alice' })).toHaveLength(0);
  });

  it('passes when both are provided', async () => {
    expect(await run({ email: 'a@b.com', identityName: 'alice' })).toHaveLength(0);
  });

  it('fails when neither is provided', async () => {
    const errors = await run({});
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.['atLeastOneOf']).toContain('email');
    expect(errors[0].constraints?.['atLeastOneOf']).toContain('identityName');
  });

  it('fails when both are empty strings', async () => {
    expect(await run({ email: '', identityName: '' })).toHaveLength(1);
  });
});
