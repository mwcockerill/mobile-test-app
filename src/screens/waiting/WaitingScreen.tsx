import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';

export const LOAD_DELAY_MS = 3000;

type Status = 'idle' | 'loading' | 'loaded';

export default function WaitingScreen(): React.JSX.Element {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('idle');

  // The timer belongs to the 'loading' state, so leaving the screen (or
  // finishing) clears it and nothing updates after unmount.
  useEffect(() => {
    if (status !== 'loading') {
      return;
    }
    const timer = setTimeout(() => setStatus('loaded'), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <View>
      <PracticeButton
        title="Load data"
        testID="load-button"
        disabled={status === 'loading'}
        onPress={() => setStatus('loading')}
      />
      {status === 'loading' && (
        <Text testID="loading-text" style={[styles.status, { color: theme.mutedText }]}>
          Loading…
        </Text>
      )}
      {status === 'loaded' && (
        <Text testID="loaded-text" style={[styles.status, { color: theme.text }]}>
          Data loaded
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  status: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 16 },
});
