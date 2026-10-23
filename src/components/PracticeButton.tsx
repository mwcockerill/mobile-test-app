import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  testID: string;
  accessibilityLabel?: string;
  disabled?: boolean;
};

// A button that renders its title exactly as written on both platforms,
// unlike the native Button, which Android uppercases.
export default function PracticeButton({
  title,
  onPress,
  testID,
  accessibilityLabel,
  disabled,
}: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accent, opacity: pressed || disabled ? 0.6 : 1 },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
