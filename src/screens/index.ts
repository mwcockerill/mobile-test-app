import type { PracticeScreen } from './types';
import LaunchScreen from './launch/LaunchScreen';

export const SCREENS: PracticeScreen[] = [
  { lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen },
];
