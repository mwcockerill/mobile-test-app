import { validateLogin } from '../../src/screens/forms/validateLogin';

describe('validateLogin', () => {
  it('requires an email', () => {
    expect(validateLogin('', 'password123')).toBe('Email is required');
    expect(validateLogin('   ', 'password123')).toBe('Email is required');
  });

  it('rejects an email without @ or with nothing after it', () => {
    expect(validateLogin('tester', 'password123')).toBe('Enter a valid email');
    expect(validateLogin('tester@', 'password123')).toBe('Enter a valid email');
  });

  it('requires a password of at least 8 characters', () => {
    expect(validateLogin('tester@example.com', 'short')).toBe(
      'Password must be at least 8 characters',
    );
  });

  it('accepts a valid login, ignoring spaces around the email', () => {
    expect(validateLogin(' tester@example.com ', 'password123')).toBeNull();
  });
});
