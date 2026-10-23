import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme';

export default function LaunchScreen(): React.JSX.Element {
  const theme = useTheme();
  return (
    <Text testID="welcome-text" style={[styles.welcome, { color: theme.text }]}>
      Welcome to the practice app
    </Text>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
});
