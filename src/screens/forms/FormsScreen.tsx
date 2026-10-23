import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import PracticeButton from '../../components/PracticeButton';
import { useTheme } from '../../theme';
import { validateLogin } from './validateLogin';

export default function FormsScreen(): React.JSX.Element {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const logIn = () => {
    const error = validateLogin(email, password);
    setMessage(
      error
        ? { text: error, ok: false }
        : { text: `Welcome, ${email.trim()}!`, ok: true },
    );
  };

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.mutedText }];

  return (
    // "handled" lets the first tap on Log in work while the keyboard is open.
    <ScrollView keyboardShouldPersistTaps="handled">
      <Text style={[styles.label, { color: theme.text }]}>Email</Text>
      <TextInput
        testID="email-input"
        style={inputStyle}
        value={email}
        onChangeText={setEmail}
        placeholder="tester@example.com"
        placeholderTextColor={theme.mutedText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Text style={[styles.label, { color: theme.text }]}>Password</Text>
      <TextInput
        testID="password-input"
        style={inputStyle}
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        placeholderTextColor={theme.mutedText}
        secureTextEntry
      />
      <PracticeButton title="Log in" testID="login-button" onPress={logIn} />
      <Text
        testID="login-message"
        style={[styles.message, { color: message?.ok ? '#2E7D32' : '#D32F2F' }]}
      >
        {message?.text ?? ''}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '600', marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, marginVertical: 6 },
  message: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 12 },
});
