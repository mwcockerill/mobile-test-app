import { useColorScheme } from 'react-native';

export type Theme = {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
};

const light: Theme = {
  background: '#F3F3F3',
  surface: '#FFFFFF',
  text: '#000000',
  mutedText: '#444444',
  accent: '#007AFF',
};

const dark: Theme = {
  background: '#222222',
  surface: '#000000',
  text: '#FFFFFF',
  mutedText: '#DAE1E7',
  accent: '#0A84FF',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
