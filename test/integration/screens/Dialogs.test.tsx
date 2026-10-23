import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, AlertButton } from 'react-native';
import DialogsScreen from '../../../src/screens/dialogs/DialogsScreen';

describe('DialogsScreen', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => jest.restoreAllMocks());

  it('asks a maths question with a right and a wrong answer', () => {
    const { getByTestId } = render(<DialogsScreen />);
    fireEvent.press(getByTestId('math-problem-button'));
    expect(alertSpy).toHaveBeenCalledWith('Math Challenge', 'What is 6 + 6?', [
      expect.objectContaining({ text: '12' }),
      expect.objectContaining({ text: '13' }),
    ]);
  });

  it('confirms the right answer and rejects the wrong one', () => {
    const { getByTestId } = render(<DialogsScreen />);
    fireEvent.press(getByTestId('math-problem-button'));
    const buttons: AlertButton[] = alertSpy.mock.calls[0][2];
    buttons[0].onPress?.();
    expect(alertSpy).toHaveBeenLastCalledWith('Correct!', 'Well done!');
    buttons[1].onPress?.();
    expect(alertSpy).toHaveBeenLastCalledWith('Try again!', "That's not quite right.");
  });

  it('shows a colour mood', () => {
    const { getByTestId } = render(<DialogsScreen />);
    fireEvent.press(getByTestId('color-mood-button'));
    expect(alertSpy).toHaveBeenCalledWith('Your Color Mood', '💚 Green - Peaceful');
  });
});
