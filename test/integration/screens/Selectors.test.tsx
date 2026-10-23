import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectorsScreen from '../../../src/screens/selectors/SelectorsScreen';

describe('SelectorsScreen', () => {
  it('starts with nothing tapped', () => {
    const { getByTestId } = render(<SelectorsScreen />);
    expect(getByTestId('selectors-result')).toHaveTextContent('Last tapped: nothing');
  });

  it('reports the native button by id', () => {
    const { getByTestId } = render(<SelectorsScreen />);
    fireEvent.press(getByTestId('submit-button'));
    expect(getByTestId('selectors-result')).toHaveTextContent('Last tapped: button');
  });

  it('finds the label target by its accessibility label', () => {
    const { getByLabelText, getByTestId } = render(<SelectorsScreen />);
    fireEvent.press(getByLabelText('Accessible target'));
    expect(getByTestId('selectors-result')).toHaveTextContent('Last tapped: label');
  });

  it('reports the text target', () => {
    const { getByText, getByTestId } = render(<SelectorsScreen />);
    fireEvent.press(getByText('Tap me by text'));
    expect(getByTestId('selectors-result')).toHaveTextContent('Last tapped: text');
  });
});
