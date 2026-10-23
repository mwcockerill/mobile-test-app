import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PracticeButton from './components/PracticeButton';
import { SCREENS } from './screens';
import { useTheme } from './theme';
import { APP_VERSION } from './version';

type Props = {
  onOpen: (slug: string) => void;
};

export default function HomeScreen({ onOpen }: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text testID="home-title" style={[styles.title, { color: theme.text }]}>
          Learn Mobile Testing
        </Text>
        <Text testID="app-version" style={[styles.version, { color: theme.mutedText }]}>
          {`v${APP_VERSION}`}
        </Text>
      </View>
      {SCREENS.map(screen => (
        <PracticeButton
          key={screen.slug}
          testID={`home-item-${screen.slug}`}
          title={`${screen.lesson}. ${screen.title}`}
          onPress={() => onOpen(screen.slug)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700' },
  version: { fontSize: 14, marginTop: 4 },
});
