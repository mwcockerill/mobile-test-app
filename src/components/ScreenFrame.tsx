import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { lessonFileName } from '../lessonPath';
import type { PracticeScreen } from '../screens/types';
import { useTheme } from '../theme';

type Props = {
  screen: PracticeScreen;
  onBack: () => void;
  children: React.ReactNode;
};

export default function ScreenFrame({
  screen,
  onBack,
  children,
}: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable testID="back-button" accessibilityRole="button" onPress={onBack}>
          <Text style={[styles.back, { color: theme.accent }]}>‹ Back</Text>
        </Pressable>
        <Text testID="screen-title" style={[styles.title, { color: theme.text }]}>
          {screen.title}
        </Text>
        <Text testID="lesson-hint" style={[styles.hint, { color: theme.mutedText }]}>
          {`Lesson ${screen.lesson} · lessons/${lessonFileName(screen)}.md`}
        </Text>
      </View>
      <View style={[styles.body, { backgroundColor: theme.surface }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  back: { fontSize: 17, paddingVertical: 6 },
  title: { fontSize: 26, fontWeight: '700', marginTop: 8 },
  hint: { fontSize: 13, marginTop: 4 },
  body: { flex: 1, padding: 20 },
});
