import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';

export default function NavigationScreen(): React.JSX.Element {
  const theme = useTheme();
  const [page, setPage] = useState<'overview' | 'details'>('overview');

  if (page === 'details') {
    return (
      <View>
        <Text testID="details-text" style={[styles.heading, { color: theme.text }]}>
          Details page
        </Text>
        <PracticeButton
          title="Back to overview"
          testID="details-back-button"
          onPress={() => setPage('overview')}
        />
      </View>
    );
  }

  return (
    <View>
      <Text testID="nav-overview-text" style={[styles.heading, { color: theme.text }]}>
        Navigation overview
      </Text>
      <PracticeButton
        title="Open details"
        testID="open-details-button"
        onPress={() => setPage('details')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
});
