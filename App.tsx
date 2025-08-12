import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [count, setCount] = useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View style={styles.customHeader}>
          <Text
            style={[
              styles.headerText,
              { color: isDarkMode ? Colors.white : Colors.black },
            ]}
          >
            🎮 Mini App Collection
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? Colors.light : Colors.dark },
            ]}
          >
            Fun interactive tools
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="🎲 Random Number Generator">
            <Button
              title="Generate Random Number"
              onPress={() =>
                Alert.alert(
                  'Random Number',
                  `Your number: ${Math.floor(Math.random() * 100) + 1}`
                )
              }
            />
          </Section>

          <Section title="📝 Counter App">
            <Text
              style={[
                styles.counterText,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              Count: {count}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="+" onPress={() => setCount(count + 1)} />
              <Button title="Reset" onPress={() => setCount(0)} />
              <Button title="-" onPress={() => setCount(count - 1)} />
            </View>
          </Section>

          <Section title="🎯 Quick Math">
            <Button
              title="Give Me a Math Problem"
              onPress={() => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                Alert.alert('Math Challenge', `What is ${a} + ${b}?`, [
                  {
                    text: `${a + b}`,
                    onPress: () => Alert.alert('🎉 Correct!'),
                  },
                  {
                    text: `${a + b + 1}`,
                    onPress: () => Alert.alert('❌ Try again!'),
                  },
                  {
                    text: `${a + b - 1}`,
                    onPress: () => Alert.alert('❌ Try again!'),
                  },
                ]);
              }}
            />
          </Section>

          <Section title="🎨 Color Mood">
            <Button
              title="What's My Color Mood?"
              onPress={() => {
                const colors = [
                  '❤️ Red - Passionate',
                  '💙 Blue - Calm',
                  '💚 Green - Peaceful',
                  '💛 Yellow - Happy',
                  '💜 Purple - Creative',
                ];
                const randomColor =
                  colors[Math.floor(Math.random() * colors.length)];
                Alert.alert('Your Color Mood', randomColor);
              }}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
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
  highlight: {
    fontWeight: '700',
  },
});

export default App;
