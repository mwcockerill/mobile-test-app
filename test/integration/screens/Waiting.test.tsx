import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import WaitingScreen, { LOAD_DELAY_MS } from '../../../src/screens/waiting/WaitingScreen';

describe('WaitingScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('waits three seconds before showing the data', () => {
    expect(LOAD_DELAY_MS).toBe(3000);
  });

  it('shows Loading… then Data loaded after the delay', () => {
    const { getByTestId, queryByTestId } = render(<WaitingScreen />);
    fireEvent.press(getByTestId('load-button'));
    expect(getByTestId('loading-text')).toHaveTextContent('Loading…');
    act(() => jest.advanceTimersByTime(LOAD_DELAY_MS - 1));
    expect(queryByTestId('loaded-text')).toBeNull();
    act(() => jest.advanceTimersByTime(1));
    expect(getByTestId('loaded-text')).toHaveTextContent('Data loaded');
    expect(queryByTestId('loading-text')).toBeNull();
  });

  it('does not update after leaving the screen mid-load', () => {
    const errorSpy = jest.spyOn(console, 'error');
    const { getByTestId, unmount } = render(<WaitingScreen />);
    fireEvent.press(getByTestId('load-button'));
    unmount();
    expect(jest.getTimerCount()).toBe(0);
    act(() => jest.advanceTimersByTime(LOAD_DELAY_MS));
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('starts fresh when reopened', () => {
    const first = render(<WaitingScreen />);
    fireEvent.press(first.getByTestId('load-button'));
    first.unmount();
    const { getByTestId, queryByTestId } = render(<WaitingScreen />);
    expect(getByTestId('load-button')).toBeTruthy();
    expect(queryByTestId('loading-text')).toBeNull();
    expect(queryByTestId('loaded-text')).toBeNull();
  });
});
