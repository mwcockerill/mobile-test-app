import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';
import { generateRandomNumber } from '../../utils';

export default function RandomnessScreen(): React.JSX.Element {
  const theme = useTheme();
  const [value, setValue] = useState<number | null>(null);
  return (
    <View>
      <Text testID="random-number-text" style={[styles.value, { color: theme.text }]}>
        {value === null ? 'Press the button' : `Random number: ${value}`}
      </Text>
      <PracticeButton
        title="Generate Random Number"
        testID="generate-random-number-button"
        onPress={() => setValue(generateRandomNumber())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  value: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
});
