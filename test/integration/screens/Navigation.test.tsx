import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NavigationScreen from '../../../src/screens/navigation/NavigationScreen';

describe('NavigationScreen', () => {
  it('starts on the overview', () => {
    const { getByTestId, queryByTestId } = render(<NavigationScreen />);
    expect(getByTestId('nav-overview-text')).toHaveTextContent('Navigation overview');
    expect(queryByTestId('details-text')).toBeNull();
  });

  it('opens the details page and comes back', () => {
    const { getByTestId, queryByTestId } = render(<NavigationScreen />);
    fireEvent.press(getByTestId('open-details-button'));
    expect(getByTestId('details-text')).toHaveTextContent('Details page');
    expect(queryByTestId('nav-overview-text')).toBeNull();
    fireEvent.press(getByTestId('details-back-button'));
    expect(getByTestId('nav-overview-text')).toHaveTextContent('Navigation overview');
  });
});
