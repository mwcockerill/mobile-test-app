import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CounterScreen from '../../../src/screens/counter/CounterScreen';

describe('CounterScreen', () => {
  it('starts at zero', () => {
    const { getByTestId } = render(<CounterScreen />);
    expect(getByTestId('count-text')).toHaveTextContent('Count: 0');
  });

  it('increments, decrements below zero, and resets', () => {
    const { getByTestId } = render(<CounterScreen />);
    for (let i = 0; i < 3; i++) {
      fireEvent.press(getByTestId('increment-button'));
    }
    expect(getByTestId('count-text')).toHaveTextContent('Count: 3');
    for (let i = 0; i < 5; i++) {
      fireEvent.press(getByTestId('decrement-button'));
    }
    expect(getByTestId('count-text')).toHaveTextContent('Count: -2');
    fireEvent.press(getByTestId('reset-button'));
    expect(getByTestId('count-text')).toHaveTextContent('Count: 0');
  });

  it('shows button titles exactly as written', () => {
    const { getByTestId } = render(<CounterScreen />);
    expect(getByTestId('increment-button')).toHaveTextContent('+');
    expect(getByTestId('decrement-button')).toHaveTextContent('-');
    expect(getByTestId('reset-button')).toHaveTextContent('Reset');
  });
});
