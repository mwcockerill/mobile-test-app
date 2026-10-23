import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import FormsScreen from '../../../src/screens/forms/FormsScreen';

describe('FormsScreen', () => {
  it('shows a validation message when submitted empty', () => {
    const { getByTestId } = render(<FormsScreen />);
    fireEvent.press(getByTestId('login-button'));
    expect(getByTestId('login-message')).toHaveTextContent('Email is required');
  });

  it('shows the password message for a short password', () => {
    const { getByTestId } = render(<FormsScreen />);
    fireEvent.changeText(getByTestId('email-input'), 'tester@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'short');
    fireEvent.press(getByTestId('login-button'));
    expect(getByTestId('login-message')).toHaveTextContent(
      'Password must be at least 8 characters',
    );
  });

  it('welcomes a valid user using the trimmed email', () => {
    const { getByTestId } = render(<FormsScreen />);
    fireEvent.changeText(getByTestId('email-input'), ' tester@example.com ');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));
    expect(getByTestId('login-message')).toHaveTextContent(
      'Welcome, tester@example.com!',
    );
  });

  it('lets the first tap through while the keyboard is open', () => {
    const { UNSAFE_getByType } = render(<FormsScreen />);
    expect(UNSAFE_getByType(ScrollView).props.keyboardShouldPersistTaps).toBe(
      'handled',
    );
  });
});
