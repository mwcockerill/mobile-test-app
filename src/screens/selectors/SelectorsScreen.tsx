import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';

export default function SelectorsScreen(): React.JSX.Element {
  const theme = useTheme();
  const [lastTapped, setLastTapped] = useState('nothing');
  return (
    <View>
      <Text testID="selectors-result" style={[styles.result, { color: theme.text }]}>
        {`Last tapped: ${lastTapped}`}
      </Text>

      {/* Deliberately a native Button: Android shows its title as "SUBMIT". */}
      <View style={styles.target}>
        <Button title="Submit" testID="submit-button" onPress={() => setLastTapped('button')} />
      </View>

      <PracticeButton
        title="Find me by label"
        testID="label-target"
        accessibilityLabel="Accessible target"
        onPress={() => setLastTapped('label')}
      />

      <Text
        testID="text-target"
        onPress={() => setLastTapped('text')}
        style={[styles.text, { color: theme.accent }]}
      >
        Tap me by text
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  result: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  target: { marginVertical: 6 },
  text: { fontSize: 17, textAlign: 'center', paddingVertical: 12 },
});
