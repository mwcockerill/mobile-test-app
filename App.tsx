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
  Platform,
} from 'react-native';

// Web-compatible alert function
const showAlert = (title: string, message: string, buttons?: Array<{text: string, onPress?: () => void}>) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // For multiple choice questions, use confirm
      const choice = window.confirm(`${title}\n\n${message}\n\nClick OK for "${buttons[0].text}" or Cancel for other options`);
      if (choice && buttons[0].onPress) {
        buttons[0].onPress();
      } else if (!choice && buttons[1].onPress) {
        buttons[1].onPress();
      }
    } else {
      // Simple alert
      window.alert(`${title}\n\n${message}`);
      if (buttons && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Use React Native Alert for mobile
    const Alert = require('react-native').Alert;
    if (buttons) {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert(title, message);
    }
  }
};

// Define color scheme for web compatibility
const Colors = {
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  darker: '#222',
  black: '#000',
  white: '#FFF',
};

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
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {Platform.OS !== 'web' && (
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
      )}
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
            paddingBottom: Platform.OS === 'web' ? 40 : 0,
          }}
        >
          <Section title="🎲 Random Number Generator">
            <Button
              title="Generate Random Number"
              testID="generate-random-number-button"
              onPress={() =>
                showAlert(
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
          </Section>
          <View style={styles.buttonRow}>
            <Button title="+" testID="increment-button" onPress={() => setCount(count + 1)} />
            <Button title="Reset" testID="reset-button" onPress={() => setCount(0)} />
            <Button title="-" testID="decrement-button" onPress={() => setCount(count - 1)} />
          </View>

          <Section title="🎯 Quick Math">
            <Button
              title="Give Me a Math Problem"
              testID="math-problem-button"
              onPress={() => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                showAlert('Math Challenge', `What is ${a} + ${b}?`, [
                  {
                    text: `${a + b}`,
                    onPress: () => showAlert('🎉 Correct!', 'Well done!'),
                  },
                  {
                    text: `${a + b + 1}`,
                    onPress: () => showAlert('❌ Try again!', 'That\'s not quite right.'),
                  },
                  {
                    text: `${a + b - 1}`,
                    onPress: () => showAlert('❌ Try again!', 'That\'s not quite right.'),
                  },
                ]);
              }}
            />
          </Section>

          <Section title="🎨 Color Mood">
            <Button
              title="What's My Color Mood?"
              testID="color-mood-button"
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
                showAlert('Your Color Mood', randomColor);
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
  counterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;