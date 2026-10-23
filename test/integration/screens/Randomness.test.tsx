import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RandomnessScreen from '../../../src/screens/randomness/RandomnessScreen';

describe('RandomnessScreen', () => {
  afterEach(() => jest.restoreAllMocks());

  it('prompts before the first number', () => {
    const { getByTestId } = render(<RandomnessScreen />);
    expect(getByTestId('random-number-text')).toHaveTextContent('Press the button');
  });

  it('shows 1 at the bottom of the range', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const { getByTestId } = render(<RandomnessScreen />);
    fireEvent.press(getByTestId('generate-random-number-button'));
    expect(getByTestId('random-number-text')).toHaveTextContent('Random number: 1');
  });

  it('shows 100 at the top of the range', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9999);
    const { getByTestId } = render(<RandomnessScreen />);
    fireEvent.press(getByTestId('generate-random-number-button'));
    expect(getByTestId('random-number-text')).toHaveTextContent('Random number: 100');
  });
});
