import type { PracticeScreen } from './types';
import CounterScreen from './counter/CounterScreen';
import LaunchScreen from './launch/LaunchScreen';

export const SCREENS: PracticeScreen[] = [
  { lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen },
  { lesson: 2, slug: 'counter', title: 'Counter', Component: CounterScreen },
];
