import React, { useEffect, useState } from 'react';
import { BackHandler, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import ScreenFrame from './src/components/ScreenFrame';
import HomeScreen from './src/HomeScreen';
import { SCREENS } from './src/screens';
import { useTheme } from './src/theme';

function App(): React.JSX.Element {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openScreen = SCREENS.find(screen => screen.slug === openSlug);

  // Android's hardware back button returns to the home list instead of
  // closing the app while a practice screen is open.
  useEffect(() => {
    if (!openScreen) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpenSlug(null);
      return true;
    });
    return () => subscription.remove();
  }, [openScreen]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {openScreen ? (
        <ScreenFrame screen={openScreen} onBack={() => setOpenSlug(null)}>
          <openScreen.Component />
        </ScreenFrame>
      ) : (
        <HomeScreen onOpen={setOpenSlug} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
