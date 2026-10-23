import type { PracticeScreen } from './types';
import CounterScreen from './counter/CounterScreen';
import LaunchScreen from './launch/LaunchScreen';
import SelectorsScreen from './selectors/SelectorsScreen';

export const SCREENS: PracticeScreen[] = [
  { lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen },
  { lesson: 2, slug: 'counter', title: 'Counter', Component: CounterScreen },
  { lesson: 3, slug: 'selectors', title: 'Selectors', Component: SelectorsScreen },
];
