// Returns the message to show for an invalid login, or null when it's valid.
export function validateLogin(email: string, password: string): string | null {
  const trimmed = email.trim();
  if (trimmed === '') {
    return 'Email is required';
  }
  const at = trimmed.indexOf('@');
  if (at === -1 || at === trimmed.length - 1) {
    return 'Enter a valid email';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}
