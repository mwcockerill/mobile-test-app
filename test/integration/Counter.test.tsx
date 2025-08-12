import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

// Mock useColorScheme
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

// Counter component extracted for testing
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function CounterSection(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [count, setCount] = useState(0);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? Colors.white : Colors.black },
        ]}
      >
        📝 Counter App
      </Text>
      <Text
        style={[
          styles.counterText,
          { color: isDarkMode ? Colors.white : Colors.black },
        ]}
        testID="counter-display"
      >
        Count: {count}
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title="+"
          onPress={() => setCount(count + 1)}
          testID="increment-button"
        />
        <Button
          title="Reset"
          onPress={() => setCount(0)}
          testID="reset-button"
        />
        <Button
          title="-"
          onPress={() => setCount(count - 1)}
          testID="decrement-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});

describe('Counter Integration Tests', () => {
  const mockUseColorScheme = useColorScheme as jest.MockedFunction<
    typeof useColorScheme
  >;

  beforeEach(() => {
    mockUseColorScheme.mockReturnValue('light');
  });

  it('starts with count of 0', () => {
    const { getByTestId } = render(<CounterSection />);
    expect(getByTestId('counter-display')).toHaveTextContent('Count: 0');
  });

  it('increments count when + button is pressed', () => {
    const { getByTestId } = render(<CounterSection />);

    const incrementButton = getByTestId('increment-button');
    const counterDisplay = getByTestId('counter-display');

    fireEvent.press(incrementButton);
    expect(counterDisplay).toHaveTextContent('Count: 1');

    fireEvent.press(incrementButton);
    expect(counterDisplay).toHaveTextContent('Count: 2');
  });

  it('decrements count when - button is pressed', () => {
    const { getByTestId } = render(<CounterSection />);

    const decrementButton = getByTestId('decrement-button');
    const incrementButton = getByTestId('increment-button');
    const counterDisplay = getByTestId('counter-display');

    // First increment to 2
    fireEvent.press(incrementButton);
    fireEvent.press(incrementButton);
    expect(counterDisplay).toHaveTextContent('Count: 2');

    // Then decrement
    fireEvent.press(decrementButton);
    expect(counterDisplay).toHaveTextContent('Count: 1');
  });

  it('resets count to 0 when Reset button is pressed', () => {
    const { getByTestId } = render(<CounterSection />);

    const incrementButton = getByTestId('increment-button');
    const resetButton = getByTestId('reset-button');
    const counterDisplay = getByTestId('counter-display');

    // Increment to 5
    for (let i = 0; i < 5; i++) {
      fireEvent.press(incrementButton);
    }
    expect(counterDisplay).toHaveTextContent('Count: 5');

    // Reset
    fireEvent.press(resetButton);
    expect(counterDisplay).toHaveTextContent('Count: 0');
  });

  it('handles negative numbers', () => {
    const { getByTestId } = render(<CounterSection />);

    const decrementButton = getByTestId('decrement-button');
    const counterDisplay = getByTestId('counter-display');

    fireEvent.press(decrementButton);
    expect(counterDisplay).toHaveTextContent('Count: -1');

    fireEvent.press(decrementButton);
    expect(counterDisplay).toHaveTextContent('Count: -2');
  });

  it('maintains count state through multiple interactions', () => {
    const { getByTestId } = render(<CounterSection />);

    const incrementButton = getByTestId('increment-button');
    const decrementButton = getByTestId('decrement-button');
    const resetButton = getByTestId('reset-button');
    const counterDisplay = getByTestId('counter-display');

    // Complex interaction sequence
    fireEvent.press(incrementButton); // 1
    fireEvent.press(incrementButton); // 2
    fireEvent.press(decrementButton); // 1
    fireEvent.press(incrementButton); // 2
    fireEvent.press(incrementButton); // 3

    expect(counterDisplay).toHaveTextContent('Count: 3');

    fireEvent.press(resetButton); // 0
    expect(counterDisplay).toHaveTextContent('Count: 0');
  });

  it('applies correct styling in dark mode', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { getByTestId } = render(<CounterSection />);

    const counterDisplay = getByTestId('counter-display');
    expect(counterDisplay.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.white })])
    );
  });

  it('applies correct styling in light mode', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { getByTestId } = render(<CounterSection />);

    const counterDisplay = getByTestId('counter-display');
    expect(counterDisplay.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.black })])
    );
  });
});
