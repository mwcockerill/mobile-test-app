import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ListsScreen from '../../../src/screens/lists/ListsScreen';

describe('ListsScreen', () => {
  it('starts with nothing selected and renders the first row', () => {
    const { getByTestId } = render(<ListsScreen />);
    expect(getByTestId('list-selection')).toHaveTextContent('Selected: none');
    expect(getByTestId('list-item-1')).toHaveTextContent('Item 1');
  });

  it('selects a tapped row', () => {
    const { getByTestId } = render(<ListsScreen />);
    fireEvent.press(getByTestId('list-item-3'));
    expect(getByTestId('list-selection')).toHaveTextContent('Selected: Item 3');
  });
});
