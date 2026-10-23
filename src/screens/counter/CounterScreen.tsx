import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';

export default function CounterScreen(): React.JSX.Element {
  const theme = useTheme();
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text testID="count-text" style={[styles.count, { color: theme.text }]}>
        {`Count: ${count}`}
      </Text>
      <View style={styles.row}>
        <PracticeButton title="+" testID="increment-button" onPress={() => setCount(count + 1)} />
        <PracticeButton title="Reset" testID="reset-button" onPress={() => setCount(0)} />
        <PracticeButton title="-" testID="decrement-button" onPress={() => setCount(count - 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
});
