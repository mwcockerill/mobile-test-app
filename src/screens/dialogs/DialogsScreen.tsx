import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';
import { generateMathProblem, getRandomColor } from '../../utils';

export default function DialogsScreen(): React.JSX.Element {
  const theme = useTheme();

  const askMathProblem = () => {
    const { a, b, answer } = generateMathProblem();
    Alert.alert('Math Challenge', `What is ${a} + ${b}?`, [
      { text: String(answer), onPress: () => Alert.alert('Correct!', 'Well done!') },
      {
        text: String(answer + 1),
        onPress: () => Alert.alert('Try again!', "That's not quite right."),
      },
    ]);
  };

  return (
    <View>
      <Text style={[styles.intro, { color: theme.mutedText }]}>
        Each button opens a native dialog.
      </Text>
      <PracticeButton
        title="Give Me a Math Problem"
        testID="math-problem-button"
        onPress={askMathProblem}
      />
      <PracticeButton
        title="What's My Color Mood?"
        testID="color-mood-button"
        onPress={() => Alert.alert('Your Color Mood', getRandomColor())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 15, textAlign: 'center', marginBottom: 12 },
});
